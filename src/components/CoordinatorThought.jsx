export default function CoordinatorThought({ thought }) {
  if (!thought) return null
  return (
    <div className="flex gap-2 mb-3 animate-fadeSlide">
      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs">✦</div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex-1">
        <p className="text-xs font-semibold text-amber-700 mb-0.5">coordinator thought</p>
        <p className="text-xs text-amber-800 italic leading-relaxed">{thought}</p>
      </div>
    </div>
  )
}