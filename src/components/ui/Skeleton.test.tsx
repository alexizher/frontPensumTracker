import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('pinta un bloque animado con el tamaño que recibe', () => {
    const { container } = render(<Skeleton className="h-7 w-56" />)

    expect(container.firstElementChild).toHaveClass('animate-pulse', 'h-7', 'w-56')
  })
})
