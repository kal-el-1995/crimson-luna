"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Product } from "@/types";
import CategoryFilter from "@/components/products/CategoryFilter";
import ProductGrid from "@/components/products/ProductGrid";
import Pagination from "@/components/products/Pagination";
import { ShoppingBag } from "lucide-react";

interface ProductsPageClientProps {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  currentSearch: string;
  currentSort: string;
}

export default function ProductsPageClient({
  products,
  total,
  page,
  totalPages,
  currentSearch,
  currentSort,
}: ProductsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value && value !== "default") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      // Reset to page 1 when search/sort changes
      if ("search" in updates || "sort" in updates) {
        params.delete("page");
      }
      startTransition(() => {
        router.push(`/products?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-crimson/10">
          <ShoppingBag className="w-5 h-5 text-crimson" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-warm-white">Products</h1>
          <p className="text-warm-white-muted text-sm">
            {total} products available
          </p>
        </div>
      </div>

      <CategoryFilter
        onSearchChange={(term) => updateParams({ search: term })}
        onSortChange={(sort) => updateParams({ sort })}
        defaultSearch={currentSearch}
        defaultSort={currentSort}
      />
      <ProductGrid products={products} loading={isPending} />
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => updateParams({ page: String(p) })}
        />
      )}
    </div>
  );
}
