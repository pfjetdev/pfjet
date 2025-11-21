import { Skeleton } from '@/components/ui/skeleton'

export default function EmptyLegsLoading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
          {/* Title Skeleton */}
          <div>
            <Skeleton className="h-10 sm:h-12 lg:h-14 w-64 sm:w-80 mb-2" />
            <Skeleton className="h-4 sm:h-5 w-80 sm:w-96" />
          </div>

          {/* Mobile Filters Button */}
          <div className="lg:hidden">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Main Content - Filters + Cards */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Filters Skeleton - Desktop Only */}
            <aside className="hidden lg:block w-80 shrink-0 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-7 w-20" />
              </div>

              {/* Search Section */}
              <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                <Skeleton className="h-5 w-20 mb-4" />

                {/* Input fields */}
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>

              {/* Aircraft Section */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <Skeleton className="h-5 w-20 mb-4" />

                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton key={i} className="h-9 w-24 rounded-full" />
                  ))}
                </div>
              </div>
            </aside>

            {/* Right: Cards Grid Skeleton */}
            <div className="flex-1">
              <Skeleton className="h-4 sm:h-5 w-48 sm:w-64 mb-4" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl overflow-hidden border border-border flex h-[140px] sm:h-[160px]"
                  >
                    {/* Image Skeleton - Left Side */}
                    <div className="relative w-[35%] sm:w-[30%]">
                      <Skeleton className="h-full w-full rounded-none" />
                    </div>

                    {/* Content Skeleton - Right Side */}
                    <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between relative">
                      {/* Arrow Icon - Top Right */}
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <Skeleton className="h-7 w-7 sm:h-9 sm:w-9 rounded-xl" />
                      </div>

                      {/* Top Section */}
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-28 sm:w-32" />
                        <Skeleton className="h-3.5 w-24 sm:w-28" />
                      </div>

                      {/* Middle Section: Route */}
                      <Skeleton className="h-4 sm:h-5 w-32 sm:w-40" />

                      {/* Bottom Section: Price */}
                      <div>
                        <Skeleton className="h-4 sm:h-5 w-24 sm:w-28" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-20 sm:w-24" />
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-md" />
                  ))}
                  <Skeleton className="h-10 w-16 sm:w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
