"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { useCartStore } from "@/stores/cart-store";
import {
  Menu,
  X,
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

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCartStore();
  const cartCount = totalItems();

  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen(true)} className="p-2 text-warm-white-muted hover:text-warm-white">
        <Menu className="w-6 h-6" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-dark-surface border-r border-white/5 z-50 p-6">
            <div className="flex items-center justify-between mb-8">
              <Logo size="sm" />
              <button onClick={() => setOpen(false)} className="p-1 text-warm-white-muted hover:text-warm-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const isCart = item.href === "/cart";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
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
          </div>
        </>
      )}
    </div>
  );
}
