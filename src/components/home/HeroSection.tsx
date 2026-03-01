"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cleanupDemoUser } from "@/actions/user-actions";
import Logo from "@/components/Logo";
import SignInButton from "@/components/auth/SignInButton";
import Button from "@/components/ui/Button";
import { ArrowRight, Sparkles, LogOut } from "lucide-react";

function MoonPhaseIcon({ phase }: { phase: number }) {
  // phase 0-7, use clip-path or simple SVG arcs
  // Simple approach: full circle, with a clip-path ellipse for the shadow
  // For phases 0-3: waxing (left side lit), 4: full, 5-7: waning
  // Simple visual: just use a circle with varying fill
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="#e5e7eb" opacity="0.8" />
      {phase !== 4 && (
        <ellipse
          cx={phase < 4 ? 10 - (phase * 4) : 10 + ((phase - 4) * 4)}
          cy="10"
          rx={Math.abs(phase - 4) * 2 + 1}
          ry="9"
          fill="#1a1a2e"
        />
      )}
    </svg>
  );
}

export default function HeroSection() {
  const { data: session } = useSession();
  const router = useRouter();

  function handleGetStarted() {
    // Always go to /dashboard — the server layout will redirect to /onboarding if needed
    if (session?.user) {
      router.push("/dashboard");
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-deep-crimson)_0%,_transparent_50%)] opacity-20" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-crimson/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <Logo size="lg" className="justify-center" />
        </div>

        <div className="inline-flex items-center gap-2 bg-crimson/10 border border-crimson/20 rounded-full px-4 py-1.5 mb-6">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-sm text-warm-white-muted">Cycle-aware wellness for every phase</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
          Embrace Your
          <br />
          <span className="text-crimson">Natural Rhythm</span>
        </h1>

        <p className="text-lg md:text-xl text-warm-white-muted max-w-2xl mx-auto mb-10">
          Track your menstrual cycle with precision, get personalized insights for each phase,
          and discover curated products that support your wellbeing throughout the month.
        </p>

        <div className="flex flex-col items-center justify-center gap-4">
          {session?.user ? (
            <div className="flex flex-col items-center gap-3">
              <Button size="lg" onClick={handleGetStarted}>
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <button
                onClick={async () => {
                  await cleanupDemoUser();
                  signOut({ callbackUrl: "/" });
                }}
                className="inline-flex items-center gap-1.5 text-sm text-warm-white-muted hover:text-warm-white transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          ) : (
            <>
              <SignInButton />
              <button
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm text-warm-white-muted hover:text-warm-white transition-colors mt-2"
              >
                Learn more ↓
              </button>
            </>
          )}
        </div>

        {/* Decorative moon phases */}
        <div aria-hidden="true" className="flex items-center justify-center gap-3 mt-16 opacity-30">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((p) => (
            <MoonPhaseIcon key={p} phase={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
