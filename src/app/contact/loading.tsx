import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/Footer";

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Back Button Skeleton */}
          <Skeleton className="h-5 w-32" />

          {/* Title Section Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-12 md:h-14 w-56 md:w-72" />
            <Skeleton className="h-6 w-full max-w-2xl" />
            <Skeleton className="h-6 w-3/4 max-w-xl" />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form Card Skeleton */}
            <div className="bg-card p-6 md:p-8 rounded-[24px]">
              <div className="mb-6">
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>

              <div className="space-y-5">
                {/* Name & Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                </div>

                {/* Phone & Subject row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>

                {/* Submit Button */}
                <Skeleton className="h-12 w-full rounded-full" />
              </div>
            </div>

            {/* Contact Info & Map */}
            <div className="space-y-6">
              {/* Contact Info Cards Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-card p-5 rounded-[20px]">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Card Skeleton */}
              <Skeleton className="h-[300px] md:h-[350px] w-full rounded-[24px]" />

              {/* Quick Request CTA Skeleton */}
              <div className="bg-muted p-6 rounded-[24px]">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
                  <div className="text-center md:text-left flex-1 space-y-2">
                    <Skeleton className="h-5 w-40 mx-auto md:mx-0" />
                    <Skeleton className="h-4 w-56 mx-auto md:mx-0" />
                  </div>
                  <Skeleton className="h-10 w-32 rounded-full" />
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
