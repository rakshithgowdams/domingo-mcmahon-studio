import { useEffect, useState } from "react";
import { Preloader } from "@/components/sections/Preloader";
import { Hero } from "@/components/sections/Hero";
import { Archive } from "@/components/sections/Archive";
import { Marquee } from "@/components/sections/Marquee";
import { Designer } from "@/components/sections/Designer";
import { WorkStrip } from "@/components/sections/WorkStrip";
import { Atelier } from "@/components/sections/Atelier";
import { CTABanner } from "@/components/sections/CTABanner";
import { Footer } from "@/components/sections/Footer";
import { getLenis } from "@/lib/lenis";
import { ScrollTrigger } from "@/lib/gsap";

const Index = () => {
  // First-visit-only preloader (sessionStorage gate)
  const [preloading, setPreloading] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("dm_preloaded") !== "1";
  });

  // Lock scroll while preloader is showing, unlock cleanly afterwards.
  // We touch THREE things to guarantee no scroll leaks on any platform:
  //   1. Lenis smooth-scroll loop (stop/start)
  //   2. document.body overflow (covers iOS Safari edge cases)
  //   3. document.documentElement overflow (covers some Android browsers)
  // Then we ScrollTrigger.refresh() so any triggers that measured during
  // the locked state (with hidden scrollbar) re-measure correctly.
  useEffect(() => {
    const lenis = getLenis();
    const html = document.documentElement;
    const body = document.body;

    if (preloading) {
      lenis?.stop();
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      lenis?.start();
      body.style.overflow = "";
      html.style.overflow = "";
      sessionStorage.setItem("dm_preloaded", "1");
      // Scroll back to top in case browser restored a position while locked,
      // then refresh triggers against the now-unlocked layout.
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true });
      // Defer one frame so layout settles before measuring.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    // Belt-and-braces cleanup if the page unmounts mid-preload.
    return () => {
      body.style.overflow = "";
      html.style.overflow = "";
      lenis?.start();
    };
  }, [preloading]);

  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Domingo McMahon — Tailored for Individual Expression</h1>

      {preloading && <Preloader onComplete={() => setPreloading(false)} />}

      <Hero ready={!preloading} />
      <Archive />
      <Marquee />
      <Designer />
      <WorkStrip />
      <Atelier />
      <CTABanner />
      <Footer />
    </main>
  );
};

export default Index;
