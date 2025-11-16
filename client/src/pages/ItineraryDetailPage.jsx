import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ItineraryDetailPage() {
  const [, params] = useRoute("/itineraries/:id");
  const itineraryId = params?.id;

  const { data: itinerary, isLoading, error } = useQuery({
    queryKey: ['/api/itineraries', itineraryId],
    enabled: !!itineraryId,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading itinerary...</div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Itinerary not found</CardTitle>
            <CardDescription>
              The itinerary you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/itineraries">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Itineraries
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="itinerary-detail-page">
      <div className="mb-6">
        <Link href="/itineraries">
          <Button variant="ghost" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Itineraries
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl" data-testid="itinerary-title">
            {itinerary.title}
          </CardTitle>
          {itinerary.description && (
            <CardDescription className="text-base" data-testid="itinerary-description">
              {itinerary.description}
            </CardDescription>
          )}
          <div className="flex items-center text-sm text-muted-foreground pt-2">
            <Calendar className="w-4 h-4 mr-2" />
            Created on {new Date(itinerary.createdAt).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Destinations</h3>
            <div className="space-y-3" data-testid="destinations-list">
              {itinerary.destinations.map((dest, index) => (
                <div
                  key={dest.id}
                  className="flex items-start gap-3 p-4 bg-muted rounded-lg"
                  data-testid={`destination-item-${dest.id}`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-lg" data-testid={`destination-name-${dest.id}`}>
                          {dest.name}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`destination-country-${dest.id}`}>
                          {dest.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
