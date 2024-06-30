import { render, screen } from '@testing-library/react'
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

const steps = screen.getByTestId("steps")
const coordinates = screen.getByTestId("coordinates")


beforeEach(() => render(<AppFunctional />))

test("başlık görünüyor", () => {
  
})