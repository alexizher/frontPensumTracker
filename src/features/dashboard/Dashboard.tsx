import type { PartialRecord } from '@/hooks/useAcademicRecord'
import { Alert } from '@/components/ui/Alert'
import { Collapsible } from '@/components/ui/Collapsible'
import { AvailableSubjects } from '@/features/pensum/AvailableSubjects'
import { ElectiveBanks } from '@/features/pensum/ElectiveBanks'
import { PensumGrid } from '@/features/pensum/PensumGrid'
import { PensumGridSkeleton, TableSkeleton } from '@/features/pensum/skeletons'
import { CreditsSummary } from './CreditsSummary'
import { DashboardHeader } from './DashboardHeader'
import { GaugeSkeleton } from './skeletons'

interface Props {
  data: PartialRecord
  error: string | null
  onReset: () => void
  onChangeVersion: (version: number) => Promise<void>
}

// El expediente llega por etapas: cada bloque se pinta cuando ya tiene sus datos.
export function Dashboard({ data, error, onReset, onChangeVersion }: Props) {
  const hasSubjects = Array.isArray(data.subjects)
  const isComplete = data.completed_credits !== undefined

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:p-6">
      <DashboardHeader data={data} onReset={onReset} onChangeVersion={onChangeVersion} />

      {error ? (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      ) : null}

      {data.graduated ? (
        <Alert variant="success" className="mb-6">
          Completaste todos los créditos del plan. No tienes materias pendientes para el grado.
        </Alert>
      ) : null}

      <div className="mx-auto mb-8 max-w-xs">
        {isComplete ? (
          <CreditsSummary
            progress={data.progress_credits!}
            inProgress={data.in_progress_credits!}
            total={data.total_credits!}
            completed={data.completed_credits!}
          />
        ) : (
          <GaugeSkeleton />
        )}
      </div>

      <section className="mb-10">
        {hasSubjects ? <PensumGrid subjects={data.subjects!} /> : (
          <>
            <h2 className="mb-4 text-base font-semibold text-foreground">Pensum</h2>
            <PensumGridSkeleton />
          </>
        )}
      </section>

      <Collapsible title="Materias disponibles">
        {isComplete ? <AvailableSubjects subjects={data.subjects!} /> : <TableSkeleton />}
      </Collapsible>

      <Collapsible title="Electivas">
        {isComplete ? (
          <ElectiveBanks banks={data.elective_banks!} subjects={data.subjects!} />
        ) : (
          <TableSkeleton rows={3} />
        )}
      </Collapsible>
    </div>
  )
}
