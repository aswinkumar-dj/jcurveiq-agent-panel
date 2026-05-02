export default function ToolCallRow({ tool, input_summary, result }) {
  return (
    <div className="mt-2 bg-gray-50 border border-gray-100 rounded-md px-3 py-2 animate-fadeSlide">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-mono font-semibold text-blue-600">{tool}</span>
        <span className="text-xs text-gray-400">·</span>
        <span className="text-xs text-gray-500 flex-1">{input_summary}</span>
        {result && <span className="text-xs text-green-600 font-medium">✓</span>}
      </div>
      {result && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{result}</p>}
    </div>
  )
}