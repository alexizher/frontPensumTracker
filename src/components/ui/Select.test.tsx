import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from './Select'

describe('Select', () => {
  it('pinta sus opciones y avisa del cambio', async () => {
    const onChange = vi.fn()
    render(
      <Select aria-label="Versión" defaultValue="2" onChange={onChange}>
        <option value="1">V1</option>
        <option value="2">V2</option>
      </Select>,
    )
    const select = screen.getByLabelText('Versión')
    expect(select).toHaveValue('2')

    await userEvent.setup().selectOptions(select, '1')

    expect(select).toHaveValue('1')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('suma las clases que recibe y se puede deshabilitar', () => {
    render(<Select aria-label="Versión" className="flex-1" disabled />)

    expect(screen.getByLabelText('Versión')).toHaveClass('min-h-11', 'flex-1')
    expect(screen.getByLabelText('Versión')).toBeDisabled()
  })
})
