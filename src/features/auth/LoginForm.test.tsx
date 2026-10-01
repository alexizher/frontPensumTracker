import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

function usernameInput() {
  return screen.getByPlaceholderText('tu.usuario')
}

function passwordInput() {
  return document.querySelector<HTMLInputElement>('input[autocomplete="current-password"]')!
}

describe('LoginForm', () => {
  it('deshabilita el envío hasta que hay usuario y contraseña', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} loading={false} />)
    const submit = screen.getByRole('button', { name: 'Ver mi pensum' })

    expect(submit).toBeDisabled()
    await user.type(usernameInput(), 'ana.prueba')
    expect(submit).toBeDisabled()
    await user.type(passwordInput(), 'Secreta123')
    expect(submit).toBeEnabled()
  })

  it('no acepta solo espacios como credenciales', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} loading={false} />)

    await user.type(usernameInput(), '   ')
    await user.type(passwordInput(), '   ')

    expect(screen.getByRole('button', { name: 'Ver mi pensum' })).toBeDisabled()
  })

  it('envía usuario y contraseña al pulsar el botón', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} loading={false} />)

    await user.type(usernameInput(), 'ana.prueba')
    await user.type(passwordInput(), 'Secreta123')
    await user.click(screen.getByRole('button', { name: 'Ver mi pensum' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith('ana.prueba', 'Secreta123')
  })

  it('envía con Enter desde el campo de contraseña', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} loading={false} />)

    await user.type(usernameInput(), 'ana.prueba')
    await user.type(passwordInput(), 'Secreta123{Enter}')

    expect(onSubmit).toHaveBeenCalledWith('ana.prueba', 'Secreta123')
  })

  it('muestra y vuelve a ocultar la contraseña con el botón del ojo', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} loading={false} />)
    await user.type(passwordInput(), 'Secreta123')
    expect(passwordInput()).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))
    expect(passwordInput()).toHaveAttribute('type', 'text')
    expect(passwordInput()).toHaveValue('Secreta123')

    await user.click(screen.getByRole('button', { name: 'Ocultar contraseña' }))
    expect(passwordInput()).toHaveAttribute('type', 'password')
  })

  it('el botón del ojo no envía el formulario', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} loading={false} />)
    await user.type(usernameInput(), 'ana.prueba')
    await user.type(passwordInput(), 'Secreta123')

    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('oculta la contraseña al enviar', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} loading={false} />)
    await user.type(usernameInput(), 'ana.prueba')
    await user.type(passwordInput(), 'Secreta123')
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))

    await user.click(screen.getByRole('button', { name: 'Ver mi pensum' }))

    expect(passwordInput()).toHaveAttribute('type', 'password')
  })

  it('muestra el error que recibe, debajo del formulario', () => {
    const { container } = render(
      <LoginForm onSubmit={vi.fn()} loading={false} error="Credenciales inválidas" />,
    )
    const message = screen.getByText('Credenciales inválidas')

    expect(message.tagName).toBe('P')
    expect(message.previousElementSibling).toBe(container.firstElementChild)
  })

  it('no pinta ningún mensaje cuando no hay error', () => {
    const { container } = render(<LoginForm onSubmit={vi.fn()} loading={false} error={null} />)

    expect(container.children).toHaveLength(1)
  })

  it('mientras carga bloquea los campos y cambia el texto del botón', () => {
    render(<LoginForm onSubmit={vi.fn()} loading={true} />)

    expect(screen.getByRole('button', { name: 'Cargando pensum...' })).toBeDisabled()
    expect(usernameInput()).toBeDisabled()
    expect(passwordInput()).toBeDisabled()
  })
})
