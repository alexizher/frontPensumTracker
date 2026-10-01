import { useEffect, useState } from 'react'

// Columnas de semestre que caben según el ancho de la ventana.
export function useVisibleCols() {
  const [cols, setCols] = useState(2)

  useEffect(() => {
    const queries = [
      { mq: window.matchMedia('(min-width: 1024px)'), n: 6 },
      { mq: window.matchMedia('(min-width: 768px)'), n: 4 },
      { mq: window.matchMedia('(min-width: 640px)'), n: 3 },
    ]

    const update = () => {
      setCols(queries.find(q => q.mq.matches)?.n ?? 2)
    }

    update()
    for (const q of queries) q.mq.addEventListener('change', update)
    return () => {
      for (const q of queries) q.mq.removeEventListener('change', update)
    }
  }, [])

  return cols
}
