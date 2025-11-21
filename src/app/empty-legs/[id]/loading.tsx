import { Skeleton } from '@/components/ui/skeleton'

export default function EmptyLegDetailLoading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Route Title Skeleton */}
          <div>
            <Skeleton className="h-14 w-96 mb-3" />
            <Skeleton className="h-8 w-64 rounded-lg" />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Hero Block and Flight Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Block Skeleton */}
              <div className="bg-card rounded-3xl border border-border overflow-hidden">
                {/* Image Section with Overlayed Cards */}
                <div className="relative h-[420px]">
                  <Skeleton className="h-full w-full rounded-none" />

                  {/* Overlayed Cards Skeleton */}
                  <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3 justify-center">
                    {[1, 2, 3].map((i) => (
                      <Skeleton
                        key={i}
                        className="h-[72px] w-[180px] rounded-2xl bg-white/20 dark:bg-white/10"
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom Info Bar Skeleton */}
                <div className="bg-card px-8 py-6 flex items-center justify-between border-t border-border">
                  <div className="flex items-center gap-8">
                    {/* Date, Time, Passengers */}
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-5 h-5 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Skeleton */}
                  <div className="text-right space-y-1">
                    <Skeleton className="h-9 w-40 ml-auto" />
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </div>
                </div>
              </div>

              {/* Flight Information Skeleton */}
              <div className="bg-white dark:bg-card rounded-[24px] overflow-hidden px-6 py-3">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Side - Flight Information */}
                  <div className="flex flex-col gap-6 w-full md:w-[414px] shrink-0">
                    {/* Header - Aircraft Name and Category */}
                    <div className="flex items-center justify-between w-full">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>

                    {/* Flight Route - Large Airport Codes */}
                    <div className="flex gap-[48px] items-center py-3 w-full">
                      {/* From Code */}
                      <div className="flex flex-col space-y-2">
                        <Skeleton className="h-14 w-28" />
                        <Skeleton className="h-4 w-24" />
                      </div>

                      {/* Plane Icon with lines */}
                      <div className="flex flex-1 gap-[12px] items-center justify-center">
                        <Skeleton className="h-[1px] w-[20px]" />
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-[1px] w-[20px]" />
                      </div>

                      {/* To Code */}
                      <div className="flex flex-col items-end space-y-2">
                        <Skeleton className="h-14 w-28" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>

                    {/* Flight Times and Duration */}
                    <div className="flex items-center justify-between h-[60px] relative w-full">
                      {/* Departure */}
                      <div className="flex flex-col space-y-1">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>

                      {/* Duration - Centered */}
                      <div className="flex flex-col items-center space-y-1">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-4 w-28" />
                      </div>

                      {/* Arrival */}
                      <div className="flex flex-col space-y-1">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-[1px] bg-border self-stretch" />

                  {/* Right Side - Aircraft Image */}
                  <div className="flex flex-1 flex-col gap-[10px] items-start overflow-hidden py-[21px] self-stretch">
                    <Skeleton className="aspect-[317/162] w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Form Skeleton */}
            <div>
              <div className="bg-[#0F142E] dark:bg-card rounded-2xl p-8 border border-border sticky top-6">
                <div className="space-y-6">
                  {/* Title */}
                  <Skeleton className="h-8 w-40" />

                  {/* Input Fields (Name, Email, Phone) */}
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                  ))}

                  {/* Price Display */}
                  <div className="bg-white/5 dark:bg-background rounded-xl p-6 border border-white/10 dark:border-border">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-36" />
                  </div>

                  {/* Submit Button */}
                  <Skeleton className="h-14 w-full rounded-full" />

                  {/* Order Conditions */}
                  <div className="border-t border-white/10 dark:border-border pt-6">
                    <Skeleton className="h-6 w-36" />
                  </div>

                  {/* Cancellation Policy */}
                  <div className="border-t border-white/10 dark:border-border pt-6">
                    <Skeleton className="h-6 w-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
