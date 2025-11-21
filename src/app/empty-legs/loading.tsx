import { Skeleton } from '@/components/ui/skeleton'

export default function EmptyLegsLoading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title Skeleton */}
          <div>
            <Skeleton className="h-14 w-80 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Main Content - Filters + Cards */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Filters Skeleton */}
            <aside className="w-80 shrink-0 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-7 w-20" />
              </div>

              {/* Search Section */}
              <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                <Skeleton className="h-5 w-20 mb-4" />

                {/* Input fields */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>

              {/* Aircraft Section */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <Skeleton className="h-5 w-20 mb-4" />

                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Skeleton key={i} className="h-9 w-24 rounded-full" />
                  ))}
                </div>
              </div>
            </aside>

            {/* Right: Cards Grid Skeleton */}
            <div className="flex-1">
              <Skeleton className="h-5 w-64 mb-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl overflow-hidden border border-border flex h-[200px]"
                  >
                    {/* Image Skeleton - Left Side */}
                    <div className="relative w-[35%]">
                      <Skeleton className="h-full w-full rounded-none" />
                    </div>

                    {/* Content Skeleton - Right Side */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      {/* Top Section */}
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-28" />
                      </div>

                      {/* Middle Section: Route */}
                      <Skeleton className="h-6 w-40" />

                      {/* Bottom Section */}
                      <div className="flex items-end justify-between">
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-5 w-28" />
                        </div>
                        <Skeleton className="h-9 w-9 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-24" />
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-md" />
                  ))}
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
