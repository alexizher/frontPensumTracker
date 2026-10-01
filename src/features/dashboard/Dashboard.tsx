import { useId, useTransition } from 'react'
import { LogOut } from 'lucide-react'
import type { PartialRecord } from '@/hooks/useAcademicRecord'
import { cn } from '@/lib/utils'
import { extraCredits } from '@/domain/progress'
import { Alert } from '@/components/ui/Alert'
import { Collapsible } from '@/components/ui/Collapsible'
import { IconButton } from '@/components/ui/IconButton'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProgressGauge } from './ProgressGauge'
import { GaugeSkeleton } from './skeletons'
import { AvailableSubjects } from '@/features/pensum/AvailableSubjects'
import { ElectiveBanks } from '@/features/pensum/ElectiveBanks'
import { PensumGrid } from '@/features/pensum/PensumGrid'
import { PensumGridSkeleton, TableSkeleton } from '@/features/pensum/skeletons'

interface VersionSelectorProps {
  currentVersion: number
  versionActual: number
  enrolledVersion: number | null | undefined
  versiones: number[]
  onChangeVersion: (version: number) => Promise<void>
}

function VersionSelector({
  currentVersion,
  versionActual,
  enrolledVersion,
  versiones,
  onChangeVersion,
}: VersionSelectorProps) {
  const [isPending, startTransition] = useTransition()
  const selectId = useId()
  const helpId = useId()
  const hasAssigned = enrolledVersion != null

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(async () => {
      await onChangeVersion(Number(e.target.value))
    })
  }

  function labelFor(v: number) {
    const tags: string[] = []
    if (hasAssigned && v === enrolledVersion) tags.push('tuya')
    if (v === versionActual) tags.push('vigente')
    return tags.length ? `V${v} (${tags.join(', ')})` : `V${v}`
  }

  // Hint solo al explorar otra versión (1 fila en el caso normal).
  const showAssignedHint = hasAssigned && currentVersion !== enrolledVersion

  return (
    <div className="flex w-full min-w-0 flex-col gap-1 md:w-auto md:items-end">
      <div className="flex w-full min-w-0 items-center gap-2">
        <label htmlFor={selectId} className="shrink-0 text-sm font-medium text-muted-foreground">
          Pensum
        </label>
        <Select
          id={selectId}
          value={currentVersion}
          onChange={handleChange}
          disabled={isPending}
          aria-describedby={showAssignedHint ? helpId : undefined}
          className="min-w-0 flex-1 md:w-auto md:flex-none"
        >
          {versiones.map(v => (
            <option key={v} value={v}>
              {labelFor(v)}
            </option>
          ))}
        </Select>
        {isPending ? (
          <span className="shrink-0 text-sm text-muted-foreground" aria-live="polite">
            Cargando...
          </span>
        ) : null}
      </div>
      {showAssignedHint ? (
        <p id={helpId} className="text-sm leading-snug text-muted-foreground">
          Tu versión: <span className="font-medium text-foreground">V{enrolledVersion}</span>
        </p>
      ) : null}
    </div>
  )
}

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
  error: string | null
  onReset: () => void
  onChangeVersion: (version: number) => Promise<void>
}

export function Dashboard({ data, error, onReset, onChangeVersion }: Props) {
  const hasHeader = data.student_name !== undefined
  const hasProgram = data.versiones !== undefined && data.pensum_version !== undefined
  const hasSubjects = Array.isArray(data.subjects)
  const isComplete = data.completed_credits !== undefined
  const showVersionSelector = hasProgram && data.versiones!.length > 1
  const extra = isComplete ? extraCredits(data.completed_credits!, data.total_credits!) : 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:p-6">
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

      {error ? (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      ) : null}

      {data.graduated ? (
        <Alert variant="success" className="mb-6">
          Completaste todos los créditos del plan. No tienes materias pendientes para el grado.
        </Alert>
      ) : null}

      <div className="mx-auto mb-8 max-w-xs">
        {isComplete ? (
          <>
            <ProgressGauge
              completed={data.progress_credits!}
              inProgress={data.in_progress_credits!}
              total={data.total_credits!}
            />
            <div className="mt-1 text-center text-sm text-muted-foreground">
              {data.progress_credits} / {data.total_credits} créditos para el grado
              {data.in_progress_credits! > 0 ? (
                <span className="text-blue-600"> · {data.in_progress_credits} en curso</span>
              ) : null}
            </div>
            {extra > 0 ? (
              <div className="mt-1 text-center text-xs text-emerald-700">
                Has cursado {data.completed_credits} créditos en total
                ({extra} adicionales al plan)
              </div>
            ) : null}
          </>
        ) : (
          <GaugeSkeleton />
        )}
      </div>

      <section className="mb-10">
        {hasSubjects ? <PensumGrid subjects={data.subjects!} /> : (
          <>
            <h2 className="mb-4 text-base font-semibold text-foreground">Pensum</h2>
            <PensumGridSkeleton />
          </>
        )}
      </section>

      <Collapsible title="Materias disponibles">
        {isComplete ? <AvailableSubjects subjects={data.subjects!} /> : <TableSkeleton />}
      </Collapsible>

      <Collapsible title="Electivas">
        {isComplete ? (
          <ElectiveBanks banks={data.elective_banks!} subjects={data.subjects!} />
        ) : (
          <TableSkeleton rows={3} />
        )}
      </Collapsible>
    </div>
  )
}
