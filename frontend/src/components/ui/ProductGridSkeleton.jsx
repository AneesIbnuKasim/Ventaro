import { memo } from "react";

const ProductsGridSkeleton = memo(({length= 12}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-gray-200 bg-white p-3 space-y-3"
        >
          {/* Image */}
          <div className="h-40 w-full rounded-lg bg-gray-200" />

          {/* Title */}
          <div className="h-4 w-3/4 rounded bg-gray-200" />

          {/* Price */}
          <div className="h-4 w-1/2 rounded bg-gray-200" />

          {/* Button */}
          <div className="h-9 w-full rounded-lg bg-gray-200" />
        </div>
      ))}
    </div>
  );
});

export default ProductsGridSkeleton;