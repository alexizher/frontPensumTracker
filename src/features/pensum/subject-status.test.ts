import { describe, expect, it } from 'vitest'
import { STATUS_LEGEND, SUBJECT_STATUS } from './subject-status'

describe('SUBJECT_STATUS', () => {
  it('da una etiqueta a cada estado', () => {
    expect(Object.fromEntries(Object.entries(SUBJECT_STATUS).map(([k, v]) => [k, v.label]))).toEqual({
      passed: 'Aprobada',
      in_progress: 'En curso',
      available: 'Disponible',
      locked: 'Bloqueada',
      not_needed: 'No requerida',
    })
  })

  it('da clases de tarjeta y de pastilla a cada estado', () => {
    for (const status of Object.values(SUBJECT_STATUS)) {
      expect(status.card).toMatch(/\bbg-\S+/)
      expect(status.badge).toMatch(/\bbg-\S+/)
    }
  })
})

describe('STATUS_LEGEND', () => {
  it('lista los cuatro estados de la malla, sin el de electiva no requerida', () => {
    expect(STATUS_LEGEND.map(item => item.status)).toEqual([
      'passed',
      'in_progress',
      'available',
      'locked',
    ])
  })
})
