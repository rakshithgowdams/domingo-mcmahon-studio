import { Hero } from "@/components/sections/Hero";
import { Archive } from "@/components/sections/Archive";
import { DesignerDetails } from "@/components/sections/DesignerDetails";
import { Atelier } from "@/components/sections/Atelier";
import { ClarityCTA } from "@/components/sections/ClarityCTA";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Domingo McMahon — Tailored for Individual Expression</h1>
      <Hero />
      <Archive />
      <DesignerDetails />
      <Atelier />
      <ClarityCTA />
      <Footer />
    </main>
  );
};

export default Index;
