"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { categories } from "@/data/products";

interface CategoryFilterProps {
  onSearchChange?: (term: string) => void;
  onSortChange?: (sort: string) => void;
}

export default function CategoryFilter({ onSearchChange, onSortChange }: CategoryFilterProps) {
  const pathname = usePathname();
  const activeCategory = pathname.split("/products/")[1] || null;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-warm-white-muted/50 outline-none focus:border-white/20 transition-colors text-sm"
        />
        <select
          onChange={(e) => onSortChange?.(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-white/20 transition-colors text-sm cursor-pointer"
          defaultValue="default"
        >
          <option value="default" className="bg-dark-surface text-warm-white">Default</option>
          <option value="price-asc" className="bg-dark-surface text-warm-white">Price: Low → High</option>
          <option value="price-desc" className="bg-dark-surface text-warm-white">Price: High → Low</option>
          <option value="rating-desc" className="bg-dark-surface text-warm-white">Highest Rated</option>
          <option value="name-asc" className="bg-dark-surface text-warm-white">Name A → Z</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/products"
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            !activeCategory
              ? "bg-crimson text-warm-white"
              : "bg-dark-surface text-warm-white-muted hover:text-warm-white hover:bg-white/5 border border-white/5"
          )}
        >
          All Products
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products/${cat.slug}`}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeCategory === cat.slug
                ? "bg-crimson text-warm-white"
                : "bg-dark-surface text-warm-white-muted hover:text-warm-white hover:bg-white/5 border border-white/5"
            )}
          >
            {cat.emoji} {cat.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
