import type { SubjectStatus } from '@/types/academic'

interface StatusStyle {
  label: string
  // Clases de la tarjeta de la malla.
  card: string
  // Clases de la pastilla en los bancos de electivas.
  badge: string
}

// Etiqueta y colores de cada estado de materia.
export const SUBJECT_STATUS = {
  passed: {
    label: 'Aprobada',
    card: 'bg-green-100 border-green-300 text-green-900',
    badge: 'bg-green-100 text-green-800',
  },
  in_progress: {
    label: 'En curso',
    card: 'bg-blue-100 border-blue-300 text-blue-900',
    badge: 'bg-blue-100 text-blue-800',
  },
  available: {
    label: 'Disponible',
    card: 'bg-amber-100 border-amber-300 text-amber-900',
    badge: 'bg-amber-100 text-amber-800',
  },
  locked: {
    label: 'Bloqueada',
    card: 'bg-gray-100 border-gray-200 text-gray-400',
    badge: 'bg-gray-100 text-gray-500',
  },
  not_needed: {
    label: 'No requerida',
    card: 'bg-gray-50 border-gray-200 text-gray-400 border-dashed',
    badge: 'bg-gray-50 text-gray-400',
  },
} satisfies Record<SubjectStatus, StatusStyle>

// Estados que aparecen en la leyenda de la malla, en orden, con el color de su punto.
// "No requerida" no está: solo aplica a electivas y no tiene punto.
export const STATUS_LEGEND: { status: SubjectStatus; dot: string }[] = [
  { status: 'passed', dot: 'bg-green-400' },
  { status: 'in_progress', dot: 'bg-blue-400' },
  { status: 'available', dot: 'bg-amber-400' },
  { status: 'locked', dot: 'bg-gray-300' },
]
