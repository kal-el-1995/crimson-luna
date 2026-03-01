import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { CyclePhaseInfo } from "@/types";
import { cn } from "@/lib/utils";
import { phaseTextColors } from "@/lib/cycle-utils";
import { Lightbulb } from "lucide-react";

interface CyclePhaseCardProps {
  phaseInfo: CyclePhaseInfo;
  dayOfCycle: number;
  cycleLength: number;
  lastPeriodDate?: string;
}

export default function CyclePhaseCard({ phaseInfo, dayOfCycle, cycleLength, lastPeriodDate }: CyclePhaseCardProps) {
  if (!lastPeriodDate) {
    return (
      <Card>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl opacity-30">🌑</span>
          <h3 className="text-lg font-display font-semibold text-warm-white-muted">
            Cycle Phase
          </h3>
        </div>
        <p className="text-sm text-warm-white-muted">
          Complete your profile to see your cycle phase
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{phaseInfo.icon}</span>
          <div>
            <h3 className={cn("text-lg font-display font-semibold", phaseTextColors[phaseInfo.phase])}>
              {phaseInfo.name}
            </h3>
            <p className="text-xs text-warm-white-muted">{phaseInfo.dayRange}</p>
          </div>
        </div>
        <Badge variant="crimson">
          Day {dayOfCycle} of {cycleLength}
        </Badge>
      </div>

      <p className="text-sm text-warm-white-muted mb-4">{phaseInfo.description}</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium text-warm-white">Phase Tips</span>
        </div>
        {phaseInfo.tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-warm-white-muted">
            <span className="text-crimson mt-1">&#8226;</span>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
