import Logo from "@/components/Logo";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo size="sm" />
        <p className="text-warm-white-muted text-sm flex items-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-crimson fill-crimson" /> for menstrual wellness
        </p>
        <p className="text-warm-white-muted/50 text-xs">
          &copy; {new Date().getFullYear()} Crimson Luna. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
