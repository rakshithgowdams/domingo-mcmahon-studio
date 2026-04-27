import { useEffect, type ReactNode } from "react";
import { createLenis, destroyLenis } from "@/lib/lenis";

/**
 * Mounts the singleton Lenis smooth-scroll instance for the entire app.
 * Place once near the top of the React tree.
 */
export const SmoothScrollProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    createLenis();
    return () => destroyLenis();
  }, []);

  return <>{children}</>;
};

export default SmoothScrollProvider;
