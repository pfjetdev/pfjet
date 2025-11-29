import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-0">
        {/* Hero Section Skeleton */}
        <section className="w-full px-4">
          <div className="max-w-7xl mx-auto">
            <div className="pb-8 md:h-[600px] md:rounded-3xl md:border md:border-border bg-background/50 backdrop-blur-sm flex flex-col items-center justify-start relative overflow-hidden">
              {/* Background skeleton for desktop */}
              <div className="hidden md:block absolute inset-0 bg-muted animate-pulse" />

              {/* Content */}
              <div className="text-center md:text-center space-y-3 md:space-y-6 px-0 md:px-8 relative z-10 mb-6 md:mb-8 pt-[40px] md:pt-[60px] w-full">
                <div className="text-left md:text-center space-y-1 md:space-y-2">
                  {/* Title skeleton */}
                  <Skeleton className="h-9 md:h-16 lg:h-20 w-3/4 md:w-[500px] md:mx-auto" />
                </div>
                {/* Subtitle skeleton */}
                <Skeleton className="h-5 md:h-6 w-2/3 md:w-[350px] md:mx-auto" />

                {/* Mobile Toggle skeleton */}
                <div className="md:hidden flex justify-start">
                  <Skeleton className="h-10 w-56 rounded-full" />
                </div>
              </div>

              {/* Forms Container */}
              <div className="relative z-10 w-full px-0 md:px-4 space-y-3">
                {/* Desktop Toggle skeleton */}
                <div className="hidden md:flex justify-center">
                  <Skeleton className="h-10 w-56 rounded-full" />
                </div>

                {/* Desktop Search Form skeleton */}
                <div className="hidden md:block w-full max-w-6xl mx-auto">
                  <Skeleton className="h-20 w-full rounded-2xl" />
                </div>

                {/* Mobile Search Form skeleton */}
                <div className="md:hidden w-full max-w-md mx-auto">
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>

                {/* Add Destination Button skeleton */}
                <div className="w-full max-w-6xl mx-auto">
                  <Skeleton className="h-10 w-40 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FlightClassBanner Skeleton */}
        <section className="w-full px-4 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-28 md:h-24 w-full rounded-2xl" />
          </div>
        </section>

        {/* Features Section Skeleton */}
        <section className="py-6 md:py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-border/50 rounded-lg overflow-hidden">
                  <div className="pb-2 md:pb-4 pt-3 md:pt-6 px-3 md:px-6">
                    <Skeleton className="h-10 md:h-12 w-full" />
                  </div>
                  <div className="pb-3 md:pb-6 px-3 md:px-6 pt-0">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Empty Legs Section Skeleton */}
        <section className="py-8 md:py-16 pl-4 pr-0 bg-background">
          <div className="max-w-7xl mx-auto pr-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-8 pr-4">
              <Skeleton className="h-9 md:h-14 w-40 md:w-64" />
              <Skeleton className="h-10 md:h-12 w-24 md:w-32 rounded-lg" />
            </div>
            {/* Carousel items */}
            <div className="flex gap-2 md:gap-3 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[60%] sm:w-[48%] md:w-[33%] lg:w-[25%] pl-2 md:pl-3">
                  <div className="p-1">
                    <Skeleton className="h-56 md:h-72 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section Skeleton */}
        <section className="py-8 md:py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-start lg:items-center">
              {/* Left side */}
              <div className="flex flex-col space-y-4 md:space-y-6">
                <div className="w-full md:w-4/5">
                  <Skeleton className="h-9 md:h-14 w-40 md:w-52 mb-3 md:mb-6" />
                  <Skeleton className="h-16 md:h-20 w-full" />
                </div>
                <Skeleton className="h-10 md:h-12 w-40 rounded-full" />
              </div>
              {/* Right side - Bento Grid */}
              <div className="grid grid-cols-2 gap-2 md:gap-4 h-[280px] md:h-[500px]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Events Section Skeleton */}
        <section className="py-8 md:py-16 pl-4 pr-0 bg-background">
          <div className="max-w-7xl mx-auto pr-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-8 pr-4">
              <div>
                <Skeleton className="h-9 md:h-14 w-44 md:w-72 mb-2 md:mb-4" />
                <Skeleton className="hidden md:block h-5 w-80" />
              </div>
              <Skeleton className="h-10 md:h-12 w-24 md:w-32 rounded-lg" />
            </div>
            {/* Carousel items */}
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5 pl-3">
                  <Skeleton className="h-64 md:h-80 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Routes Section Skeleton */}
        <section className="py-8 md:py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-4 md:mb-12">
              <Skeleton className="h-9 md:h-14 w-40 md:w-64" />
            </div>
            {/* Routes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
              ))}
            </div>
          </div>
        </section>

        {/* Aircraft Section Skeleton */}
        <section className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-4 md:mb-12">
              <Skeleton className="h-9 md:h-14 w-32 md:w-48" />
            </div>
            {/* Content */}
            <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 lg:h-[500px]">
              {/* Left Column - Aircraft Menu */}
              <div className="lg:w-2/5 space-y-1.5 md:space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-[52px] md:h-[58px] w-full rounded-xl" />
                ))}
              </div>
              {/* Right Column - Image */}
              <div className="lg:w-3/5 h-64 md:h-80 lg:h-auto">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Destinations Section Skeleton */}
        <section className="py-8 md:py-16 pl-4 pr-0 bg-background">
          <div className="max-w-7xl mx-auto pr-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-12 pr-4">
              <Skeleton className="h-9 md:h-14 w-32 md:w-48" />
              <Skeleton className="h-10 md:h-12 w-24 md:w-32 rounded-lg" />
            </div>
            {/* Country Flags */}
            <div className="mb-4 md:mb-8">
              {/* Desktop flags */}
              <div className="hidden md:flex flex-wrap gap-3">
                {Array.from({ length: 20 }).map((_, i) => (
                  <Skeleton key={i} className="w-10 h-10 rounded" />
                ))}
              </div>
              {/* Mobile flags - two rows */}
              <div className="md:hidden space-y-3">
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                  <div className="flex gap-3 pb-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="w-12 h-12 rounded flex-shrink-0" />
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                  <div className="flex gap-3 pb-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="w-12 h-12 rounded flex-shrink-0" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Cities Carousel */}
            <div className="flex gap-2 md:gap-3 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[60%] sm:w-[48%] md:w-[33%] lg:w-[25%] pl-2 md:pl-3">
                  <div className="p-1">
                    <Skeleton className="h-48 md:h-64 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest News Section Skeleton */}
        <section className="py-8 md:py-16 pl-4 pr-0 bg-background">
          <div className="max-w-7xl mx-auto pr-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-8 pr-4">
              <Skeleton className="h-9 md:h-14 w-36 md:w-56" />
              <Skeleton className="h-10 md:h-12 w-24 md:w-32 rounded-lg" />
            </div>
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-[1px]">
                  <div className="bg-card rounded-t-[24px] p-6 flex flex-col justify-between h-64">
                    <Skeleton className="h-16 w-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-[242px] w-full rounded-b-[24px]" />
                </div>
              ))}
            </div>
            {/* Mobile carousel */}
            <div className="md:hidden flex gap-2 overflow-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 basis-[70%] pl-2">
                  <div className="p-1">
                    <div className="flex flex-col gap-[1px]">
                      <div className="bg-card rounded-t-[24px] p-4 flex flex-col justify-between h-48">
                        <Skeleton className="h-12 w-full" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-[180px] w-full rounded-b-[24px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Skeleton */}
      <footer className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-20" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
