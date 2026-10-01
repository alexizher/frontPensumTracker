import type { StreamEvent } from '@/types/stream'

// Respuesta NDJSON troceada en chunks pequeños, como la entrega la red.
export function ndjsonResponse(events: StreamEvent[], chunkSize = 64): Response {
  const text = events.map(event => JSON.stringify(event)).join('\n') + '\n'
  const bytes = new TextEncoder().encode(text)
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (let i = 0; i < bytes.length; i += chunkSize) {
        controller.enqueue(bytes.slice(i, i + chunkSize))
      }
      controller.close()
    },
  })
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'application/x-ndjson' },
  })
}
