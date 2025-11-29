import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/Footer";

export default function NewsLoading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Back Button Skeleton */}
          <Skeleton className="h-5 w-32" />

          {/* Title Skeleton */}
          <Skeleton className="h-12 md:h-14 w-64 md:w-80" />

          {/* Category Filter Skeleton */}
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-24 md:w-28 rounded-full" />
            ))}
          </div>

          {/* News Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-[1px]">
                {/* Content section */}
                <div className="bg-card rounded-t-[24px] p-6 flex flex-col justify-between h-64">
                  {/* Category Badge */}
                  <Skeleton className="h-6 w-20 rounded-full" />
                  {/* Title */}
                  <Skeleton className="h-16 w-full" />
                  {/* Meta information */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                {/* Image section */}
                <Skeleton className="h-[242px] w-full rounded-b-[24px]" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
