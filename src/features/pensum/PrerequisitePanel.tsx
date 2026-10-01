import type { PrerequisiteRef } from '@/domain/pensum'
import type { Subject } from '@/types/academic'
import { Alert } from '@/components/ui/Alert'

interface Props {
  subject: Subject
  prerequisites: PrerequisiteRef[]
}

export function PrerequisitePanel({ subject, prerequisites }: Props) {
  return (
    <Alert variant="info" role="status" aria-live="polite" className="mb-3">
      <p className="font-medium leading-snug">{subject.name}</p>
      {prerequisites.length > 0 ? (
        <ul className="mt-1.5 space-y-1 text-sm leading-snug text-orange-900/90">
          {prerequisites.map(p => (
            <li key={p.code}>
              <span className="font-mono text-xs opacity-70">{p.code}</span>
              <span className="mx-1.5 text-orange-300" aria-hidden="true">
                ·
              </span>
              {p.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-orange-900/80">Sin prerrequisitos</p>
      )}
    </Alert>
  )
}
