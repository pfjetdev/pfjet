export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Title Skeleton */}
          <div className="space-y-3">
            <div className="h-14 bg-muted animate-pulse rounded-lg w-2/3"></div>
            <div className="h-6 bg-muted animate-pulse rounded-lg w-1/4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {/* Aircraft Card Skeleton */}
              <div className="bg-card rounded-[24px] overflow-hidden border border-border">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-0">
                  {/* Image Skeleton */}
                  <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:min-h-[400px] bg-muted animate-pulse"></div>

                  {/* Specs Skeleton */}
                  <div className="lg:col-span-3 flex flex-col justify-center gap-4 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-border/50">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-muted animate-pulse rounded"></div>
                        <div className="h-4 bg-muted animate-pulse rounded flex-1"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Destination Card Skeleton */}
              <div className="bg-card rounded-[24px] overflow-hidden p-8 border border-border">
                <div className="space-y-8">
                  <div className="h-8 bg-muted animate-pulse rounded-lg w-1/4"></div>

                  {/* Route Skeleton */}
                  <div className="flex items-center justify-between gap-8">
                    <div className="space-y-2">
                      <div className="h-12 bg-muted animate-pulse rounded w-24"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
                    </div>
                    <div className="flex-1 h-0.5 bg-muted"></div>
                    <div className="space-y-2">
                      <div className="h-12 bg-muted animate-pulse rounded w-24"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
                    </div>
                  </div>

                  {/* Times Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-8 bg-muted animate-pulse rounded w-24"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                      <div className="h-6 bg-muted animate-pulse rounded w-16"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-muted animate-pulse rounded w-24"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
                    </div>
                  </div>

                  {/* Controls Skeleton */}
                  <div className="h-16 bg-muted animate-pulse rounded-xl"></div>
                </div>
              </div>
            </div>

            {/* Right Column Skeleton - Order Form */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-[24px] p-6 border border-border sticky top-6">
                <div className="space-y-6">
                  <div className="h-8 bg-muted animate-pulse rounded w-3/4"></div>
                  <div className="h-12 bg-muted animate-pulse rounded"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
                    ))}
                  </div>
                  <div className="h-12 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
