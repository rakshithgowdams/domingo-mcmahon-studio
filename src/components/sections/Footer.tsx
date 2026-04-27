import { useState } from "react";
import { Asterisk } from "../Asterisk";

export const Footer = () => {
  const [email, setEmail] = useState("");
  return (
    <footer className="grid grid-cols-1 lg:grid-cols-10">
      {/* Left black column */}
      <div className="relative bg-foreground p-8 text-white lg:col-span-3 lg:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">Follow Me On</p>
        <ul className="mt-4 space-y-1 text-base">
          {["Facebook", "Instagram", "Tik tok"].map((s) => (
            <li key={s}>
              <a href="#" className="story-link transition-opacity hover:opacity-70">{s}</a>
            </li>
          ))}
        </ul>
        <Asterisk color="yellow" size={36} className="absolute right-8 top-10" />

        <div className="mt-12">
          <p className="display text-3xl text-white md:text-4xl">Be Part of<br />The Story</p>
          <p className="mt-3 text-xs text-white/70">Updates on new drops, collaborations, and events.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
            className="mt-4 flex overflow-hidden rounded-full bg-white p-1"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 bg-transparent px-4 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="rounded-full bg-foreground px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-80">
              Subscribe
            </button>
          </form>
        </div>

        <p className="mt-16 text-[11px] uppercase tracking-[0.25em] text-white/60">Let's Stay Connected</p>
      </div>

      {/* Right white column */}
      <div className="relative flex flex-col justify-between bg-background p-8 lg:col-span-7 lg:p-10">
        <div className="relative">
          <Asterisk color="blue" size={56} className="absolute -left-2 top-2" />
          <h2
            className="display text-accent-forest"
            style={{ fontSize: "clamp(96px, 22vw, 360px)", lineHeight: "0.82", letterSpacing: "-0.05em" }}
          >
            Silhouette
          </h2>
        </div>

        <div className="mt-10">
          <div className="h-px w-full bg-foreground" />
          <div className="flex flex-col items-start justify-between gap-3 pt-4 text-[11px] uppercase tracking-wider text-foreground sm:flex-row sm:items-center">
            <p>© 2026 Domingo McMahon Portfolio. All rights reserved.</p>
            <a href="#" className="story-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
