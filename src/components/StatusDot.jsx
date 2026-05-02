export default function StatusDot({ status, retried }) {
  if (status === 'running' && retried) return <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
  const map = { running: 'bg-blue-400 animate-pulse', complete: 'bg-green-500', failed: 'bg-red-500', cancelled: 'bg-gray-400' }
  return <span className={`flex-shrink-0 w-2 h-2 rounded-full ${map[status] || 'bg-gray-300'}`} />
}