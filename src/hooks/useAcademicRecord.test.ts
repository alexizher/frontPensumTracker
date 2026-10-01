import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAcademicRecord } from './useAcademicRecord'
import type { StreamEvent } from '@/types/stream'
import { ndjsonResponse } from '@/test/stream'
import { record, recordEvents, subjects } from '@/test/fixtures/academic-record'

type Responder = () => Response | Promise<Response>

function stubFetch(...responders: Responder[]) {
  let call = 0
  const fetchMock = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(
    async () => responders[Math.min(call++, responders.length - 1)](),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

// Respuesta que queda pendiente hasta que el test la suelta.
function deferred(events: StreamEvent[]) {
  let release = () => {}
  const responder: Responder = () =>
    new Promise<Response>(resolve => {
      release = () => resolve(ndjsonResponse(events))
    })
  return { responder, release: () => release() }
}

const bodyOf = (init?: RequestInit) => JSON.parse(String(init?.body))
const partialError: StreamEvent[] = [
  recordEvents[0],
  { stage: 'error', status: 502, detail: 'El portal no respondió' },
]

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useAcademicRecord', () => {
  it('empieza sin datos, sin error y en reposo', () => {
    const { result } = renderHook(() => useAcademicRecord())

    expect(result.current.status).toBe('idle')
    expect(result.current.error).toBeNull()
    expect(result.current.data).toBeNull()
  })

  it('mientras carga queda en loading y sin datos', async () => {
    const pending = deferred(recordEvents)
    stubFetch(pending.responder)
    const { result } = renderHook(() => useAcademicRecord())

    let finished: Promise<void> = Promise.resolve()
    act(() => {
      finished = result.current.load('ana.prueba', 'Secreta123')
    })
    expect(result.current.status).toBe('loading')
    expect(result.current.data).toBeNull()

    await act(async () => {
      pending.release()
      await finished
    })
    expect(result.current.status).toBe('idle')
  })

  it('al terminar deja el expediente completo y vuelve a reposo', async () => {
    const fetchMock = stubFetch(() => ndjsonResponse(recordEvents))
    const { result } = renderHook(() => useAcademicRecord())

    await act(() => result.current.load('ana.prueba', 'Secreta123'))

    expect(result.current.status).toBe('idle')
    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual(record)
    expect(bodyOf(fetchMock.mock.calls[0][1])).toEqual({
      username: 'ana.prueba',
      password: 'Secreta123',
      pensum_version: 0,
    })
  })

  it('una etapa pensum que llega después del expediente no pisa los estados calculados', async () => {
    const locked = subjects.map(subject => ({ ...subject, status: 'locked' as const }))
    stubFetch(() =>
      ndjsonResponse([...recordEvents, { stage: 'pensum', data: { subjects: locked } }]),
    )
    const { result } = renderHook(() => useAcademicRecord())

    await act(() => result.current.load('ana.prueba', 'Secreta123'))

    expect(result.current.data?.subjects).toEqual(subjects)
  })

  it('antes del expediente, cada etapa pensum reemplaza las materias', async () => {
    stubFetch(() => ndjsonResponse(recordEvents.slice(0, 4)))
    const { result } = renderHook(() => useAcademicRecord())

    await act(() => result.current.load('ana.prueba', 'Secreta123'))

    expect(result.current.data?.subjects?.every(subject => subject.status === 'locked')).toBe(true)
    expect(result.current.data?.subjects?.[0].cursada).toBe(true)
    expect(result.current.data?.completed_credits).toBeUndefined()
    expect(result.current.data?.student_name).toBe('Ana Prueba')
    expect(result.current.data?.versiones).toEqual([1, 2])
  })

  it('con un error HTTP queda en error, con el detalle y sin datos', async () => {
    stubFetch(
      () =>
        new Response(JSON.stringify({ detail: 'Credenciales inválidas' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }),
    )
    const { result } = renderHook(() => useAcademicRecord())

    await act(() => result.current.load('ana.prueba', 'mala'))

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('Credenciales inválidas')
    expect(result.current.data).toBeNull()
  })

  it('con una etapa error conserva lo recibido y sigue en error al cerrarse el stream', async () => {
    stubFetch(() => ndjsonResponse(partialError))
    const { result } = renderHook(() => useAcademicRecord())

    await act(() => result.current.load('ana.prueba', 'Secreta123'))

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('El portal no respondió')
    expect(result.current.data).toEqual({
      student_name: 'Ana Prueba',
      program_name: 'Ingeniería de Sistemas',
      program_code: '504',
    })
  })

  it('con un fallo de red muestra su mensaje', async () => {
    stubFetch(() => Promise.reject(new TypeError('Failed to fetch')))
    const { result } = renderHook(() => useAcademicRecord())

    await act(() => result.current.load('ana.prueba', 'Secreta123'))

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('Failed to fetch')
  })

  it('si lo que falla no es un Error, usa un mensaje genérico', async () => {
    stubFetch(() => Promise.reject('boom'))
    const { result } = renderHook(() => useAcademicRecord())

    await act(() => result.current.load('ana.prueba', 'Secreta123'))

    expect(result.current.error).toBe('Error desconocido')
  })

  it('un JSON inválido en el stream termina como error visible', async () => {
    stubFetch(() => new Response('{"stage":\n'))
    const { result } = renderHook(() => useAcademicRecord())

    await act(() => result.current.load('ana.prueba', 'Secreta123'))

    expect(result.current.status).toBe('error')
    expect(result.current.error).toEqual(expect.any(String))
  })

  it('un intento nuevo borra el error y los datos del anterior', async () => {
    const pending = deferred(recordEvents)
    stubFetch(() => ndjsonResponse(partialError), pending.responder)
    const { result } = renderHook(() => useAcademicRecord())
    await act(() => result.current.load('ana.prueba', 'Secreta123'))
    expect(result.current.status).toBe('error')

    let finished: Promise<void> = Promise.resolve()
    act(() => {
      finished = result.current.load('ana.prueba', 'Secreta123')
    })
    expect(result.current.status).toBe('loading')
    expect(result.current.error).toBeNull()
    expect(result.current.data).toBeNull()

    await act(async () => {
      pending.release()
      await finished
    })
    expect(result.current.data).toEqual(record)
  })

  it('cambiar de versión reusa las credenciales y conserva los datos mientras llega la otra', async () => {
    const pending = deferred(recordEvents)
    const fetchMock = stubFetch(() => ndjsonResponse(recordEvents), pending.responder)
    const { result } = renderHook(() => useAcademicRecord())
    await act(() => result.current.load('ana.prueba', 'Secreta123'))

    let finished: Promise<void> = Promise.resolve()
    act(() => {
      finished = result.current.changeVersion(1)
    })
    expect(result.current.status).toBe('loading')
    expect(result.current.data).toEqual(record)
    expect(bodyOf(fetchMock.mock.calls[1][1])).toEqual({
      username: 'ana.prueba',
      password: 'Secreta123',
      pensum_version: 1,
    })

    await act(async () => {
      pending.release()
      await finished
    })
    expect(result.current.status).toBe('idle')
  })

  it('cambiar de versión sin haber entrado no llama al backend', async () => {
    const fetchMock = stubFetch(() => ndjsonResponse(recordEvents))
    const { result } = renderHook(() => useAcademicRecord())

    await act(() => result.current.changeVersion(1))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.current.status).toBe('idle')
  })

  it('reset vuelve al estado inicial y olvida las credenciales', async () => {
    const fetchMock = stubFetch(() => ndjsonResponse(recordEvents))
    const { result } = renderHook(() => useAcademicRecord())
    await act(() => result.current.load('ana.prueba', 'Secreta123'))

    act(() => result.current.reset())
    expect(result.current.status).toBe('idle')
    expect(result.current.error).toBeNull()
    expect(result.current.data).toBeNull()

    await act(() => result.current.changeVersion(1))
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('reset también limpia un error', async () => {
    stubFetch(() => ndjsonResponse(partialError))
    const { result } = renderHook(() => useAcademicRecord())
    await act(() => result.current.load('ana.prueba', 'Secreta123'))

    act(() => result.current.reset())

    expect(result.current.status).toBe('idle')
    expect(result.current.error).toBeNull()
    expect(result.current.data).toBeNull()
  })
})
