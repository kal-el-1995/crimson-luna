import Card from "@/components/ui/Card";
import { CyclePhase } from "@/types";
import { Apple, Dumbbell, Moon, Heart } from "lucide-react";

const insights: Record<CyclePhase, { category: string; icon: React.ElementType; items: string[] }[]> = {
  menstrual: [
    {
      category: "Nutrition",
      icon: Apple,
      items: ["Iron-rich foods (spinach, lentils)", "Warm soups and stews", "Dark chocolate (in moderation)"],
    },
    {
      category: "Exercise",
      icon: Dumbbell,
      items: ["Gentle yoga and stretching", "Light walks", "Rest when needed"],
    },
    {
      category: "Self-Care",
      icon: Heart,
      items: ["Warm baths with epsom salts", "Heating pad for cramps", "Journaling and reflection"],
    },
    {
      category: "Sleep",
      icon: Moon,
      items: ["Aim for 8+ hours", "Herbal tea before bed", "Keep bedroom cool"],
    },
  ],
  follicular: [
    {
      category: "Nutrition",
      icon: Apple,
      items: ["Fermented foods (kimchi, yogurt)", "Light, fresh salads", "Sprouted grains"],
    },
    {
      category: "Exercise",
      icon: Dumbbell,
      items: ["Try new workout classes", "Cardio and HIIT", "Increase intensity gradually"],
    },
    {
      category: "Self-Care",
      icon: Heart,
      items: ["Start new creative projects", "Socialize and network", "Plan ahead for the month"],
    },
    {
      category: "Sleep",
      icon: Moon,
      items: ["Energy is up - enjoy it!", "Consistent sleep schedule", "Morning light exposure"],
    },
  ],
  ovulation: [
    {
      category: "Nutrition",
      icon: Apple,
      items: ["Antioxidant-rich berries", "Fiber-rich vegetables", "Healthy fats (avocado, nuts)"],
    },
    {
      category: "Exercise",
      icon: Dumbbell,
      items: ["Peak performance workouts", "Group fitness classes", "High-intensity training"],
    },
    {
      category: "Self-Care",
      icon: Heart,
      items: ["Schedule important meetings", "Enjoy social activities", "Express your creativity"],
    },
    {
      category: "Sleep",
      icon: Moon,
      items: ["Body temp may rise slightly", "Stay cool while sleeping", "7-8 hours recommended"],
    },
  ],
  luteal: [
    {
      category: "Nutrition",
      icon: Apple,
      items: ["Complex carbs (sweet potato)", "Magnesium foods (dark chocolate)", "Reduce salt and caffeine"],
    },
    {
      category: "Exercise",
      icon: Dumbbell,
      items: ["Pilates and barre", "Swimming and walking", "Lower intensity workouts"],
    },
    {
      category: "Self-Care",
      icon: Heart,
      items: ["Prioritize rest and boundaries", "Comfort activities", "Prepare period supplies"],
    },
    {
      category: "Sleep",
      icon: Moon,
      items: ["Extra sleep may be needed", "Magnesium supplement at night", "Limit screens before bed"],
    },
  ],
};

interface InsightsPanelProps {
  currentPhase: CyclePhase;
  loading?: boolean;
}

export default function InsightsPanel({ currentPhase, loading }: InsightsPanelProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white/5 rounded-2xl h-24" />
        ))}
      </div>
    );
  }

  const phaseInsights = insights[currentPhase];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {phaseInsights.map((insight) => (
        <Card key={insight.category}>
          <div className="flex items-center gap-2 mb-3">
            <insight.icon className="w-4 h-4 text-gold" />
            <h4 className="font-medium text-sm text-warm-white">{insight.category}</h4>
          </div>
          <ul className="space-y-1.5">
            {insight.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-warm-white-muted">
                <span className="text-crimson/60 mt-0.5">&#8226;</span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
