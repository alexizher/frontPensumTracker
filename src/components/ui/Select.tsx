import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'min-h-11 cursor-pointer rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}
