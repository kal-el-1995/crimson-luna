"use server";

import { getSupabase } from "@/lib/supabase";
import { CartItem, Product } from "@/types";
import { products } from "@/data/products";

interface DBCartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  is_subscription: boolean;
}

function toCartItem(row: DBCartItem): CartItem | null {
  const product = products.find((p) => p.id === row.product_id);
  if (!product) return null;
  return {
    product,
    quantity: row.quantity,
    isSubscription: row.is_subscription,
  };
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const { data, error } = await getSupabase()
    .from("cart_items")
    .select("*")
    .eq("user_id", userId);

  if (error || !data) return [];
  return (data as DBCartItem[]).map(toCartItem).filter((item): item is CartItem => item !== null);
}

export async function addCartItem(
  userId: string,
  product: Product,
  isSubscription: boolean
): Promise<void> {
  await getSupabase().from("cart_items").upsert(
    {
      user_id: userId,
      product_id: product.id,
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
  await getSupabase()
    .from("cart_items")
    .update({ is_subscription: isSubscription })
    .eq("user_id", userId)
    .eq("product_id", productId);
}

export async function removeCartItem(userId: string, productId: string): Promise<void> {
  await getSupabase()
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
}

export async function clearCartItems(userId: string): Promise<void> {
  await getSupabase().from("cart_items").delete().eq("user_id", userId);
}
