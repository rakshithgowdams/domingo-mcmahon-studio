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
    // Use lerp-based smoothing only — mixing `duration` + `lerp` causes
    // the wheel to feel "rubbery" and produces visible micro-stutters
    // when ScrollTrigger pins kick in. Lower lerp = snappier, higher = softer.
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    syncTouch: false,
  });

  instance.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    instance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Critical for pinned sections: tells ScrollTrigger to use transform-based
  // pinning which stays in sync with Lenis instead of jumping on pin start.
  ScrollTrigger.defaults({ pinType: "transform" });
  // Normalize scroll events — eliminates the iOS/trackpad jitter that
  // makes pinned horizontal sections feel "glitchy" at the boundaries.
  ScrollTrigger.normalizeScroll(true);
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
