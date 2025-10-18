import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { destinations, type Destination } from '@shared/destinations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function InteractiveMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Map<string, maplibregl.Marker>>(new Map());
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
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

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('MapLibre GL error:', e);
        setMapError('Map failed to load. WebGL may not be supported in your browser.');
      });
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setMapError('Map initialization failed. WebGL may not be supported in your browser.');
    }

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add markers for destinations
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current.clear();

    // Create markers for each destination
    destinations.forEach(destination => {
      const isSelected = selectedDestination?.id === destination.id;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s';
      el.style.backgroundColor = isSelected ? '#3b82f6' : '#6366f1';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

      if (isSelected) {
        el.style.transform = 'scale(1.3)';
      }

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
        setSelectedDestination(destination);
        // Fly to destination
        map.current?.flyTo({
          center: [destination.coordinates.lng, destination.coordinates.lat],
          zoom: 8,
          duration: 1500
        });
      });

      // Store marker reference
      markers.current.set(destination.id, marker);
    });
  }, [selectedDestination]);

  // Filter destinations based on search query
  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDestination = (destination: Destination) => {
    setSelectedDestination(destination);
    setSearchQuery('');
    setShowSearchResults(false);
    // Fly to destination
    map.current?.flyTo({
      center: [destination.coordinates.lng, destination.coordinates.lat],
      zoom: 8,
      duration: 1500
    });
  };

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Map Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {mapError}
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Available Destinations:</h4>
              <div className="grid grid-cols-2 gap-2">
                {destinations.map(dest => (
                  <Button
                    key={dest.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDestination(dest)}
                    data-testid={`button-destination-${dest.id}`}
                  >
                    {dest.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        data-testid="map-container"
      />
      
      {/* Search Bar */}
      <div className="absolute top-4 right-4 w-80 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
            }}
            onFocus={() => setShowSearchResults(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            className="pl-10 bg-background shadow-lg"
            data-testid="input-search-destination"
          />
          
          {/* Search Results Dropdown */}
          {showSearchResults && filteredDestinations.length > 0 && (
            <Card className="absolute top-full mt-2 w-full shadow-lg max-h-60 overflow-auto">
              <CardContent className="p-2">
                {filteredDestinations.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => handleSelectDestination(dest)}
                    className="w-full text-left px-3 py-2 rounded-md hover-elevate active-elevate-2 flex items-center gap-2"
                    data-testid={`search-result-${dest.id}`}
                  >
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{dest.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{dest.country}</div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* No Results */}
          {showSearchResults && searchQuery && filteredDestinations.length === 0 && (
            <Card className="absolute top-full mt-2 w-full shadow-lg">
              <CardContent className="p-4 text-center text-sm text-muted-foreground">
                No destinations found
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Destination info card */}
      {selectedDestination && (
        <Card className="absolute top-4 left-4 w-80 max-h-[80%] overflow-auto shadow-lg z-10">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{selectedDestination.name}</CardTitle>
                <Badge variant="secondary" className="mt-1">{selectedDestination.country}</Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSelectedDestination(null)}
                data-testid="button-close-info"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedDestination.description}
            </p>
            
            <div>
              <h4 className="text-sm font-semibold mb-2">Top Highlights</h4>
              <ul className="space-y-1">
                {selectedDestination.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-sm flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-primary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-1">Best Time to Visit</h4>
              <p className="text-sm text-muted-foreground">
                {selectedDestination.bestTimeToVisit}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
