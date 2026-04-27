import { Asterisk } from "../Asterisk";
import portraitBlue from "@/assets/portrait-blue.jpg";

export const ClarityCTA = () => {
  return (
    <section className="relative bg-foreground py-24 text-white md:py-40">
      {/* Scattered hand-placed accents around the headline */}
      <Asterisk color="yellow" size={32} className="absolute left-10 top-16" />
      <Asterisk color="lime" size={24} className="absolute bottom-16 right-12" />
      <Asterisk color="orange" size={20} className="absolute bottom-24 left-1/4 hidden md:block" />

      <div className="relative px-4 md:px-6">
        <h2 className="display text-center text-white" style={{ fontSize: "clamp(64px, 14vw, 240px)", letterSpacing: "-0.045em", lineHeight: "0.85" }}>
          <span className="inline-flex flex-wrap items-center justify-center gap-x-[0.15em]">
            Crafting
            <span className="inline-block align-middle">
              <Asterisk color="purple" size={72} />
            </span>
            Clarity
          </span>
          <br />
          <span className="inline-flex flex-wrap items-center justify-center gap-x-[0.15em]">
            From
            <span className="inline-block h-[0.7em] w-[0.7em] overflow-hidden rounded-full align-middle">
              <img src={portraitBlue} alt="Designer portrait" loading="lazy" className="h-full w-full object-cover" />
            </span>
            Complexity
            <span className="inline-block align-middle">
              <Asterisk color="pink" size={72} />
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

export default ClarityCTA;
