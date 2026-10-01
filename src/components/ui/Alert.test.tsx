import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert } from './Alert'

describe('Alert', () => {
  it('pinta su contenido y pasa los atributos al contenedor', () => {
    render(
      <Alert variant="info" role="status" aria-live="polite">
        Cálculo II
      </Alert>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('Cálculo II')
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('cada variante tiene su color', () => {
    render(
      <>
        <Alert variant="error">error</Alert>
        <Alert variant="success">éxito</Alert>
        <Alert variant="info">aviso</Alert>
      </>,
    )

    expect(screen.getByText('error')).toHaveClass('border', 'bg-red-50')
    expect(screen.getByText('éxito')).toHaveClass('border', 'bg-emerald-50')
    expect(screen.getByText('aviso')).toHaveClass('border', 'bg-orange-50')
  })

  it('exige una variante en el tipo', () => {
    // @ts-expect-error sin variante la caja no tendría color ni relleno
    render(<Alert>sin variante</Alert>)
    // @ts-expect-error null tampoco es una variante
    render(<Alert variant={null}>nula</Alert>)

    expect(screen.getByText('sin variante')).toBeInTheDocument()
  })

  it('suma las clases que recibe', () => {
    render(
      <Alert variant="error" className="mb-6">
        error
      </Alert>,
    )

    expect(screen.getByText('error')).toHaveClass('mb-6')
  })
})
