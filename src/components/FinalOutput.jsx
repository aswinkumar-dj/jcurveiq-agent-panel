export default function FinalOutput({ output }) {
  if (!output) return null
  const { summary, citations } = output
  return (
    <div className="mt-4 bg-white border-2 border-emerald-300 rounded-xl px-5 py-4 shadow-sm animate-fadeSlide">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <polyline points="2,5 4,7 8,3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Research Output</p>
      </div>
      <p className="text-sm text-gray-800 leading-relaxed">{summary}</p>
      {citations?.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2 font-medium">Sources</p>
          <div className="flex flex-wrap gap-2">
            {citations.map(c => (
              <span key={c.ref_id} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full">
                {c.title} · p.{c.page}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}