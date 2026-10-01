import { describe, expect, it } from 'vitest'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PensumGrid } from './PensumGrid'
import { subjects } from '@/test/fixtures/academic-record'
import { setViewportWidth } from '@/test/match-media'

const next = () => screen.getByRole('button', { name: 'Semestres siguientes' })
const prev = () => screen.getByRole('button', { name: 'Semestres anteriores' })

describe('PensumGrid', () => {
  it('pagina los semestres de dos en dos a ancho móvil', async () => {
    const user = userEvent.setup()
    render(<PensumGrid subjects={subjects} />)

    expect(screen.getByText('1–2 de 4')).toBeInTheDocument()
    expect(prev()).toBeDisabled()

    await user.click(next())
    expect(screen.getByText('2–3 de 4')).toBeInTheDocument()

    await user.click(next())
    expect(screen.getByText('3–4 de 4')).toBeInTheDocument()
    expect(screen.getByText('Sem 3')).toBeInTheDocument()
    expect(screen.getByText('Sem 4')).toBeInTheDocument()
    expect(screen.queryByText('Sem 1')).not.toBeInTheDocument()
    expect(next()).toBeDisabled()

    await user.click(prev())
    expect(screen.getByText('2–3 de 4')).toBeInTheDocument()
  })

  it('mantiene semestres válidos cuando cambia el ancho estando al final', async () => {
    const user = userEvent.setup()
    render(<PensumGrid subjects={subjects} />)
    await user.click(next())
    await user.click(next())
    expect(screen.getByText('3–4 de 4')).toBeInTheDocument()

    act(() => setViewportWidth(640))
    expect(screen.getByText('2–4 de 4')).toBeInTheDocument()

    act(() => setViewportWidth(1024))
    expect(screen.queryByRole('button', { name: 'Semestres siguientes' })).not.toBeInTheDocument()
    expect(screen.getByText('Sem 1')).toBeInTheDocument()
    expect(screen.getByText('Sem 4')).toBeInTheDocument()

    // Al volver a móvil la malla arranca en el primer semestre.
    act(() => setViewportWidth(0))
    expect(screen.getByText('1–2 de 4')).toBeInTheDocument()
  })

  it('mantiene semestres válidos cuando cambia la lista de materias estando al final', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<PensumGrid subjects={subjects} />)
    await user.click(next())
    await user.click(next())
    expect(screen.getByText('3–4 de 4')).toBeInTheDocument()

    rerender(<PensumGrid subjects={subjects.filter(s => s.semester !== 4)} />)
    expect(screen.getByText('2–3 de 3')).toBeInTheDocument()

    rerender(<PensumGrid subjects={[]} />)
    rerender(<PensumGrid subjects={subjects} />)
    expect(screen.getByText('1–2 de 4')).toBeInTheDocument()
  })

  it('muestra las electivas en su propio bloque, fuera de los semestres', () => {
    render(<PensumGrid subjects={subjects} />)

    expect(screen.getByText('Electivas')).toBeInTheDocument()
    expect(screen.getByText('Robótica')).toBeInTheDocument()
    expect(screen.getByText('Minería de Datos')).toBeInTheDocument()
    expect(screen.getByText('Ajedrez')).toBeInTheDocument()
    expect(screen.queryByText('Sem 0')).not.toBeInTheDocument()
    expect(screen.queryByText('Sem 99')).not.toBeInTheDocument()
  })

  it('muestra los prerrequisitos de la materia seleccionada y la deselecciona al repetir', async () => {
    const user = userEvent.setup()
    render(<PensumGrid subjects={subjects} />)
    expect(screen.getByText('Toca una materia para ver prerrequisitos')).toBeInTheDocument()

    await user.click(screen.getByText('MAT201'))

    const panel = screen.getByRole('status')
    expect(within(panel).getByText('Cálculo II')).toBeInTheDocument()
    expect(within(panel).getByText('MAT101')).toBeInTheDocument()
    expect(within(panel).getByText('Cálculo I')).toBeInTheDocument()
    expect(screen.getByText('Toca de nuevo para deseleccionar')).toBeInTheDocument()

    await user.click(screen.getByText('MAT201'))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('indica cuando la materia seleccionada no tiene prerrequisitos', async () => {
    const user = userEvent.setup()
    render(<PensumGrid subjects={subjects} />)

    await user.click(screen.getByText('MAT101'))

    expect(within(screen.getByRole('status')).getByText('Sin prerrequisitos')).toBeInTheDocument()
  })

  it('pinta el título sin paginador cuando no hay materias', () => {
    render(<PensumGrid subjects={[]} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Pensum' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Semestres siguientes' })).not.toBeInTheDocument()
    expect(screen.queryByText('Electivas')).not.toBeInTheDocument()
  })
})
