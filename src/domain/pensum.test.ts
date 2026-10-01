import { describe, expect, it } from 'vitest'
import { clampStart } from './pensum'

describe('clampStart', () => {
  it('deja el índice igual si la ventana cabe', () => {
    expect(clampStart(0, 4, 2)).toBe(0)
    expect(clampStart(2, 4, 2)).toBe(2)
  })

  it('recorta el índice para que la ventana no se salga por el final', () => {
    expect(clampStart(3, 4, 2)).toBe(2)
    expect(clampStart(2, 4, 3)).toBe(1)
  })

  it('devuelve 0 cuando todo cabe en la ventana', () => {
    expect(clampStart(2, 4, 6)).toBe(0)
    expect(clampStart(2, 4, 4)).toBe(0)
  })

  it('devuelve 0 cuando no hay elementos', () => {
    expect(clampStart(0, 0, 2)).toBe(0)
    expect(clampStart(3, 0, 2)).toBe(0)
  })

  it('no devuelve índices negativos', () => {
    expect(clampStart(-1, 4, 2)).toBe(0)
  })
})
