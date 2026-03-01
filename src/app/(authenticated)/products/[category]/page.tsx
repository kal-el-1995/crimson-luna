"use client";

import { use, useState, useMemo } from "react";
import { getProductsByCategory, categories } from "@/data/products";
import { Product } from "@/types";
import CategoryFilter from "@/components/products/CategoryFilter";
import ProductGrid from "@/components/products/ProductGrid";
import { ShoppingBag } from "lucide-react";

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const categoryInfo = categories.find((c) => c.slug === category);

  const displayedProducts = useMemo(() => {
    let filtered: Product[] = getProductsByCategory(category);

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower)
      );
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return sorted;
  }, [category, searchTerm, sortBy]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-crimson/10">
          <ShoppingBag className="w-5 h-5 text-crimson" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-warm-white">
            {categoryInfo ? `${categoryInfo.emoji} ${categoryInfo.label}` : "Products"}
          </h1>
          <p className="text-warm-white-muted text-sm">
            {displayedProducts.length} products available
          </p>
        </div>
      </div>

      <CategoryFilter onSearchChange={setSearchTerm} onSortChange={setSortBy} />
      <ProductGrid products={displayedProducts} loading={false} />
    </div>
  );
}
