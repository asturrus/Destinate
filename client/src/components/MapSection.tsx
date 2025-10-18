import { InteractiveMap } from './InteractiveMap';

export function MapSection() {
  return (
    <section id="map" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Explore Destinations</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Click on any marker to discover amazing destinations around the world
          </p>
        </div>
        
        <div className="w-full h-[600px] rounded-lg overflow-hidden border shadow-lg">
          <InteractiveMap />
        </div>
      </div>
    </section>
  );
}
