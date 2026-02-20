export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ animationDuration: "1.5s" }}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}

// Page Skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
