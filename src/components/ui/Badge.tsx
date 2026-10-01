import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// El color lo pone quien lo usa, por className.
export function Badge({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cn('rounded-full px-2 py-0.5 text-xs', className)} {...props} />
}
