import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('pasa los atributos al campo y avisa de los cambios', async () => {
    const onChange = vi.fn()
    render(<Input placeholder="tu.usuario" autoComplete="username" onChange={onChange} />)
    const input = screen.getByPlaceholderText('tu.usuario')

    await userEvent.setup().type(input, 'ana')

    expect(input).toHaveAttribute('autocomplete', 'username')
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('suma las clases que recibe a las propias', () => {
    render(<Input placeholder="x" className="pr-10" />)

    expect(screen.getByPlaceholderText('x')).toHaveClass('w-full', 'px-3', 'pr-10')
  })

  it('se puede deshabilitar', () => {
    render(<Input placeholder="x" disabled />)

    expect(screen.getByPlaceholderText('x')).toBeDisabled()
  })
})
