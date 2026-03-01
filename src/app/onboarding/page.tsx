"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/user-store";
import { completeOnboarding } from "@/actions/user-actions";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { MoonStar, ArrowRight, ArrowLeft } from "lucide-react";

const DRAFT_KEY = "crimson-luna-onboarding-draft";
const STEP_KEY = "crimson-luna-onboarding-step";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { setProfile } = useUserStore();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    age: "",
    cycleLength: "28",
    periodDuration: "5",
    lastPeriodDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      const savedStep = localStorage.getItem(STEP_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
      }
      if (savedStep) {
        const parsedStep = parseInt(savedStep, 10);
        if (!isNaN(parsedStep)) {
          setStep(parsedStep);
        }
      }
    } catch {
      // Ignore parse errors and use default state
    }
  }, []);

  const steps = [
    {
      title: "Welcome to your cycle journey",
      subtitle: "Let's personalize your experience. First, tell us your age.",
      field: "age",
    },
    {
      title: "Your cycle details",
      subtitle: "How long is your typical cycle? (Most cycles are 21-35 days)",
      field: "cycleLength",
    },
    {
      title: "Period duration",
      subtitle: "How many days does your period usually last?",
      field: "periodDuration",
    },
    {
      title: "Last period",
      subtitle: "When did your most recent period start?",
      field: "lastPeriodDate",
    },
  ];

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    const current = steps[step].field;

    if (current === "age") {
      const age = parseInt(formData.age);
      if (!formData.age || isNaN(age) || age < 10 || age > 60) {
        newErrors.age = "Please enter a valid age (10-60)";
      }
    }
    if (current === "cycleLength") {
      const len = parseInt(formData.cycleLength);
      if (!formData.cycleLength || isNaN(len) || len < 18 || len > 45) {
        newErrors.cycleLength = "Please enter a valid cycle length (18-45 days)";
      }
    }
    if (current === "periodDuration") {
      const dur = parseInt(formData.periodDuration);
      if (!formData.periodDuration || isNaN(dur) || dur < 1 || dur > 10) {
        newErrors.periodDuration = "Please enter a valid duration (1-10 days)";
      }
    }
    if (current === "lastPeriodDate") {
      if (!formData.lastPeriodDate) {
        newErrors.lastPeriodDate = "Please select a date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleNext() {
    if (!validate()) return;

    if (step < steps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      localStorage.setItem(STEP_KEY, String(nextStep));
    } else {
      const userId = session?.user?.id || "user-1";
      // Upsert the full profile (creates row if it doesn't exist)
      await completeOnboarding(userId, {
        email: session?.user?.email || "",
        age: parseInt(formData.age),
        cycleLength: parseInt(formData.cycleLength),
        periodDuration: parseInt(formData.periodDuration),
        lastPeriodDate: formData.lastPeriodDate,
      });
      // Update client store so navigation is instant
      setProfile({
        id: userId,
        name: session?.user?.name || "User",
        email: session?.user?.email || "",
        image: session?.user?.image || undefined,
        age: parseInt(formData.age),
        cycleLength: parseInt(formData.cycleLength),
        periodDuration: parseInt(formData.periodDuration),
        lastPeriodDate: formData.lastPeriodDate,
        onboardingComplete: true,
      });
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(STEP_KEY);
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-6" />
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-crimson" : i < step ? "w-8 bg-crimson/50" : "w-8 bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-dark-surface rounded-2xl border border-white/5 p-8">
          <div className="flex items-center gap-3 mb-2">
            <MoonStar className="w-5 h-5 text-gold" />
            <h2 className="text-xl font-display font-semibold text-warm-white">
              {steps[step].title}
            </h2>
          </div>
          <p className="text-warm-white-muted text-sm mb-6">{steps[step].subtitle}</p>

          <div className="space-y-4">
            {steps[step].field === "age" && (
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => {
                  const newData = { ...formData, age: e.target.value };
                  setFormData(newData);
                  localStorage.setItem(DRAFT_KEY, JSON.stringify(newData));
                }}
                error={errors.age}
                min={10}
                max={60}
              />
            )}
            {steps[step].field === "cycleLength" && (
              <div>
                <Input
                  id="cycleLength"
                  type="number"
                  placeholder="28"
                  value={formData.cycleLength}
                  onChange={(e) => {
                    const newData = { ...formData, cycleLength: e.target.value };
                    setFormData(newData);
                    localStorage.setItem(DRAFT_KEY, JSON.stringify(newData));
                  }}
                  error={errors.cycleLength}
                  min={18}
                  max={45}
                />
                <div className="flex justify-between mt-2 text-xs text-warm-white-muted">
                  <span>Short (21 days)</span>
                  <span>Average (28 days)</span>
                  <span>Long (35 days)</span>
                </div>
              </div>
            )}
            {steps[step].field === "periodDuration" && (
              <Input
                id="periodDuration"
                type="number"
                placeholder="5"
                value={formData.periodDuration}
                onChange={(e) => {
                  const newData = { ...formData, periodDuration: e.target.value };
                  setFormData(newData);
                  localStorage.setItem(DRAFT_KEY, JSON.stringify(newData));
                }}
                error={errors.periodDuration}
                min={1}
                max={10}
              />
            )}
            {steps[step].field === "lastPeriodDate" && (
              <Input
                id="lastPeriodDate"
                type="date"
                value={formData.lastPeriodDate}
                onChange={(e) => {
                  const newData = { ...formData, lastPeriodDate: e.target.value };
                  setFormData(newData);
                  localStorage.setItem(DRAFT_KEY, JSON.stringify(newData));
                }}
                error={errors.lastPeriodDate}
              />
            )}
          </div>

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  const prevStep = step - 1;
                  setStep(prevStep);
                  localStorage.setItem(STEP_KEY, String(prevStep));
                }}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1">
              {step === steps.length - 1 ? "Start Tracking" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
