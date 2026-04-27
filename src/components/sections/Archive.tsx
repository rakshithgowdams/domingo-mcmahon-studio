import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { BrandStar } from "@/components/ui/BrandStar";
import { PillTag } from "@/components/ui/PillTag";
import { useSplitText } from "@/hooks/useSplitText";
import archive1 from "@/assets/archive-1.jpg";
import archive2 from "@/assets/archive-2.jpg";
import archive3 from "@/assets/archive-3.jpg";

// Each service is now a tab — clicking its number swaps the left photo
// with an animated wipe. `image` + `caption` drive the hero panel.
const services = [
  {
    n: "1",
    label: "Luxury Bespoke Tailoring",
    image: archive1,
    alt: "Embroidered denim jacket editorial",
    caption: "Hand-stitched wearable art and custom threads.",
  },
  {
    n: "2",
    label: "Exclusive Fabric Art",
    image: archive2,
    alt: "Bespoke tailoring with textile art",
    caption: "Painted, dyed and overstitched textile compositions.",
  },
  {
    n: "3",
    label: "Fashion Editorial Direction",
    image: archive3,
    alt: "Hand-stitched fabric texture detail",
    caption: "Concept-to-shoot direction for editorial features.",
  },
] as const;

export const Archive = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useSplitText<HTMLHeadingElement>({ stagger: 0.025 });

  // Active tab state.
  const [active, setActive] = useState(0);

  // Refs for the swap animation. We keep TWO stacked <img> layers and
  // cross-fade between them so the new image can wipe in over the old.
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const baseImgRef = useRef<HTMLImageElement>(null);
  const overlayImgRef = useRef<HTMLImageElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  // Initial entry reveal — clip-path wipe on first scroll-in.
  useGSAP(
    () => {
      if (!photoWrapRef.current) return;
      gsap.fromTo(
        photoWrapRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: photoWrapRef.current, start: "top 85%" },
        }
      );
    },
    { scope: sectionRef }
  );

  // Click handler — animate the swap. We:
  //   1. Set the OVERLAY <img> src to the new image.
  //   2. Clip-path-wipe the overlay in from the bottom (fast, 0.7s).
  //   3. After the wipe, copy the overlay's src onto the BASE layer and
  //      reset the overlay's clip — ready for the next swap.
  //   4. Cross-fade the caption text in parallel.
  const handleSelect = (idx: number) => {
    if (idx === active) return;
    setActive(idx);

    const baseEl = baseImgRef.current;
    const overlayEl = overlayImgRef.current;
    const next = services[idx];
    if (!baseEl || !overlayEl) return;

    // Prep overlay for the wipe.
    overlayEl.src = next.image;
    overlayEl.alt = next.alt;

    const tl = gsap.timeline();
    tl.set(overlayEl, { clipPath: "inset(100% 0 0 0)", scale: 1.08, opacity: 1 })
      .to(overlayEl, {
        clipPath: "inset(0% 0 0 0)",
        scale: 1,
        duration: 0.75,
        ease: "power3.out",
      })
      .add(() => {
        // Promote overlay → base, reset overlay so it's ready next time.
        baseEl.src = next.image;
        baseEl.alt = next.alt;
        gsap.set(overlayEl, { clipPath: "inset(100% 0 0 0)", opacity: 0 });
      });

    // Caption fade.
    if (captionRef.current) {
      gsap.fromTo(
        captionRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.15 }
      );
    }
  };

  const current = services[active];

  return (
    <section ref={sectionRef} className="relative bg-background py-24 md:py-32">
      {/* Left vertical ribbon */}
      <div className="absolute inset-y-0 left-0 hidden w-6 bg-foreground md:block">
        <div className="vertical-rl flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-yellow">
          * Texture * Tone * Technique * Texture * Tone * Technique *
        </div>
      </div>

      <Asterisk color="yellow" size={24} className="absolute right-12 top-16" />
      <Asterisk color="pink" size={32} className="absolute bottom-24 right-20 hidden md:block" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:pl-16 md:pr-10">
        <div className="mb-10 flex items-center gap-4">
          <PillTag>02 The Archive</PillTag>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Hero photo panel — swapped via tab clicks */}
          <div className="relative lg:col-span-7">
            <div
              ref={photoWrapRef}
              className="photo relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted"
              style={{ willChange: "clip-path" }}
              aria-live="polite"
            >
              <img
                ref={baseImgRef}
                src={current.image}
                alt={current.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <img
                ref={overlayImgRef}
                src={current.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
              />
              {/* Floating active-index badge */}
              <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-foreground/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-background">
                <span>0{current.n}</span>
                <span className="opacity-60">{current.label}</span>
              </div>
            </div>

            <Asterisk color="orange" size={60} className="absolute -left-4 top-20" />

            <h2
              ref={headlineRef}
              className="display mt-12 text-foreground"
              style={{ fontSize: "clamp(44px, 8vw, 120px)" }}
            >
              Cultivating
              <br />
              The Surreal
              <br />
              In{" "}
              <span className="inline-block align-middle">
                <Asterisk color="purple" size={48} />
              </span>{" "}
              Fabric
            </h2>

            <p ref={captionRef} className="mt-6 max-w-md text-sm text-muted-foreground">
              {current.caption}
            </p>
          </div>

          {/* Services — now interactive tabs */}
          <div className="relative lg:col-span-5 lg:pl-10 lg:pt-12">
            <Asterisk color="blue" size={70} className="absolute -left-2 -top-6" />
            <ul
              role="tablist"
              aria-label="Archive services"
              className="space-y-6 border-t border-foreground"
            >
              {services.map((s, i) => {
                const isActive = i === active;
                return (
                  <li key={s.n} className="border-b border-foreground/20">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      data-cursor="hover"
                      onClick={() => handleSelect(i)}
                      className={`group flex w-full items-baseline gap-6 py-6 text-left transition-all duration-300 ${
                        isActive
                          ? "translate-x-2 text-foreground"
                          : "text-muted-foreground hover:translate-x-1 hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`display text-4xl tabular-nums transition-colors duration-300 md:text-5xl ${
                          isActive ? "text-accent-orange" : ""
                        }`}
                      >
                        {s.n}
                      </span>
                      <span className="display text-2xl md:text-3xl">{s.label}</span>
                      {/* Active indicator dash */}
                      <span
                        aria-hidden="true"
                        className={`ml-auto h-px self-center bg-foreground transition-all duration-500 ${
                          isActive ? "w-10 opacity-100" : "w-0 opacity-0"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-10">
              <PillTag>03 Service</PillTag>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Archive;
