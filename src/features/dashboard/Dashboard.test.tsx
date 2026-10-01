import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Dashboard } from './Dashboard'
import { record } from '@/test/fixtures/academic-record'

function renderDashboard(data: typeof record) {
  return render(
    <Dashboard data={data} error={null} onReset={vi.fn()} onChangeVersion={vi.fn()} />,
  )
}

describe('Dashboard', () => {
  it('avisa de los créditos cursados por encima del plan', () => {
    renderDashboard({ ...record, completed_credits: 40, progress_credits: 35 })

    expect(
      screen.getByText('Has cursado 40 créditos en total (5 adicionales al plan)'),
    ).toBeInTheDocument()
  })

  it('no muestra ese aviso cuando lo cursado no supera el plan', () => {
    renderDashboard({ ...record, completed_credits: 35, progress_credits: 35 })

    expect(screen.queryByText(/adicionales al plan/)).not.toBeInTheDocument()
  })

  it('avisa cuando el estudiante completó el plan', () => {
    renderDashboard({ ...record, graduated: true })

    expect(
      screen.getByText(
        'Completaste todos los créditos del plan. No tienes materias pendientes para el grado.',
      ),
    ).toBeInTheDocument()
  })
})
