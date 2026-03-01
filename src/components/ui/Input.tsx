"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-warm-white-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border bg-dark-surface px-4 py-2.5 text-warm-white placeholder:text-warm-white-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-crimson/50",
            error ? "border-crimson" : "border-white/10 focus:border-crimson/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-crimson">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
