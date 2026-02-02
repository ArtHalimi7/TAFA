/**
 * Skeleton loader components for loading states
 */

// Base skeleton with shimmer animation
export function Skeleton({ className = "", rounded = "rounded" }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/5 ${rounded} ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

// Text line skeleton
export function SkeletonText({ lines = 1, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"}`}
          rounded="rounded"
        />
      ))}
    </div>
  );
}

// Circular skeleton (for avatars, icons)
export function SkeletonCircle({ size = "w-10 h-10" }) {
  return <Skeleton className={size} rounded="rounded-full" />;
}

// Car card skeleton
export function SkeletonCarCard() {
  return (
    <div className="relative">
      {/* Image area */}
      <div className="relative aspect-4/3 rounded-xl overflow-hidden">
        <Skeleton className="absolute inset-0" rounded="rounded-xl" />

        {/* Top badges */}
        <div className="absolute top-5 left-5 right-5 flex justify-between">
          <Skeleton className="w-24 h-6" rounded="rounded-full" />
          <Skeleton className="w-12 h-6" rounded="rounded-full" />
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-5 left-5 right-5">
          <Skeleton className="w-3/4 h-7 mb-3" rounded="rounded" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="w-28 h-7" rounded="rounded" />
              <Skeleton className="w-20 h-4" rounded="rounded" />
            </div>
            <SkeletonCircle size="w-10 h-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Featured car card skeleton (taller)
export function SkeletonFeaturedCard() {
  return (
    <div className="relative h-96 rounded-lg overflow-hidden">
      <Skeleton className="absolute inset-0" rounded="rounded-lg" />

      {/* Top badge */}
      <div className="absolute top-6 left-6">
        <Skeleton className="w-24 h-6" rounded="rounded-full" />
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-6 left-6 right-6">
        <Skeleton className="w-3/4 h-8 mb-4" rounded="rounded" />
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <Skeleton className="w-28 h-6" rounded="rounded" />
          <SkeletonCircle size="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}

// Hero section skeleton
export function SkeletonHero() {
  return (
    <div className="relative h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <Skeleton className="w-64 h-12 mx-auto" rounded="rounded" />
        <Skeleton className="w-96 h-6 mx-auto" rounded="rounded" />
        <Skeleton className="w-40 h-12 mx-auto" rounded="rounded-full" />
      </div>
    </div>
  );
}

// Car detail gallery skeleton
export function SkeletonGallery() {
  return (
    <div className="space-y-4">
      {/* Main image */}
      <Skeleton className="w-full aspect-video" rounded="rounded-xl" />

      {/* Thumbnails */}
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-20 h-16 shrink-0"
            rounded="rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}

// Stats skeleton
export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="text-center space-y-2">
          <Skeleton className="w-20 h-12 mx-auto" rounded="rounded" />
          <Skeleton className="w-32 h-4 mx-auto" rounded="rounded" />
        </div>
      ))}
    </div>
  );
}

// Filter bar skeleton
export function SkeletonFilters() {
  return (
    <div className="flex items-center justify-between gap-6 pb-6 border-b border-white/10">
      {/* Search */}
      <Skeleton className="w-72 h-10" rounded="rounded-full" />

      {/* Brand filters */}
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCircle key={i} size="w-12 h-12" />
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-4" rounded="rounded" />
        <Skeleton className="w-36 h-10" rounded="rounded-full" />
      </div>
    </div>
  );
}

export default Skeleton;
