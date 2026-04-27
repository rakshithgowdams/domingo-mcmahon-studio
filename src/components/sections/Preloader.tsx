import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Asterisk } from "@/components/ui/Asterisk";

interface PreloaderProps {
  /** Called once the exit animation finishes. Optional so the component
   *  can also be rendered standalone (e.g. on the /qa page). */
  onComplete?: () => void;
  /** How long the skeleton stays visible before the wipe begins (seconds). */
  hold?: number;
}

/**
 * Skeleton-style preloader. Mirrors the editorial magazine grid used by
 * the rest of the site:
 *   - Outer max-width container (max-w-[1400px])
 *   - Consistent gutters (px-6 md:px-10)
 *   - Vertical rhythm via py-* matching section spacing
 *
 * Animation: skeleton blocks shimmer in place, then the entire panel
 * wipes upward (yPercent: -100) revealing the page underneath.
 */
export const Preloader = ({ onComplete, hold = 1.4 }: PreloaderProps) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to({}, { duration: hold }).call(() => setExiting(true));
    return () => {
      tl.kill();
    };
  }, [hold]);

  useEffect(() => {
    if (!exiting) return;
    const tl = gsap.timeline({ onComplete });
    tl.to(".preloader-skeleton", {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
    }).to(
      ".preloader",
      {
        yPercent: -100,
        duration: 0.9,
        ease: "expo.inOut",
      },
      "-=0.1"
    );
    return () => {
      tl.kill();
    };
  }, [exiting, onComplete]);

  return (
    <div className="preloader fixed inset-0 z-[10000] flex flex-col bg-foreground">
      {/* Magazine grid container — matches the rest of the site */}
      <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col px-6 py-8 md:px-10 md:py-10">
        {/* TOP ROW — wordmark + nav skeletons */}
        <header className="preloader-skeleton flex items-start justify-between">
          <div className="space-y-2">
            <div className="skeleton-shimmer h-3 w-40 rounded-sm" />
            <div className="skeleton-shimmer h-2 w-24 rounded-sm opacity-70" />
          </div>
          <nav className="hidden flex-col items-end gap-2 md:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="skeleton-shimmer h-2.5 rounded-sm"
                style={{ width: `${64 + i * 12}px` }}
              />
            ))}
          </nav>
        </header>

        {/* CENTER — display headline skeleton bars (mirrors Hero rhythm) */}
        <section className="preloader-skeleton flex flex-1 flex-col justify-center gap-5 py-12 md:gap-6">
          <div className="skeleton-shimmer h-[10vw] max-h-28 min-h-12 w-[55%] rounded-md" />
          <div className="skeleton-shimmer h-[10vw] max-h-28 min-h-12 w-[42%] rounded-md" />
          <div className="skeleton-shimmer h-[10vw] max-h-28 min-h-12 w-[68%] rounded-md" />

          {/* Sub-deck row — small caption pair under the headline */}
          <div className="mt-4 flex items-center gap-3">
            <div className="skeleton-shimmer h-2 w-16 rounded-sm opacity-60" />
            <div className="skeleton-shimmer h-2 w-32 rounded-sm opacity-60" />
          </div>
        </section>

        {/* BOTTOM ROW — captions + spinning asterisk on the same baseline */}
        <footer className="preloader-skeleton flex items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="skeleton-shimmer h-2 w-48 rounded-sm" />
            <div className="skeleton-shimmer h-2 w-36 rounded-sm opacity-70" />
          </div>

          {/* Asterisk centered horizontally on bottom baseline */}
          <div className="flex items-center justify-center pb-1">
            <Asterisk color="forest" size={48} reveal={false} spin={2} />
          </div>

          <div className="hidden space-y-2 text-right md:block">
            <div className="skeleton-shimmer ml-auto h-2 w-44 rounded-sm" />
            <div className="skeleton-shimmer ml-auto h-2 w-32 rounded-sm opacity-70" />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Preloader;
