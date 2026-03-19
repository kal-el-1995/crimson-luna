"use client";

import { create } from "zustand";
import { CartItem, Product } from "@/types";
import {
  addCartItem,
  removeCartItem,
  updateCartItem,
  toggleCartItemSubscription,
  clearCartItems,
} from "@/actions/cart-actions";
import { useUserStore } from "@/stores/user-store";

interface CartState {
  items: CartItem[];
  error: string | null;
  addItem: (product: Product, isSubscription?: boolean) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSubscription: (productId: string) => void;
  clearCart: () => void;
  clearError: () => void;
  totalItems: () => number;
  subtotal: () => number;
  subscriptionSavings: () => number;
  total: () => number;
  hydrateFromDB: (items: CartItem[]) => void;
}

function getUserId(): string | null {
  return useUserStore.getState().userId;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  error: null,

  hydrateFromDB: (items) => set({ items }),

  clearError: () => set({ error: null }),

  addItem: (product, isSubscription = false) => {
    const prev = get().items;
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          error: null,
        };
      }
      return {
        items: [...state.items, { product, quantity: 1, isSubscription }],
        error: null,
      };
    });
    const userId = getUserId();
    if (userId) {
      addCartItem(userId, product.id, isSubscription).catch(() => {
        set({ items: prev, error: "Failed to add item to cart" });
      });
    }
  },

  removeItem: (productId) => {
    const prev = get().items;
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
      error: null,
    }));
    const userId = getUserId();
    if (userId) {
      removeCartItem(userId, productId).catch(() => {
        set({ items: prev, error: "Failed to remove item" });
      });
    }
  },

  updateQuantity: (productId, quantity) => {
    const prev = get().items;
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.product.id !== productId)
          : state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
      error: null,
    }));
    const userId = getUserId();
    if (userId) {
      updateCartItem(userId, productId, quantity).catch(() => {
        set({ items: prev, error: "Failed to update quantity" });
      });
    }
  },

  toggleSubscription: (productId) => {
    const prev = get().items;
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId
          ? { ...i, isSubscription: !i.isSubscription }
          : i
      ),
      error: null,
    }));
    const userId = getUserId();
    if (userId) {
      const item = get().items.find((i) => i.product.id === productId);
      if (item) {
        toggleCartItemSubscription(userId, productId, item.isSubscription).catch(() => {
          set({ items: prev, error: "Failed to update subscription" });
        });
      }
    }
  },

  clearCart: () => {
    const prev = get().items;
    set({ items: [], error: null });
    const userId = getUserId();
    if (userId) {
      clearCartItems(userId).catch(() => {
        set({ items: prev, error: "Failed to clear cart" });
      });
    }
  },

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  subscriptionSavings: () =>
    get().items.reduce((sum, i) => {
      if (i.isSubscription && i.product.isSubscriptionAvailable) {
        return sum + (i.product.price * i.quantity * i.product.subscriptionDiscount) / 100;
      }
      return sum;
    }, 0),

  total: () => get().subtotal() - get().subscriptionSavings(),
}));
