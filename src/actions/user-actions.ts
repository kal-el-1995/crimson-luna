"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { UserProfile } from "@/types";

interface DBUserProfile {
  id: string;
  email: string;
  age: number | null;
  cycle_length: number;
  period_duration: number;
  last_period_date: string | null;
  onboarding_complete: boolean;
}

function toUserProfile(row: DBUserProfile): Omit<UserProfile, "name" | "image"> {
  return {
    id: row.id,
    email: row.email,
    age: row.age ?? undefined,
    cycleLength: row.cycle_length,
    periodDuration: row.period_duration,
    lastPeriodDate: row.last_period_date ?? "",
    onboardingComplete: row.onboarding_complete,
  };
}

export async function getUserProfile(
  userId: string
): Promise<Omit<UserProfile, "name" | "image"> | null> {
  const { data, error } = await getSupabase()
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    // PGRST116 = "JSON object requested, multiple (or no) rows returned"
    // This means the user simply doesn't exist yet — return null
    if (error.code === "PGRST116") return null;
    // Any other error is a real DB issue — throw so the caller doesn't
    // mistakenly try to create a duplicate profile
    throw new Error(`getUserProfile failed: ${error.message}`);
  }

  return data ? toUserProfile(data as DBUserProfile) : null;
}

export async function createUserProfile(
  userId: string,
  email: string
): Promise<void> {
  const { error } = await getSupabase().from("user_profiles").upsert(
    {
      id: userId,
      email: email ?? "",
      cycle_length: 28,
      period_duration: 5,
      onboarding_complete: false,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  // If email unique constraint blocks the insert, delete the stale row
  // (orphaned from a previous session with a different user ID) and retry
  if (error?.code === "23505") {
    await getSupabase().from("user_profiles").delete().eq("email", email);
    await getSupabase().from("user_profiles").insert({
      id: userId,
      email: email ?? "",
      cycle_length: 28,
      period_duration: 5,
      onboarding_complete: false,
    });
  }
}

export async function completeOnboarding(
  userId: string,
  data: {
    email: string;
    age: number;
    cycleLength: number;
    periodDuration: number;
    lastPeriodDate: string;
  }
): Promise<{ success: boolean; error?: string }> {
  // Use UPDATE (not upsert) to avoid email unique constraint conflicts
  const { data: updated, error: updateError } = await getSupabase()
    .from("user_profiles")
    .update({
      email: data.email,
      age: data.age,
      cycle_length: data.cycleLength,
      period_duration: data.periodDuration,
      last_period_date: data.lastPeriodDate,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select();

  if (!updateError && updated && updated.length > 0) {
    revalidatePath("/dashboard");
    return { success: true };
  }

  // Profile doesn't exist yet — insert it
  const { error: insertError } = await getSupabase()
    .from("user_profiles")
    .insert({
      id: userId,
      email: data.email,
      age: data.age,
      cycle_length: data.cycleLength,
      period_duration: data.periodDuration,
      last_period_date: data.lastPeriodDate,
      onboarding_complete: true,
    });

  if (insertError) {
    console.error("completeOnboarding failed:", insertError);
    return { success: false, error: insertError.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<void> {
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (data.age !== undefined) updates.age = data.age;
  if (data.cycleLength !== undefined) updates.cycle_length = data.cycleLength;
  if (data.periodDuration !== undefined) updates.period_duration = data.periodDuration;
  if (data.lastPeriodDate !== undefined) updates.last_period_date = data.lastPeriodDate;
  if (data.onboardingComplete !== undefined) updates.onboarding_complete = data.onboardingComplete;

  await getSupabase().from("user_profiles").update(updates).eq("id", userId);
}

const DEMO_USER_ID = "demo-user-1";

export async function cleanupDemoUser(): Promise<void> {
  const session = await auth();
  if (session?.user?.id !== DEMO_USER_ID) return;
  // ON DELETE CASCADE removes cart_items and notifications too
  await getSupabase().from("user_profiles").delete().eq("id", DEMO_USER_ID);
}
