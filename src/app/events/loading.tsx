export default function Loading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
          {/* Title Skeleton */}
          <div className="space-y-2">
            <div className="h-10 sm:h-12 lg:h-14 bg-muted rounded-lg w-1/3 animate-pulse" />
            <div className="h-5 bg-muted rounded-lg w-2/3 animate-pulse" />
          </div>

          {/* Category Filters Skeleton */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-24 bg-muted rounded-full animate-pulse shrink-0" />
            ))}
          </div>

          {/* Results Count Skeleton */}
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />

          {/* Events Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-lg">
                {/* Image skeleton */}
                <div className="h-[200px] md:h-[280px] bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 w-32 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
