import { useState } from "react";
import { DiscussionCard } from "@/components/DiscussionCard";
import { DiscussionPage } from "@/components/DiscussionPage";

export function PopularDiscussions() {
  const [selected, setSelected] = useState(null);

  const discussions = [
    { title: "Best food spots in Tokyo?", author: "Ethan", replies: 12, date: "Sep 20" },
    { title: "Hidden gems in Venice canals", author: "Ethan", replies: 5, date: "Sep 19" },
    { title: "Romantic places in Paris", author: "Ethan", replies: 9, date: "Sep 18" },
    { title: "Budget travel tips for London", author: "Ethan", replies: 7, date: "Sep 17" },
  ];

  if (selected) {
    return <DiscussionPage discussion={selected} onBack={() => setSelected(null)}/>;
  }

  return (
    <section className="py-12 px-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Popular Discussions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {discussions.map((disc, i) => (
          <DiscussionCard
            key={i}
            discussion={disc}
            onClick={() => setSelected(disc)}
          />
        ))}
      </div>
    </section>
  );
}
