import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({ size = "md", className }: LogoProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <MoonIcon size={size} />
      <span className={cn("font-display font-bold tracking-tight", sizes[size])}>
        <span className="text-crimson">Crimson</span>{" "}
        <span className="text-gold">Luna</span>
      </span>
    </div>
  );
}

export function MoonIcon({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconSizes = { sm: 20, md: 28, lg: 40 };
  const s = iconSizes[size];

  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="url(#moonGrad)" />
      <path
        d="M28 8C23 10 20 15 20 20C20 25 23 30 28 32C22 34 15 32 11 27C7 22 7 15 11 10C15 5 22 4 28 8Z"
        fill="#0D0D0D"
        fillOpacity="0.6"
      />
      <circle cx="15" cy="14" r="1.5" fill="#D4AF37" fillOpacity="0.4" />
      <circle cx="24" cy="24" r="1" fill="#D4AF37" fillOpacity="0.3" />
      <circle cx="17" cy="26" r="0.8" fill="#D4AF37" fillOpacity="0.3" />
      <defs>
        <radialGradient id="moonGrad" cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#DC143C" />
          <stop offset="100%" stopColor="#8B0000" />
        </radialGradient>
      </defs>
    </svg>
  );
}
