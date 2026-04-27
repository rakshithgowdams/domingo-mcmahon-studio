import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Asterisk } from "@/components/ui/Asterisk";
import { PillTag } from "@/components/ui/PillTag";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import work5 from "@/assets/work-5.jpg";

const projects = [
  { img: work1, title: "Floral Tailoring", year: "2024", category: "Bespoke Suit" },
  { img: work2, title: "Patchwork Denim", year: "2024", category: "Editorial" },
  { img: work3, title: "Cloud Sculpture", year: "2023", category: "Couture" },
  { img: work4, title: "Quiet Embroidery", year: "2023", category: "Tailoring" },
  { img: work5, title: "Raw Knit Form", year: "2022", category: "Conceptual" },
];

/**
 * Horizontal scroll work strip — pins the section and translates the
 * track left as the user scrolls down. Falls back to vertical stack on
 * touch / small screens.
 */
export const WorkStrip = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const distance = track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        ScrollTrigger.refresh();
        return () => {
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative bg-surface-warm py-20 lg:h-screen lg:overflow-hidden lg:py-0">
      {/* Header — visible on all sizes */}
      <div className="mx-auto flex max-w-[1400px] items-end justify-between px-6 pb-10 lg:absolute lg:left-0 lg:right-0 lg:top-10 lg:z-10 lg:pb-0 md:px-10">
        <div>
          <PillTag className="mb-4">04.5 Selected Work</PillTag>
          <h2 className="display text-foreground" style={{ fontSize: "clamp(40px, 7vw, 100px)" }}>
            The Catalogue
          </h2>
        </div>
        <Asterisk color="forest" size={48} className="hidden md:block" />
      </div>

      {/* Horizontal track on lg+, vertical stack on smaller screens */}
      <div className="lg:flex lg:h-full lg:items-center">
        <div
          ref={trackRef}
          className="flex flex-col gap-8 px-6 md:px-10 lg:w-max lg:flex-row lg:gap-16 lg:pl-[15vw] lg:pr-[15vw] lg:pt-32"
        >
          {projects.map((p, i) => (
            <article
              key={p.title}
              className="group relative shrink-0 lg:w-[420px]"
            >
              <div className="photo overflow-hidden bg-foreground/5">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-[60vh] w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:h-[600px]"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} / {p.category}
                  </p>
                  <h3 className="display mt-1 text-3xl text-foreground">{p.title}</h3>
                </div>
                <span className="text-xs text-muted-foreground">{p.year}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkStrip;
