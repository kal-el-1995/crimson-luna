"use client";

import { useState, useEffect, useRef } from "react";
import { UserProfile } from "@/types";
import { useUserStore } from "@/stores/user-store";
import { useCartStore } from "@/stores/cart-store";
import { useNotificationStore } from "@/stores/notification-store";
import { getCartItems } from "@/actions/cart-actions";
import { getOrSeedNotifications } from "@/actions/notification-actions";

interface DataInitializerProps {
  profile: UserProfile;
  children: React.ReactNode;
}

export default function DataInitializer({
  profile,
  children,
}: DataInitializerProps) {
  const [ready, setReady] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    useUserStore.getState().hydrateFromDB(profile);

    // Only fetch cart + notifications once (not on every layout re-render)
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      Promise.all([
        getCartItems(profile.id),
        getOrSeedNotifications(profile.id),
      ])
        .then(([cartItems, notifications]) => {
          useCartStore.getState().hydrateFromDB(cartItems);
          useNotificationStore.getState().hydrateFromDB(notifications);
        })
        .catch(console.error);
    }

    setReady(true);
  }, [profile]);

  if (!ready) {
    return (
      <div className="flex min-h-screen bg-dark items-center justify-center">
        <div className="w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
