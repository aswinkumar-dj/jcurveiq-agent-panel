export default function RunHeader({ query, status, elapsedMs }) {
  const formatted = (elapsedMs / 1000).toFixed(1) + 's'
  const badge = {
    running: { label: 'running', cls: 'bg-blue-50 text-blue-700 border border-blue-200' },
    complete: { label: 'complete', cls: 'bg-green-50 text-green-700 border border-green-200' },
    failed: { label: 'failed', cls: 'bg-red-50 text-red-700 border border-red-200' },
  }[status]
  if (!query) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 mb-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-800 mb-2 leading-snug">{query}</p>
      <div className="flex items-center gap-3 flex-wrap">
        {badge && (
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${badge.cls}`}>
            {badge.label === 'running' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-1.5 mb-px" />}
            {badge.label}
          </span>
        )}
        {status === 'running' && <span className="text-xs text-gray-400 tabular-nums">{formatted}</span>}
        {status === 'complete' && <span className="text-xs text-gray-400">completed in {formatted}</span>}
        {status === 'failed' && <span className="text-xs text-gray-400">run terminated</span>}
      </div>
    </div>
  )
}