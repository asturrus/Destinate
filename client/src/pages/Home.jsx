import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MapSection } from "@/components/MapSection";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { AboutUs } from "@/components/AboutUs";


export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <MapSection />
        <Features />
        <AboutUs />
      </main>
      <Footer />
    </div>
  );
}