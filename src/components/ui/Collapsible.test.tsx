import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Collapsible } from './Collapsible'

describe('Collapsible', () => {
  it('empieza abierto y enlaza el botón con su panel', () => {
    render(<Collapsible title="Electivas">contenido</Collapsible>)
    const trigger = screen.getByRole('button', { name: 'Electivas' })

    expect(screen.getByRole('heading', { level: 2, name: 'Electivas' })).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('type', 'button')
    expect(document.getElementById(trigger.getAttribute('aria-controls')!)).toHaveTextContent(
      'contenido',
    )
  })

  it('quita el panel del documento al plegarlo y lo devuelve al desplegarlo', async () => {
    const user = userEvent.setup()
    render(<Collapsible title="Electivas">contenido</Collapsible>)
    const trigger = screen.getByRole('button', { name: 'Electivas' })

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('contenido')).not.toBeInTheDocument()

    await user.click(trigger)
    expect(screen.getByText('contenido')).toBeInTheDocument()
  })

  it('puede empezar plegado', () => {
    render(
      <Collapsible title="Electivas" defaultOpen={false}>
        contenido
      </Collapsible>,
    )

    expect(screen.queryByText('contenido')).not.toBeInTheDocument()
  })
})
