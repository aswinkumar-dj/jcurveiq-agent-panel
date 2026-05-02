import { useReducer, useRef, useCallback } from 'react'

const initialState = {
  status: 'idle',
  runId: null,
  query: null,
  elapsedMs: 0,
  tasks: {},
  taskOrder: [],
  parallelGroups: {},
  coordinatorThought: null,
  finalOutput: null,
  errorMessage: null,
}

function reducer(state, action) {
  switch (action.type) {

    case 'RUN_STARTED':
      return {
        ...initialState,
        status: 'running',
        runId: action.run_id,
        query: action.query,
      }

    case 'AGENT_THOUGHT': {
      const { task_id, thought } = action
      if (task_id === 'coordinator' || task_id === null) {
        return { ...state, coordinatorThought: thought }
      }
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task_id]: { ...state.tasks[task_id], thought }
        }
      }
    }

    case 'TASK_SPAWNED': {
      const { task_id, label, agent, parallel_group, depends_on } = action
      const newTask = {
        task_id, label, agent, parallel_group, depends_on,
        status: 'running',
        toolCalls: [],
        partialOutputs: [],
        finalOutput: null,
        thought: null,
        error: null,
        retried: false,
        cancelReason: null,
        cancelMessage: null,
      }
      const newGroups = { ...state.parallelGroups }
      if (parallel_group) {
        newGroups[parallel_group] = [...(newGroups[parallel_group] || []), task_id]
      }
      const alreadyIn = state.taskOrder.includes(task_id)
      return {
        ...state,
        tasks: { ...state.tasks, [task_id]: newTask },
        taskOrder: alreadyIn ? state.taskOrder : [...state.taskOrder, task_id],
        parallelGroups: newGroups,
      }
    }

    case 'TOOL_CALL': {
      const { task_id, tool, input_summary } = action
      const task = state.tasks[task_id]
      if (!task) return state
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task_id]: {
            ...task,
            toolCalls: [...task.toolCalls, { tool, input_summary, result: null }]
          }
        }
      }
    }

    case 'TOOL_RESULT': {
      const { task_id, tool, output_summary } = action
      const task = state.tasks[task_id]
      if (!task) return state
      const updatedCalls = [...task.toolCalls]
      const idx = [...updatedCalls].reverse().findIndex(c => c.tool === tool)
      if (idx !== -1) {
        const realIdx = updatedCalls.length - 1 - idx
        updatedCalls[realIdx] = { ...updatedCalls[realIdx], result: output_summary }
      }
      return {
        ...state,
        tasks: { ...state.tasks, [task_id]: { ...task, toolCalls: updatedCalls } }
      }
    }

    case 'PARTIAL_OUTPUT': {
      const { task_id, content, is_final, quality_score } = action
      const task = state.tasks[task_id]
      if (!task) return state
      if (is_final) {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [task_id]: { ...task, finalOutput: { content, quality_score }, partialOutputs: [] }
          }
        }
      }
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task_id]: { ...task, partialOutputs: [...task.partialOutputs, content] }
        }
      }
    }

    case 'TASK_UPDATE': {
      const { task_id, status, error, reason, message } = action
      const task = state.tasks[task_id]
      if (!task) return state
      const wasFailedBefore = task.status === 'failed'
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task_id]: {
            ...task,
            status,
            error: error || null,
            retried: wasFailedBefore && status === 'running' ? true : task.retried,
            cancelReason: reason || null,
            cancelMessage: message || null,
          }
        }
      }
    }

    case 'RUN_COMPLETE':
      return { ...state, status: 'complete', finalOutput: action.output, elapsedMs: action.duration_ms }

    case 'RUN_ERROR':
      return { ...state, status: 'failed', errorMessage: action.message }

    case 'TICK':
      return { ...state, elapsedMs: state.elapsedMs + 100 }

    case 'RESET':
      return { ...initialState }

    default:
      return state
  }
}

export function useEventStream() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const timersRef = useRef([])
  const tickRef = useRef(null)

  const clearAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    if (tickRef.current) clearInterval(tickRef.current)
    tickRef.current = null
  }, [])

  const reset = useCallback(() => {
    clearAll()
    dispatch({ type: 'RESET' })
  }, [clearAll])

  const startStream = useCallback((events) => {
    clearAll()
    dispatch({ type: 'RESET' })
    let accumulated = 0

    events.forEach((event) => {
      accumulated += (event.delay || 0)
      const delay = accumulated

      const t = setTimeout(() => {
        switch (event.type) {
          case 'run_started':
            dispatch({ type: 'RUN_STARTED', run_id: event.run_id, query: event.query })
            tickRef.current = setInterval(() => dispatch({ type: 'TICK' }), 100)
            break
          case 'agent_thought':
            dispatch({ type: 'AGENT_THOUGHT', task_id: event.task_id, thought: event.thought })
            break
          case 'task_spawned':
            dispatch({ type: 'TASK_SPAWNED', task_id: event.task_id, label: event.label, agent: event.agent, parallel_group: event.parallel_group, depends_on: event.depends_on })
            break
          case 'tool_call':
            dispatch({ type: 'TOOL_CALL', task_id: event.task_id, tool: event.tool, input_summary: event.input_summary })
            break
          case 'tool_result':
            dispatch({ type: 'TOOL_RESULT', task_id: event.task_id, tool: event.tool, output_summary: event.output_summary })
            break
          case 'partial_output':
            dispatch({ type: 'PARTIAL_OUTPUT', task_id: event.task_id, content: event.content, is_final: event.is_final, quality_score: event.quality_score })
            break
          case 'task_update':
            dispatch({ type: 'TASK_UPDATE', task_id: event.task_id, status: event.status, error: event.error, reason: event.reason, message: event.message })
            break
          case 'run_complete':
            clearInterval(tickRef.current)
            dispatch({ type: 'RUN_COMPLETE', output: event.output, duration_ms: event.duration_ms })
            break
          case 'run_error':
            clearInterval(tickRef.current)
            dispatch({ type: 'RUN_ERROR', message: event.message })
            break
          default:
            break
        }
      }, delay)

      timersRef.current.push(t)
    })
  }, [clearAll])

  return { state, startStream, reset }
}