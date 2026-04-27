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

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const isTouchOnly = window.matchMedia("(pointer: coarse)").matches;
  if (isMobile || isTouchOnly) return null;

  instance = new Lenis({
    // Pure lerp-based smoothing keeps wheel input soft without fighting GSAP.
    // Lower values reduce sudden acceleration at pinned section boundaries.
    lerp: 0.075,
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1,
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

  // Let ScrollTrigger choose the correct pin type for the window scroller.
  // Forcing transform pins on body/window scroll causes a visible jump when
  // the horizontal strip enters or leaves its pinned state.
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
