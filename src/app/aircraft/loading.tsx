import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/Footer";

export default function AircraftLoading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title Skeleton */}
          <Skeleton className="h-12 md:h-14 w-48 md:w-64" />

          {/* Category Grid Skeleton */}
          <div className="space-y-8">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center p-1.5 rounded-md border border-border bg-card/50"
                >
                  <Skeleton className="w-full h-8 mb-1 rounded-sm" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Image and Description (70%) */}
              <div className="lg:w-[70%] space-y-6">
                {/* Aircraft Image Skeleton */}
                <Skeleton className="w-full h-[200px] md:h-[350px] rounded-xl" />

                {/* Description Skeleton */}
                <div className="space-y-4">
                  <Skeleton className="h-8 md:h-9 w-48 md:w-64" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>

                  {/* Specifications Grid Skeleton */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-card border border-border rounded-lg p-4"
                      >
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Models List (30%) */}
              <div className="lg:w-[30%]">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                  </div>

                  {/* CTA Skeleton */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
