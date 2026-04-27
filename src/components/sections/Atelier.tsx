import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Asterisk } from "@/components/ui/Asterisk";
import { PillTag } from "@/components/ui/PillTag";
import { useSplitText } from "@/hooks/useSplitText";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const posts = [
  {
    img: blog1,
    tag: "Timeless Design",
    title: "Building a Timeless Wardrobe Identity",
    desc: "How quiet silhouettes and considered fabrics\nbecome the foundation of a personal style.",
    rotate: "-4deg",
    offsetY: "mt-0",
  },
  {
    img: blog2,
    tag: "Textile Art",
    title: "Designing for Calm: Beyond the Runway",
    desc: "Why softness, restraint, and slowness belong\ninside the most considered tailored work.",
    rotate: "3deg",
    offsetY: "sm:mt-12",
  },
  {
    img: blog3,
    tag: "Slow Craft",
    title: "The Power of Restraint in Hand-Stitching",
    desc: "Studio notes on patience, repetition, and the\nquiet discipline carried in every single stitch.",
    rotate: "-2deg",
    offsetY: "sm:-mt-6",
  },
];

export const Atelier = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useSplitText<HTMLHeadingElement>({ stagger: 0.025 });

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".atelier-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative bg-surface-warm py-24 md:py-32">
      <Asterisk color="pink" size={26} className="absolute left-1/2 top-12" />
      <Asterisk color="blue" size={20} className="absolute bottom-20 right-12 hidden md:block" />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:px-10 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <PillTag className="mb-6">05 Blog</PillTag>
          <h2
            ref={headlineRef}
            className="display text-foreground"
            style={{ fontSize: "clamp(56px, 13vw, 180px)", letterSpacing: "-0.04em", lineHeight: "0.85" }}
          >
            Latest
            <br />
            Insights
            <br />
            From The
            <br />
            <span className="text-accent-forest">Atelier</span>
          </h2>
          <p className="mt-8 max-w-sm text-sm text-muted-foreground">
            Thoughts, ideas, and perspectives on slow fashion, hand-stitched details,
            and the art of mindful creation.
          </p>
          <Asterisk color="lime" size={50} className="absolute -bottom-2 left-1/2" />
        </div>

        <div className="relative lg:col-span-7">
          <Asterisk color="orange" size={48} className="absolute -top-6 right-10 z-10" />
          <Asterisk color="yellow" size={36} className="absolute bottom-10 -left-4 z-10" />

          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:-space-x-2">
            {posts.map((p, i) => (
              <article
                key={p.title}
                className={`atelier-card group relative rounded-lg bg-background p-3 shadow-[0_12px_40px_-15px_hsl(0_0%_0%/0.25)] transition-all duration-300 hover:z-20 hover:-translate-y-2 hover:rotate-0 ${p.offsetY}`}
                style={{ transform: `rotate(${p.rotate})`, zIndex: 10 - i }}
              >
                <span className="absolute left-1 top-1 z-10 inline-flex items-center gap-2 rounded-full border border-foreground bg-background px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground shadow-sm">
                  {p.tag}
                </span>
                <div className="relative photo">
                  <img src={p.img} alt={p.title} loading="lazy" className="h-56 w-full object-cover sm:h-64" />
                </div>
                <div className="px-2 pb-3 pt-4">
                  <h3 className="display text-xl leading-[0.95] text-foreground sm:text-2xl">{p.title}</h3>
                  <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Atelier;
