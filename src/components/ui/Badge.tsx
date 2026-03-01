import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "crimson" | "gold" | "plum";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-white/10 text-warm-white-muted": variant === "default",
          "bg-crimson/20 text-crimson": variant === "crimson",
          "bg-gold/20 text-gold": variant === "gold",
          "bg-plum text-warm-white": variant === "plum",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
