"use client";

import { useState, useEffect } from "react";
import { UserProfile, CartItem, Notification } from "@/types";
import { useUserStore } from "@/stores/user-store";
import { useCartStore } from "@/stores/cart-store";
import { useNotificationStore } from "@/stores/notification-store";

interface DataInitializerProps {
  profile: UserProfile;
  cartItems: CartItem[];
  notifications: Notification[];
  children: React.ReactNode;
}

export default function DataInitializer({
  profile,
  cartItems,
  notifications,
  children,
}: DataInitializerProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    useUserStore.getState().hydrateFromDB(profile);
    useCartStore.getState().hydrateFromDB(cartItems);
    useNotificationStore.getState().hydrateFromDB(notifications);
    setReady(true);
  }, [profile, cartItems, notifications]);

  if (!ready) {
    return (
      <div className="flex min-h-screen bg-dark items-center justify-center">
        <div className="w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
