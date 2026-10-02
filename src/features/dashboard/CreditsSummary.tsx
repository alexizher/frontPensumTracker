import { extraCredits, remainingCredits } from '@/domain/progress'
import { ProgressGauge } from './ProgressGauge'

interface Props {
  // Créditos que cuentan para el grado: es lo que pinta el gauge.
  towardDegree: number
  inProgress: number
  total: number
  // Créditos cursados en total, que pueden superar los del plan.
  takenTotal: number
}

export function CreditsSummary({ towardDegree, inProgress, total, takenTotal }: Props) {
  const extra = extraCredits(takenTotal, total)
  const remaining = remainingCredits(towardDegree, inProgress, total)

  return (
    <>
      <ProgressGauge completed={towardDegree} inProgress={inProgress} total={total} />
      <div className="mt-1 text-center text-sm text-muted-foreground">
        {towardDegree} / {total} créditos para el grado
        {inProgress > 0 ? <span className="text-blue-600"> · {inProgress} en curso</span> : null}
        <span> · {remaining} créditos faltantes</span>
      </div>
      {extra > 0 ? (
        <div className="mt-1 text-center text-xs text-emerald-700">
          Has cursado {takenTotal} créditos en total
          ({extra} adicionales al plan)
        </div>
      ) : null}
    </>
  )
}
