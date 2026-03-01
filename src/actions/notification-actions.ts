"use server";

import { getSupabase } from "@/lib/supabase";
import { Notification } from "@/types";

const seedNotifications: Omit<Notification, "id">[] = [
  {
    title: "Period Starting Soon",
    message: "Your period is expected to start in 2 days. Make sure you're stocked up on supplies!",
    type: "cycle",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    icon: "🌑",
  },
  {
    title: "Time to Restock",
    message: "You're running low on organic pads. Check out our latest collection with 15% off.",
    type: "supply",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    icon: "📦",
  },
  {
    title: "Follicular Phase Tip",
    message: "Your energy is rising! This is the perfect time to try a new workout routine or start a creative project.",
    type: "wellness",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    icon: "✨",
  },
  {
    title: "New Arrivals",
    message: "Check out our new menstrual cup collection - eco-friendly and comfortable all day long.",
    type: "promo",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    icon: "🛍️",
  },
  {
    title: "Cycle Insight",
    message: "Your cycle has been consistent for 3 months! Your average length is 28 days.",
    type: "cycle",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    icon: "📊",
  },
  {
    title: "Hydration Reminder",
    message: "During your menstrual phase, staying hydrated is extra important. Aim for 8-10 glasses today.",
    type: "wellness",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    icon: "💧",
  },
  {
    title: "Subscription Renewal",
    message: "Your monthly pad subscription renews in 5 days. Update your preferences if needed.",
    type: "supply",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    icon: "🔄",
  },
  {
    title: "Luteal Phase Alert",
    message: "You're entering your luteal phase. Consider adding magnesium-rich foods to your diet.",
    type: "wellness",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    icon: "🌗",
  },
  {
    title: "Flash Sale",
    message: "24-hour flash sale! Get 20% off all heating pads and pain relief products.",
    type: "promo",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    icon: "⚡",
  },
  {
    title: "Ovulation Window",
    message: "You're approaching your ovulation window. Peak fertility expected in 2 days.",
    type: "cycle",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    icon: "🌕",
  },
];

export async function getOrSeedNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await getSupabase()
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!error && data && data.length > 0) {
    return data.map((row) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      type: row.type as Notification["type"],
      read: row.read,
      createdAt: row.created_at,
      icon: row.icon ?? "",
    }));
  }

  // Seed notifications for new user
  const toInsert = seedNotifications.map((n, i) => ({
    id: `${userId}-${i + 1}`,
    user_id: userId,
    title: n.title,
    message: n.message,
    type: n.type,
    read: n.read,
    icon: n.icon,
    created_at: n.createdAt,
  }));

  await getSupabase().from("notifications").upsert(toInsert);

  return seedNotifications.map((n, i) => ({
    ...n,
    id: `${userId}-${i + 1}`,
  }));
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await getSupabase().from("notifications").update({ read: true }).eq("id", notificationId);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await getSupabase().from("notifications").update({ read: true }).eq("user_id", userId);
}
