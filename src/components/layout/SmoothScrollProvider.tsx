import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { createLenis, destroyLenis, getLenis } from "@/lib/lenis";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Mounts the singleton Lenis smooth-scroll instance for the entire app.
 * Place once near the top of the React tree, INSIDE <BrowserRouter> so it
 * can react to route changes (scroll-to-top + ScrollTrigger.refresh).
 */
export const SmoothScrollProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  // Init Lenis exactly once for the app lifetime.
  useEffect(() => {
    const lenis = createLenis();

    // Honor reduced-motion: stop Lenis (native scroll takes over).
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) lenis.stop();

    return () => destroyLenis();
  }, []);

  // On every route change: jump to top + refresh ScrollTrigger so triggers
  // recalculate against the new DOM. Defer one frame so React commits first.
  useEffect(() => {
    const lenis = getLenis();
    lenis?.scrollTo(0, { immediate: true });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [location.pathname]);

  return <>{children}</>;
};

export default SmoothScrollProvider;
