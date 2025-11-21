import { Skeleton } from '@/components/ui/skeleton';

export function JetCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3]">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Name and Category */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-2 border-t border-border">
          <div className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
