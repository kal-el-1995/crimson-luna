"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { useCartStore } from "@/stores/cart-store";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  User,
  Bell,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: ShoppingBag },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { totalItems } = useCartStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const cartCount = hasMounted ? totalItems() : 0;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-dark-surface h-screen sticky top-0">
      <div className="p-6">
        <Link href="/dashboard">
          <Logo size="md" />
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isCart = item.href === "/cart";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-crimson/10 text-crimson"
                  : "text-warm-white-muted hover:text-warm-white hover:bg-white/5"
              )}
            >
              <span className="relative">
                <item.icon className="w-5 h-5" />
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-crimson-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center leading-none">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <p className="text-xs text-warm-white-muted/50 text-center">Crimson Luna v1.0</p>
      </div>
    </aside>
  );
}
