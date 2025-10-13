import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Destination } from '@shared/destinations';

interface InteractiveMapProps {
  destinations: Destination[];
  selectedDestinations: string[];
  onDestinationClick?: (destinationId: string) => void;
  highlightedDestination?: string | null;
  showRoute?: boolean;
}

export function InteractiveMap({
  destinations,
  selectedDestinations,
  onDestinationClick,
  highlightedDestination,
  showRoute = false
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // TODO: Initialize MapLibre GL map here
    // Example starter code:
    
    // map.current = new maplibregl.Map({
    //   container: mapContainer.current,
    //   style: 'https://demotiles.maplibre.org/style.json', // or your custom style
    //   center: [0, 20], // Starting position [lng, lat]
    //   zoom: 1.5
    // });

    // TODO: Add markers for each destination
    // destinations.forEach(destination => {
    //   const marker = new maplibregl.Marker()
    //     .setLngLat([destination.coordinates.lng, destination.coordinates.lat])
    //     .addTo(map.current!);
    // });

    // TODO: Handle selected destinations highlighting

    // TODO: Draw routes if showRoute is true and selectedDestinations has multiple items

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [destinations, selectedDestinations, highlightedDestination, showRoute]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      data-testid="map-container"
    />
  );
}
