import { motion } from "framer-motion";
import { Asterisk } from "../Asterisk";
import archive1 from "@/assets/archive-1.jpg";
import archive2 from "@/assets/archive-2.jpg";
import archive3 from "@/assets/archive-3.jpg";

const services = [
  { n: "1", label: "Luxury Bespoke Tailoring", muted: false },
  { n: "2", label: "Exclusive Fabric Art", muted: true },
  { n: "3", label: "Fashion Editorial Direction", muted: true },
];

export const Archive = () => {
  return (
    <section className="relative bg-background py-24 md:py-32">
      {/* Left vertical ribbon */}
      <div className="absolute inset-y-0 left-0 hidden w-6 bg-foreground md:block">
        <div className="vertical-rl flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-yellow">
          * Texture * Tone * Technique * Texture * Tone * Technique *
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:pl-16 md:pr-10">
        <div className="mb-10 flex items-center gap-4">
          <span className="pill">02 The Archive</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Photo collage */}
          <div className="relative lg:col-span-7">
            <div className="grid grid-cols-6 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="col-span-3 photo"
                style={{ transform: "rotate(-2deg)" }}
              >
                <img src={archive1} alt="Embroidered denim jacket editorial" loading="lazy" className="h-full w-full object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="col-span-3 mt-12 photo"
                style={{ transform: "rotate(2deg)" }}
              >
                <img src={archive2} alt="Bespoke tailoring with textile art" loading="lazy" className="h-full w-full object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="col-span-4 col-start-2 photo"
                style={{ transform: "rotate(-1deg)" }}
              >
                <img src={archive3} alt="Hand-stitched fabric texture detail" loading="lazy" className="h-full w-full object-cover" />
              </motion.div>
            </div>

            <Asterisk color="orange" size={60} className="absolute -left-4 top-20" />

            <h2 className="display mt-12 text-foreground" style={{ fontSize: "clamp(44px, 8vw, 120px)" }}>
              Cultivating
              <br />
              The Surreal
              <br />
              In{" "}
              <span className="inline-block align-middle">
                <Asterisk color="purple" size={48} spin />
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
              <a href="#" className="pill">03 Service</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Archive;
