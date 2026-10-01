import { describe, expect, it } from 'vitest'
import { initialRecordState, recordReducer, type RecordState } from './academic-record'
import type { StreamEvent } from '@/types/stream'
import type { AcademicRecord, Subject } from '@/types/academic'

const subject = (code: string, status: Subject['status']): Subject => ({
  code,
  name: code,
  credits: 3,
  semester: 1,
  obligatoria: true,
  elective_bank: null,
  prerequisites: [],
  corequisites: [],
  cursada: status === 'passed',
  nota: null,
  cursando: false,
  status,
})

const studentInfo: StreamEvent = {
  stage: 'student_info',
  data: { student_name: 'Ana Prueba', program_name: 'Sistemas', program_code: '504' },
}
const programInfo: StreamEvent = {
  stage: 'program_info',
  data: { pensum_version: 2, version_actual: 2, enrolled_version: 1, versiones: [1, 2], total_credits: 30 },
}
const record: AcademicRecord = {
  student_name: 'Ana Prueba',
  program_name: 'Sistemas',
  program_code: '504',
  pensum_version: 2,
  version_actual: 2,
  enrolled_version: 1,
  versiones: [1, 2],
  total_credits: 30,
  completed_credits: 3,
  progress_credits: 3,
  in_progress_credits: 0,
  graduated: false,
  elective_banks: [],
  subjects: [subject('A', 'passed')],
}

const stage = (state: RecordState, event: StreamEvent) => recordReducer(state, { type: 'stage', event })
const loaded: RecordState = { status: 'idle', error: null, data: record }

describe('recordReducer', () => {
  it('parte sin datos, sin error y en reposo', () => {
    expect(initialRecordState).toEqual({ status: 'idle', error: null, data: null })
  })

  describe('start', () => {
    it('pasa a loading y borra el error y los datos anteriores', () => {
      const previous: RecordState = { status: 'error', error: 'falló', data: record }

      expect(recordReducer(previous, { type: 'start', keepData: false })).toEqual({
        status: 'loading',
        error: null,
        data: null,
      })
    })

    it('conserva los datos cuando se pide, para el cambio de versión', () => {
      expect(recordReducer(loaded, { type: 'start', keepData: true })).toEqual({
        status: 'loading',
        error: null,
        data: record,
      })
    })
  })

  describe('stage', () => {
    const loading: RecordState = { status: 'loading', error: null, data: null }

    it('guarda los datos del estudiante en un expediente que estaba vacío', () => {
      expect(stage(loading, studentInfo)).toEqual({
        status: 'loading',
        error: null,
        data: { student_name: 'Ana Prueba', program_name: 'Sistemas', program_code: '504' },
      })
    })

    it('suma los datos del programa a los que ya había', () => {
      const next = stage(stage(loading, studentInfo), programInfo)

      expect(next.data).toEqual({
        student_name: 'Ana Prueba',
        program_name: 'Sistemas',
        program_code: '504',
        pensum_version: 2,
        version_actual: 2,
        enrolled_version: 1,
        versiones: [1, 2],
        total_credits: 30,
      })
    })

    it('un program_info posterior corrige el total de créditos', () => {
      const first = stage(loading, programInfo)
      const corrected: StreamEvent = { ...programInfo, data: { ...programInfo.data, total_credits: 35 } }

      expect(stage(first, corrected).data?.total_credits).toBe(35)
    })

    it('cada pensum reemplaza las materias mientras no haya expediente', () => {
      const catalog = stage(loading, { stage: 'pensum', data: { subjects: [subject('A', 'locked')] } })
      const curriculum = stage(catalog, {
        stage: 'pensum',
        data: { subjects: [subject('A', 'locked'), subject('B', 'locked')] },
      })

      expect(curriculum.data?.subjects?.map(s => s.code)).toEqual(['A', 'B'])
    })

    it('un pensum que llega después del expediente no cambia nada', () => {
      const state = stage(loading, { stage: 'record', data: record })
      const late = stage(state, { stage: 'pensum', data: { subjects: [subject('A', 'locked')] } })

      expect(late).toBe(state)
    })

    it('el expediente completo reemplaza lo parcial', () => {
      const partial = stage(stage(loading, studentInfo), {
        stage: 'pensum',
        data: { subjects: [subject('A', 'locked')] },
      })

      expect(stage(partial, { stage: 'record', data: record }).data).toEqual(record)
    })

    it('una etapa error deja el estado en error con su detalle y conserva los datos', () => {
      const partial = stage(loading, studentInfo)
      const failed = stage(partial, { stage: 'error', status: 502, detail: 'El portal no respondió' })

      expect(failed).toEqual({ status: 'error', error: 'El portal no respondió', data: partial.data })
    })

    it('una etapa desconocida no cambia los datos, pero abre un expediente vacío si no había', () => {
      const unknown = { stage: 'nueva', data: {} } as unknown as StreamEvent
      const partial = stage(loading, studentInfo)

      expect(stage(partial, unknown)).toBe(partial)
      expect(stage(loading, unknown).data).toEqual({})
    })

    it('no modifica el estado que recibe', () => {
      const before = stage(loading, studentInfo)
      const snapshot = structuredClone(before)

      stage(before, programInfo)

      expect(before).toEqual(snapshot)
    })
  })

  describe('fail', () => {
    it('deja el estado en error con el mensaje y conserva los datos', () => {
      expect(recordReducer(loaded, { type: 'fail', message: 'Failed to fetch' })).toEqual({
        status: 'error',
        error: 'Failed to fetch',
        data: record,
      })
    })
  })

  describe('done', () => {
    it('vuelve a reposo cuando el stream termina bien', () => {
      const loading: RecordState = { status: 'loading', error: null, data: record }

      expect(recordReducer(loading, { type: 'done' })).toEqual(loaded)
    })

    it('no borra un error que llegó durante el stream', () => {
      const failed: RecordState = { status: 'error', error: 'El portal no respondió', data: null }

      expect(recordReducer(failed, { type: 'done' })).toBe(failed)
    })
  })

  describe('reset', () => {
    it('vuelve al estado inicial', () => {
      const failed: RecordState = { status: 'error', error: 'falló', data: record }

      expect(recordReducer(failed, { type: 'reset' })).toEqual(initialRecordState)
    })
  })
})
