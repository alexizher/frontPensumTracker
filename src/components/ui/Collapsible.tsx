import { useId, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export function Collapsible({ title, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <section className="mb-10">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="mb-4 flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-md text-left transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <ChevronDown
          className={cn(
            'size-5 shrink-0 text-muted-foreground transition-transform duration-200',
            open ? 'rotate-0' : '-rotate-90',
          )}
          aria-hidden="true"
        />
      </button>
      {open ? <div id={panelId}>{children}</div> : null}
    </section>
  )
}
