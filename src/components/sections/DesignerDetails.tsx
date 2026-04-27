import { Asterisk } from "../Asterisk";
import portraitPurple from "@/assets/portrait-purple.jpg";
import portraitBlue from "@/assets/portrait-blue.jpg";

export const DesignerDetails = () => {
  return (
    <section className="relative bg-background py-24 md:py-32">
      {/* Scattered hand-placed accents */}
      <Asterisk color="purple" size={28} className="absolute left-8 top-20" />
      <Asterisk color="blue" size={44} className="absolute right-10 top-1/3 hidden md:block" />
      <Asterisk color="lime" size={20} className="absolute bottom-16 left-1/3" />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:px-10 lg:grid-cols-12">
        {/* Left vertical column */}
        <aside className="hidden flex-col items-start gap-8 lg:col-span-2 lg:flex">
          <span className="display text-6xl text-foreground">04</span>
          <p className="vertical-rl text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground">
            Client Styling & Consulting
          </p>
          <a href="#" className="pill-solid mt-auto">See Pricing →</a>
        </aside>

        {/* Center: headline + photos */}
        <div className="relative lg:col-span-6">
          <span className="pill mb-6 inline-flex">04 About Me</span>

          <h2 className="display relative text-foreground" style={{ fontSize: "clamp(56px, 11vw, 160px)" }}>
            Designer
            <br />
            <span className="relative inline-block pl-8 text-accent-forest md:pl-20">
              Details
              <span className="absolute -top-4 right-0 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-foreground md:-top-6">
                Since 2018 <Asterisk color="pink" size={16} />
              </span>
            </span>
          </h2>

          <div className="relative mt-12 grid grid-cols-2 gap-6">
            <div className="photo col-start-2" style={{ transform: "rotate(3deg)" }}>
              <img src={portraitPurple} alt="Domingo in purple striped suit against sky" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="photo relative col-span-2 mx-auto mt-4 max-w-md" style={{ transform: "rotate(-90deg) scale(0.9)" }}>
              <img src={portraitBlue} alt="Domingo in blue jacket holding daisies" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <Asterisk color="orange" size={56} className="absolute -bottom-4 left-0" />
          </div>
        </div>

        {/* Right body text */}
        <div className="space-y-6 lg:col-span-4 lg:pt-24">
          <p className="text-sm leading-relaxed text-foreground md:text-base">
            Cultivating wearable art takes time. Every piece returns to the origin of expression,
            driven by the slow, deliberate chaos of manual craftsmanship.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Through this archive, I return to the raw roots of textile art-focusing on the deliberate,
            slow process of hand-stitched garments.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DesignerDetails;
