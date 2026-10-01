import { extraCredits } from '@/domain/progress'
import { ProgressGauge } from './ProgressGauge'

interface Props {
  // Créditos que cuentan para el grado.
  progress: number
  inProgress: number
  total: number
  // Créditos cursados en total, que pueden superar los del plan.
  completed: number
}

export function CreditsSummary({ progress, inProgress, total, completed }: Props) {
  const extra = extraCredits(completed, total)

  return (
    <>
      <ProgressGauge completed={progress} inProgress={inProgress} total={total} />
      <div className="mt-1 text-center text-sm text-muted-foreground">
        {progress} / {total} créditos para el grado
        {inProgress > 0 ? <span className="text-blue-600"> · {inProgress} en curso</span> : null}
      </div>
      {extra > 0 ? (
        <div className="mt-1 text-center text-xs text-emerald-700">
          Has cursado {completed} créditos en total
          ({extra} adicionales al plan)
        </div>
      ) : null}
    </>
  )
}
