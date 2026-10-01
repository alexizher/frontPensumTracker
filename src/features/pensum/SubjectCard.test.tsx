import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SubjectCard } from './SubjectCard'
import { subjects } from '@/test/fixtures/academic-record'
import type { Subject, SubjectStatus } from '@/types/academic'

const base = subjects[0]

function card(overrides: Partial<Subject> = {}, props: { isSelected?: boolean; isPrereq?: boolean } = {}) {
  render(<SubjectCard subject={{ ...base, ...overrides }} {...props} />)
  return screen.getByText(overrides.name ?? base.name).parentElement!
}

describe('SubjectCard', () => {
  it('muestra nombre, código, créditos y nota con un decimal', () => {
    const element = card({ name: 'Cálculo I', code: 'MAT101', credits: 4, nota: 4 })

    expect(element).toHaveTextContent('Cálculo I')
    expect(element).toHaveTextContent('MAT101')
    expect(element).toHaveTextContent('4 cr')
    expect(element).toHaveTextContent('4.0')
  })

  it('no muestra nota cuando la materia no la tiene', () => {
    const element = card({ nota: null, credits: 3 })

    expect(element.textContent).toBe(`${base.name}${base.code}3 cr`)
  })

  it.each<[SubjectStatus, string[]]>([
    ['passed', ['bg-green-100', 'border-green-300', 'text-green-900']],
    ['in_progress', ['bg-blue-100', 'border-blue-300', 'text-blue-900']],
    ['available', ['bg-amber-100', 'border-amber-300', 'text-amber-900']],
    ['locked', ['bg-gray-100', 'border-gray-200', 'text-gray-400']],
    ['not_needed', ['bg-gray-50', 'border-gray-200', 'text-gray-400', 'border-dashed']],
  ])('pinta el estado %s con sus colores', (status, expected) => {
    const element = card({ status })
    const statusClasses = [...element.classList].filter(name =>
      /^(bg|text|border)-(green|blue|amber|gray)-|^border-dashed$/.test(name),
    )

    expect(statusClasses.sort()).toEqual([...expected].sort())
  })

  it('marca con un anillo oscuro la seleccionada y con uno naranja el prerrequisito', () => {
    expect(card({ name: 'A' }, { isSelected: true })).toHaveClass('ring-2', 'ring-gray-800')
    expect(card({ name: 'B' }, { isPrereq: true })).toHaveClass('ring-2', 'ring-orange-400')
    expect(card({ name: 'C' })).not.toHaveClass('ring-2')
  })

  it('avisa del clic con el código de la materia', async () => {
    const onClick = vi.fn()
    render(<SubjectCard subject={base} onClick={onClick} />)

    await userEvent.setup().click(screen.getByText(base.name))

    expect(onClick).toHaveBeenCalledWith(base.code)
  })
})
