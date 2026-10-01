// Índice inicial válido para una ventana de `visible` elementos sobre `total`.
export function clampStart(startIndex: number, total: number, visible: number): number {
  const max = Math.max(0, total - visible)
  return Math.min(Math.max(0, startIndex), max)
}
