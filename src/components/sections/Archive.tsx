import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Asterisk } from "@/components/ui/Asterisk";
import { PillTag } from "@/components/ui/PillTag";
import { useSplitText } from "@/hooks/useSplitText";
import archive1 from "@/assets/archive-1.jpg";
import archive2 from "@/assets/archive-2.jpg";
import archive3 from "@/assets/archive-3.jpg";

const services = [
  { n: "1", label: "Luxury Bespoke Tailoring", muted: false },
  { n: "2", label: "Exclusive Fabric Art", muted: true },
  { n: "3", label: "Fashion Editorial Direction", muted: true },
];

export const Archive = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useSplitText<HTMLHeadingElement>({ stagger: 0.025 });

  // Image clip-path reveals
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".archive-photo").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
    },
    { scope: sectionRef }
  );

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
          {/* Photo collage */}
          <div className="relative lg:col-span-7">
            <div className="grid grid-cols-6 gap-4">
              <div className="archive-photo col-span-3 photo" style={{ transform: "rotate(-2deg)" }}>
                <img src={archive1} alt="Embroidered denim jacket editorial" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="archive-photo col-span-3 mt-12 photo" style={{ transform: "rotate(2deg)" }}>
                <img src={archive2} alt="Bespoke tailoring with textile art" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="archive-photo col-span-4 col-start-2 photo" style={{ transform: "rotate(-1deg)" }}>
                <img src={archive3} alt="Hand-stitched fabric texture detail" loading="lazy" className="h-full w-full object-cover" />
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

            <p className="mt-6 max-w-md text-sm text-muted-foreground">
              Hand-stitched wearable art and custom threads.
            </p>
          </div>

          {/* Services */}
          <div className="relative lg:col-span-5 lg:pl-10 lg:pt-12">
            <Asterisk color="blue" size={70} className="absolute -left-2 -top-6" />
            <ul className="space-y-6 border-t border-foreground">
              {services.map((s) => (
                <li
                  key={s.n}
                  className={`flex items-baseline gap-6 border-b border-foreground/20 pb-6 pt-6 ${
                    s.muted ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  <span className="display text-4xl md:text-5xl">{s.n}</span>
                  <span className="display text-2xl md:text-3xl">{s.label}</span>
                </li>
              ))}
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
