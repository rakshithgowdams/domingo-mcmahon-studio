import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────
 * Brand color palette — these are the ONLY colors used by BrandStar.
 * ──────────────────────────────────────────────────────────────────── */
export type BrandStarColor = "lime" | "orange" | "blue" | "pink" | "pink-alt";

const COLORS: Record<BrandStarColor, string> = {
  lime: "#8DDE97",
  orange: "#F0680C",
  blue: "#2B38ED",
  pink: "#E32BED",
  "pink-alt": "#E32BED",
};

/* The official 16-pointed brand star path (extracted from the supplied
 * SVG files). All five files share this exact geometry — only the fill
 * differs. Inlining the path lets us animate fill, rotation, transform
 * etc. via GSAP/Framer Motion directly. */
const STAR_PATH =
  "M419.671 21.2979C424.893 -7.09929 465.592 -7.09936 470.813 21.2979L505.189 208.24C508.924 228.556 533.719 236.613 548.684 222.372L686.375 91.3381C707.291 71.4335 740.218 95.3558 727.751 121.399L645.679 292.843C636.759 311.476 652.083 332.568 672.56 329.842L860.975 304.767C889.596 300.958 902.173 339.665 876.779 353.406L709.609 443.867C691.441 453.699 691.441 479.769 709.609 489.601L876.779 580.061C902.173 593.803 889.596 632.51 860.975 628.701L672.56 603.625C652.083 600.9 636.759 621.992 645.679 640.625L727.751 812.069C740.218 838.112 707.291 862.034 686.375 842.13L548.684 711.096C533.719 696.855 508.924 704.911 505.189 725.228L470.813 912.17C465.592 940.567 424.893 940.567 419.671 912.17L385.296 725.228C381.56 704.911 356.765 696.855 341.801 711.096L204.109 842.13C183.193 862.034 150.267 838.112 162.734 812.069L244.805 640.625C253.725 621.992 238.401 600.9 217.924 603.625L29.5093 628.701C0.888371 632.51 -11.6884 593.803 13.7053 580.061L180.875 489.601C199.043 479.769 199.043 453.699 180.875 443.867L13.7054 353.406C-11.6884 339.665 0.888303 300.958 29.5093 304.767L217.924 329.842C238.401 332.568 253.725 311.476 244.805 292.843L162.734 121.399C150.267 95.3559 183.193 71.4335 204.109 91.3381L341.801 222.372C356.765 236.613 381.56 228.557 385.296 208.24L419.671 21.2979Z";

export interface BrandStarProps {
  color: BrandStarColor;
  /** Display size in CSS pixels (square). Default 60. */
  size?: number;
  /** Continuous rotation. Default true. */
  rotate?: boolean;
  /** Seconds per full rotation. Default 12. */
  rotateSpeed?: number;
  /** 1 = clockwise, -1 = counter-clockwise. Default 1. */
  rotateDirection?: 1 | -1;
  /** Static rotation applied before animations start (degrees). */
  initialRotation?: number;
  /** 0 = none, 0.3 = subtle, 0.8 = strong. Default 0. */
  parallaxSpeed?: number;
  /** Pop-in scale 0→1 (back.out) when entering viewport. Default true. */
  popInOnScroll?: boolean;
  /** Glow halo for use on dark backgrounds (CTA section). Default false. */
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Aria label override; defaults to decorative (aria-hidden). */
  ariaLabel?: string;
}

/**
 * BrandStar — official 16-point brand star, inline SVG.
 *
 * Animation architecture (avoids the well-known GSAP × Framer Motion
 * transform-stack collision):
 *   • Outer wrapper  → Framer Motion (whileHover scale/rotate, whileTap)
 *   • Inner <g>      → GSAP infinite rotation + parallax + pop-in
 *
 * Because each library writes to a different element, neither overrides
 * the other's transform matrix.
 */
export const BrandStar = forwardRef<HTMLDivElement, BrandStarProps>(function BrandStar(
  {
    color,
    size = 60,
    rotate = true,
    rotateSpeed = 12,
    rotateDirection = 1,
    initialRotation = 0,
    parallaxSpeed = 0,
    popInOnScroll = true,
    glow = false,
    className,
    style,
    ariaLabel,
  },
  forwardedRef
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<SVGGElement>(null);
  useImperativeHandle(forwardedRef, () => wrapperRef.current as HTMLDivElement, []);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const spin = spinRef.current;
      if (!wrapper || !spin) return;
      const reduced = prefersReducedMotion();

      // Belt-and-braces: kill any prior triggers attached to this wrapper
      // (HMR safety; useGSAP cleanup handles the normal case).
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === wrapper)
        .forEach((st) => st.kill());

      // Apply static initialRotation to the inner <g>.
      gsap.set(spin, {
        rotation: initialRotation,
        transformOrigin: "50% 50%",
      });

      let spinTween: gsap.core.Tween | null = null;
      let io: IntersectionObserver | null = null;

      if (rotate && !reduced) {
        spinTween = gsap.to(spin, {
          rotation: initialRotation + 360 * rotateDirection,
          duration: rotateSpeed,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });

        // PERF: pause spin while off-screen (page can host many stars).
        if (typeof IntersectionObserver !== "undefined") {
          io = new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                if (e.isIntersecting) spinTween?.play();
                else spinTween?.pause();
              }
            },
            { rootMargin: "100px" }
          );
          io.observe(wrapper);
          const r = wrapper.getBoundingClientRect();
          const onScreen = r.bottom > -100 && r.top < (window.innerHeight || 0) + 100;
          if (!onScreen) spinTween.pause();
        }
      }

      if (popInOnScroll && !reduced) {
        gsap.fromTo(
          wrapper,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.8,
            ease: "back.out(2)",
            scrollTrigger: { trigger: wrapper, start: "top 80%", once: true },
          }
        );
      }

      // Skip parallax on mobile — scroll-linked transforms cause jank on
      // touch devices where Lenis is also disabled.
      const isMobile = window.innerWidth < 768;
      if (parallaxSpeed > 0 && !reduced && !isMobile) {
        gsap.to(wrapper, {
          yPercent: -100 * parallaxSpeed,
          ease: "none",
          scrollTrigger: { trigger: wrapper, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      }

      return () => {
        io?.disconnect();
      };
    },
    { scope: wrapperRef, dependencies: [rotate, rotateSpeed, rotateDirection, initialRotation, parallaxSpeed, popInOnScroll] }
  );

  // ─────────────────────────────────────────────────────────────────
  // Click → 4-star burst. We spawn DOM nodes from a fixed-positioned
  // helper layer so the burst escapes any overflow:hidden parent.
  // ─────────────────────────────────────────────────────────────────
  const onClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    spawnBurst(e.clientX, e.clientY, COLORS[color], size);
  };

  return (
    <motion.div
      ref={wrapperRef}
      data-cursor="hover"
      data-brand-star={color}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      whileHover={prefersReducedMotion() ? undefined : { scale: 1.3, rotate: 90 * rotateDirection }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={cn("brand-star inline-block cursor-pointer select-none will-change-transform", className)}
      style={{
        width: size,
        height: size,
        filter: glow ? `drop-shadow(0 0 20px ${COLORS[color]}80)` : undefined,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 891 934"
        width={size}
        height={size}
        fill={COLORS[color]}
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        {/* Inner <g> is the GSAP target — Framer Motion writes to the
            outer wrapper, so the two transform stacks never collide. */}
        <g ref={spinRef} style={{ transformOrigin: "445.5px 467px" }}>
          <path d={STAR_PATH} />
        </g>
      </svg>
    </motion.div>
  );
});

/* ────────────────────────────────────────────────────────────────────
 * Burst helper — spawns 4 mini-star copies that fly outward and fade.
 * Mounted into a single body-level div so it escapes section overflow.
 * ──────────────────────────────────────────────────────────────────── */
function getBurstLayer(): HTMLDivElement {
  const id = "brand-star-burst-layer";
  let el = document.getElementById(id) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.setAttribute("aria-hidden", "true");
    el.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:9996;overflow:visible";
    document.body.appendChild(el);
  }
  return el;
}

function spawnBurst(x: number, y: number, fill: string, srcSize: number) {
  const layer = getBurstLayer();
  const burstSize = Math.max(16, srcSize * 0.5);
  const distance = srcSize * 1.4;

  for (let i = 0; i < 4; i++) {
    const wrap = document.createElement("div");
    wrap.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${burstSize}px;height:${burstSize}px;margin:${-burstSize / 2}px 0 0 ${-burstSize / 2}px;pointer-events:none;will-change:transform,opacity`;
    wrap.innerHTML = `<svg viewBox="0 0 891 934" width="${burstSize}" height="${burstSize}" fill="${fill}" xmlns="http://www.w3.org/2000/svg"><path d="${STAR_PATH}"/></svg>`;
    layer.appendChild(wrap);

    const angle = (i / 4) * Math.PI * 2 + Math.random() * 0.4;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    gsap
      .timeline({ onComplete: () => wrap.remove() })
      .to(wrap, {
        x: dx,
        y: dy,
        rotation: 180 + Math.random() * 180,
        scale: 0.4,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: i * 0.05,
      });
  }
}

export default BrandStar;
