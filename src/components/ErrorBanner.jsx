export default function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-5 py-4 animate-fadeSlide">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">!</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-red-700 mb-1">Run terminated</p>
          <p className="text-xs text-red-500 leading-relaxed">{message}</p>
          <p className="text-xs text-red-400 mt-1">Partial results above may still be useful.</p>
        </div>
      </div>
    </div>
  )
}