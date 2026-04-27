import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { BrandStar } from "@/components/ui/BrandStar";

const items = [
  "Bespoke",
  "Hand-Stitched",
  "Editorial",
  "Slow Fashion",
  "Textile Art",
];
const colors = ["orange", "lime", "pink", "blue", "pink-alt"] as const;

/**
 * Infinite horizontal marquee strip with rotating brand stars
 * between words. Uses GSAP for buttery-smooth seamless looping.
 */
export const Marquee = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;

    let tween: gsap.core.Tween | null = null;
    const build = () => {
      tween?.kill();
      // Reset transform so scrollWidth measurement isn't skewed by a
      // mid-flight tween position.
      gsap.set(track, { x: 0 });
      const distance = track.scrollWidth / 2; // duplicated content
      tween = gsap.to(track, {
        x: -distance,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    };

    build();

    // Re-measure once webfonts are ready — Anton/Bebas swap in after
    // first paint and shift the track width, which would otherwise leave
    // a tiny seam at the loop boundary.
    let cancelled = false;
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) build();
      });
    }

    return () => {
      cancelled = true;
      tween?.kill();
    };
  });

  const Row = () => (
    <div className="flex items-center gap-10 pr-10">
      {items.map((word, i) => (
        <div key={`${word}-${i}`} className="flex items-center gap-10">
          <span className="display whitespace-nowrap text-foreground" style={{ fontSize: "clamp(48px, 9vw, 120px)" }}>
            {word}
          </span>
          <BrandStar color={colors[i % colors.length]} size={56} popInOnScroll={false} rotateSpeed={6} />
        </div>
      ))}
    </div>
  );

  return (
    <section
      aria-hidden="true"
      className="relative overflow-hidden border-y border-foreground bg-background py-6"
    >
      <div ref={trackRef} className="flex w-max">
        <Row />
        <Row />
      </div>
    </section>
  );
};

export default Marquee;
