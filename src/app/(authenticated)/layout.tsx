import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserProfile, createUserProfile } from "@/actions/user-actions";
import { getCartItems } from "@/actions/cart-actions";
import { getOrSeedNotifications } from "@/actions/notification-actions";
import { UserProfile } from "@/types";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AuthErrorBoundary from "@/components/layout/AuthErrorBoundary";
import DataInitializer from "@/components/auth/DataInitializer";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userId = session.user.id;

  let profile: Omit<UserProfile, "name" | "image"> | null = null;
  let dbError = false;
  try {
    profile = await getUserProfile(userId);
    if (!profile) {
      // User truly doesn't exist yet — create a new profile
      await createUserProfile(userId, session.user.email ?? "");
      profile = await getUserProfile(userId);
    }
  } catch (e) {
    // Real DB error (not "user not found") — don't try to create
    console.error("Supabase error:", e);
    dbError = true;
  }

  if (!profile) {
    profile = {
      id: userId,
      email: session.user.email ?? "",
      cycleLength: 28,
      periodDuration: 5,
      lastPeriodDate: "",
      // If DB errored, assume returning user — don't force onboarding
      // If genuinely new (no DB error), they need onboarding
      onboardingComplete: dbError,
    };
  }

  const fullProfile: UserProfile = {
    ...profile,
    name: session.user.name ?? "",
    image: session.user.image ?? undefined,
  };

  // Redirect to onboarding if not complete (server-side, no flash)
  if (!fullProfile.onboardingComplete) {
    redirect("/onboarding");
  }

  let cartItems: import("@/types").CartItem[] = [];
  let notifications: import("@/types").Notification[] = [];
  try {
    [cartItems, notifications] = await Promise.all([
      getCartItems(userId),
      getOrSeedNotifications(userId),
    ]);
  } catch (e) {
    console.error("Supabase error fetching cart/notifications:", e);
  }

  return (
    <AuthErrorBoundary>
      <DataInitializer
        profile={fullProfile}
        cartItems={cartItems}
        notifications={notifications}
      >
        <div className="flex min-h-screen bg-dark">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-4 lg:p-8">{children}</main>
          </div>
        </div>
      </DataInitializer>
    </AuthErrorBoundary>
  );
}
