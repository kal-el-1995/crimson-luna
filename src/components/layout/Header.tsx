"use client";

import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/user-store";
import SignOutButton from "@/components/auth/SignOutButton";
import NotificationBell from "@/components/notifications/NotificationBell";
import MobileNav from "@/components/layout/MobileNav";
import { User } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const { profile } = useUserStore();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-dark/80 backdrop-blur-lg">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileNav />
          <div className="hidden lg:block">
            <h2 className="text-sm font-medium text-warm-white">
              Welcome back, <span className="text-crimson">{profile?.name || session?.user?.name || "User"}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <div className="flex items-center gap-2">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-crimson/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-crimson/20 flex items-center justify-center">
                <User className="w-4 h-4 text-crimson" />
              </div>
            )}
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
