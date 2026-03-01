"use client";

import { useState } from "react";
import { addMonths, subMonths, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCalendarDays, phaseColors } from "@/lib/cycle-utils";
import { CyclePhase } from "@/types";

interface CycleCalendarProps {
  lastPeriodDate: string;
  cycleLength: number;
  periodDuration: number;
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const phaseLegend: { phase: CyclePhase; label: string }[] = [
  { phase: "menstrual", label: "Menstrual" },
  { phase: "follicular", label: "Follicular" },
  { phase: "ovulation", label: "Ovulation" },
  { phase: "luteal", label: "Luteal" },
];

export default function CycleCalendar({ lastPeriodDate, cycleLength, periodDuration }: CycleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const days = getCalendarDays(currentMonth, lastPeriodDate, cycleLength, periodDuration);

  return (
    <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-semibold text-warm-white">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-white/5 text-warm-white-muted hover:text-warm-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 text-xs rounded-lg hover:bg-white/5 text-warm-white-muted hover:text-warm-white transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-white/5 text-warm-white-muted hover:text-warm-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!lastPeriodDate ? (
        /* Skeleton: 7-column grid of 35 cells */
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/5 rounded-lg aspect-square" />
          ))}
        </div>
      ) : (
        <>
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayLabels.map((label) => (
              <div key={label} className="text-center text-xs font-medium text-warm-white-muted py-2">
                {label}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <div
                key={i}
                className={cn(
                  "relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all",
                  day.isCurrentMonth ? "text-warm-white" : "text-warm-white-muted/30",
                  day.isToday && "ring-2 ring-crimson"
                )}
              >
                {/* Phase background */}
                {day.isCurrentMonth && (
                  <div
                    className={cn(
                      "absolute inset-0.5 rounded-lg opacity-40",
                      phaseColors[day.phase]
                    )}
                  />
                )}
                <span className="relative z-10 font-medium">{format(day.date, "d")}</span>
                {day.isCurrentMonth && (
                  <span className="relative z-10 text-[10px] text-warm-white-muted">
                    D{day.dayOfCycle}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/5">
            {phaseLegend.map((item) => (
              <div key={item.phase} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", phaseColors[item.phase])} />
                <span className="text-xs text-warm-white-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
