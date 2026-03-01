"use client";

import { useUserStore } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import CycleCalendar from "@/components/dashboard/CycleCalendar";
import CyclePhaseCard from "@/components/dashboard/CyclePhaseCard";
import CycleCountdown from "@/components/dashboard/CycleCountdown";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import { getDayOfCycle, getCurrentPhaseInfo } from "@/lib/cycle-utils";

export default function DashboardPage() {
  const { profile } = useUserStore();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !profile?.onboardingComplete) {
      router.push("/onboarding");
    }
  }, [hasMounted, profile, router]);

  if (!hasMounted || !profile?.onboardingComplete) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile.lastPeriodDate || profile.lastPeriodDate.trim() === "") {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-warm-white">Dashboard</h1>
          <p className="text-warm-white-muted text-sm mt-1">
            Track your cycle and get personalized insights
          </p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col items-center text-center gap-4">
          <div className="text-4xl">🌙</div>
          <h2 className="text-xl font-display font-semibold text-warm-white">
            Set Up Your Cycle Tracking
          </h2>
          <p className="text-warm-white-muted max-w-sm">
            Update your last period date in Profile to get personalized cycle insights, phase
            tracking, and predictions.
          </p>
          <Link
            href="/profile"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-crimson px-5 py-2.5 text-sm font-medium text-white hover:bg-crimson/90 transition-colors"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  const today = new Date();
  const dayOfCycle = getDayOfCycle(profile.lastPeriodDate, profile.cycleLength, today);
  const phaseInfo = getCurrentPhaseInfo(dayOfCycle, profile.cycleLength, profile.periodDuration);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-warm-white">Dashboard</h1>
        <p className="text-warm-white-muted text-sm mt-1">
          Track your cycle and get personalized insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - takes 2 columns */}
        <div className="lg:col-span-2">
          <CycleCalendar
            lastPeriodDate={profile.lastPeriodDate}
            cycleLength={profile.cycleLength}
            periodDuration={profile.periodDuration}
          />
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          <CycleCountdown
            lastPeriodDate={profile.lastPeriodDate}
            cycleLength={profile.cycleLength}
          />
          <CyclePhaseCard
            phaseInfo={phaseInfo}
            dayOfCycle={dayOfCycle}
            cycleLength={profile.cycleLength}
          />
        </div>
      </div>

      {/* Insights */}
      <div>
        <h2 className="text-xl font-display font-semibold text-warm-white mb-4">
          Insights for Your {phaseInfo.name}
        </h2>
        <InsightsPanel currentPhase={phaseInfo.phase} />
      </div>
    </div>
  );
}
