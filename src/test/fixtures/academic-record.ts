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

const BANK = 'Electivas profesionales'

export const subjects: Subject[] = [
  subject({ code: 'MAT101', name: 'Cálculo I', credits: 4, semester: 1, status: 'passed', nota: 4.2 }),
  subject({ code: 'PRG101', name: 'Programación I', credits: 3, semester: 1, status: 'passed', nota: 3.8 }),
  subject({ code: 'MAT201', name: 'Cálculo II', credits: 4, semester: 2, status: 'in_progress', prerequisites: ['MAT101'] }),
  subject({ code: 'PRG201', name: 'Estructuras de Datos', credits: 3, semester: 2, status: 'available', prerequisites: ['PRG101'] }),
  subject({ code: 'MAT301', name: 'Ecuaciones Diferenciales', credits: 3, semester: 3, status: 'locked', prerequisites: ['MAT201'] }),
  subject({ code: 'PRG301', name: 'Bases de Datos', credits: 3, semester: 3, status: 'available', prerequisites: ['PRG101'] }),
  subject({ code: 'PRG401', name: 'Ingeniería de Software', credits: 3, semester: 4, status: 'locked', prerequisites: ['PRG301'] }),
  subject({ code: 'TRG401', name: 'Trabajo de Grado', credits: 4, semester: 4, status: 'locked', prerequisites: ['PRG301'] }),
  subject({ code: 'ELE001', name: 'Robótica', credits: 3, semester: 0, status: 'available', obligatoria: false, elective_bank: BANK }),
  subject({ code: 'ELE002', name: 'Minería de Datos', credits: 3, semester: 99, status: 'passed', nota: 4.5, obligatoria: false, elective_bank: BANK }),
]

// El catálogo llega primero, sin historia académica.
const catalog: Subject[] = subjects.map(s => ({
  ...s,
  status: 'locked',
  cursada: false,
  cursando: false,
  nota: null,
}))

export const record: AcademicRecord = {
  student_name: 'Ana Prueba',
  program_name: 'Ingeniería de Sistemas',
  program_code: '504',
  pensum_version: 2,
  version_actual: 2,
  enrolled_version: 2,
  versiones: [1, 2],
  total_credits: 30,
  completed_credits: 10,
  progress_credits: 10,
  in_progress_credits: 4,
  graduated: false,
  elective_banks: [
    { name: BANK, credits_required: 3, credits_approved: 3, subject_codes: ['ELE001', 'ELE002'] },
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
      versiones: record.versiones,
      total_credits: record.total_credits,
    },
  },
  { stage: 'pensum', data: { subjects: catalog } },
  { stage: 'pensum', data: { subjects } },
  { stage: 'record', data: record },
]
