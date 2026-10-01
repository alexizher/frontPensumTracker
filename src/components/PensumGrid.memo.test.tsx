import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PensumGrid } from './PensumGrid'
import { subjects } from '@/test/fixtures/academic-record'

const renders = vi.hoisted(() => ({ codes: [] as string[] }))

// Tarjeta de reemplazo con el mismo memo que la real: registra qué materias se pintan.
vi.mock('./SubjectCard', async () => {
  const { memo } = await import('react')
  return {
    SubjectCard: memo(function SubjectCard(props: {
      subject: { code: string }
      onClick?: (code: string) => void
    }) {
      renders.codes.push(props.subject.code)
      return <button onClick={() => props.onClick?.(props.subject.code)}>{props.subject.code}</button>
    }),
  }
})

describe('PensumGrid y el memo de SubjectCard', () => {
  it('al seleccionar una materia solo repinta esa tarjeta y las de sus prerrequisitos', async () => {
    const user = userEvent.setup()
    render(<PensumGrid subjects={subjects} />)
    renders.codes = []

    await user.click(screen.getByRole('button', { name: 'MAT201' }))

    expect([...renders.codes].sort()).toEqual(['MAT101', 'MAT201'])
  })
})
