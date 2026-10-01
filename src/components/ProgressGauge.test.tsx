import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressGauge } from './ProgressGauge'

function arcs(container: HTMLElement) {
  return [...container.querySelectorAll('path')].map(path => path.getAttribute('d'))
}

describe('ProgressGauge', () => {
  it('dibuja el tramo aprobado, luego el tramo en curso, y la aguja al final de ambos', () => {
    const { container } = render(<ProgressGauge completed={12} inProgress={4} total={35} />)

    expect(screen.getByLabelText('Progreso: 34% aprobado')).toBeInTheDocument()
    // Fondo de 0° a 180°, aprobado de 0° a 61,7° y en curso de 61,7° a 82,3°.
    expect(arcs(container)).toEqual([
      'M 20.00 100.00 A 80 80 0 0 1 180.00 100.00',
      'M 20.00 100.00 A 80 80 0 0 1 62.09 29.55',
      'M 62.09 29.55 A 80 80 0 0 1 89.26 20.72',
    ])
    const needle = container.querySelector('line')
    expect(needle?.getAttribute('x2')).toBe('91.27')
    expect(needle?.getAttribute('y2')).toBe('35.59')
  })

  it('no dibuja tramos cuando no hay avance', () => {
    const { container } = render(<ProgressGauge completed={0} inProgress={0} total={35} />)

    expect(screen.getByLabelText('Progreso: 0% aprobado')).toBeInTheDocument()
    expect(arcs(container)).toHaveLength(1)
  })

  it('llena el arco y omite el tramo en curso cuando lo aprobado supera el total', () => {
    const { container } = render(<ProgressGauge completed={40} inProgress={5} total={35} />)

    expect(screen.getByLabelText('Progreso: 100% aprobado')).toBeInTheDocument()
    expect(arcs(container)).toEqual([
      'M 20.00 100.00 A 80 80 0 0 1 180.00 100.00',
      'M 20.00 100.00 A 80 80 0 0 1 180.00 100.00',
    ])
  })
})
