import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('se anuncia con su aria-label y avisa del clic', async () => {
    const onClick = vi.fn()
    render(
      <IconButton aria-label="Siguiente" onClick={onClick}>
        <svg />
      </IconButton>,
    )

    await userEvent.setup().click(screen.getByRole('button', { name: 'Siguiente' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('exige aria-label en el tipo', () => {
    // @ts-expect-error un botón de solo ícono sin nombre accesible no compila
    render(<IconButton />)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('es de tipo button y pasa el resto de atributos', () => {
    render(<IconButton aria-label="Salir" title="Cerrar sesión" disabled />)
    const button = screen.getByRole('button', { name: 'Salir' })

    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('title', 'Cerrar sesión')
    expect(button).toBeDisabled()
  })

  it('usa la variante outline por defecto y suma las clases que recibe', () => {
    render(<IconButton aria-label="Siguiente" className="shrink-0" />)

    expect(screen.getByRole('button')).toHaveClass('size-11', 'border-input', 'shrink-0')
  })

  it('la variante danger cambia el borde y el hover', () => {
    render(<IconButton aria-label="Salir" variant="danger" />)

    expect(screen.getByRole('button')).toHaveClass('border-border', 'hover:text-destructive')
    expect(screen.getByRole('button')).not.toHaveClass('border-input')
  })
})
