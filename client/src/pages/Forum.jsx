import { Header } from "@/components/Header";
import { ForumHero } from "@/components/ForumHero";
import { Footer } from "@/components/Footer";

export default function Forum() {
  return (
    <div id="forum" className="min-h-screen bg-background">
      <Header />
      <main>
        <ForumHero />
      </main>
      <Footer />
    </div>
  );
}