import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MapDialog } from "@/components/MapDialog";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { AboutUs } from "@/components/AboutUs";


export default function Home() {
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenMap={() => setIsMapOpen(true)} />
      <main>
        <Hero onOpenMap={() => setIsMapOpen(true)} />
        <Features />
        <AboutUs />
      </main>
      <Footer />
      <MapDialog open={isMapOpen} onOpenChange={setIsMapOpen} />
    </div>
  );
}