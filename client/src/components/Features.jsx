import { FeatureCard } from "./FeatureCard";
import { MapPin, Building2, Mountain, Crown, Waves, Church } from "lucide-react";

export function Features() {
  const locations = [
    {
      icon: Building2,
      title: "Tokyo, Japan",
      description: "Experience the perfect blend of ancient tradition and cutting-edge technology in Japan's vibrant capital city.",
      backgroundImage: "https://cdn.pixabay.com/photo/2020/04/29/10/16/tokyo-5107832_1280.jpg" // Tokyo night skyline
    },
    {
      icon: Waves,
      title: "Venice, Italy",
      description: "Navigate romantic canals and discover Renaissance art in this unique floating city of bridges and gondolas.",
      backgroundImage: "https://cdn.pixabay.com/photo/2016/11/29/12/30/gondolier-1869380_1280.jpg" // Venice canal at night
    },
    {
      icon: Crown,
      title: "Paris, France",
      description: "Fall in love with the City of Light, from the iconic Eiffel Tower to world-class museums and charming cafés.",
      backgroundImage: "https://cdn.pixabay.com/photo/2018/08/16/09/30/paris-3610492_1280.jpg" // Paris Eiffel Tower at night
    },
    {
      icon: MapPin,
      title: "London, England",
      description: "Explore centuries of history, royal palaces, and modern culture in Britain's cosmopolitan capital.",
      backgroundImage: "https://cdn.pixabay.com/photo/2016/11/29/09/32/london-1868627_1280.jpg" // London Big Ben at night
    },
    {
      icon: Church,
      title: "Amsterdam, Netherlands",
      description: "Cycle through picturesque canals, visit world-renowned museums, and enjoy the laid-back Dutch lifestyle.",
      backgroundImage: "https://cdn.pixabay.com/photo/2016/12/15/12/24/amsterdam-1909003_1280.jpg" // Amsterdam canals at night
    },
    {
      icon: Mountain,
      title: "Santorini, Greece",
      description: "Witness breathtaking sunsets over whitewashed buildings and crystal-clear waters in this Aegean paradise.",
      backgroundImage: "https://cdn.pixabay.com/photo/2016/04/18/22/05/santorini-1338086_1280.jpg" // Santorini at night
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-locations-title">
            Popular Destinations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-locations-description">
            Discover amazing destinations around the world, handpicked by travelers for unforgettable experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <FeatureCard
              key={location.title}
              icon={location.icon}
              title={location.title}
              description={location.description}
              backgroundImage={location.backgroundImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}