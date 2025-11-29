import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Footer from "@/components/Footer";

export default function AircraftModelLoading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button Skeleton */}
          <Skeleton className="h-10 w-32 rounded-md" />

          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 md:h-12 w-64 md:w-80" />
          </div>

          {/* Main Content Skeleton */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - 70% */}
            <div className="lg:w-[70%] space-y-6">
              {/* Gallery Skeleton */}
              <Card>
                <CardContent className="px-4 py-0">
                  {/* Mobile Layout */}
                  <div className="flex flex-col gap-2 md:hidden">
                    {/* Main large image */}
                    <Skeleton className="aspect-[16/9] rounded-xl" />
                    {/* Small images row */}
                    <div className="grid grid-cols-4 gap-2 h-[60px]">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="rounded-lg h-full" />
                      ))}
                    </div>
                  </div>

                  {/* Desktop Layout - 2 top + 3 bottom */}
                  <div className="hidden md:flex flex-col gap-2">
                    {/* Top row - 2 images */}
                    <div className="grid grid-cols-2 gap-2 h-[280px]">
                      <Skeleton className="rounded-lg" />
                      <Skeleton className="rounded-lg" />
                    </div>
                    {/* Bottom row - 3 images */}
                    <div className="grid grid-cols-3 gap-2 h-[180px]">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="rounded-lg" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specifications Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                        <Skeleton className="w-5 h-5 rounded" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Description & Features Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div>
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Skeleton className="w-4 h-4 rounded-full flex-shrink-0" />
                          <Skeleton className="h-4 flex-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - 30% */}
            <div className="lg:w-[30%]">
              <Card className="sticky top-6">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <Skeleton className="h-4 w-40 mt-2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
                  <div className="pt-4 border-t border-border">
                    <Skeleton className="h-11 w-full rounded-md" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
