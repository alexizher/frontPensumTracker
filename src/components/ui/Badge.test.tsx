import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('pinta su texto con forma de pastilla y el color que recibe', () => {
    render(<Badge className="bg-green-100 text-green-800">Aprobada</Badge>)

    expect(screen.getByText('Aprobada')).toHaveClass('rounded-full', 'bg-green-100', 'text-green-800')
  })
})
