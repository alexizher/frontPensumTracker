import { describe, expect, it } from 'vitest'
import type { Subject } from '@/types/academic'
import {
  availableSubjects,
  clampStart,
  groupBySemester,
  indexByCode,
  isElective,
  resolvePrerequisites,
} from './pensum'

function subject(code: string, semester: number | null, extra: Partial<Subject> = {}): Subject {
  return {
    code,
    name: code,
    credits: 3,
    semester,
    obligatoria: true,
    elective_bank: null,
    prerequisites: [],
    corequisites: [],
    cursada: false,
    nota: null,
    cursando: false,
    status: 'locked',
    ...extra,
  }
}

const codes = (subjects: Subject[]) => subjects.map(s => s.code)

describe('clampStart', () => {
  it('deja el índice igual si la ventana cabe', () => {
    expect(clampStart(0, 4, 2)).toBe(0)
    expect(clampStart(2, 4, 2)).toBe(2)
  })

  it('recorta el índice para que la ventana no se salga por el final', () => {
    expect(clampStart(3, 4, 2)).toBe(2)
    expect(clampStart(2, 4, 3)).toBe(1)
  })

  it('devuelve 0 cuando todo cabe en la ventana', () => {
    expect(clampStart(2, 4, 6)).toBe(0)
    expect(clampStart(2, 4, 4)).toBe(0)
  })

  it('devuelve 0 cuando no hay elementos', () => {
    expect(clampStart(0, 0, 2)).toBe(0)
    expect(clampStart(3, 0, 2)).toBe(0)
  })

  it('no devuelve índices negativos', () => {
    expect(clampStart(-1, 4, 2)).toBe(0)
  })
})

describe('isElective', () => {
  it('trata como electiva la materia sin semestre o con semestre 0 o 99', () => {
    expect(isElective(subject('A', null))).toBe(true)
    expect(isElective(subject('B', 0))).toBe(true)
    expect(isElective(subject('C', 99))).toBe(true)
  })

  it('no trata como electiva una materia con semestre real', () => {
    expect(isElective(subject('A', 1))).toBe(false)
    expect(isElective(subject('B', 10))).toBe(false)
  })
})

describe('groupBySemester', () => {
  it('separa las materias por semestre y aparta las electivas', () => {
    const groups = groupBySemester([
      subject('A', 1),
      subject('B', 2),
      subject('C', 1),
      subject('E0', 0),
      subject('E99', 99),
      subject('EN', null),
    ])

    expect(groups.semesters).toEqual([1, 2])
    expect(codes(groups.bySemester[1])).toEqual(['A', 'C'])
    expect(codes(groups.bySemester[2])).toEqual(['B'])
    expect(codes(groups.electives)).toEqual(['E0', 'E99', 'EN'])
  })

  it('ordena los semestres como números', () => {
    const groups = groupBySemester([subject('A', 10), subject('B', 2), subject('C', 1)])

    expect(groups.semesters).toEqual([1, 2, 10])
  })

  it('devuelve grupos vacíos cuando no hay materias', () => {
    expect(groupBySemester([])).toEqual({ semesters: [], bySemester: {}, electives: [] })
  })

  it('no crea semestres cuando solo hay electivas', () => {
    const groups = groupBySemester([subject('E0', 0), subject('EN', null)])

    expect(groups.semesters).toEqual([])
    expect(codes(groups.electives)).toEqual(['E0', 'EN'])
  })
})

describe('indexByCode', () => {
  it('permite buscar una materia por su código', () => {
    const a = subject('A', 1)
    const b = subject('B', 2)
    const index = indexByCode([a, b])

    expect(index.size).toBe(2)
    expect(index.get('B')).toBe(b)
    expect(index.get('Z')).toBeUndefined()
  })

  it('se queda con la última materia si el código se repite', () => {
    const first = subject('A', 1, { name: 'primera' })
    const last = subject('A', 2, { name: 'última' })

    expect(indexByCode([first, last]).get('A')).toBe(last)
  })
})

describe('resolvePrerequisites', () => {
  const index = indexByCode([
    subject('MAT101', 1, { name: 'Cálculo I' }),
    subject('PRG101', 1, { name: 'Programación I' }),
  ])

  it('devuelve código y nombre de cada prerrequisito, en el orden declarado', () => {
    const target = subject('X', 2, { prerequisites: ['PRG101', 'MAT101'] })

    expect(resolvePrerequisites(target, index)).toEqual([
      { code: 'PRG101', name: 'Programación I' },
      { code: 'MAT101', name: 'Cálculo I' },
    ])
  })

  it('usa el código como nombre si el prerrequisito no está en el pensum', () => {
    const target = subject('X', 2, { prerequisites: ['FIS999'] })

    expect(resolvePrerequisites(target, index)).toEqual([{ code: 'FIS999', name: 'FIS999' }])
  })

  it('devuelve una lista vacía si no hay prerrequisitos', () => {
    expect(resolvePrerequisites(subject('X', 2), index)).toEqual([])
  })
})

describe('availableSubjects', () => {
  it('deja solo las materias disponibles', () => {
    const result = availableSubjects([
      subject('A', 1, { status: 'passed' }),
      subject('B', 1, { status: 'available' }),
      subject('C', 1, { status: 'in_progress' }),
      subject('D', 1, { status: 'locked' }),
      subject('E', 1, { status: 'not_needed' }),
    ])

    expect(codes(result)).toEqual(['B'])
  })

  it('ordena por semestre y, dentro del semestre, por nombre', () => {
    const result = availableSubjects([
      subject('C', 3, { status: 'available', name: 'Ecuaciones' }),
      subject('B', 3, { status: 'available', name: 'Bases de Datos' }),
      subject('D', 3, { status: 'available', name: 'Álgebra' }),
      subject('A', 2, { status: 'available', name: 'Zoología' }),
    ])

    expect(codes(result)).toEqual(['A', 'D', 'B', 'C'])
  })

  it('pone al final las materias sin semestre', () => {
    const result = availableSubjects([
      subject('N', null, { status: 'available' }),
      subject('Z', 99, { status: 'available' }),
      subject('A', 10, { status: 'available' }),
      subject('E', 0, { status: 'available' }),
    ])

    expect(codes(result)).toEqual(['E', 'A', 'Z', 'N'])
  })

  it('no reordena el arreglo que recibe', () => {
    const input = [
      subject('B', 2, { status: 'available' }),
      subject('A', 1, { status: 'available' }),
    ]

    availableSubjects(input)

    expect(codes(input)).toEqual(['B', 'A'])
  })
})
