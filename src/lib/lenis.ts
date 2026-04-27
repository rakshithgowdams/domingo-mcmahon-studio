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
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    lerp: 0.1,
  });

  instance.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    instance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return instance;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function destroyLenis(): void {
  instance?.destroy();
  instance = null;
}
