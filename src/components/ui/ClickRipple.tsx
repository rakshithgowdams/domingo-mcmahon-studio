import { useEffect, useRef } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

/**
 * Global click feedback — spawns a soft forest-green ripple at every
 * click position and removes it after the 600ms animation finishes.
 *
 * Mounted once near the root (App.tsx). Listens to `pointerdown` on
 * window with capture: true so it still fires even if downstream
 * handlers call stopPropagation().
 *
 * Honors prefers-reduced-motion (no ripple spawn at all).
 */
export const ClickRipple = () => {
  const layerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onDown = (e: PointerEvent) => {
      const layer = layerRef.current;
      if (!layer) return;
      // Don't ripple on right/middle clicks.
      if (e.button !== 0) return;

      const dot = document.createElement("span");
      dot.className = "click-ripple-dot";
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      layer.appendChild(dot);

      // Remove the node when its CSS animation ends (or after a safety
      // timeout in case animationend doesn't fire — tab switch, etc.).
      const remove = () => dot.remove();
      dot.addEventListener("animationend", remove, { once: true });
      window.setTimeout(remove, 800);
    };

    window.addEventListener("pointerdown", onDown, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", onDown, { capture: true } as EventListenerOptions);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden"
    />
  );
};

export default ClickRipple;
