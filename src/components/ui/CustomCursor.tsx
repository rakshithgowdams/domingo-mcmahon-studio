import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor — small black dot by default, expands into a soft cream
 * disc with mix-blend-difference when hovering interactive elements.
 * Disabled on touch devices.
 */
export const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const sx = useSpring(mx, { stiffness: 500, damping: 40, mass: 0.3 });
  const sy = useSpring(my, { stiffness: 500, damping: 40, mass: 0.3 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("a, button, [data-cursor='hover'], input, textarea, label")) {
        setIsHover(true);
      } else {
        setIsHover(false);
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [mx, my]);

  if (!enabled) return null;

  // Fixed 10px element scaled with transform — animating `scale` is
  // compositor-only (no layout/paint), unlike width/height which were
  // re-running layout on every hover transition.
  const HOVER_SCALE = 5.6; // 10px * 5.6 ≈ 56px

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      data-custom-cursor=""
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full mix-blend-difference will-change-transform"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        width: 10,
        height: 10,
        scale: isHover ? HOVER_SCALE : 1,
        backgroundColor: isHover ? "hsl(40 18% 95%)" : "hsl(0 0% 100%)",
        transition: "scale 0.25s ease, background-color 0.25s ease",
      }}
    />
  );
};

export default CustomCursor;
