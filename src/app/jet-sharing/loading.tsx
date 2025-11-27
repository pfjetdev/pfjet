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

          {/* Content Grid Skeleton */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Skeleton - Desktop Only */}
            <div className="hidden lg:block w-80 shrink-0 space-y-6">
              {/* Header skeleton */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-muted rounded animate-pulse" />
                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
              </div>
              {/* Search section skeleton */}
              <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-12 bg-muted rounded-xl animate-pulse" />
                <div className="h-12 bg-muted rounded-xl animate-pulse" />
                <div className="h-12 bg-muted rounded-xl animate-pulse" />
                <div className="h-12 bg-muted rounded-xl animate-pulse" />
                {/* Price range skeleton */}
                <div className="space-y-3 pt-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-muted rounded-lg animate-pulse" />
                    <div className="flex-1 h-10 bg-muted rounded-lg animate-pulse" />
                  </div>
                  <div className="h-2 bg-muted rounded-full animate-pulse" />
                </div>
              </div>
              {/* Aircraft section skeleton */}
              <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-10 w-24 bg-muted rounded-full animate-pulse" />
                  ))}
                </div>
              </div>
            </div>

            {/* Cards Grid Skeleton */}
            <div className="flex-1">
              {/* Results count skeleton */}
              <div className="mb-4">
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border/50 rounded-xl overflow-hidden">
                    {/* Image skeleton - aspect-[16/9] on mobile, aspect-square on desktop */}
                    <div className="aspect-[16/9] md:aspect-square bg-muted animate-pulse" />
                    {/* Price footer skeleton */}
                    <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-2.5">
                      <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                      <div className="w-7 h-7 sm:w-9 sm:h-9 bg-muted rounded-xl animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Button Skeleton */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <div className="h-14 w-32 bg-muted rounded-full animate-pulse" />
      </div>

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
