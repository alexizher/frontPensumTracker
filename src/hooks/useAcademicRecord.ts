import { useCallback, useReducer, useRef } from 'react'
import { initialRecordState, recordReducer } from '@/domain/academic-record'
import { streamLoginAndFetch } from '@/services/academic-api'

export function useAcademicRecord() {
  const [state, dispatch] = useReducer(recordReducer, initialRecordState)
  // Las credenciales viven solo en memoria, para poder pedir otra versión del pensum.
  const credsRef = useRef<{ username: string; password: string } | null>(null)

  const run = useCallback(
    async (username: string, password: string, pensumVersion: number, keepData: boolean) => {
      credsRef.current = { username, password }
      dispatch({ type: 'start', keepData })

      try {
        await streamLoginAndFetch(username, password, pensumVersion, event => {
          dispatch({ type: 'stage', event })
        })
        dispatch({ type: 'done' })
      } catch (err) {
        dispatch({
          type: 'fail',
          message: err instanceof Error ? err.message : 'Error desconocido',
        })
      }
    },
    [],
  )

  const load = useCallback(
    (username: string, password: string, pensumVersion = 0) =>
      run(username, password, pensumVersion, false),
    [run],
  )

  const changeVersion = useCallback(
    async (version: number) => {
      if (!credsRef.current) return
      await run(credsRef.current.username, credsRef.current.password, version, true)
    },
    [run],
  )

  const reset = useCallback(() => {
    credsRef.current = null
    dispatch({ type: 'reset' })
  }, [])

  return { status: state.status, error: state.error, data: state.data, load, reset, changeVersion }
}
