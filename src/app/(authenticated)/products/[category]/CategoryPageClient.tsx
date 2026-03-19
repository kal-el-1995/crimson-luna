"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Product } from "@/types";
import CategoryFilter from "@/components/products/CategoryFilter";
import ProductGrid from "@/components/products/ProductGrid";
import Pagination from "@/components/products/Pagination";
import { ShoppingBag } from "lucide-react";

interface CategoryPageClientProps {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  currentSearch: string;
  currentSort: string;
  categoryLabel: string;
}

export default function CategoryPageClient({
  products,
  total,
  page,
  totalPages,
  currentSearch,
  currentSort,
  categoryLabel,
}: CategoryPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
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
      if ("search" in updates || "sort" in updates) {
        params.delete("page");
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [router, pathname, searchParams, startTransition]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-crimson/10">
          <ShoppingBag className="w-5 h-5 text-crimson" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-warm-white">
            {categoryLabel}
          </h1>
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
