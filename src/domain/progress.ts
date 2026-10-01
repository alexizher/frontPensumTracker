export interface GaugeFractions {
  completedFraction: number
  inProgressFraction: number
  percent: number
}

// Porcentaje entero entre 0 y 100. Si el total no es un número positivo devuelve 0.
export function percentOf(value: number, total: number): number {
  if (!(total > 0)) return 0
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)))
}

// Fracciones del gauge. Lo aprobado y lo que está en curso no pasan juntos de 1.
// Si el total no es positivo se divide por 1, así que cualquier crédito aprobado
// da 100 %. Es el comportamiento heredado del gauge y por eso no usa percentOf,
// que en ese caso devuelve 0. Los valores negativos no se recortan.
export function gaugeFractions(
  completed: number,
  inProgress: number,
  total: number,
): GaugeFractions {
  const safeTotal = total > 0 ? total : 1
  const completedFraction = Math.min(1, completed / safeTotal)
  const inProgressFraction = Math.min(1 - completedFraction, inProgress / safeTotal)
  return { completedFraction, inProgressFraction, percent: Math.round(completedFraction * 100) }
}

// Créditos cursados por encima del total que exige el plan.
export function extraCredits(completed: number, total: number): number {
  return Math.max(0, completed - total)
}
