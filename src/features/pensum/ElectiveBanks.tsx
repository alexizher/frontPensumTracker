import type { ElectiveBank, Subject } from '@/types/academic'
import { BankItem } from './BankItem'

interface Props {
  banks: ElectiveBank[]
  subjects: Subject[]
}

export function ElectiveBanks({ banks, subjects }: Props) {
  if (banks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No hay bancos de electivas registrados.</p>
    )
  }

  return (
    <div className="space-y-4">
      {banks.map(bank => (
        <BankItem key={bank.name} bank={bank} subjects={subjects} />
      ))}
    </div>
  )
}
