import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const DEMO_USER_ID = "demo-user-1";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await getSupabase()
    .from("user_profiles")
    .delete()
    .eq("id", DEMO_USER_ID);

  return NextResponse.json({
    success: !error,
    message: error ? error.message : "Demo user cleaned up",
  });
}
