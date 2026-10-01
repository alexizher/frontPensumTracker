// Lee un cuerpo NDJSON (un objeto JSON por línea) y entrega cada objeto en cuanto
// su línea está completa. Una línea que no es JSON válido lanza SyntaxError.
export async function* readNdjson<T>(body: ReadableStream<Uint8Array>): AsyncGenerator<T> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    // stream: true conserva los bytes de un carácter partido entre dos chunks.
    buffer += decoder.decode(value, { stream: true })

    let newlineIndex: number
    while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newlineIndex).trim()
      buffer = buffer.slice(newlineIndex + 1)
      if (line) yield JSON.parse(line) as T
    }
  }

  const tail = buffer.trim()
  if (tail) yield JSON.parse(tail) as T
}
