import { useState } from 'react';
import { X, MapPin, Route, Sparkles, Navigation, Info } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractiveMap } from './InteractiveMap';
import { destinations, getRandomDestination, calculateTripDistance, type Destination } from '@shared/destinations';

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MapModal({ open, onOpenChange }: MapModalProps) {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [highlightedDestination, setHighlightedDestination] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'explore' | 'planner' | 'inspire'>('explore');
  const [inspirationDestination, setInspirationDestination] = useState<Destination | null>(null);

  const handleDestinationToggle = (destinationId: string) => {
    setSelectedDestinations(prev => {
      if (prev.includes(destinationId)) {
        return prev.filter(id => id !== destinationId);
      }
      return [...prev, destinationId];
    });
  };

  const handleSurpriseMe = () => {
    const randomDest = getRandomDestination(selectedDestinations);
    if (randomDest) {
      setInspirationDestination(randomDest);
      setHighlightedDestination(randomDest.id);
      setActiveTab('inspire');
    }
  };

  const clearTripPlan = () => {
    setSelectedDestinations([]);
  };

  const selectedDests = destinations.filter(d => selectedDestinations.includes(d.id));
  const totalDistance = calculateTripDistance(selectedDestinations);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 gap-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold" data-testid="text-map-modal-title">Explore Destinations</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSurpriseMe}
                data-testid="button-surprise-me"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Surprise Me
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onOpenChange(false)}
                data-testid="button-close-map"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Map Section */}
            <div className="flex-1 relative">
              <InteractiveMap
                destinations={destinations}
                selectedDestinations={selectedDestinations}
                onDestinationClick={handleDestinationToggle}
                highlightedDestination={highlightedDestination}
                showRoute={activeTab === 'planner' && selectedDestinations.length > 1}
              />
            </div>

            {/* Side Panel */}
            <div className="w-96 border-l flex flex-col">
              <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as 'explore' | 'planner' | 'inspire')} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
                  <TabsTrigger value="explore" data-testid="tab-explore">
                    <Info className="h-4 w-4 mr-2" />
                    Explore
                  </TabsTrigger>
                  <TabsTrigger value="planner" data-testid="tab-planner">
                    <Route className="h-4 w-4 mr-2" />
                    Plan Trip
                  </TabsTrigger>
                  <TabsTrigger value="inspire" data-testid="tab-inspire">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Inspire
                  </TabsTrigger>
                </TabsList>

                {/* Explore Tab */}
                <TabsContent value="explore" className="flex-1 mt-0">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">All Destinations</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Click on a destination to learn more
                        </p>
                      </div>
                      {destinations.map((dest) => (
                        <Card 
                          key={dest.id}
                          className="hover-elevate active-elevate-2 cursor-pointer"
                          onClick={() => {
                            setHighlightedDestination(dest.id);
                            handleDestinationToggle(dest.id);
                          }}
                          data-testid={`card-destination-${dest.id}`}
                        >
                          <CardHeader className="p-4">
                            <CardTitle className="text-base flex items-center justify-between">
                              <span>{dest.name}, {dest.country}</span>
                              {selectedDestinations.includes(dest.id) && (
                                <Badge variant="default" data-testid={`badge-selected-${dest.id}`}>Selected</Badge>
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground mb-3">{dest.description}</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs">
                                <Navigation className="h-3 w-3" />
                                <span>Best time: {dest.bestTimeToVisit}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {dest.highlights.slice(0, 3).map((highlight, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Trip Planner Tab */}
                <TabsContent value="planner" className="flex-1 mt-0">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Plan Your Route</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select destinations to create your itinerary
                        </p>
                      </div>

                      {selectedDests.length === 0 ? (
                        <Card>
                          <CardContent className="p-6 text-center">
                            <Route className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              No destinations selected. Switch to Explore tab to add destinations.
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <>
                          <Card>
                            <CardHeader className="p-4">
                              <CardTitle className="text-base">Trip Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Destinations:</span>
                                <span className="font-medium" data-testid="text-trip-destination-count">
                                  {selectedDests.length}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Distance:</span>
                                <span className="font-medium" data-testid="text-trip-distance">
                                  {totalDistance.toLocaleString()} km
                                </span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full mt-2"
                                onClick={clearTripPlan}
                                data-testid="button-clear-trip"
                              >
                                Clear Trip
                              </Button>
                            </CardContent>
                          </Card>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Your Itinerary</h4>
                            {selectedDests.map((dest, index) => (
                              <Card key={dest.id} data-testid={`card-itinerary-${dest.id}`}>
                                <CardContent className="p-3 flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{dest.name}</p>
                                    <p className="text-xs text-muted-foreground">{dest.country}</p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDestinationToggle(dest.id)}
                                    data-testid={`button-remove-${dest.id}`}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Inspiration Tab */}
                <TabsContent value="inspire" className="flex-1 mt-0">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Get Inspired</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Discover your next adventure
                        </p>
                      </div>

                      {selectedDestinations.length === destinations.length ? (
                        <Card>
                          <CardContent className="p-6 text-center">
                            <Sparkles className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-4">
                              You've selected all destinations! Remove some from your trip to discover more.
                            </p>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setSelectedDestinations([]);
                                setActiveTab('explore');
                              }}
                              data-testid="button-clear-all"
                            >
                              Clear All Destinations
                            </Button>
                          </CardContent>
                        </Card>
                      ) : inspirationDestination ? (
                        <Card data-testid="card-inspiration-result">
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">
                              {inspirationDestination.name}, {inspirationDestination.country}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 space-y-4">
                            <p className="text-sm">{inspirationDestination.description}</p>
                            
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Best Time to Visit</h4>
                              <p className="text-sm text-muted-foreground">
                                {inspirationDestination.bestTimeToVisit}
                              </p>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold mb-2">Top Highlights</h4>
                              <ul className="space-y-1">
                                {inspirationDestination.highlights.map((highlight, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                    <MapPin className="h-3 w-3" />
                                    {highlight}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold mb-2">Travel Tips</h4>
                              <ul className="space-y-1">
                                {inspirationDestination.travelTips.map((tip, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground">
                                    • {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                className="flex-1"
                                onClick={() => {
                                  handleDestinationToggle(inspirationDestination.id);
                                  setActiveTab('planner');
                                }}
                                data-testid="button-add-to-trip"
                              >
                                Add to Trip
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={handleSurpriseMe}
                                data-testid="button-try-another"
                              >
                                Try Another
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card>
                          <CardContent className="p-6 text-center">
                            <Sparkles className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-4">
                              Click "Surprise Me" to discover a random destination
                            </p>
                            <Button onClick={handleSurpriseMe} data-testid="button-inspire-surprise">
                              <Sparkles className="h-4 w-4 mr-2" />
                              Surprise Me
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
