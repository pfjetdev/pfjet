export default function Loading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-4 sm:pt-6 px-4 pb-20 lg:pb-12">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
          {/* Title Skeleton */}
          <div className="space-y-2">
            <div className="h-10 sm:h-12 lg:h-14 bg-muted rounded-lg w-2/3 animate-pulse" />
            <div className="h-5 bg-muted rounded-lg w-1/3 animate-pulse" />
          </div>

          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Hero Block Skeleton */}
              <div className="bg-muted rounded-2xl h-[400px] animate-pulse" />

              {/* Flight Info Skeleton */}
              <div className="bg-muted rounded-2xl h-[300px] animate-pulse" />
            </div>

            {/* Right Column - Desktop Only */}
            <div className="hidden lg:block">
              <div className="bg-muted rounded-2xl h-[500px] animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
