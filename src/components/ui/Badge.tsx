import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// El color lo pone quien lo usa, por className.
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('rounded-full px-2 py-0.5 text-xs', className)} {...props} />
}
