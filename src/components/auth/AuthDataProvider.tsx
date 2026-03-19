import { redirect } from "next/navigation";
import { ensureUserProfile } from "@/actions/user-actions";
import { UserProfile } from "@/types";
import DataInitializer from "./DataInitializer";

interface AuthDataProviderProps {
  userId: string;
  email: string;
  name: string;
  image?: string;
  children: React.ReactNode;
}

export default async function AuthDataProvider({
  userId,
  email,
  name,
  image,
  children,
}: AuthDataProviderProps) {
  let profile: Omit<UserProfile, "name" | "image">;
  try {
    profile = await ensureUserProfile(userId, email);
  } catch (e) {
    console.error("Supabase error:", e);
    // DB unreachable — let user through rather than looping onboarding
    profile = {
      id: userId,
      email,
      cycleLength: 28,
      periodDuration: 5,
      lastPeriodDate: "",
      onboardingComplete: true,
    };
  }

  const fullProfile: UserProfile = { ...profile, name, image };

  if (!fullProfile.onboardingComplete) {
    redirect("/onboarding");
  }

  return <DataInitializer profile={fullProfile}>{children}</DataInitializer>;
}
