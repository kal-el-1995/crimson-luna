"use client";

import { useSession } from "next-auth/react";
import SignInButton from "@/components/auth/SignInButton";
import { MoonIcon } from "@/components/Logo";

export default function CTASection() {
  const { data: session } = useSession();

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <MoonIcon size="lg" />
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Ready to Sync with Your <span className="text-crimson">Cycle</span>?
        </h2>
        <p className="text-warm-white-muted max-w-lg mx-auto mb-8">
          Start your wellness journey today. Track, understand, and thrive through every phase of your menstrual cycle.
        </p>
        {!session?.user && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
      </div>
    </section>
  );
}
