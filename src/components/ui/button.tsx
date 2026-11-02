import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "lemonade" | "outline" | "ghost" | "icon" | "accent";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    // Apple-grade spacious pill button: zero borders, zero shadows, pure surface color + fluid press scale
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:pointer-events-none select-none focus:outline-none active:scale-[0.96] rounded-full";

    const variants = {
      // Primary: Deep Forest Green
      primary: "bg-[#0f382c] text-white hover:bg-[#144737] active:bg-[#0a261e]",
      
      // Lemonade Accent
      lemonade: "bg-[#e4f576] text-[#0f382c] hover:bg-[#ebfb73] active:bg-[#d8ea5e]",
      
      // Secondary: Soft Apple Neutral
      secondary: "bg-black/[0.05] text-[#18241f] hover:bg-black/[0.08] active:bg-black/[0.12]",
      
      // Clean borderless soft outline
      outline: "bg-black/[0.04] text-[#18241f] hover:bg-black/[0.07] active:bg-black/[0.1]",
      
      // Minimal Ghost
      ghost: "bg-transparent text-[#5e6b64] hover:text-[#18241f] hover:bg-black/[0.04]",
      
      // Circular Icon Button
      icon: "rounded-full bg-black/[0.05] text-[#18241f] hover:bg-black/[0.09] active:bg-black/[0.12]",
      
      // Accent variant
      accent: "bg-[#e4f576] text-[#0f382c] hover:bg-[#ebfb73]",
    };

    const sizes = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5 tracking-tight",
      md: "text-xs sm:text-[13px] px-5 py-2.5 gap-2 tracking-tight",
      lg: "text-sm sm:text-base px-6 py-3.5 gap-2.5 tracking-tight",
      icon: "w-9 h-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export function ButtonGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-black/[0.05] p-1 gap-1",
        className
      )}
    >
      {children}
    </div>
  );
}
