type Listener = () => void

let width = 0
const listeners = new Set<Listener>()

function minWidthOf(query: string): number {
  const match = /min-width:\s*(\d+)px/.exec(query)
  return match ? Number(match[1]) : 0
}

// Reinicia el ancho a 0 (móvil) y reemplaza window.matchMedia.
export function installMatchMedia(): void {
  width = 0
  listeners.clear()
  window.matchMedia = (query: string) =>
    ({
      media: query,
      get matches() {
        return width >= minWidthOf(query)
      },
      addEventListener: (_type: string, listener: Listener) => {
        listeners.add(listener)
      },
      removeEventListener: (_type: string, listener: Listener) => {
        listeners.delete(listener)
      },
    }) as unknown as MediaQueryList
}

// Cambia el ancho simulado y avisa a los componentes suscritos.
export function setViewportWidth(px: number): void {
  width = px
  for (const listener of [...listeners]) listener()
}
