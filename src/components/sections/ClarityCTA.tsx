import { Asterisk } from "../Asterisk";
import portraitBlue from "@/assets/portrait-blue.jpg";

export const ClarityCTA = () => {
  return (
    <section className="bg-foreground py-24 text-white md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <h2 className="display text-center text-white" style={{ fontSize: "clamp(56px, 12vw, 200px)" }}>
          Crafting{" "}
          <span className="inline-block align-middle">
            <Asterisk color="purple" size={56} />
          </span>{" "}
          Clarity
          <br />
          <span className="inline-flex flex-wrap items-center justify-center gap-4">
            From
            <span className="inline-block h-16 w-16 overflow-hidden rounded-full align-middle md:h-24 md:w-24">
              <img src={portraitBlue} alt="Designer portrait" loading="lazy" className="h-full w-full object-cover" />
            </span>
            Complexity
            <span className="inline-block align-middle">
              <Asterisk color="pink" size={56} />
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
