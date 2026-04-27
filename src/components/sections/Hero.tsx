import { motion } from "framer-motion";
import { Asterisk } from "./Asterisk";
import heroImg from "@/assets/hero-designer.jpg";

const navItems = ["Collections", "Editorial", "Archive", "About Designer", "Contact"];

export const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-foreground">
      {/* Background photo */}
      <img
        src={heroImg}
        alt="Domingo McMahon, fashion designer in embroidered denim jacket holding a green ceramic vase"
        width={1080}
        height={1920}
        className="absolute inset-0 h-full w-full object-cover"
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

      {/* Massive headline */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-120px)] max-w-[1400px] items-center px-6 md:px-10">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="display relative text-white"
          style={{ fontSize: "clamp(64px, 14vw, 220px)" }}
        >
          <span className="relative inline-block">
            <Asterisk color="orange" size={48} className="absolute -left-4 -top-2 md:-left-6 md:-top-4" />
            Tailored for
          </span>
          <br />
          Individual
          <br />
          <span className="relative inline-block">
            Expression.
            <Asterisk color="lime" size={56} className="absolute -bottom-2 -right-6 md:-bottom-4 md:-right-10" />
          </span>
        </motion.h1>
      </div>

      {/* Bottom captions */}
      <div className="absolute inset-x-0 bottom-6 z-10 grid grid-cols-2 gap-4 px-6 text-white md:bottom-10 md:grid-cols-3 md:px-10">
        <p className="text-[11px] leading-snug md:text-xs">
          Custom Embroidery, Textile Design,
          <br />
          Creative Direction & Styling
        </p>
        <p className="hidden text-[11px] leading-snug md:block md:text-xs">
          Welcome to My Creative
          <br />
          Archive ___________
        </p>
        <p className="text-right text-[11px] leading-snug md:text-xs">
          Exploring Art Through the
          <br />
          Language of Denim. ___________
        </p>
      </div>

      {/* Vertical bio text */}
      <p className="absolute right-4 top-1/2 z-10 hidden max-w-[180px] -translate-y-1/2 text-[11px] leading-relaxed text-white md:block vertical-rl">
        I'm Domingo McMahon, creating bespoke, hand-stitched fashion and art that
        stands beyond trends. Explore my world of refined creativity.
      </p>
    </section>
  );
};

export default Hero;
