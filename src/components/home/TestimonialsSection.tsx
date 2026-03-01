import Card from "@/components/ui/Card";
import { Star } from "lucide-react";
import { Testimonial } from "@/types";

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    avatar: "PS",
    text: "Crimson Luna completely changed how I understand my body. The phase insights helped me optimize my workouts and diet around my cycle.",
    rating: 5,
  },
  {
    id: "2",
    name: "Maya Chen",
    avatar: "MC",
    text: "The product recommendations are spot on! I discovered amazing organic pads and the heating pad from their shop is a game changer.",
    rating: 5,
  },
  {
    id: "3",
    name: "Aisha Okafor",
    avatar: "AO",
    text: "I love how the calendar shows all my cycle phases at a glance. The reminders ensure I'm always prepared. Highly recommend!",
    rating: 5,
  },
  {
    id: "4",
    name: "Luna Rodriguez",
    avatar: "LR",
    text: "As someone with irregular cycles, this app has been invaluable. The tracking is intuitive and the wellness tips are genuinely helpful.",
    rating: 4,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-dark-surface/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Loved by <span className="text-gold">Thousands</span>
          </h2>
          <p className="text-warm-white-muted max-w-xl mx-auto">
            Join a community of women who have transformed their relationship with their cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <Card key={t.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-crimson/20 flex items-center justify-center text-crimson font-semibold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-medium text-warm-white">{t.name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < t.rating ? "text-gold fill-gold" : "text-white/20"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-warm-white-muted text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
