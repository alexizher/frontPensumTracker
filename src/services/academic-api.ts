import type { StreamEvent } from '@/types/stream'
import { readNdjson } from './ndjson'

const BASE_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/api`

export async function streamLoginAndFetch(
  username: string,
  password: string,
  pensumVersion: number,
  onEvent: (event: StreamEvent) => void,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/login/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, pensum_version: pensumVersion }),
  })

  if (!res.ok || !res.body) {
    const err = (await res.json().catch(() => null)) as { detail?: string } | null
    throw new Error(err?.detail ?? 'Error al iniciar sesión')
  }

  for await (const event of readNdjson<StreamEvent | null>(res.body)) {
    // `null` es JSON válido pero no es un evento. Se corta aquí para que no llegue al reducer.
    if (event === null) throw new Error('Respuesta inesperada del servidor')
    onEvent(event)
  }
}
