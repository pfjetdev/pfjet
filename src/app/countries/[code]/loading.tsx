import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/Footer";

export default function CountryDetailLoading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button Skeleton */}
          <Skeleton className="h-5 w-32 mb-6" />

          {/* Hero Section */}
          <div className="relative mb-8">
            {/* Background Image Skeleton */}
            <Skeleton className="w-full h-[300px] md:h-[400px] rounded-2xl" />

            {/* Country Info Overlay */}
            <div className="absolute bottom-6 left-6 space-y-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-48 md:w-64" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>

          {/* Cities Section */}
          <div>
            <Skeleton className="h-8 w-40 mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden">
                  <Skeleton className="h-48 md:h-56 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
