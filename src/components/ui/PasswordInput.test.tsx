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
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )

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

  it('sin controlar también avisa de cada cambio', async () => {
    const user = userEvent.setup()
    const onRevealedChange = vi.fn()
    render(<PasswordInput placeholder="clave" onRevealedChange={onRevealedChange} />)

    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))
    await user.click(screen.getByRole('button', { name: 'Ocultar contraseña' }))

    expect(onRevealedChange.mock.calls).toEqual([[true], [false]])
  })

  it('en modo controlado obedece a revealed y avisa del cambio pedido', async () => {
    const onVisibleChange = vi.fn()
    const { rerender } = render(
      <PasswordInput placeholder="clave" revealed={false} onRevealedChange={onVisibleChange} />,
    )

    await userEvent.setup().click(screen.getByRole('button', { name: 'Mostrar contraseña' }))
    expect(onVisibleChange).toHaveBeenCalledWith(true)
    expect(field()).toHaveAttribute('type', 'password')

    rerender(<PasswordInput placeholder="clave" revealed={true} onRevealedChange={onVisibleChange} />)
    expect(field()).toHaveAttribute('type', 'text')
  })

  it('conserva el hueco del ojo aunque reciba otro relleno horizontal', () => {
    render(<PasswordInput placeholder="clave" className="px-4" />)

    expect(field()).toHaveClass('px-4', 'pr-10')
  })

  it('no deja que un type externo pise el que calcula', () => {
    const sneaky = { type: 'email' } as object
    render(<PasswordInput placeholder="clave" {...sneaky} />)

    expect(field()).toHaveAttribute('type', 'password')
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
