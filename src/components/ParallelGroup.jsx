import TaskCard from './TaskCard'

export default function ParallelGroup({ groupId, taskIds, tasks }) {
  const groupTasks = taskIds.map(id => tasks[id]).filter(Boolean)
  if (groupTasks.length === 0) return null
  const allDone = groupTasks.every(t => t.status === 'complete' || t.status === 'cancelled')
  const anyFailed = groupTasks.some(t => t.status === 'failed')

  return (
    <div className="mb-3 animate-fadeSlide">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1 text-xs text-blue-500 font-medium">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <line x1="1" y1="9" x2="1" y2="1" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="5" y1="9" x2="5" y2="1" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="9" y1="9" x2="9" y2="1" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="13" y1="9" x2="13" y2="1" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {groupTasks.length} tasks ran in parallel
        </div>
        <div className="flex-1 h-px bg-blue-100" />
        {allDone && !anyFailed && <span className="text-xs text-green-500">group complete</span>}
        {anyFailed && <span className="text-xs text-red-400">group has failures</span>}
      </div>
      <div className={`grid gap-2 ${groupTasks.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : groupTasks.length >= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1'}`}>
        {groupTasks.map(task => <TaskCard key={task.task_id} task={task} compact={true} />)}
      </div>
    </div>
  )
}