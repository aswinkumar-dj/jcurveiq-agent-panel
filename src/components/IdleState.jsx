export default function IdleState({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-2xl text-gray-300">◎</div>
      <p className="text-sm font-medium text-gray-600 mb-1">No active run</p>
      <p className="text-xs text-gray-400 mb-6 max-w-xs">Select a fixture below and watch the agent pipeline unfold in real time.</p>
      <div className="flex gap-3">
        <button onClick={() => onStart('success')} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          ▶ Run success fixture
        </button>
        <button onClick={() => onStart('error')} className="text-sm px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          ▶ Run error fixture
        </button>
      </div>
    </div>
  )
}