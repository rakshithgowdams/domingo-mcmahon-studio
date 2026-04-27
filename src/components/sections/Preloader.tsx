import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Asterisk } from "@/components/ui/Asterisk";

interface PreloaderProps {
  onComplete: () => void;
}

/**
 * Skeleton-style preloader: editorial wireframe blocks with shimmer,
 * then a black wipe upwards on completion.
 */
export const Preloader = ({ onComplete }: PreloaderProps) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();
    // Hold the skeleton on screen briefly so the layout is perceived.
    tl.to({}, { duration: 1.4 }).call(() => setExiting(true));
    return () => {
      tl.kill();
    };
  }, []);

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
      {/* Top bar — wordmark + nav skeletons */}
      <div className="preloader-skeleton flex items-start justify-between px-6 pt-8 md:px-10">
        <div className="skeleton-shimmer h-3 w-40 rounded-sm" />
        <div className="hidden flex-col items-end gap-2 md:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-shimmer h-2.5 rounded-sm"
              style={{ width: `${60 + i * 14}px` }}
            />
          ))}
        </div>
      </div>

      {/* Center: massive headline skeleton bars */}
      <div className="preloader-skeleton flex flex-1 flex-col justify-center gap-4 px-6 md:px-10">
        <div className="skeleton-shimmer h-[12vw] max-h-32 w-[55%] rounded-md" />
        <div className="skeleton-shimmer h-[12vw] max-h-32 w-[42%] rounded-md" />
        <div className="skeleton-shimmer h-[12vw] max-h-32 w-[68%] rounded-md" />
      </div>

      {/* Bottom: caption skeletons + spinning asterisk */}
      <div className="preloader-skeleton flex items-end justify-between px-6 pb-10 md:px-10">
        <div className="space-y-2">
          <div className="skeleton-shimmer h-2 w-48 rounded-sm" />
          <div className="skeleton-shimmer h-2 w-36 rounded-sm" />
        </div>
        <Asterisk color="forest" size={48} reveal={false} spin={2} />
        <div className="hidden space-y-2 text-right md:block">
          <div className="skeleton-shimmer ml-auto h-2 w-44 rounded-sm" />
          <div className="skeleton-shimmer ml-auto h-2 w-32 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
