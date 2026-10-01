import { useId, useTransition } from 'react'
import { Select } from '@/components/ui/Select'

interface Props {
  currentVersion: number
  versionActual: number
  enrolledVersion: number | null | undefined
  versiones: number[]
  onChangeVersion: (version: number) => Promise<void>
}

export function VersionSelector({
  currentVersion,
  versionActual,
  enrolledVersion,
  versiones,
  onChangeVersion,
}: Props) {
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
