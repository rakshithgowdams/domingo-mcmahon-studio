import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import SplitType from "split-type";
import { Asterisk } from "@/components/ui/Asterisk";
import heroImg from "@/assets/hero-designer.jpg";

const navItems = ["Collections", "Editorial", "Archive", "About Designer", "Contact"];

interface HeroProps {
  /** Trigger character reveal once preloader exits. */
  ready: boolean;
}

export const Hero = ({ ready }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);

  // Character reveal on ready
  useEffect(() => {
    if (!ready || !headlineRef.current) return;
    const split = new SplitType(headlineRef.current, { types: "chars,words" });
    if (!split.chars) return;
    gsap.set(split.chars, { yPercent: 110, opacity: 0 });
    const tween = gsap.to(split.chars, {
      yPercent: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.035,
      ease: "power4.out",
      delay: 0.1,
    });
    return () => {
      tween.kill();
      split.revert();
    };
  }, [ready]);

  // Pinned hero exit + parallax
  useGSAP(
    () => {
      if (!sectionRef.current) return;
      // Photo zoom on scroll
      gsap.fromTo(
        photoRef.current,
        { scale: 1 },
        {
          scale: 1.15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      // Headline lift + fade as section exits
      gsap.to(headlineRef.current, {
        yPercent: -30,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom 30%",
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-foreground"
    >
      <img
        ref={photoRef}
        src={heroImg}
        alt="Domingo McMahon, fashion designer in embroidered denim jacket holding a green ceramic vase"
        width={1080}
        height={1920}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-foreground/15" />

      {/* Top bar */}
      <div className="relative z-10 flex items-start justify-between px-6 pt-6 md:px-10 md:pt-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
          Domingo McMahon
        </span>
        <nav className="hidden flex-col items-end gap-1 text-[12px] font-medium text-white md:flex">
          {navItems.map((item) => (
            <a key={item} href="#" className="story-link transition-opacity hover:opacity-70">
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Decorative scattered accents */}
      <Asterisk color="pink" size={28} className="absolute bottom-32 left-12 z-10 hidden md:block" />

      {/* Massive headline */}
      <div className="relative z-10 flex min-h-[calc(100vh-120px)] items-center px-4 md:px-6">
        <h1
          ref={headlineRef}
          className="display relative w-full text-white"
          style={{
            fontSize: "clamp(72px, 17vw, 260px)",
            letterSpacing: "-0.045em",
            lineHeight: "0.85",
          }}
        >
          <span className="relative inline-block">
            <Asterisk color="orange" size={56} className="absolute -left-5 -top-3 md:-left-8 md:-top-6" />
            Tailored for
          </span>
          <br />
          Individual
          <br />
          <span className="relative inline-block">
            Expression.
            <Asterisk color="lime" size={64} className="absolute -bottom-3 -right-8 md:-bottom-5 md:-right-12" />
          </span>
        </h1>
      </div>

      {/* Bottom captions */}
      <div className="absolute inset-x-0 bottom-6 z-10 grid grid-cols-2 gap-4 px-4 pr-12 text-white md:bottom-10 md:px-6 md:pr-24">
        <p className="text-[11px] leading-snug md:text-xs">
          Custom Embroidery, Textile Design,
          <br />
          Creative Direction &amp; Styling
        </p>
        <p className="text-right text-[11px] leading-snug md:text-xs">
          Welcome to My Creative
          <br />
          Archive ___________
        </p>
      </div>

      {/* Right-edge vertical rails */}
      <p className="vertical-up absolute right-10 top-1/2 z-10 hidden max-h-[60vh] max-w-[180px] -translate-y-1/2 text-[11px] font-medium leading-relaxed text-white md:block">
        I'm Domingo McMahon, creating bespoke, hand-stitched fashion and art that
        stands beyond trends. Explore my world of refined creativity.
      </p>
      <p className="vertical-up absolute bottom-10 right-3 z-10 hidden text-[11px] uppercase tracking-[0.15em] leading-snug text-white md:block">
        Exploring Art Through the
        <br />
        Language of Denim. ___________
      </p>
    </section>
  );
};

export default Hero;
