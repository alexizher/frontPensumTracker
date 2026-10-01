import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const iconButtonVariants = cva(
  'inline-flex size-11 cursor-pointer items-center justify-center rounded-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        neutral:
          'border-input text-muted-foreground hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30',
        danger:
          'border-border bg-secondary text-foreground shadow-sm hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

// Un botón de solo ícono necesita nombre accesible: aria-label es obligatorio.
type Props = Omit<ComponentProps<'button'>, 'aria-label'> &
  VariantProps<typeof iconButtonVariants> & { 'aria-label': string }

export function IconButton({ variant, className, type = 'button', ...props }: Props) {
  return (
    <button type={type} className={cn(iconButtonVariants({ variant }), className)} {...props} />
  )
}
