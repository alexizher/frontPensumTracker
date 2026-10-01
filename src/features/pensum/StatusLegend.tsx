import { cn } from '@/lib/utils'
import { STATUS_LEGEND, SUBJECT_STATUS } from './subject-status'

export function StatusLegend() {
  return STATUS_LEGEND.map(item => (
    <span key={item.status} className="flex items-center gap-1 text-xs text-gray-600">
      <span className={cn('inline-block w-3 h-3 rounded-sm', item.dot)} />
      {SUBJECT_STATUS[item.status].label}
    </span>
  ))
}
