import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

let instance: Lenis | null = null;

const MOBILE_BREAKPOINT = 768;

/**
 * Create (or return) the singleton Lenis instance and wire it to GSAP's
 * ScrollTrigger so all scroll-driven animations stay in sync with the
 * smooth-scroll loop.
 *
 * On mobile (<768px) and on touch-only devices, we DO NOT initialize Lenis:
 * native momentum scroll is significantly smoother than a JS-driven loop on
 * iOS Safari and most Android browsers. Lenis on mobile causes choppy
 * one-finger scrolling and broken `position: sticky` in some Chromium versions.
 */
export function createLenis(): Lenis | null {
  if (instance) return instance;
  if (typeof window === "undefined") return null;

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const isTouchOnly = window.matchMedia("(pointer: coarse)").matches;
  if (isMobile || isTouchOnly) return null;

  instance = new Lenis({
    // Softer lerp = more inertia / glide. 0.1 is the Lenis sweet spot for
    // editorial sites — high enough to feel smooth, low enough that pinned
    // sections don't drift behind the scroll position.
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
    syncTouch: false,
  });

  // Drive ScrollTrigger from Lenis's scroll event so pins/triggers update
  // on the SAME frame Lenis paints — this is what removes the "stutter".
  instance.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    instance?.raf(time * 1000);
  });
  // lagSmoothing(0) prevents GSAP from "catching up" after a long frame,
  // which would otherwise cause a visible jump in pinned sections.
  gsap.ticker.lagSmoothing(0);

  // Pin via transform so pinned elements ride the same compositor layer
  // Lenis is translating — eliminates the 1-frame desync at pin boundaries.
  ScrollTrigger.defaults({ pinType: "transform" });
  // NOTE: do NOT call ScrollTrigger.normalizeScroll(true) here. It hijacks
  // wheel/touch events that Lenis is already smoothing, which produces the
  // exact "sudden glitch" the user is reporting (double-handled input).
  ScrollTrigger.config({ ignoreMobileResize: true });

  return instance;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function destroyLenis(): void {
  instance?.destroy();
  instance = null;
}
