export interface GaugeFractions {
  completed: number
  inProgress: number
  percent: number
}

// Porcentaje entero entre 0 y 100. Con total 0 o negativo devuelve 0.
export function percentOf(value: number, total: number): number {
  if (total <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)))
}

// Fracciones del gauge, entre 0 y 1. Lo aprobado y lo que está en curso no pasan juntos de 1.
export function gaugeFractions(
  completed: number,
  inProgress: number,
  total: number,
): GaugeFractions {
  const safeTotal = total > 0 ? total : 1
  const completedFraction = Math.min(1, completed / safeTotal)
  const inProgressFraction = Math.min(Math.max(0, 1 - completedFraction), inProgress / safeTotal)
  return {
    completed: completedFraction,
    inProgress: inProgressFraction,
    percent: Math.round(completedFraction * 100),
  }
}
