import { memo } from 'react'
import { cn } from '@/lib/utils'
import type { Subject } from '@/types/academic'
import { SUBJECT_STATUS } from './subject-status'

interface Props {
  subject: Subject
  isSelected?: boolean
  isPrereq?: boolean
  onClick?: (code: string) => void
}

export const SubjectCard = memo(function SubjectCard({
  subject: s,
  isSelected = false,
  isPrereq = false,
  onClick,
}: Props) {
  return (
    <div
      onClick={() => onClick?.(s.code)}
      className={cn(
        'w-full min-h-[88px] rounded-lg border p-2 text-xs flex flex-col justify-between',
        onClick ? 'cursor-pointer transition-shadow hover:shadow-md' : '',
        SUBJECT_STATUS[s.status].card,
        isSelected && 'ring-2 ring-offset-1 ring-gray-800',
        isPrereq && 'ring-2 ring-offset-1 ring-orange-400',
      )}
    >
      <div className="font-semibold line-clamp-2 leading-tight">{s.name}</div>
      <div className="flex justify-between items-end opacity-70">
        <span className="font-mono">{s.code}</span>
        <span className="text-right leading-tight">
          {s.nota !== null ? (
            <span className="block font-medium opacity-100">{s.nota.toFixed(1)}</span>
          ) : null}
          <span>{s.credits} cr</span>
        </span>
      </div>
    </div>
  )
})
