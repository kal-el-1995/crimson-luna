"use server";

import { getSupabase } from "@/lib/supabase";
import { CartItem, Product } from "@/types";
import { auth } from "@/lib/auth";

interface DBCartItemWithProduct {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  is_subscription: boolean;
  products: {
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
  };
}

function toCartItem(row: DBCartItemWithProduct): CartItem | null {
  const p = row.products;
  if (!p) return null;

  const product: Product = {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    image: p.image,
    category: p.category as Product["category"],
    rating: Number(p.rating),
    reviewCount: p.review_count,
    inStock: p.in_stock,
    isSubscriptionAvailable: p.is_subscription_available,
    subscriptionDiscount: p.subscription_discount,
    tags: p.tags,
  };

  return {
    product,
    quantity: row.quantity,
    isSubscription: row.is_subscription,
  };
}

async function verifyUser(userId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
  await verifyUser(userId);

  const { data, error } = await getSupabase()
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", userId);

  if (error || !data) return [];
  return (data as DBCartItemWithProduct[])
    .map(toCartItem)
    .filter((item): item is CartItem => item !== null);
}

export async function addCartItem(
  userId: string,
  productId: string,
  isSubscription: boolean
): Promise<void> {
  await verifyUser(userId);

  // Validate product exists in database
  const { data: product } = await getSupabase()
    .from("products")
    .select("id")
    .eq("id", productId)
    .single();

  if (!product) {
    throw new Error("Invalid product");
  }

  await getSupabase().from("cart_items").upsert(
    {
      user_id: userId,
      product_id: productId,
      quantity: 1,
      is_subscription: isSubscription,
    },
    { onConflict: "user_id,product_id" }
  );
}

export async function updateCartItem(
  userId: string,
  productId: string,
  quantity: number
): Promise<void> {
  await verifyUser(userId);

  if (quantity <= 0) {
    await getSupabase()
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);
  } else {
    await getSupabase()
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", userId)
      .eq("product_id", productId);
  }
}

export async function toggleCartItemSubscription(
  userId: string,
  productId: string,
  isSubscription: boolean
): Promise<void> {
  await verifyUser(userId);

  await getSupabase()
    .from("cart_items")
    .update({ is_subscription: isSubscription })
    .eq("user_id", userId)
    .eq("product_id", productId);
}

export async function removeCartItem(userId: string, productId: string): Promise<void> {
  await verifyUser(userId);

  await getSupabase()
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
}

export async function clearCartItems(userId: string): Promise<void> {
  await verifyUser(userId);

  await getSupabase().from("cart_items").delete().eq("user_id", userId);
}
