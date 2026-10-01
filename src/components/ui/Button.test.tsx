import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('pinta su contenido y avisa del clic', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Guardar</Button>)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Guardar' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('es de tipo button salvo que se pida otro', () => {
    render(
      <>
        <Button>Uno</Button>
        <Button type="submit">Dos</Button>
      </>,
    )

    expect(screen.getByRole('button', { name: 'Uno' })).toHaveAttribute('type', 'button')
    expect(screen.getByRole('button', { name: 'Dos' })).toHaveAttribute('type', 'submit')
  })

  it('no avisa del clic cuando está deshabilitado', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Guardar
      </Button>,
    )

    await userEvent.setup().click(screen.getByRole('button', { name: 'Guardar' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('usa la variante primary por defecto y suma las clases que recibe', () => {
    render(<Button className="w-full">Guardar</Button>)

    expect(screen.getByRole('button')).toHaveClass('bg-primary', 'w-full')
  })

  it('la variante ghost no lleva el fondo de primary', () => {
    render(<Button variant="ghost">Ver más</Button>)

    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')
    expect(screen.getByRole('button')).not.toHaveClass('bg-primary')
  })
})
