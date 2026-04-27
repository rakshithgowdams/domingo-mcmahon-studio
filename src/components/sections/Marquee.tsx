import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Asterisk } from "@/components/ui/Asterisk";

const items = [
  "Bespoke",
  "Hand-Stitched",
  "Editorial",
  "Slow Fashion",
  "Textile Art",
];
const colors = ["orange", "lime", "pink", "purple", "yellow"] as const;

/**
 * Infinite horizontal marquee strip with rotating colored asterisks
 * between words. Uses GSAP for buttery-smooth seamless looping.
 */
export const Marquee = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const distance = track.scrollWidth / 2; // duplicated content
    const tween = gsap.to(track, {
      x: -distance,
      duration: 30,
      ease: "none",
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  });

  const Row = () => (
    <div className="flex items-center gap-10 pr-10">
      {items.map((word, i) => (
        <div key={`${word}-${i}`} className="flex items-center gap-10">
          <span className="display whitespace-nowrap text-foreground" style={{ fontSize: "clamp(48px, 9vw, 120px)" }}>
            {word}
          </span>
          <Asterisk color={colors[i % colors.length]} size={56} reveal={false} spin={6} />
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
