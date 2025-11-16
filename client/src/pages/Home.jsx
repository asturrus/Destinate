import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { AboutUs } from "@/components/AboutUs";


export default function Home({ onOpenMap }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero onOpenMap={onOpenMap} />
        <Features />
        <AboutUs />
      </main>
      <Footer />
    </div>
  );
}