import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PillTagProps {
  children: ReactNode;
  variant?: "outline" | "solid";
  className?: string;
  as?: "span" | "a" | "button";
  href?: string;
  onClick?: () => void;
}

/**
 * Editorial pill tag/button with hover fill.
 */
export const PillTag = ({
  children,
  variant = "outline",
  className,
  as = "span",
  href,
  onClick,
}: PillTagProps) => {
  const Tag = as as "span";
  const base =
    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-300";
  const styles =
    variant === "solid"
      ? "bg-foreground text-background hover:opacity-80"
      : "border border-foreground text-foreground hover:bg-foreground hover:text-background";

  return (
    <Tag
      className={cn(base, styles, className)}
      // @ts-expect-error allow href when as="a"
      href={href}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};

export default PillTag;
