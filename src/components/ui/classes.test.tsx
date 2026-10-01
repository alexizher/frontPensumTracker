import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert } from './Alert'
import { Badge } from './Badge'
import { Button } from './Button'
import { Collapsible } from './Collapsible'
import { IconButton } from './IconButton'
import { Input } from './Input'
import { PasswordInput } from './PasswordInput'
import { ProgressBar } from './ProgressBar'
import { Select } from './Select'
import { Skeleton } from './Skeleton'

// Contrato visual: el aspecto de cada átomo es su lista de clases. Si una clase se
// pierde o se añade por accidente, estos tests lo dicen. Cambiarlas a propósito es
// un cambio de diseño y se actualiza aquí.
function classes(element: Element | null) {
  return [...(element?.classList ?? [])].sort()
}

function list(value: string) {
  return value.split(' ').sort()
}

describe('clases de los átomos', () => {
  it('Button primary', () => {
    render(<Button>x</Button>)

    expect(classes(screen.getByRole('button'))).toEqual(
      list('rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50'),
    )
  })

  it('Button ghost', () => {
    render(<Button variant="ghost">x</Button>)

    expect(classes(screen.getByRole('button'))).toEqual(
      list(
        'flex min-h-11 cursor-pointer items-center gap-1 px-4 text-sm text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
      ),
    )
  })

  const iconButtonBase =
    'inline-flex size-11 cursor-pointer items-center justify-center rounded-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  it('IconButton neutral', () => {
    render(<IconButton aria-label="x" />)

    expect(classes(screen.getByRole('button'))).toEqual(
      list(
        `${iconButtonBase} border-input text-muted-foreground hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30`,
      ),
    )
  })

  it('IconButton danger', () => {
    render(<IconButton aria-label="x" variant="danger" />)

    expect(classes(screen.getByRole('button'))).toEqual(
      list(
        `${iconButtonBase} border-border bg-secondary text-foreground shadow-sm hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive`,
      ),
    )
  })

  const inputClasses =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring'

  it('Input', () => {
    render(<Input placeholder="x" />)

    expect(classes(screen.getByPlaceholderText('x'))).toEqual(list(inputClasses))
  })

  it('PasswordInput: campo, contenedor y botón del ojo', () => {
    render(<PasswordInput placeholder="x" />)
    const field = screen.getByPlaceholderText('x')

    expect(classes(field)).toEqual(list(`${inputClasses} pr-10`))
    expect(classes(field.parentElement)).toEqual(['relative'])
    expect(classes(screen.getByRole('button'))).toEqual(
      list(
        'absolute inset-y-0 right-0 flex items-center rounded-md px-3 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:opacity-50',
      ),
    )
  })

  it('Select', () => {
    render(<Select aria-label="x" />)

    expect(classes(screen.getByLabelText('x'))).toEqual(
      list(
        'min-h-11 cursor-pointer rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 md:text-sm',
      ),
    )
  })

  it('Badge', () => {
    render(<Badge>x</Badge>)

    expect(classes(screen.getByText('x'))).toEqual(list('rounded-full px-2 py-0.5 text-xs'))
  })

  it('Alert en sus tres variantes', () => {
    render(
      <>
        <Alert variant="error">error</Alert>
        <Alert variant="success">éxito</Alert>
        <Alert variant="info">aviso</Alert>
      </>,
    )

    expect(classes(screen.getByText('error'))).toEqual(
      list('border rounded-md border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'),
    )
    expect(classes(screen.getByText('éxito'))).toEqual(
      list('border rounded-lg border-emerald-300 bg-emerald-50 px-4 py-3 text-center text-emerald-800'),
    )
    expect(classes(screen.getByText('aviso'))).toEqual(
      list('border rounded-md border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-950'),
    )
  })

  it('ProgressBar: pista y relleno', () => {
    const { container } = render(<ProgressBar percent={50} />)
    const track = container.firstElementChild

    expect(classes(track)).toEqual(list('h-2 overflow-hidden rounded-full bg-gray-200'))
    expect(classes(track?.firstElementChild ?? null)).toEqual(
      list('h-full rounded-full bg-green-500 transition-all'),
    )
  })

  it('Skeleton', () => {
    const { container } = render(<Skeleton />)

    expect(classes(container.firstElementChild)).toEqual(list('animate-pulse rounded-md bg-gray-200'))
  })

  it('Collapsible: sección, botón, título y flecha abierta', () => {
    const { container } = render(<Collapsible title="Título">x</Collapsible>)
    const trigger = screen.getByRole('button')

    expect(classes(container.firstElementChild)).toEqual(['mb-10'])
    expect(classes(trigger)).toEqual(
      list(
        'mb-4 flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-md text-left transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      ),
    )
    expect(classes(screen.getByRole('heading'))).toEqual(list('text-base font-semibold text-foreground'))
    expect(trigger.querySelector('svg')).toHaveClass('rotate-0')
    expect(trigger.querySelector('svg')).not.toHaveClass('-rotate-90')
  })

  it('Collapsible: flecha girada al plegar', () => {
    render(
      <Collapsible title="Título" defaultOpen={false}>
        x
      </Collapsible>,
    )

    expect(screen.getByRole('button').querySelector('svg')).toHaveClass('-rotate-90')
  })
})
