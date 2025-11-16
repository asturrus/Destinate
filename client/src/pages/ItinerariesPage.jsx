import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ItinerariesPage() {
  const { toast } = useToast();

  const { data: itineraries, isLoading } = useQuery({
    queryKey: ['/api/itineraries'],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest('DELETE', `/api/itineraries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/itineraries'] });
      toast({
        title: "Itinerary deleted",
        description: "Your itinerary has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete itinerary. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading itineraries...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="itineraries-page">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" data-testid="page-title">My Itineraries</h1>
          <p className="text-muted-foreground">Manage your travel plans</p>
        </div>
        <Link href="/itineraries/create">
          <Button data-testid="button-create-itinerary">
            <Plus className="w-4 h-4 mr-2" />
            Create Itinerary
          </Button>
        </Link>
      </div>

      {!itineraries || itineraries.length === 0 ? (
        <Card data-testid="empty-state">
          <CardHeader>
            <CardTitle>No itineraries yet</CardTitle>
            <CardDescription>
              Create your first itinerary to start planning your travels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/itineraries/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Itinerary
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="itineraries-grid">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="hover-elevate" data-testid={`itinerary-card-${itinerary.id}`}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <Link href={`/itineraries/${itinerary.id}`}>
                    <span className="hover:text-primary cursor-pointer" data-testid={`itinerary-title-${itinerary.id}`}>
                      {itinerary.title}
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(itinerary.id)}
                    data-testid={`button-delete-${itinerary.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </CardTitle>
                {itinerary.description && (
                  <CardDescription data-testid={`itinerary-description-${itinerary.id}`}>
                    {itinerary.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(itinerary.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm" data-testid={`itinerary-destinations-${itinerary.id}`}>
                    <strong>{itinerary.destinations.length}</strong> destination{itinerary.destinations.length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {itinerary.destinations.slice(0, 3).map((dest, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-muted px-2 py-1 rounded-md"
                        data-testid={`destination-tag-${dest.id}`}
                      >
                        {dest.name}
                      </span>
                    ))}
                    {itinerary.destinations.length > 3 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{itinerary.destinations.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
