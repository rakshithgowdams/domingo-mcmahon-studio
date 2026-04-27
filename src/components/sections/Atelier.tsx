import { motion } from "framer-motion";
import { Asterisk } from "../Asterisk";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const posts = [
  {
    img: blog1,
    tag: "Timeless Design",
    title: "Building a Timeless Wardrobe Identity",
    desc: "A study on how restraint and ritual shape garments that outlast every season.",
    rotate: "-3deg",
  },
  {
    img: blog2,
    tag: "Textile Art",
    title: "Designing for Calm: Beyond the Runway",
    desc: "Why softness and silence belong inside the most considered tailored work.",
    rotate: "2deg",
  },
  {
    img: blog3,
    tag: "Slow Craft",
    title: "The Power of Restraint in Hand-Stitching",
    desc: "Notes from the studio on patience, repetition and the discipline of one stitch.",
    rotate: "-1deg",
  },
];

export const Atelier = () => {
  return (
    <section className="relative bg-surface-warm py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:px-10 lg:grid-cols-12">
        {/* Left headline */}
        <div className="relative lg:col-span-5">
          <span className="pill mb-6 inline-flex">05 Blog</span>
          <h2 className="display text-foreground" style={{ fontSize: "clamp(48px, 9vw, 130px)" }}>
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

        {/* Right cards */}
        <div className="relative lg:col-span-7">
          <Asterisk color="orange" size={48} className="absolute -top-6 right-10 z-10" />
          <Asterisk color="yellow" size={36} className="absolute bottom-10 -left-4 z-10" />

          <div className="grid gap-8 sm:grid-cols-2">
            {posts.map((p, i) => (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`group rounded-lg bg-background p-3 shadow-[0_8px_30px_-12px_hsl(0_0%_0%/0.15)] transition-all duration-300 hover:-translate-y-1 ${
                  i === 2 ? "sm:col-span-2 sm:max-w-md sm:mx-auto" : ""
                }`}
                style={{ transform: `rotate(${p.rotate})` }}
              >
                <div className="relative photo">
                  <img src={p.img} alt={p.title} loading="lazy" className="h-64 w-full object-cover" />
                  <span className="pill absolute left-3 top-3 bg-background">{p.tag}</span>
                </div>
                <div className="px-2 pb-2 pt-4">
                  <h3 className="display text-2xl text-foreground">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Atelier;
