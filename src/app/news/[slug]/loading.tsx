import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/Footer";

export default function NewsDetailLoading() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button Skeleton */}
          <Skeleton className="h-5 w-32" />

          {/* Category Badge */}
          <Skeleton className="h-7 w-24 rounded-full" />

          {/* Title */}
          <Skeleton className="h-12 md:h-14 w-full" />
          <Skeleton className="h-12 md:h-14 w-3/4" />

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16 ml-auto" />
          </div>

          {/* Separator */}
          <Skeleton className="h-px w-full" />

          {/* Featured Image */}
          <Skeleton className="w-full h-[300px] md:h-[500px] rounded-xl" />

          {/* Content */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>

          {/* Separator */}
          <Skeleton className="h-px w-full my-8" />

          {/* Related News */}
          <div className="space-y-6">
            <Skeleton className="h-9 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
