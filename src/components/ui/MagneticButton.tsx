import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
}

/**
 * Pill-shaped button that magnetically follows the cursor on hover.
 */
export const MagneticButton = ({
  children,
  variant = "solid",
  className,
  ...rest
}: MagneticButtonProps) => {
  const ref = useMagnetic<HTMLButtonElement>(0.3, 80);

  const styles = {
    solid: "bg-foreground text-background hover:bg-accent-forest",
    outline: "border border-foreground text-foreground hover:bg-foreground hover:text-background",
    ghost: "text-foreground hover:opacity-70",
  }[variant];

  return (
    <button
      ref={ref}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 will-change-transform",
        styles,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default MagneticButton;
