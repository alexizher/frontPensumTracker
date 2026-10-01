export function GaugeSkeleton() {
  return (
    <div className="animate-pulse">
      <svg viewBox="0 0 200 140" className="w-full" aria-hidden>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={14}
          strokeLinecap="round"
        />
      </svg>
      <div className="mx-auto -mt-12 h-5 w-16 rounded bg-gray-200" />
    </div>
  )
}
