import type { AcademicRecord, Subject } from '@/types/academic'
import type { StreamEvent } from '@/services/api'

type SubjectSeed = Pick<Subject, 'code' | 'name' | 'credits' | 'semester' | 'status'> &
  Partial<Subject>

function subject(seed: SubjectSeed): Subject {
  return {
    obligatoria: true,
    elective_bank: null,
    prerequisites: [],
    corequisites: [],
    cursada: seed.status === 'passed',
    nota: null,
    cursando: seed.status === 'in_progress',
    ...seed,
  }
}

const BANK_PRO = 'Electivas profesionales'
const BANK_COMP = 'Formación complementaria'

// Estados calculados como lo hace el backend: un prerrequisito en curso
// desbloquea, y una electiva de un banco ya cumplido queda "not_needed".
export const subjects: Subject[] = [
  subject({ code: 'MAT101', name: 'Cálculo I', credits: 4, semester: 1, status: 'passed', nota: 4.2 }),
  subject({ code: 'PRG101', name: 'Programación I', credits: 3, semester: 1, status: 'passed', nota: 3.8 }),
  subject({ code: 'MAT201', name: 'Cálculo II', credits: 4, semester: 2, status: 'in_progress', prerequisites: ['MAT101'] }),
  subject({ code: 'PRG201', name: 'Estructuras de Datos', credits: 3, semester: 2, status: 'available', prerequisites: ['PRG101'] }),
  subject({ code: 'MAT301', name: 'Ecuaciones Diferenciales', credits: 3, semester: 3, status: 'available', prerequisites: ['MAT201'] }),
  subject({ code: 'PRG301', name: 'Bases de Datos', credits: 3, semester: 3, status: 'available', prerequisites: ['PRG101'] }),
  subject({ code: 'PRG401', name: 'Ingeniería de Software', credits: 3, semester: 4, status: 'locked', prerequisites: ['PRG301'] }),
  subject({ code: 'TRG401', name: 'Trabajo de Grado', credits: 4, semester: 4, status: 'locked', prerequisites: ['PRG301'] }),
  subject({ code: 'ELE001', name: 'Robótica', credits: 3, semester: 0, status: 'available', obligatoria: false, elective_bank: BANK_PRO }),
  subject({ code: 'ELE002', name: 'Minería de Datos', credits: 3, semester: 99, status: 'passed', nota: 4.5, obligatoria: false, elective_bank: BANK_PRO }),
  subject({ code: 'ELE003', name: 'Fotografía', credits: 2, semester: null, status: 'passed', nota: 4.0, obligatoria: false, elective_bank: BANK_COMP }),
  subject({ code: 'ELE004', name: 'Ajedrez', credits: 2, semester: null, status: 'not_needed', obligatoria: false, elective_bank: BANK_COMP }),
]

// El catálogo llega primero, sin historia académica.
const catalog: Subject[] = subjects.map(s => ({
  ...s,
  status: 'locked',
  cursada: false,
  cursando: false,
  nota: null,
}))

// Luego llega la historia académica, todavía sin estados calculados.
const curriculum: Subject[] = subjects.map(s => ({ ...s, status: 'locked' }))

// 27 créditos obligatorios + 6 y 2 de los bancos de electivas.
export const record: AcademicRecord = {
  student_name: 'Ana Prueba',
  program_name: 'Ingeniería de Sistemas',
  program_code: '504',
  pensum_version: 2,
  version_actual: 2,
  enrolled_version: 2,
  versiones: [1, 2],
  total_credits: 35,
  completed_credits: 12,
  progress_credits: 12,
  in_progress_credits: 4,
  graduated: false,
  elective_banks: [
    { name: BANK_PRO, credits_required: 6, credits_approved: 3, subject_codes: ['ELE001', 'ELE002'] },
    { name: BANK_COMP, credits_required: 2, credits_approved: 2, subject_codes: ['ELE003', 'ELE004'] },
  ],
  subjects,
}

export const recordEvents: StreamEvent[] = [
  {
    stage: 'student_info',
    data: {
      student_name: record.student_name,
      program_name: record.program_name,
      program_code: record.program_code,
    },
  },
  {
    stage: 'program_info',
    data: {
      pensum_version: record.pensum_version,
      version_actual: record.version_actual,
      enrolled_version: record.enrolled_version,
      versiones: record.versiones,
      total_credits: record.total_credits,
    },
  },
  { stage: 'pensum', data: { subjects: catalog } },
  { stage: 'pensum', data: { subjects: curriculum } },
  { stage: 'record', data: record },
]
