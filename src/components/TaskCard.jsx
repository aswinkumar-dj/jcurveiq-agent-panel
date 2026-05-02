import StatusDot from './StatusDot'
import ToolCallRow from './ToolCallRow'

export default function TaskCard({ task, compact = false }) {
  const { label, agent, status, retried, toolCalls, partialOutputs, finalOutput, thought, error, cancelReason, cancelMessage, depends_on } = task
  const isCancelled = status === 'cancelled'
  const isFailed = status === 'failed' && !retried
  const isComplete = status === 'complete'

  return (
    <div className={`bg-white border rounded-lg px-4 py-3 mb-2 animate-fadeSlide transition-all shadow-sm
      ${isCancelled ? 'border-gray-200 opacity-80' : ''}
      ${isFailed ? 'border-red-200' : ''}
      ${isComplete ? 'border-gray-200' : ''}
      ${status === 'running' ? 'border-blue-100' : ''}
    `}>
      <div className="flex items-start gap-2">
        <div className="mt-1"><StatusDot status={status} retried={retried} /></div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug ${isCancelled ? 'text-gray-400' : 'text-gray-800'} ${compact ? 'text-xs' : ''}`}>
            {label}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded font-mono">{agent}</span>
            {depends_on?.length > 0 && <span className="text-xs text-gray-300">after {depends_on.join(', ')}</span>}
            {retried && <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">retried</span>}
          </div>
        </div>
        {finalOutput?.quality_score != null && (
          <span className="text-xs bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full flex-shrink-0">
            {Math.round(finalOutput.quality_score * 100)}%
          </span>
        )}
      </div>

      {thought && (
        <div className="mt-2 bg-amber-50 border border-amber-100 rounded px-2.5 py-1.5 animate-fadeSlide">
          <p className="text-xs text-amber-600 font-semibold mb-0.5">agent thought</p>
          <p className="text-xs text-amber-700 italic leading-relaxed">{thought}</p>
        </div>
      )}

      {!compact && toolCalls.map((tc, i) => <ToolCallRow key={i} {...tc} />)}

      {!compact && partialOutputs.length > 0 && (
        <div className="mt-2 border-l-2 border-blue-200 pl-3 animate-fadeSlide">
          <p className="text-xs text-gray-400 mb-0.5">streaming...</p>
          <p className="text-xs text-gray-500 leading-relaxed italic">{partialOutputs[partialOutputs.length - 1]}</p>
        </div>
      )}

      {finalOutput && (
        <div className="mt-2 border-l-2 border-green-300 pl-3 animate-fadeSlide">
          <p className="text-xs text-gray-600 leading-relaxed">{finalOutput.content}</p>
        </div>
      )}

      {error && (
        <div className="mt-2 bg-red-50 border border-red-100 rounded px-2.5 py-1.5 animate-fadeSlide">
          <p className="text-xs text-red-500 leading-relaxed">{error}</p>
        </div>
      )}

      {isCancelled && (
        <div className="mt-2 flex items-center gap-1.5 animate-fadeSlide">
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full flex items-center gap-1">
            <span>◎</span>
            <span>sufficient data — skipped early</span>
          </span>
          {cancelMessage && <span className="text-xs text-gray-400">{cancelMessage}</span>}
        </div>
      )}
    </div>
  )
}