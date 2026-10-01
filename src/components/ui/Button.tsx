import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva('', {
  variants: {
    variant: {
      primary:
        'rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50',
      ghost:
        'flex min-h-11 cursor-pointer items-center gap-1 px-4 text-sm text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
    },
  },
  defaultVariants: { variant: 'primary' },
})

type Props = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ variant, className, type = 'button', ...props }: Props) {
  return <button type={type} className={cn(buttonVariants({ variant }), className)} {...props} />
}
