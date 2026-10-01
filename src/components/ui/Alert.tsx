import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva('border', {
  variants: {
    variant: {
      error: 'rounded-md border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700',
      success: 'rounded-lg border-emerald-300 bg-emerald-50 px-4 py-3 text-center text-emerald-800',
      info: 'rounded-md border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-950',
    },
  },
})

type Props = ComponentProps<'div'> & {
  variant: NonNullable<VariantProps<typeof alertVariants>['variant']>
}

export function Alert({ variant, className, ...props }: Props) {
  return <div className={cn(alertVariants({ variant }), className)} {...props} />
}
