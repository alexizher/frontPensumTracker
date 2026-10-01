import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamLoginAndFetch } from './academic-api'
import type { StreamEvent } from '@/types/stream'
import { ndjsonResponse } from '@/test/stream'
import { recordEvents } from '@/test/fixtures/academic-record'

function stubFetch(respond: () => Response | Promise<Response>) {
  const fetchMock = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(
    async () => respond(),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

async function collect(respond: () => Response | Promise<Response>) {
  stubFetch(respond)
  const events: StreamEvent[] = []
  await streamLoginAndFetch('ana.prueba', 'Secreta123', 0, event => events.push(event))
  return events
}

const errorEvent: StreamEvent = { stage: 'error', status: 502, detail: 'El portal no respondió' }

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('streamLoginAndFetch', () => {
  it('pide el expediente por POST con las credenciales y la versión', async () => {
    const fetchMock = stubFetch(() => ndjsonResponse(recordEvents))

    await streamLoginAndFetch('ana.prueba', 'Secreta123', 2, () => {})

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toMatch(/\/api\/login\/stream$/)
    expect(init?.method).toBe('POST')
    expect(init?.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(JSON.parse(String(init?.body))).toEqual({
      username: 'ana.prueba',
      password: 'Secreta123',
      pensum_version: 2,
    })
  })

  it('entrega cada evento, en el orden en que llega', async () => {
    const events = await collect(() => ndjsonResponse(recordEvents))

    expect(events).toEqual(recordEvents)
  })

  it('entrega los mismos eventos aunque el cuerpo llegue byte a byte', async () => {
    const events = await collect(() => ndjsonResponse(recordEvents, 1))

    expect(events).toEqual(recordEvents)
  })

  it('entrega el último evento aunque no termine en salto de línea', async () => {
    const events = await collect(() => new Response(JSON.stringify(errorEvent)))

    expect(events).toEqual([errorEvent])
  })

  it('ignora las líneas vacías', async () => {
    const events = await collect(() => new Response(`\n\n${JSON.stringify(errorEvent)}\n  \n`))

    expect(events).toEqual([errorEvent])
  })

  it('no entrega nada si el cuerpo llega vacío', async () => {
    const events = await collect(() => new Response(''))

    expect(events).toEqual([])
  })

  it('rechaza con el detalle del backend cuando la respuesta es un error', async () => {
    stubFetch(
      () =>
        new Response(JSON.stringify({ detail: 'Credenciales inválidas' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }),
    )

    await expect(streamLoginAndFetch('a', 'b', 0, () => {})).rejects.toThrow('Credenciales inválidas')
  })

  it('rechaza con un mensaje genérico si el error no trae JSON', async () => {
    stubFetch(() => new Response('Bad Gateway', { status: 502 }))

    await expect(streamLoginAndFetch('a', 'b', 0, () => {})).rejects.toThrow(
      'Error al iniciar sesión',
    )
  })

  it('rechaza con un mensaje genérico si la respuesta no trae cuerpo', async () => {
    stubFetch(() => new Response(null, { status: 200 }))

    await expect(streamLoginAndFetch('a', 'b', 0, () => {})).rejects.toThrow(
      'Error al iniciar sesión',
    )
  })

  it('rechaza si una línea no es JSON válido, después de entregar las anteriores', async () => {
    stubFetch(() => new Response(`${JSON.stringify(errorEvent)}\n{"stage":\n`))
    const events: StreamEvent[] = []

    await expect(
      streamLoginAndFetch('a', 'b', 0, event => events.push(event)),
    ).rejects.toThrow(SyntaxError)
    expect(events).toEqual([errorEvent])
  })

  it('rechaza si una línea es null, después de entregar las anteriores', async () => {
    stubFetch(() => new Response(`${JSON.stringify(errorEvent)}\nnull\n`))
    const events: StreamEvent[] = []

    await expect(
      streamLoginAndFetch('a', 'b', 0, event => events.push(event)),
    ).rejects.toThrow('Respuesta inesperada del servidor')
    expect(events).toEqual([errorEvent])
  })

  it('deja pasar el error de red', async () => {
    stubFetch(() => Promise.reject(new TypeError('Failed to fetch')))

    await expect(streamLoginAndFetch('a', 'b', 0, () => {})).rejects.toThrow('Failed to fetch')
  })
})
