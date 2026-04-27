import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type AsteriskColor =
  | "orange" | "lime" | "forest" | "pink" | "purple" | "yellow" | "blue" | "ink" | "white";

const colorMap: Record<AsteriskColor, string> = {
  orange: "text-accent-orange",
  lime: "text-accent-lime",
  forest: "text-accent-forest",
  pink: "text-accent-pink",
  purple: "text-accent-purple",
  yellow: "text-accent-yellow",
  blue: "text-accent-blue",
  ink: "text-foreground",
  white: "text-white",
};

interface AsteriskProps {
  color?: AsteriskColor;
  size?: number;
  /** Continuous rotation duration in seconds (0 = no rotation). */
  spin?: number;
  className?: string;
  /** Pop-in scale animation when entering viewport. */
  reveal?: boolean;
}

/**
 * Reusable 8-petaled flower/asterisk SVG with infinite GSAP rotation
 * and optional ScrollTrigger pop-in.
 */
export const Asterisk = ({
  color = "orange",
  size = 40,
  spin = 8,
  className,
  reveal = true,
}: AsteriskProps) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tweens: gsap.core.Tween[] = [];

    if (spin > 0) {
      tweens.push(
        gsap.to(el, { rotation: 360, duration: spin, repeat: -1, ease: "none" })
      );
    }
    if (reveal) {
      gsap.set(el, { scale: 0 });
      tweens.push(
        gsap.to(el, {
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: el, start: "top 90%" },
        })
      );
    }
    return () => tweens.forEach((t) => t.kill());
  }, [spin, reveal]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={cn("asterisk", colorMap[color], className)}
    >
      <path d="M50 8
        C 53 26, 58 34, 70 32
        C 64 40, 64 48, 72 50
        C 64 52, 64 60, 70 68
        C 58 66, 53 74, 50 92
        C 47 74, 42 66, 30 68
        C 36 60, 36 52, 28 50
        C 36 48, 36 40, 30 32
        C 42 34, 47 26, 50 8 Z" />
    </svg>
  );
};

export default Asterisk;
