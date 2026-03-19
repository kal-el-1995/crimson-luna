"use server";

import { getSupabase } from "@/lib/supabase";
import { Product, ProductQuery, ProductResult } from "@/types";

const DEFAULT_LIMIT = 12;

interface DBProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image: string;
  category: string;
  rating: number;
  review_count: number;
  in_stock: boolean;
  is_subscription_available: boolean;
  subscription_discount: number;
  tags: string[];
}

function toProduct(row: DBProduct): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    image: row.image,
    category: row.category as Product["category"],
    rating: Number(row.rating),
    reviewCount: row.review_count,
    inStock: row.in_stock,
    isSubscriptionAvailable: row.is_subscription_available,
    subscriptionDiscount: row.subscription_discount,
    tags: row.tags,
  };
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductResult> {
  const {
    category,
    search,
    sort = "default",
    page = 1,
    limit = DEFAULT_LIMIT,
  } = query;

  const offset = (page - 1) * limit;

  let q = getSupabase()
    .from("products")
    .select("*", { count: "exact" });

  // Filter by category
  if (category) {
    q = q.eq("category", category);
  }

  // Search by name or description (case-insensitive)
  if (search?.trim()) {
    q = q.or(`name.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`);
  }

  // Sort
  switch (sort) {
    case "price-asc":
      q = q.order("price", { ascending: true });
      break;
    case "price-desc":
      q = q.order("price", { ascending: false });
      break;
    case "rating":
      q = q.order("rating", { ascending: false });
      break;
    case "name":
      q = q.order("name", { ascending: true });
      break;
    default:
      q = q.order("category", { ascending: true }).order("name", { ascending: true });
      break;
  }

  // Pagination
  q = q.range(offset, offset + limit - 1);

  const { data, error, count } = await q;

  if (error || !data) {
    console.error("Failed to fetch products:", error);
    return { products: [], total: 0, page, totalPages: 0 };
  }

  const total = count ?? 0;

  return {
    products: (data as DBProduct[]).map(toProduct),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await getSupabase()
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return toProduct(data as DBProduct);
}
