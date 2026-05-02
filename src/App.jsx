import { useEventStream } from './hooks/useEventStream'
import RunHeader from './components/RunHeader'
import CoordinatorThought from './components/CoordinatorThought'
import TaskCard from './components/TaskCard'
import ParallelGroup from './components/ParallelGroup'
import FinalOutput from './components/FinalOutput'
import IdleState from './components/IdleState'
import ErrorBanner from './components/ErrorBanner'

import successFixture from '../mock/fixtures/run_success.json'
import errorFixture from '../mock/fixtures/run_error.json'

export default function App() {
  const { state, startStream, reset } = useEventStream()
  const { status, query, elapsedMs, tasks, taskOrder, parallelGroups, coordinatorThought, finalOutput, errorMessage } = state

  function handleStart(fixture) {
    const events = fixture === 'success' ? successFixture : errorFixture
    startStream(events)
  }

  const renderedGroups = new Set()
  const renderItems = []

  for (const taskId of taskOrder) {
    const task = tasks[taskId]
    if (!task) continue
    if (task.parallel_group) {
      if (!renderedGroups.has(task.parallel_group)) {
        renderedGroups.add(task.parallel_group)
        renderItems.push({ type: 'parallel', groupId: task.parallel_group })
      }
    } else {
      renderItems.push({ type: 'task', taskId })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">J</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">JcurveIQ</span>
          <span className="text-gray-300 text-sm">·</span>
          <span className="text-xs text-gray-400">Agent Run Panel</span>
        </div>
        <div className="flex items-center gap-2">
          {status !== 'idle' && (
            <>
              <button onClick={() => handleStart('success')} className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">▶ Success</button>
              <button onClick={() => handleStart('error')} className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">▶ Error</button>
              <button onClick={reset} className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors">↺ Reset</button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {status === 'idle' && <IdleState onStart={handleStart} />}

        {status !== 'idle' && (
          <>
            <RunHeader query={query} status={status} elapsedMs={elapsedMs} />
            <CoordinatorThought thought={coordinatorThought} />

            {renderItems.map((item) => {
              if (item.type === 'parallel') {
                return <ParallelGroup key={item.groupId} groupId={item.groupId} taskIds={parallelGroups[item.groupId]} tasks={tasks} />
              }
              return <TaskCard key={item.taskId} task={tasks[item.taskId]} />
            })}

            {status === 'failed' && <ErrorBanner message={errorMessage} />}
            {status === 'complete' && finalOutput && <FinalOutput output={finalOutput} />}
          </>
        )}
      </div>
    </div>
  )
}