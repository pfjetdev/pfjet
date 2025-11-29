import { Skeleton } from '@/components/ui/skeleton'

export default function EmptyLegDetailLoading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button Skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-4 h-4 sm:w-5 sm:h-5" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Hero Block and Flight Info */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Hero Block Skeleton */}
              <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden">
                {/* Image Section */}
                <div className="relative h-[280px] sm:h-[360px] lg:h-[420px]">
                  <Skeleton className="h-full w-full rounded-none" />
                </div>

                {/* Desktop Bottom Info Bar */}
                <div className="hidden sm:flex bg-card px-4 sm:px-8 py-4 sm:py-6 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-t border-border">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                    {/* Date */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Skeleton className="w-4 h-4 sm:w-5 sm:h-5" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 sm:h-5 w-20" />
                        <Skeleton className="h-3 w-10" />
                      </div>
                    </div>
                    {/* Time */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Skeleton className="w-4 h-4 sm:w-5 sm:h-5" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 sm:h-5 w-16" />
                        <Skeleton className="h-3 w-10" />
                      </div>
                    </div>
                    {/* Passengers */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Skeleton className="w-4 h-4 sm:w-5 sm:h-5" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 sm:h-5 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </div>
                  {/* Price */}
                  <div className="text-right space-y-1">
                    <Skeleton className="h-8 sm:h-9 w-36 ml-auto" />
                    <Skeleton className="h-3 w-16 ml-auto" />
                  </div>
                </div>

                {/* Mobile Bottom Section */}
                <div className="sm:hidden border-t border-border">
                  {/* Date & Time - Two columns */}
                  <div className="grid grid-cols-2 divide-x divide-border">
                    {/* Date */}
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-3 w-10" />
                        </div>
                      </div>
                    </div>
                    {/* Time */}
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-14" />
                          <Skeleton className="h-3 w-10" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Passengers */}
                  <div className="px-4 py-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </div>
                      <Skeleton className="w-7 h-7 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Information Skeleton */}
              <div className="bg-white dark:bg-card rounded-2xl sm:rounded-[24px] overflow-hidden px-4 sm:px-6 py-3">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  {/* Left Side - Flight Information */}
                  <div className="flex flex-col gap-4 sm:gap-6 w-full md:w-[414px] shrink-0">
                    {/* Header - Aircraft Name and Category */}
                    <div className="flex items-center justify-between w-full">
                      <Skeleton className="h-4 sm:h-5 w-32 sm:w-40" />
                      <Skeleton className="h-3 sm:h-4 w-16 sm:w-24" />
                    </div>

                    {/* Flight Route - Large Airport Codes */}
                    <div className="flex gap-6 sm:gap-[48px] items-center py-2 sm:py-3 w-full">
                      {/* From Code */}
                      <div className="flex flex-col space-y-1 sm:space-y-2">
                        <Skeleton className="h-8 sm:h-12 w-16 sm:w-24" />
                        <Skeleton className="h-3 sm:h-4 w-14 sm:w-20" />
                      </div>

                      {/* Plane Icon with lines */}
                      <div className="flex flex-1 gap-2 sm:gap-[12px] items-center justify-center">
                        <Skeleton className="h-[1px] w-3 sm:w-[20px]" />
                        <Skeleton className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
                        <Skeleton className="h-[1px] w-3 sm:w-[20px]" />
                      </div>

                      {/* To Code */}
                      <div className="flex flex-col items-end space-y-1 sm:space-y-2">
                        <Skeleton className="h-8 sm:h-12 w-16 sm:w-24" />
                        <Skeleton className="h-3 sm:h-4 w-14 sm:w-20" />
                      </div>
                    </div>

                    {/* Flight Times and Duration */}
                    <div className="flex items-center justify-between relative w-full">
                      {/* Departure */}
                      <div className="flex flex-col space-y-1">
                        <Skeleton className="h-4 sm:h-5 w-14 sm:w-16" />
                        <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                      </div>

                      {/* Duration - Centered */}
                      <div className="flex flex-col items-center space-y-1">
                        <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                        <Skeleton className="h-3 sm:h-4 w-20 sm:w-28" />
                      </div>

                      {/* Arrival */}
                      <div className="flex flex-col items-end space-y-1">
                        <Skeleton className="h-4 sm:h-5 w-14 sm:w-16" />
                        <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-[1px] bg-border self-stretch" />

                  {/* Right Side - Aircraft Gallery */}
                  <div className="flex flex-1 flex-col gap-2 items-start overflow-hidden py-3 self-stretch">
                    {/* Main Image */}
                    <Skeleton className="w-full aspect-[16/9] rounded-xl" />
                    {/* Thumbnail Row */}
                    <div className="grid grid-cols-4 gap-1.5 w-full h-[50px]">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="w-full h-full rounded-lg" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Form Skeleton - Desktop Only */}
            <div className="hidden lg:block">
              <div className="bg-[#0F142E] dark:bg-card rounded-2xl p-6 sm:p-8 border border-border sticky top-6">
                <div className="space-y-5 sm:space-y-6">
                  {/* Title */}
                  <Skeleton className="h-7 sm:h-8 w-36 sm:w-40 bg-white/10" />

                  {/* Input Fields (Name, Email, Phone) */}
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-3 sm:h-4 w-14 sm:w-16 mb-2 bg-white/10" />
                      <Skeleton className="h-11 sm:h-12 w-full rounded-xl bg-white/10" />
                    </div>
                  ))}

                  {/* Price Display */}
                  <div className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/10">
                    <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mb-2 bg-white/10" />
                    <Skeleton className="h-9 sm:h-10 w-32 sm:w-36 bg-white/10" />
                  </div>

                  {/* Submit Button */}
                  <Skeleton className="h-12 sm:h-14 w-full rounded-full bg-white/10" />

                  {/* Order Conditions */}
                  <div className="border-t border-white/10 pt-5 sm:pt-6">
                    <Skeleton className="h-5 sm:h-6 w-32 sm:w-36 bg-white/10" />
                  </div>

                  {/* Cancellation Policy */}
                  <div className="border-t border-white/10 pt-5 sm:pt-6">
                    <Skeleton className="h-5 sm:h-6 w-36 sm:w-40 bg-white/10" />
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
