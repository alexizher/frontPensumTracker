import { LogOut } from 'lucide-react'
import type { PartialRecord } from '@/hooks/useAcademicRecord'
import { cn } from '@/lib/utils'
import { IconButton } from '@/components/ui/IconButton'
import { Skeleton } from '@/components/ui/Skeleton'
import { VersionSelector } from './VersionSelector'

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
  data: PartialRecord
  onReset: () => void
  onChangeVersion: (version: number) => Promise<void>
}

export function DashboardHeader({ data, onReset, onChangeVersion }: Props) {
  const hasHeader = data.student_name !== undefined
  const hasProgram = data.versiones !== undefined && data.pensum_version !== undefined
  const showVersionSelector = hasProgram && data.versiones!.length > 1

  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-border pb-4 md:mb-8 md:flex-row md:items-start md:justify-between md:gap-8 md:border-0 md:pb-0">
      <div className="flex min-w-0 items-start gap-2 md:flex-1">
        <div className="min-w-0 flex-1">
          {hasHeader ? (
            <>
              <h1 className="text-xl font-semibold leading-snug text-foreground break-words md:text-2xl">
                {data.student_name}
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {data.program_name}
              </p>
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
        {showVersionSelector ? (
          <VersionSelector
            currentVersion={data.pensum_version!}
            versionActual={data.version_actual!}
            enrolledVersion={data.enrolled_version}
            versiones={data.versiones!}
            onChangeVersion={onChangeVersion}
          />
        ) : null}
      </div>
    </header>
  )
}
