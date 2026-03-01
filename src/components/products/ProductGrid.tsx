import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { PackageSearch } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white/5 rounded-2xl overflow-hidden">
      {/* Image area */}
      <div className="animate-pulse bg-white/10 w-full h-48" />
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="animate-pulse bg-white/10 rounded h-4 w-3/4" />
        <div className="animate-pulse bg-white/10 rounded h-3 w-full" />
        <div className="animate-pulse bg-white/10 rounded h-3 w-5/6" />
        {/* Price */}
        <div className="animate-pulse bg-white/10 rounded h-5 w-1/3" />
        {/* Button */}
        <div className="animate-pulse bg-white/10 rounded-lg h-9 w-full" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <PackageSearch className="w-12 h-12 text-warm-white-muted/30 mb-4" />
        <p className="text-warm-white-muted">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
