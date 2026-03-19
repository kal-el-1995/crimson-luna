import { getProducts } from "@/actions/product-actions";
import ProductsPageClient from "./ProductsPageClient";

interface ProductsPageProps {
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const result = await getProducts({
    search: params.search,
    sort: params.sort,
    page,
  });

  return (
    <ProductsPageClient
      products={result.products}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      currentSearch={params.search || ""}
      currentSort={params.sort || "default"}
    />
  );
}
