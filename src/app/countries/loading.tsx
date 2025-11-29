import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/Footer";

export default function CountriesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title Section */}
          <div>
            <Skeleton className="h-12 md:h-14 w-64 md:w-96 mb-2" />
            <Skeleton className="h-5 w-full max-w-[600px]" />
          </div>

          {/* Continent Filter */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-full" />
            ))}
          </div>

          {/* Countries by Letter */}
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-3">
                {/* Letter */}
                <Skeleton className="h-6 w-8" />
                {/* Countries Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
