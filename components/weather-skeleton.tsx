export function WeatherCardSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent rounded-2xl p-6 sm:p-8 border border-blue-100 dark:border-blue-900/30 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="h-8 w-48 bg-muted rounded-lg"></div>
            <div className="h-4 w-32 bg-muted rounded mt-2"></div>
          </div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>

        {/* Main Weather Skeleton */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-full"></div>
            <div className="text-center sm:text-left">
              <div className="h-16 w-32 bg-muted rounded-lg"></div>
              <div className="h-5 w-24 bg-muted rounded mt-2"></div>
            </div>
          </div>
        </div>

        {/* Weather Details Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-muted rounded"></div>
                <div className="h-4 w-16 bg-muted rounded"></div>
              </div>
              <div className="h-6 w-16 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
