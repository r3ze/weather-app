/**
 * LoadingSkeleton
 * Pulsing placeholder that mirrors the layout of the main weather content.
 * Shown while API requests are in-flight.
 */
const LoadingSkeleton = () => (
  <div className="space-y-4 animate-fade-in" aria-label="Loading weather data" role="status">
    {/* ── Current weather card skeleton ────────────────────────────────── */}
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8">
      {/* Header row */}
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="h-9 w-44 bg-white/20 rounded-xl animate-pulse" />
          <div className="h-4 w-32 bg-white/10 rounded-lg animate-pulse" />
        </div>
        <div className="h-9 w-14 bg-white/10 rounded-2xl animate-pulse" />
      </div>

      {/* Temp + icon row */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-20 w-40 bg-white/20 rounded-xl animate-pulse" />
          <div className="h-5 w-36 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-4 w-24 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-4 w-28 bg-white/10 rounded-lg animate-pulse" />
        </div>
        <div className="h-28 w-28 rounded-full bg-white/10 animate-pulse shrink-0" />
      </div>
    </div>

    {/* ── Stats grid skeleton ───────────────────────────────────────────── */}
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-5 flex items-center gap-4"
        >
          <div className="h-12 w-12 rounded-xl bg-white/20 animate-pulse shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-16 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-5 w-20 bg-white/20 rounded-lg animate-pulse" />
            <div className="h-3 w-12 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </div>
      ))}
    </div>

    {/* ── Forecast strip skeleton ───────────────────────────────────────── */}
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 md:p-6">
      <div className="h-3 w-28 bg-white/10 rounded-lg animate-pulse mb-4" />
      <div className="flex gap-2 md:gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-white/10 rounded-2xl p-3 md:p-4 flex flex-col items-center gap-2"
          >
            <div className="h-3 w-10 bg-white/20 rounded animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
            <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-10 bg-white/20 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
