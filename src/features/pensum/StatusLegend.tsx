import { memo } from 'react'
import { cn } from '@/lib/utils'
import { STATUS_LEGEND, SUBJECT_STATUS } from './subject-status'

// Sin props: con memo se pinta una sola vez, aunque la malla se repinte.
export const StatusLegend = memo(function StatusLegend() {
  return STATUS_LEGEND.map(item => (
    <span key={item.status} className="flex items-center gap-1 text-xs text-gray-600">
      <span className={cn('inline-block w-3 h-3 rounded-sm', item.dot)} />
      {SUBJECT_STATUS[item.status].label}
    </span>
  ))
})
