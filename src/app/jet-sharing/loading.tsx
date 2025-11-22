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
            <div className="hidden lg:block w-80 shrink-0">
              <div className="bg-muted rounded-2xl h-[600px] animate-pulse" />
            </div>

            {/* Cards Grid Skeleton */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-muted rounded-2xl h-[320px] animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
