import Card from "@/components/ui/Card";
import { Calendar, ShoppingBag, Brain, Bell } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Cycle Tracking",
    description:
      "Visual calendar with color-coded phases. Know exactly where you are in your cycle at a glance.",
    color: "text-crimson",
    bg: "bg-crimson/10",
  },
  {
    icon: Brain,
    title: "Phase Insights",
    description:
      "Get personalized tips for nutrition, exercise, and self-care tailored to each cycle phase.",
    color: "text-gold",
    bg: "bg-gold/10",
  },
  {
    icon: ShoppingBag,
    title: "Wellness Shop",
    description:
      "Curated menstrual wellness products from pads and cups to pain relief and mood enhancers.",
    color: "text-crimson",
    bg: "bg-crimson/10",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Never be caught off guard. Get timely notifications for period start, supply restocking, and more.",
    color: "text-gold",
    bg: "bg-gold/10",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Everything You Need in <span className="text-crimson">One Place</span>
          </h2>
          <p className="text-warm-white-muted max-w-xl mx-auto">
            Crimson Luna combines cycle tracking, personalized insights, and curated products
            into one seamless experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} hover>
              <div className={`inline-flex p-3 rounded-lg ${feature.bg} mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-warm-white mb-2">{feature.title}</h3>
              <p className="text-warm-white-muted text-sm leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
