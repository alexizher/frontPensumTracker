import { describe, expect, it } from 'vitest'
import { gaugeFractions, percentOf } from './progress'

describe('percentOf', () => {
  it('redondea al entero más cercano', () => {
    expect(percentOf(3, 6)).toBe(50)
    expect(percentOf(1, 3)).toBe(33)
    expect(percentOf(2, 3)).toBe(67)
  })

  it('se queda en 100 cuando el valor supera el total', () => {
    expect(percentOf(10, 6)).toBe(100)
  })

  it('devuelve 0 cuando el total es 0 o negativo', () => {
    expect(percentOf(0, 0)).toBe(0)
    expect(percentOf(5, 0)).toBe(0)
    expect(percentOf(-5, -1)).toBe(0)
  })

  it('devuelve 0 cuando el total no es un número', () => {
    expect(percentOf(5, NaN)).toBe(0)
  })

  it('no devuelve porcentajes negativos', () => {
    expect(percentOf(-1, 5)).toBe(0)
  })
})

describe('gaugeFractions', () => {
  it('calcula las fracciones aprobada y en curso sobre el total', () => {
    const result = gaugeFractions(12, 4, 35)

    expect(result.completed).toBeCloseTo(12 / 35)
    expect(result.inProgress).toBeCloseTo(4 / 35)
    expect(result.percent).toBe(34)
  })

  it('se queda en 100 % y sin tramo en curso cuando lo aprobado supera el total', () => {
    expect(gaugeFractions(40, 5, 35)).toEqual({ completed: 1, inProgress: 0, percent: 100 })
  })

  it('recorta el tramo en curso a lo que falta para el total', () => {
    const result = gaugeFractions(30, 10, 35)

    expect(result.completed + result.inProgress).toBeCloseTo(1)
    expect(result.inProgress).toBeCloseTo(5 / 35)
  })

  it('redondea el porcentaje al entero más cercano, también hacia arriba', () => {
    expect(gaugeFractions(23, 0, 35).percent).toBe(66)
  })

  it('devuelve ceros cuando no hay avance', () => {
    expect(gaugeFractions(0, 0, 35)).toEqual({ completed: 0, inProgress: 0, percent: 0 })
  })

  it('con total 0 trata cualquier crédito aprobado como 100 %', () => {
    expect(gaugeFractions(5, 2, 0)).toEqual({ completed: 1, inProgress: 0, percent: 100 })
    expect(gaugeFractions(0, 0, 0)).toEqual({ completed: 0, inProgress: 0, percent: 0 })
    expect(gaugeFractions(5, 2, -10)).toEqual({ completed: 1, inProgress: 0, percent: 100 })
  })
})
