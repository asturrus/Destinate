import { Header } from "@/components/Header";
import { ForumHero } from "@/components/ForumHero";
import { Footer } from "@/components/Footer";
import { PopularDiscussions } from "@/components/PopularDiscussions";

export default function Forum({ onOpenMap }) {
  return (
    <div id="forum" className="min-h-screen bg-background">
      <Header onOpenMap={onOpenMap} />
      <main>
        <ForumHero />
        <PopularDiscussions />
      </main>
      <Footer />
    </div>
  );
}