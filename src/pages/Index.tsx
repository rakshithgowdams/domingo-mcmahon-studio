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

const Index = () => {
  // First-visit-only preloader (sessionStorage gate)
  const [preloading, setPreloading] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("dm_preloaded") !== "1";
  });

  // Lock scroll while preloader is showing
  useEffect(() => {
    const lenis = getLenis();
    if (preloading) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
      sessionStorage.setItem("dm_preloaded", "1");
    }
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
