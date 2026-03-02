'use client';

export function ForecastSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-white/5 rounded-xl p-4 border border-border/50 animate-pulse"
        >
          {/* Date skeleton */}
          <div className="h-4 bg-muted rounded w-16 mx-auto mb-3" />
          
          {/* Icon skeleton */}
          <div className="h-10 w-10 bg-muted rounded-full mx-auto mb-3" />
          
          {/* Description skeleton */}
          <div className="h-3 bg-muted rounded w-20 mx-auto mb-3" />
          
          {/* Temps skeleton */}
          <div className="flex justify-center gap-2 mb-3">
            <div className="h-5 bg-muted rounded w-12" />
            <div className="h-5 bg-muted rounded w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
