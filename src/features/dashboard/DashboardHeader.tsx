import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton } from '@/components/ui/IconButton'
import { Skeleton } from '@/components/ui/Skeleton'

function LogoutButton({ onReset, className }: { onReset: () => void; className?: string }) {
  return (
    <IconButton
      variant="danger"
      onClick={onReset}
      aria-label="Cerrar sesión"
      title="Cerrar sesión"
      className={cn('shrink-0', className)}
    >
      <LogOut className="size-5" strokeWidth={2.25} aria-hidden="true" />
    </IconButton>
  )
}

interface Props {
  // Sin nombre todavía, la cabecera pinta un esqueleto.
  studentName?: string
  programName?: string
  // Hueco para el selector de versión; vacío si el programa tiene una sola.
  versionSelector?: ReactNode
  onReset: () => void
}

export function DashboardHeader({ studentName, programName, versionSelector, onReset }: Props) {
  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-border pb-4 md:mb-8 md:flex-row md:items-start md:justify-between md:gap-8 md:border-0 md:pb-0">
      <div className="flex min-w-0 items-start gap-2 md:flex-1">
        <div className="min-w-0 flex-1">
          {studentName !== undefined ? (
            <>
              <h1 className="text-xl font-semibold leading-snug text-foreground break-words md:text-2xl">
                {studentName}
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{programName}</p>
            </>
          ) : (
            <>
              <Skeleton className="h-7 w-56" />
              <Skeleton className="mt-2 h-4 w-40" />
            </>
          )}
        </div>
        <LogoutButton onReset={onReset} className="md:hidden" />
      </div>

      <div className="flex w-full flex-col gap-3 md:w-auto md:shrink-0 md:items-end">
        <LogoutButton onReset={onReset} className="hidden md:inline-flex" />
        {versionSelector}
      </div>
    </header>
  )
}
