"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/user-store";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { User, Calendar, Save, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { profile, updateProfile } = useUserStore();
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    age: profile?.age?.toString() || "",
    cycleLength: profile?.cycleLength?.toString() || "28",
    periodDuration: profile?.periodDuration?.toString() || "5",
    lastPeriodDate: profile?.lastPeriodDate || "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age?.toString() || "",
        cycleLength: profile.cycleLength.toString(),
        periodDuration: profile.periodDuration.toString(),
        lastPeriodDate: profile.lastPeriodDate,
      });
    }
  }, [profile]);

  function handleSave() {
    const newErrors: Record<string, string> = {};

    const age = parseInt(formData.age);
    if (formData.age && (isNaN(age) || age <= 0)) {
      newErrors.age = "Please enter a valid age (10-60)";
    } else if (formData.age && (age < 10 || age > 60)) {
      newErrors.age = "Please enter a valid age (10-60)";
    }

    const cycleLength = parseInt(formData.cycleLength);
    if (!formData.cycleLength || isNaN(cycleLength) || cycleLength <= 0) {
      newErrors.cycleLength = "Please enter a valid cycle length (18-45 days)";
    } else if (cycleLength < 18 || cycleLength > 45) {
      newErrors.cycleLength = "Please enter a valid cycle length (18-45 days)";
    }

    const periodDuration = parseInt(formData.periodDuration);
    if (!formData.periodDuration || isNaN(periodDuration) || periodDuration <= 0) {
      newErrors.periodDuration = "Please enter a valid duration (1-10 days)";
    } else if (periodDuration < 1 || periodDuration > 10) {
      newErrors.periodDuration = "Please enter a valid duration (1-10 days)";
    }

    if (!formData.lastPeriodDate) {
      newErrors.lastPeriodDate = "Please select a date";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    updateProfile({
      age: formData.age ? parseInt(formData.age) : undefined,
      cycleLength: parseInt(formData.cycleLength),
      periodDuration: parseInt(formData.periodDuration),
      lastPeriodDate: formData.lastPeriodDate,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-crimson/10">
          <User className="w-5 h-5 text-crimson" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-warm-white">Profile</h1>
          <p className="text-warm-white-muted text-sm">Manage your account and cycle settings</p>
        </div>
      </div>

      {/* Account Info */}
      <Card>
        <h2 className="text-lg font-display font-semibold text-warm-white mb-4">Account</h2>
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-crimson/30"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-crimson/20 flex items-center justify-center">
              <User className="w-8 h-8 text-crimson" />
            </div>
          )}
          <div>
            <p className="font-medium text-warm-white">{profile?.name || session?.user?.name}</p>
            <p className="text-sm text-warm-white-muted">{profile?.email || session?.user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Cycle Settings */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-display font-semibold text-warm-white">Cycle Settings</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="age"
            label="Age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            error={errors.age}
            min={10}
            max={60}
          />
          <Input
            id="cycleLength"
            label="Cycle Length (days)"
            type="number"
            value={formData.cycleLength}
            onChange={(e) => setFormData({ ...formData, cycleLength: e.target.value })}
            error={errors.cycleLength}
            min={18}
            max={45}
          />
          <Input
            id="periodDuration"
            label="Period Duration (days)"
            type="number"
            value={formData.periodDuration}
            onChange={(e) => setFormData({ ...formData, periodDuration: e.target.value })}
            error={errors.periodDuration}
            min={1}
            max={10}
          />
          <Input
            id="lastPeriodDate"
            label="Last Period Start Date"
            type="date"
            value={formData.lastPeriodDate}
            onChange={(e) => setFormData({ ...formData, lastPeriodDate: e.target.value })}
            error={errors.lastPeriodDate}
          />
        </div>

        <div className="mt-6">
          <Button onClick={handleSave}>
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
