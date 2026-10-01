interface Props {
  // Entre 0 y 100.
  percent: number
}

export function ProgressBar({ percent }: Props) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-green-500 transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
