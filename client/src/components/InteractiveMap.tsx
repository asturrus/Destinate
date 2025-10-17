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
  const markers = useRef<Map<string, maplibregl.Marker>>(new Map());

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize MapLibre GL map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [10, 30],
      zoom: 2,
      minZoom: 1,
      maxZoom: 18
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when destinations or selection changes
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current.clear();

    // Create markers for each destination
    destinations.forEach(destination => {
      const isSelected = selectedDestinations.includes(destination.id);
      const isHighlighted = highlightedDestination === destination.id;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s';
      
      // Set marker color based on state
      if (isHighlighted) {
        el.style.backgroundColor = '#3b82f6';
        el.style.transform = 'scale(1.3)';
      } else if (isSelected) {
        el.style.backgroundColor = '#3b82f6';
      } else {
        el.style.backgroundColor = '#94a3b8';
      }
      
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

      // Add destination name label
      const label = document.createElement('div');
      label.textContent = destination.name;
      label.style.position = 'absolute';
      label.style.top = '40px';
      label.style.left = '50%';
      label.style.transform = 'translateX(-50%)';
      label.style.whiteSpace = 'nowrap';
      label.style.fontSize = '12px';
      label.style.fontWeight = 'bold';
      label.style.color = '#0f172a';
      label.style.backgroundColor = '#ffffff';
      label.style.padding = '2px 8px';
      label.style.borderRadius = '4px';
      label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      label.style.pointerEvents = 'none';
      el.appendChild(label);

      // Create and add marker
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([destination.coordinates.lng, destination.coordinates.lat])
        .addTo(map.current!);

      // Add click handler
      el.addEventListener('click', () => {
        if (onDestinationClick) {
          onDestinationClick(destination.id);
        }
      });

      // Store marker reference
      markers.current.set(destination.id, marker);
    });
  }, [destinations, selectedDestinations, highlightedDestination, onDestinationClick]);

  // Draw routes between selected destinations
  useEffect(() => {
    if (!map.current || !showRoute || selectedDestinations.length < 2) {
      // Remove route layer if it exists
      if (map.current?.getLayer('route')) {
        map.current.removeLayer('route');
      }
      if (map.current?.getSource('route')) {
        map.current.removeSource('route');
      }
      return;
    }

    // Wait for map to be loaded
    if (!map.current.isStyleLoaded()) {
      const handler = () => {
        drawRoute();
        map.current?.off('load', handler);
      };
      map.current.on('load', handler);
      return;
    }

    drawRoute();

    function drawRoute() {
      if (!map.current) return;

      // Get coordinates of selected destinations in order
      const coordinates = selectedDestinations
        .map(id => destinations.find(d => d.id === id))
        .filter((d): d is Destination => d !== undefined)
        .map(d => [d.coordinates.lng, d.coordinates.lat]);

      if (coordinates.length < 2) return;

      // Remove existing route if any
      if (map.current.getLayer('route')) {
        map.current.removeLayer('route');
      }
      if (map.current.getSource('route')) {
        map.current.removeSource('route');
      }

      // Add route source and layer
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 3,
          'line-opacity': 0.7
        }
      });

      // Fit map to show all selected destinations
      if (coordinates.length > 0) {
        const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord as [number, number]);
        }, new maplibregl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]));

        map.current.fitBounds(bounds, {
          padding: 100,
          maxZoom: 6
        });
      }
    }
  }, [destinations, selectedDestinations, showRoute]);

  // Fly to highlighted destination
  useEffect(() => {
    if (!map.current || !highlightedDestination) return;

    const destination = destinations.find(d => d.id === highlightedDestination);
    if (destination) {
      map.current.flyTo({
        center: [destination.coordinates.lng, destination.coordinates.lat],
        zoom: 8,
        duration: 1500
      });
    }
  }, [highlightedDestination, destinations]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      data-testid="map-container"
    />
  );
}
