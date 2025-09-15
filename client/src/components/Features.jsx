import { FeatureCard } from "./FeatureCard";
import { MapPin, Building2, Mountain, Crown, Waves, Church } from "lucide-react";

export function Features() {
  const locations = [
    {
      icon: Building2,
      title: "Tokyo, Japan",
      description: "Experience the perfect blend of ancient tradition and cutting-edge technology in Japan's vibrant capital city.",
      backgroundGradient: "bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-800" // Tokyo neon lights
    },
    {
      icon: Waves,
      title: "Venice, Italy",
      description: "Navigate romantic canals and discover Renaissance art in this unique floating city of bridges and gondolas.",
      backgroundGradient: "bg-gradient-to-br from-blue-600 via-teal-700 to-green-800" // Venice canals
    },
    {
      icon: Crown,
      title: "Paris, France",
      description: "Fall in love with the City of Light, from the iconic Eiffel Tower to world-class museums and charming cafés.",
      backgroundGradient: "bg-gradient-to-br from-yellow-500 via-orange-600 to-pink-700" // Paris golden lights
    },
    {
      icon: MapPin,
      title: "London, England",
      description: "Explore centuries of history, royal palaces, and modern culture in Britain's cosmopolitan capital.",
      backgroundGradient: "bg-gradient-to-br from-gray-600 via-blue-700 to-slate-900" // London evening fog
    },
    {
      icon: Church,
      title: "Amsterdam, Netherlands",
      description: "Cycle through picturesque canals, visit world-renowned museums, and enjoy the laid-back Dutch lifestyle.",
      backgroundGradient: "bg-gradient-to-br from-orange-500 via-red-600 to-purple-800" // Amsterdam sunset
    },
    {
      icon: Mountain,
      title: "Santorini, Greece",
      description: "Witness breathtaking sunsets over whitewashed buildings and crystal-clear waters in this Aegean paradise.",
      backgroundGradient: "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600" // Santorini sunset
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
              backgroundGradient={location.backgroundGradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
}