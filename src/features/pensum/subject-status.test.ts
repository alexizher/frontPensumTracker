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

  it('da a cada estado los colores de su tarjeta y de su pastilla', () => {
    const colors = Object.fromEntries(
      Object.entries(SUBJECT_STATUS).map(([status, style]) => [status, [style.card, style.badge]]),
    )

    expect(colors).toEqual({
      passed: ['bg-green-100 border-green-300 text-green-900', 'bg-green-100 text-green-800'],
      in_progress: ['bg-blue-100 border-blue-300 text-blue-900', 'bg-blue-100 text-blue-800'],
      available: ['bg-amber-100 border-amber-300 text-amber-900', 'bg-amber-100 text-amber-800'],
      locked: ['bg-gray-100 border-gray-200 text-gray-400', 'bg-gray-100 text-gray-500'],
      not_needed: [
        'bg-gray-50 border-gray-200 text-gray-400 border-dashed',
        'bg-gray-50 text-gray-400',
      ],
    })
  })
})

describe('STATUS_LEGEND', () => {
  it('lista los cuatro estados de la malla, sin el de electiva no requerida', () => {
    expect(STATUS_LEGEND).toEqual([
      { status: 'passed', dot: 'bg-green-400' },
      { status: 'in_progress', dot: 'bg-blue-400' },
      { status: 'available', dot: 'bg-amber-400' },
      { status: 'locked', dot: 'bg-gray-300' },
    ])
  })
})
