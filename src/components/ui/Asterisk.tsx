import { forwardRef, useImperativeHandle, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
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
 *
 * Uses useGSAP with a scope so ALL tweens AND their attached
 * ScrollTriggers are automatically reverted on unmount / dep change.
 * This prevents the trigger leak that would otherwise accumulate one
 * orphaned ScrollTrigger per Asterisk instance per Strict-Mode mount.
 */
export const Asterisk = forwardRef<SVGSVGElement, AsteriskProps>(function Asterisk(
  { color = "orange", size = 40, spin = 8, className, reveal = true },
  forwardedRef
) {
  const ref = useRef<SVGSVGElement>(null);
  // Expose the inner SVG to any parent that passes a ref (fixes the
  // "Function components cannot be given refs" warning that previously
  // fired wherever an Asterisk was used inside a SplitType / SplitText
  // wrapper or any other ref-forwarding parent).
  useImperativeHandle(forwardedRef, () => ref.current as SVGSVGElement, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // Respect the user's OS-level reduced-motion preference.
      const reduced = prefersReducedMotion();

      // Idempotency guard: if a previous ScrollTrigger was somehow attached
      // to this exact element (e.g. fast HMR), kill it before creating a new
      // one. useGSAP's cleanup handles the normal case; this is belt-and-braces.
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === el)
        .forEach((st) => st.kill());

      let spinTween: gsap.core.Tween | null = null;
      let io: IntersectionObserver | null = null;

      if (spin > 0 && !reduced) {
        spinTween = gsap.to(el, {
          rotation: 360,
          duration: spin,
          repeat: -1,
          ease: "none",
          // transformOrigin keeps spin centered regardless of layout.
          transformOrigin: "50% 50%",
        });

        // PERF: pause the infinite spin whenever the asterisk is off-screen.
        // The page has ~30 asterisks; without this gate every single one
        // would keep mutating its transform every frame, causing visible
        // scroll jank. IntersectionObserver fires only on visibility change,
        // so the per-frame cost drops to "asterisks currently in viewport".
        if (typeof IntersectionObserver !== "undefined") {
          io = new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) spinTween?.play();
                else spinTween?.pause();
              }
            },
            { rootMargin: "100px" } // small buffer so spin resumes just before scroll-in
          );
          io.observe(el);
          // Start paused if the element isn't already on-screen at mount.
          const rect = el.getBoundingClientRect();
          const onScreen =
            rect.bottom > -100 &&
            rect.top < (window.innerHeight || 0) + 100;
          if (!onScreen) spinTween.pause();
        }
      }

      // Return cleanup so the observer is disconnected when useGSAP reverts.
      // (useGSAP also kills spinTween automatically as part of context cleanup.)
      const cleanup = () => {
        io?.disconnect();
      };

      if (reveal && !reduced) {
        gsap.fromTo(
          el,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              // once: true means the trigger self-disposes after firing,
              // so it won't sit in the global registry forever.
              once: true,
            },
          }
        );
      }

      return cleanup;
    },
    { scope: ref, dependencies: [spin, reveal] }
  );

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
});

export default Asterisk;
