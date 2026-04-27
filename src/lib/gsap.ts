import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register plugins exactly once. Safe to import this module from anywhere.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // Site-wide tween defaults.
  gsap.defaults({ ease: "power3.out", duration: 1 });

  // ScrollTrigger defaults — `play none none reverse` means reveal animations
  // re-hide when scrolled back up so the section feels alive on every pass.
  ScrollTrigger.defaults({
    toggleActions: "play none none reverse",
    markers: false,
  });

  // Refresh after fonts load (display-headline metrics shift) and after the
  // window finishes loading (lazy images change scrollHeight).
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener("load", () => ScrollTrigger.refresh());

  // Reduced-motion: freeze the global timeline so every tween is paused
  // even if a component forgot to short-circuit.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.globalTimeline.timeScale(0);
  }

  // Keyboard-vs-mouse signal — used to hide the custom cursor while the
  // user is tabbing through interactive elements (a11y).
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") document.body.classList.add("using-keyboard");
  });
  document.addEventListener("mousedown", () => {
    document.body.classList.remove("using-keyboard");
  });
}

/**
 * Global reduced-motion helper. Components should call this and short-circuit
 * any non-essential tweens / infinite loops when it returns true.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, ScrollToPlugin };
