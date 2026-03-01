import Card from "@/components/ui/Card";
import { getDaysUntilNextPeriod, getNextPeriodDate, formatDate } from "@/lib/cycle-utils";
import { Timer, CalendarDays } from "lucide-react";

interface CycleCountdownProps {
  lastPeriodDate: string;
  cycleLength: number;
}

export default function CycleCountdown({ lastPeriodDate, cycleLength }: CycleCountdownProps) {
  if (!lastPeriodDate) {
    return (
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-crimson/10">
            <Timer className="w-5 h-5 text-crimson" />
          </div>
          <h3 className="font-display font-semibold text-warm-white">Next Period</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-warm-white-muted">
            Set your last period date in Profile to see cycle predictions
          </p>
        </div>
      </Card>
    );
  }

  const daysUntil = getDaysUntilNextPeriod(lastPeriodDate, cycleLength);
  const nextDate = getNextPeriodDate(lastPeriodDate, cycleLength);

  const urgency =
    daysUntil <= 3 ? "text-crimson" : daysUntil <= 7 ? "text-gold" : "text-warm-white";

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-crimson/10">
          <Timer className="w-5 h-5 text-crimson" />
        </div>
        <h3 className="font-display font-semibold text-warm-white">Next Period</h3>
      </div>

      <div className="text-center py-4">
        <p className={`text-5xl font-bold font-display ${urgency}`}>{daysUntil}</p>
        <p className="text-sm text-warm-white-muted mt-1">days away</p>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-white/5">
        <CalendarDays className="w-4 h-4 text-warm-white-muted" />
        <span className="text-sm text-warm-white-muted">
          Expected: {formatDate(nextDate, "MMMM d, yyyy")}
        </span>
      </div>
    </Card>
  );
}
