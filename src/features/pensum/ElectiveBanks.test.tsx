import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ElectiveBanks } from './ElectiveBanks'
import { record, subjects } from '@/test/fixtures/academic-record'

function barWidths(container: HTMLElement) {
  return [...container.querySelectorAll<HTMLElement>('[style]')].map(bar => bar.style.width)
}

describe('ElectiveBanks', () => {
  it('pinta la barra de cada banco con su porcentaje de avance', () => {
    const { container } = render(<ElectiveBanks banks={record.elective_banks} subjects={subjects} />)

    // 3 de 6 créditos y 2 de 2.
    expect(barWidths(container)).toEqual(['50%', '100%'])
  })

  it('deja la barra en 0 % cuando el banco no exige créditos', () => {
    const bank = { name: 'Práctica', credits_required: 0, credits_approved: 4, subject_codes: [] }
    const { container } = render(<ElectiveBanks banks={[bank]} subjects={subjects} />)

    expect(barWidths(container)).toEqual(['0%'])
  })

  it('avisa cuando no hay bancos', () => {
    render(<ElectiveBanks banks={[]} subjects={subjects} />)

    expect(screen.getByText('No hay bancos de electivas registrados.')).toBeInTheDocument()
  })
})
