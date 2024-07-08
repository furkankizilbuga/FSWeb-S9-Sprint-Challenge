import { fireEvent, render, screen } from '@testing-library/react'
import AppFunctional from './AppFunctional'
import React from "react"

// Write your tests here
test('sanity', () => {
  render(<AppFunctional />)
})

const right = screen.getByTestId("right")
const left = screen.getByTestId("left")
const up = screen.getByTestId("up")
const down = screen.getByTestId("down")
const submit = screen.getByTestId("submit")

const steps = screen.getByTestId("steps")
const coordinates = screen.getByTestId("coordinates")
const input = screen.getByTestId("input")



beforeEach(() => render(<AppFunctional />))

test("win metni görünüyor", async () => {
  fireEvent.click(right)
  fireEvent.click(left)
  fireEvent.change(input, {target: {value: "asd@asd.com"}})
  fireEvent.click(submit)
  const winMessage = await screen.findByText("asd win")
  expect(winMessage).toBeVisible()
})

test("boş email hata veriyor", async () => {
  fireEvent.click(submit)
  const message = await screen.findByText("Ouch: email is required")
  expect(message).toBeVisible()
})

test("invalid email hata veriyor", async () => {
  fireEvent.change(input, {target: {value: "asd@asd"}})
  fireEvent.click(submit)
  const message = await screen.findByText("Ouch: email must be a valid email")
  expect(message).toBeVisible()
})

test("step counter başlangıçta 0 olarak geliyor", async () => {
  expect(steps).toHaveTextContent("0 kere ilerlediniz")
})

test("step counter çalışıyor", async () => {
  fireEvent.click(right)
  fireEvent.click(left)
  fireEvent.click(up)
  const message = await screen.findByText("3 kere ilerlediniz")
  expect(message).toBeVisible()
})

test("kordinatlar doğru başlıyor", () => {
  expect(coordinates).toHaveTextContent("(2, 2)")
})

test("kordinatlar doğru güncelleniyor", () => {
  fireEvent.click(right)
  fireEvent.click(down)
  fireEvent.click(left)
  fireEvent.click(left)
  expect(coordinates).toHaveTextContent("(1, 3)")
})