import axios from 'axios'
import React, { useEffect, useState } from 'react'

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const coords = [
    [1,1], [2,1], [3,1],
    [1,2], [2,2], [3,2],
    [1,3], [2,3], [3,3]
  ]

  const [data, setData] = useState({
    "message": initialMessage,
    "email": initialEmail,
    "steps": initialSteps,
    "index" : initialIndex
  })

  const [payload, setPayload] = useState({
    "x": 2,
    "y": 2,
    "steps": 0,
    "email": ""
  })

  useEffect(() => {
    setPayload({...payload, 
      "x": (coords[data.index])[0],
      "y": (coords[data.index])[1],
      "steps": data.steps,
      "email": data.email })
  }, [data])

  

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    return coords[data.index]
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    
    const [x, y] = getXY();
    return `Koordinatlar (${x}, ${y})`

  }

  function reset() {
    setData(
      {
        "message": initialMessage,
        "email": initialEmail,
        "steps": initialSteps,
        "index" : initialIndex
      }
    )
  }

  function sonrakiIndex(evt) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.

    let yon = evt.target.id

    const [x, y] = getXY()

    if(yon === "left" && x === 1 || 
      yon === "right" && x === 3 ||
      yon === "up" && y === 1 || 
      yon === "down" && y === 3) {
      setData({...data, "message": `You can't go ${yon}`})
      return;
    }

    ilerle(yon)

  }

  function ilerle(yon) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.

    let newIndex = data.index;


    if(yon === "left") {
      newIndex -= 1
    }
    if(yon === "right") {
      newIndex += 1
    }
    if(yon === "up") {
      newIndex -= 3
    }
    if(yon === "down") {
      newIndex += 3
    }

    setData({...data, "index": newIndex, "steps": data.steps + 1})

  }

  function emailHandler(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setData({...data, "email": evt.target.value})
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.

    evt.preventDefault()

    if(!validateEmail(payload.email) || payload.x < 1 || payload.x > 3 || payload.y < 1 || payload.y > 3 || payload.steps <= 0) {
      console.log("Unprocessable Entity")
      return;
    }

    axios
      .post("http://localhost:9000/api/result", payload)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => console.warn(err))

  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 data-testid="coordinates" id="coordinates">{getXYMesaj()}</h3>
        <h3 data-testid="steps" id="steps">{data.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === data.index ? ' active' : ''}`}>
              {idx === data.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{data.message}</h3>
      </div>
      <div id="keypad">
        <button onClick={sonrakiIndex} data-testid="left" id="left">SOL</button>
        <button onClick={sonrakiIndex} data-testid="up" id="up">YUKARI</button>
        <button onClick={sonrakiIndex} data-testid="right" id="right">SAĞ</button>
        <button onClick={sonrakiIndex} data-testid="down" id="down">AŞAĞI</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input onChange={emailHandler} value={data.email} id="email" type="email" placeholder="email girin"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
