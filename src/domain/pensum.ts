import type { Subject } from '@/types/academic'

export interface SemesterGroups {
  semesters: number[]
  bySemester: Record<number, Subject[]>
  electives: Subject[]
}

export interface PrerequisiteRef {
  code: string
  name: string
}

// Índice inicial válido para una ventana de `visible` elementos sobre `total`.
export function clampStart(startIndex: number, total: number, visible: number): number {
  const max = Math.max(0, total - visible)
  return Math.min(Math.max(0, startIndex), max)
}

// El backend entrega las electivas sin semestre, o con semestre 0 o 99.
export function isElective(subject: Subject): boolean {
  return subject.semester === null || subject.semester === 0 || subject.semester === 99
}

export function groupBySemester(subjects: Subject[]): SemesterGroups {
  const bySemester: Record<number, Subject[]> = {}
  const electives: Subject[] = []

  for (const subject of subjects) {
    if (isElective(subject)) {
      electives.push(subject)
      continue
    }
    const semester = subject.semester ?? 0
    const group = bySemester[semester] ?? []
    group.push(subject)
    bySemester[semester] = group
  }

  const semesters = Object.keys(bySemester).map(Number).sort((a, b) => a - b)
  return { semesters, bySemester, electives }
}

export function indexByCode(subjects: Subject[]): Map<string, Subject> {
  return new Map(subjects.map(subject => [subject.code, subject]))
}

// Si un prerrequisito no está en el pensum, su código hace de nombre.
export function resolvePrerequisites(
  subject: Subject,
  index: Map<string, Subject>,
): PrerequisiteRef[] {
  return subject.prerequisites.map(code => ({ code, name: index.get(code)?.name ?? code }))
}

// Materias disponibles, por semestre y nombre. Las que no tienen semestre van al final.
export function availableSubjects(subjects: Subject[]): Subject[] {
  return subjects
    .filter(subject => subject.status === 'available')
    .sort((a, b) => {
      const semesterA = a.semester ?? 999
      const semesterB = b.semester ?? 999
      if (semesterA !== semesterB) return semesterA - semesterB
      return a.name.localeCompare(b.name)
    })
}
