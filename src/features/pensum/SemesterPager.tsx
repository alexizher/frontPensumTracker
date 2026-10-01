import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'

interface Props {
  // Índice del primer semestre visible.
  start: number
  pageSize: number
  total: number
  onPrevious: () => void
  onNext: () => void
}

export function SemesterPager({ start, pageSize, total, onPrevious, onNext }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <IconButton onClick={onPrevious} disabled={start <= 0} aria-label="Semestres anteriores">
        <ChevronLeft className="size-4" aria-hidden="true" />
      </IconButton>
      <span className="text-xs tabular-nums text-muted-foreground">
        {start + 1}–{Math.min(start + pageSize, total)}{' '}
        de {total}
      </span>
      <IconButton
        onClick={onNext}
        disabled={start + pageSize >= total}
        aria-label="Semestres siguientes"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </IconButton>
    </div>
  )
}
