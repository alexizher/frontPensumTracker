import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PasswordInput } from './PasswordInput'

const field = () => screen.getByPlaceholderText('clave')

describe('PasswordInput', () => {
  it('oculta el texto al empezar y lo alterna con el botón del ojo', async () => {
    const user = userEvent.setup()
    render(<PasswordInput placeholder="clave" />)
    expect(field()).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))
    expect(field()).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await user.click(screen.getByRole('button', { name: 'Ocultar contraseña' }))
    expect(field()).toHaveAttribute('type', 'password')
  })

  it('conserva lo escrito al alternar', async () => {
    const user = userEvent.setup()
    render(<PasswordInput placeholder="clave" />)
    await user.type(field(), 'Secreta123')

    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))

    expect(field()).toHaveValue('Secreta123')
  })

  it('en modo controlado obedece a visible y avisa del cambio pedido', async () => {
    const onVisibleChange = vi.fn()
    const { rerender } = render(
      <PasswordInput placeholder="clave" visible={false} onVisibleChange={onVisibleChange} />,
    )

    await userEvent.setup().click(screen.getByRole('button', { name: 'Mostrar contraseña' }))
    expect(onVisibleChange).toHaveBeenCalledWith(true)
    expect(field()).toHaveAttribute('type', 'password')

    rerender(<PasswordInput placeholder="clave" visible={true} onVisibleChange={onVisibleChange} />)
    expect(field()).toHaveAttribute('type', 'text')
  })

  it('deshabilita el campo y el botón a la vez', () => {
    render(<PasswordInput placeholder="clave" disabled />)

    expect(field()).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeDisabled()
  })

  it('el botón del ojo no envía el formulario que lo contiene', async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <PasswordInput placeholder="clave" />
      </form>,
    )

    await userEvent.setup().click(screen.getByRole('button', { name: 'Mostrar contraseña' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
