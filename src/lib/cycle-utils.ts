import {
  differenceInDays,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday as isTodayFn,
  isSameMonth,
  format,
} from "date-fns";
import { CyclePhase, CycleDay, CyclePhaseInfo } from "@/types";

export function isValidDate(date: string): boolean {
  if (!date || date.trim() === "") return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
}

export function getDayOfCycle(lastPeriodDate: string, cycleLength: number, date: Date): number {
  if (!isValidDate(lastPeriodDate)) return 1;
  const start = new Date(lastPeriodDate);
  const diff = differenceInDays(date, start);
  if (diff < 0) {
    // Date is before last period - calculate backwards through cycles
    const cyclesBack = Math.ceil(Math.abs(diff) / cycleLength);
    const adjustedDiff = diff + cyclesBack * cycleLength;
    return (adjustedDiff % cycleLength) + 1;
  }
  return (diff % cycleLength) + 1;
}

export function getPhaseForDay(dayOfCycle: number, cycleLength: number, periodDuration: number): CyclePhase {
  const ovulationDay = cycleLength - 14;

  if (dayOfCycle <= periodDuration) return "menstrual";
  if (dayOfCycle < ovulationDay - 1) return "follicular";
  if (dayOfCycle <= ovulationDay + 1) return "ovulation";
  return "luteal";
}

export function getCalendarDays(
  month: Date,
  lastPeriodDate: string,
  cycleLength: number,
  periodDuration: number
): CycleDay[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: calStart, end: calEnd }).map((date) => {
    const dayOfCycle = getDayOfCycle(lastPeriodDate, cycleLength, date);
    const phase = getPhaseForDay(dayOfCycle, cycleLength, periodDuration);
    return {
      date,
      dayOfCycle,
      phase,
      isToday: isTodayFn(date),
      isCurrentMonth: isSameMonth(date, month),
    };
  });
}

export function getCurrentPhaseInfo(
  dayOfCycle: number,
  cycleLength: number,
  periodDuration: number
): CyclePhaseInfo {
  const phase = getPhaseForDay(dayOfCycle, cycleLength, periodDuration);
  const ovulationDay = cycleLength - 14;

  const phases: Record<CyclePhase, CyclePhaseInfo> = {
    menstrual: {
      phase: "menstrual",
      name: "Menstrual Phase",
      dayRange: `Day 1 - ${periodDuration}`,
      description: "Your body is shedding the uterine lining. Focus on rest and gentle movement.",
      tips: [
        "Stay hydrated with warm herbal teas",
        "Opt for gentle yoga or walking",
        "Iron-rich foods help replenish blood loss",
        "Use a heating pad for cramp relief",
      ],
      color: "crimson",
      icon: "🌑",
    },
    follicular: {
      phase: "follicular",
      name: "Follicular Phase",
      dayRange: `Day ${periodDuration + 1} - ${ovulationDay - 2}`,
      description: "Energy is rising! Your body is preparing for ovulation. Great time for new projects.",
      tips: [
        "Energy levels are increasing - try new workouts",
        "Great time for creative projects",
        "Focus on fermented foods for gut health",
        "Skin tends to glow in this phase",
      ],
      color: "gold",
      icon: "🌓",
    },
    ovulation: {
      phase: "ovulation",
      name: "Ovulation Phase",
      dayRange: `Day ${ovulationDay - 1} - ${ovulationDay + 1}`,
      description: "Peak energy and confidence! You're at your most social and communicative.",
      tips: [
        "Peak energy - great for high-intensity workouts",
        "Social energy is highest now",
        "Excellent time for important conversations",
        "Stay hydrated and eat antioxidant-rich foods",
      ],
      color: "gold",
      icon: "🌕",
    },
    luteal: {
      phase: "luteal",
      name: "Luteal Phase",
      dayRange: `Day ${ovulationDay + 2} - ${cycleLength}`,
      description: "Wind down time. You may crave comfort food - focus on balanced nutrition.",
      tips: [
        "Cravings may increase - choose complex carbs",
        "Magnesium-rich foods help with PMS",
        "Switch to calming exercises like pilates",
        "Prioritize sleep and relaxation",
      ],
      color: "plum",
      icon: "🌗",
    },
  };

  return phases[phase];
}

export function getDaysUntilNextPeriod(
  lastPeriodDate: string,
  cycleLength: number,
  today: Date = new Date()
): number {
  if (!isValidDate(lastPeriodDate)) return 28;
  const dayOfCycle = getDayOfCycle(lastPeriodDate, cycleLength, today);
  return cycleLength - dayOfCycle + 1;
}

export function getNextPeriodDate(lastPeriodDate: string, cycleLength: number): Date {
  if (!isValidDate(lastPeriodDate)) return new Date();
  const today = new Date();
  const daysUntil = getDaysUntilNextPeriod(lastPeriodDate, cycleLength, today);
  return addDays(today, daysUntil);
}

export function formatDate(date: Date, formatStr: string = "MMM d, yyyy"): string {
  return format(date, formatStr);
}

export const phaseColors: Record<CyclePhase, string> = {
  menstrual: "bg-crimson",
  follicular: "bg-gold/80",
  ovulation: "bg-teal-400",
  luteal: "bg-purple-600",
};

export const phaseTextColors: Record<CyclePhase, string> = {
  menstrual: "text-crimson",
  follicular: "text-gold",
  ovulation: "text-gold",
  luteal: "text-purple-300",
};

export const phaseBorderColors: Record<CyclePhase, string> = {
  menstrual: "border-crimson",
  follicular: "border-gold/60",
  ovulation: "border-gold",
  luteal: "border-purple-600",
};
