"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
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

/**
 * Find a user profile — first by ID, then by email as fallback.
 * If found by email with a stale ID, migrates the row to the current ID.
 * If not found at all, creates a new blank profile.
 * This single function replaces the old getUserProfile + createUserProfile flow.
 */
export async function ensureUserProfile(
  userId: string,
  email: string
): Promise<Omit<UserProfile, "name" | "image">> {
  const sb = getSupabase();

  // 1. Try by ID (fast path — covers most logins)
  const { data: byId, error: idError } = await sb
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!idError && byId) {
    return toUserProfile(byId as DBUserProfile);
  }

  // 2. Try by email — finds returning users whose session ID changed
  if (email) {
    const { data: byEmail } = await sb
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (byEmail) {
      const old = byEmail as DBUserProfile;
      // Migrate: delete old row, re-insert with current user ID + all existing data
      await sb.from("user_profiles").delete().eq("id", old.id);
      await sb.from("user_profiles").insert({
        id: userId,
        email: old.email,
        age: old.age,
        cycle_length: old.cycle_length,
        period_duration: old.period_duration,
        last_period_date: old.last_period_date,
        onboarding_complete: old.onboarding_complete,
      });
      return toUserProfile({ ...old, id: userId });
    }
  }

  // 3. Truly new user — create a blank profile
  await sb.from("user_profiles").insert({
    id: userId,
    email: email ?? "",
    cycle_length: 28,
    period_duration: 5,
    onboarding_complete: false,
  });

  return {
    id: userId,
    email: email ?? "",
    cycleLength: 28,
    periodDuration: 5,
    lastPeriodDate: "",
    onboardingComplete: false,
  };
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
  const sb = getSupabase();

  // UPDATE by ID (profile should already exist from ensureUserProfile)
  const { data: updated, error: updateError } = await sb
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

  // Fallback: profile somehow missing — insert directly
  const { error: insertError } = await sb.from("user_profiles").insert({
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
