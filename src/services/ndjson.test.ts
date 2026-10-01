import { describe, expect, it } from 'vitest'
import { readNdjson } from './ndjson'

const encoder = new TextEncoder()

function streamOf(...chunks: (string | Uint8Array)[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(typeof chunk === 'string' ? encoder.encode(chunk) : chunk)
      }
      controller.close()
    },
  })
}

async function collect<T>(stream: ReadableStream<Uint8Array>): Promise<T[]> {
  const values: T[] = []
  for await (const value of readNdjson<T>(stream)) values.push(value)
  return values
}

describe('readNdjson', () => {
  it('entrega un objeto por línea, en orden', async () => {
    expect(await collect(streamOf('{"a":1}\n{"a":2}\n'))).toEqual([{ a: 1 }, { a: 2 }])
  })

  it('une una línea partida entre dos chunks', async () => {
    expect(await collect(streamOf('{"a":', '1}\n{"a"', ':2}\n'))).toEqual([{ a: 1 }, { a: 2 }])
  })

  it('une un carácter con tilde partido entre dos chunks', async () => {
    const bytes = encoder.encode('{"nombre":"Cálculo"}\n')
    const cut = bytes.indexOf(0xc3) + 1

    expect(await collect(streamOf(bytes.slice(0, cut), bytes.slice(cut)))).toEqual([
      { nombre: 'Cálculo' },
    ])
  })

  it('entrega la última línea aunque no termine en salto', async () => {
    expect(await collect(streamOf('{"a":1}\n{"a":2}'))).toEqual([{ a: 1 }, { a: 2 }])
  })

  it('ignora las líneas vacías o con solo espacios', async () => {
    expect(await collect(streamOf('\n  \n{"a":1}\n\n'))).toEqual([{ a: 1 }])
  })

  it('entrega todas las líneas que llegan juntas en un mismo chunk', async () => {
    expect(await collect(streamOf('{"a":1}\n{"a":2}\n{"a":3}\n'))).toEqual([
      { a: 1 },
      { a: 2 },
      { a: 3 },
    ])
  })

  it('no pierde eventos cuando el cuerpo empieza con una línea vacía', async () => {
    expect(await collect(streamOf('\n{"a":1}\n{"a":2}\n'))).toEqual([{ a: 1 }, { a: 2 }])
  })

  it('ignora los espacios que queden al final sin salto de línea', async () => {
    expect(await collect(streamOf('{"a":1}\n  '))).toEqual([{ a: 1 }])
  })

  it('entrega cada objeto en cuanto su línea está completa, sin esperar al cierre', async () => {
    let controller!: ReadableStreamDefaultController<Uint8Array>
    const stream = new ReadableStream<Uint8Array>({ start: c => void (controller = c) })
    const iterator = readNdjson<{ a: number }>(stream)

    controller.enqueue(encoder.encode('{"a":1}\n{"a"'))
    expect(await iterator.next()).toEqual({ done: false, value: { a: 1 } })

    controller.enqueue(encoder.encode(':2}\n'))
    expect(await iterator.next()).toEqual({ done: false, value: { a: 2 } })

    controller.close()
    expect(await iterator.next()).toEqual({ done: true, value: undefined })
  })

  it('no entrega nada de un stream vacío', async () => {
    expect(await collect(streamOf())).toEqual([])
  })

  it('entrega las líneas válidas y falla al llegar a una que no es JSON', async () => {
    const values: unknown[] = []
    const read = async () => {
      for await (const value of readNdjson(streamOf('{"a":1}\n{"a":\n{"a":3}\n'))) values.push(value)
    }

    await expect(read()).rejects.toThrow(SyntaxError)
    expect(values).toEqual([{ a: 1 }])
  })
})
