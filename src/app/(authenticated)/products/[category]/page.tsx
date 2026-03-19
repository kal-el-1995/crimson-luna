import { getProducts } from "@/actions/product-actions";
import { categories } from "@/data/categories";
import CategoryPageClient from "./CategoryPageClient";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const categoryInfo = categories.find((c) => c.slug === category);

  const result = await getProducts({
    category,
    search: sp.search,
    sort: sp.sort,
    page,
  });

  return (
    <CategoryPageClient
      products={result.products}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      currentSearch={sp.search || ""}
      currentSort={sp.sort || "default"}
      categoryLabel={categoryInfo ? `${categoryInfo.emoji} ${categoryInfo.label}` : "Products"}
    />
  );
}
