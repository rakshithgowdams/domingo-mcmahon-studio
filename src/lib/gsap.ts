import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register plugins exactly once. Safe to import this module from anywhere.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  // Default ease across the whole site for consistency.
  gsap.defaults({ ease: "power3.out", duration: 1 });
  // Refresh ScrollTrigger after fonts load so SplitText measurements are correct.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

/**
 * Global reduced-motion helper. Components should call this and short-circuit
 * any non-essential tweens / infinite loops when it returns true.
 * Spec success criterion: "Reduced motion preference respected".
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, ScrollToPlugin };
