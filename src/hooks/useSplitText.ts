import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

interface Options {
  /** Only animate when in view (uses ScrollTrigger). Default: true. */
  scroll?: boolean;
  /** Stagger between characters (seconds). */
  stagger?: number;
  /** Delay before starting (seconds). */
  delay?: number;
  /** Animate by 'chars' (default), 'words', or 'lines'. */
  by?: "chars" | "words" | "lines";
  /** Override the trigger start position. */
  start?: string;
}

/**
 * Hook: SplitText character/word/line reveal driven by GSAP.
 * Returns a ref to attach to the element you want to animate.
 *
 * Migrated to useGSAP for HMR-safe cleanup — the GSAP context auto-reverts
 * tweens AND any attached ScrollTriggers when the component unmounts or
 * the hook re-runs, eliminating leak risk on hot reload.
 */
export function useSplitText<T extends HTMLElement>({
  scroll = true,
  stagger = 0.03,
  delay = 0,
  by = "chars",
  start = "top 85%",
}: Options = {}) {
  const ref = useRef<T | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // Reduced motion: skip the split entirely so the headline is
      // immediately legible (no hidden chars stuck off-screen).
      if (prefersReducedMotion()) return;

      const split = new SplitType(el, { types: "lines,words,chars" });
      const targets =
        by === "chars" ? split.chars : by === "words" ? split.words : split.lines;
      if (!targets || targets.length === 0) {
        split.revert();
        return;
      }

      gsap.set(targets, { yPercent: 110, opacity: 0 });

      const animation = {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        stagger,
        delay,
        ease: "power3.out",
      } as const;

      if (scroll) {
        gsap.to(targets, {
          ...animation,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none reverse",
          },
        });
      } else {
        gsap.to(targets, animation);
      }

      // Revert split markup on cleanup so re-runs don't double-wrap chars.
      return () => {
        split.revert();
      };
    },
    { scope: ref, dependencies: [scroll, stagger, delay, by, start] }
  );

  return ref;
}
