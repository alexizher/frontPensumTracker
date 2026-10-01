import { useState, useMemo, useCallback } from 'react'
import type { Subject } from '@/types/academic'
import {
  clampStart,
  groupBySemester,
  indexByCode,
  isPrerequisiteOf,
  resolvePrerequisites,
} from '@/domain/pensum'
import { PrerequisitePanel } from './PrerequisitePanel'
import { SemesterPager } from './SemesterPager'
import { StatusLegend } from './StatusLegend'
import { SubjectCard } from './SubjectCard'
import { useVisibleCols } from './useVisibleCols'

interface Props {
  subjects: Subject[]
}

export function PensumGrid({ subjects }: Props) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const colsVisible = useVisibleCols()

  const { semesters, bySemester, electives } = useMemo(() => groupBySemester(subjects), [subjects])

  const visibleSemesters = useMemo(
    () => semesters.slice(startIndex, startIndex + colsVisible),
    [semesters, startIndex, colsVisible],
  )

  // Ajuste durante el render: React repite el render antes de pintar.
  const clampedStart = clampStart(startIndex, semesters.length, colsVisible)
  if (clampedStart !== startIndex) setStartIndex(clampedStart)

  const subjectsByCode = useMemo(() => indexByCode(subjects), [subjects])

  const selectedSubject = selectedCode ? (subjectsByCode.get(selectedCode) ?? null) : null

  const selectedPrereqs = useMemo(
    () => (selectedSubject ? resolvePrerequisites(selectedSubject, subjectsByCode) : []),
    [selectedSubject, subjectsByCode],
  )

  const handleCardClick = useCallback((code: string) => {
    setSelectedCode(prev => (prev === code ? null : code))
  }, [])

  function renderCard(subject: Subject) {
    return (
      <SubjectCard
        key={subject.code}
        subject={subject}
        isSelected={selectedCode === subject.code}
        isPrereq={isPrerequisiteOf(selectedSubject, subject.code)}
        onClick={handleCardClick}
      />
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">Pensum</h2>
        {semesters.length > colsVisible ? (
          <SemesterPager
            start={startIndex}
            pageSize={colsVisible}
            total={semesters.length}
            onPrevious={() => setStartIndex(i => i - 1)}
            onNext={() => setStartIndex(i => i + 1)}
          />
        ) : null}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <StatusLegend />
        <span className="text-xs text-muted-foreground">
          {selectedSubject
            ? 'Toca de nuevo para deseleccionar'
            : 'Toca una materia para ver prerrequisitos'}
        </span>
      </div>

      {selectedSubject ? (
        <PrerequisitePanel subject={selectedSubject} prerequisites={selectedPrereqs} />
      ) : null}

      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${visibleSemesters.length}, minmax(0, 1fr))` }}>
        {visibleSemesters.map(sem => (
          <div key={sem} className="min-w-0">
            <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sem {sem}
            </div>
            <div className="flex flex-col gap-2">{bySemester[sem].map(renderCard)}</div>
          </div>
        ))}
      </div>

      {electives.length > 0 ? (
        <div className="mt-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Electivas
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {electives.map(renderCard)}
          </div>
        </div>
      ) : null}
    </div>
  )
}
