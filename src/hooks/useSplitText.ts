import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap, ScrollTrigger } from "@/lib/gsap";

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
 */
export function useSplitText<T extends HTMLElement>({
  scroll = true,
  stagger = 0.03,
  delay = 0,
  by = "chars",
  start = "top 85%",
}: Options = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const split = new SplitType(el, { types: "lines,words,chars" });
    const targets =
      by === "chars" ? split.chars : by === "words" ? split.words : split.lines;
    if (!targets || targets.length === 0) return;

    gsap.set(targets, { yPercent: 110, opacity: 0 });

    const animation = {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      stagger,
      delay,
      ease: "power3.out",
    } as const;

    let tween: gsap.core.Tween;
    let trigger: ScrollTrigger | undefined;

    if (scroll) {
      tween = gsap.to(targets, {
        ...animation,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
        },
      });
      trigger = ScrollTrigger.getAll().find((t) => t.trigger === el);
    } else {
      tween = gsap.to(targets, animation);
    }

    return () => {
      tween?.kill();
      trigger?.kill();
      split.revert();
    };
  }, [scroll, stagger, delay, by, start]);

  return ref;
}
