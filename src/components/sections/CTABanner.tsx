import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { BrandStar } from "@/components/ui/BrandStar";
import { useSplitText } from "@/hooks/useSplitText";
import portraitBlue from "@/assets/portrait-blue.jpg";

/**
 * CTA banner — pinned section with a white wipe revealing the black
 * background from the bottom up; headline characters cascade in.
 */
export const CTABanner = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useSplitText<HTMLHeadingElement>({ stagger: 0.04, start: "top 70%" });

  useGSAP(
    () => {
      if (!wipeRef.current || !sectionRef.current) return;
      gsap.fromTo(
        wipeRef.current,
        { yPercent: 0 },
        {
          yPercent: -100,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-foreground py-24 text-white md:py-40"
    >
      {/* White wipe overlay — drops away as section scrolls in */}
      <div
        ref={wipeRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] bg-background"
      />

      {/* Stage 2F: removed loose yellow/lime/orange decoratives in favor of placed Stars L/M */}

      {/* Star L — pink, top-right, glowing on black (hidden on mobile per spec) */}
      <BrandStar
        color="pink"
        size={90}
        initialRotation={-10}
        rotateSpeed={10}
        glow
        className="absolute z-10 hidden md:block"
        style={{ top: "22%", right: "18%" }}
      />
      {/* Star M — pink-alt, bottom-left, glowing on black */}
      <BrandStar
        color="pink-alt"
        size={110}
        initialRotation={15}
        rotateSpeed={12}
        rotateDirection={-1}
        glow
        className="absolute z-10"
        style={{ bottom: "18%", left: "14%" }}
      />

      <div className="relative z-10 px-4 md:px-6">
        <h2
          ref={headlineRef}
          className="display text-center text-white"
          style={{ fontSize: "clamp(64px, 14vw, 240px)", letterSpacing: "-0.045em", lineHeight: "0.85" }}
        >
          <span className="inline-flex flex-wrap items-center justify-center gap-x-[0.15em]">
            Crafting
            <span className="inline-block align-middle">
              <BrandStar color="pink" size={72} rotate={false} popInOnScroll={false} glow />
            </span>
            Clarity
          </span>
          <br />
          <span className="inline-flex flex-wrap items-center justify-center gap-x-[0.15em]">
            From
            <span className="inline-block h-[0.7em] w-[0.7em] overflow-hidden rounded-full align-middle">
              <img src={portraitBlue} alt="Designer portrait" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </span>
            Complexity
            <span className="inline-block align-middle">
              <BrandStar color="pink-alt" size={72} rotate={false} popInOnScroll={false} glow />
            </span>
          </span>
        </h2>
        <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-white/70">
          Hand-painted and stitched visions, brought straight from the underground studio to your wardrobe.
        </p>
      </div>
    </section>
  );
};

export default CTABanner;
