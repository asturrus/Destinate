import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { destinations } from "@shared/destinations";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export default function CreateItineraryPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [currentDestination, setCurrentDestination] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiRequest('POST', '/api/itineraries', data),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your itinerary has been created.",
      });
      setLocation("/itineraries");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create itinerary",
        variant: "destructive",
      });
    },
  });

  const handleAddDestination = () => {
    if (!currentDestination) return;
    
    const dest = destinations.find(d => d.id === currentDestination);
    if (!dest) return;

    if (selectedDestinations.some(d => d.id === dest.id)) {
      toast({
        title: "Already added",
        description: "This destination is already in your itinerary",
        variant: "destructive",
      });
      return;
    }

    setSelectedDestinations([...selectedDestinations, {
      id: dest.id,
      name: dest.name,
      country: dest.country,
    }]);
    setCurrentDestination("");
  };

  const handleRemoveDestination = (id) => {
    setSelectedDestinations(selectedDestinations.filter(d => d.id !== id));
  };

  const onSubmit = (data) => {
    if (selectedDestinations.length === 0) {
      toast({
        title: "No destinations",
        description: "Please add at least one destination to your itinerary",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({
      ...data,
      destinations: selectedDestinations,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="create-itinerary-page">
      <Card>
        <CardHeader>
          <CardTitle data-testid="page-title">Create New Itinerary</CardTitle>
          <CardDescription>Plan your next adventure</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My Amazing Trip"
                        data-testid="input-title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your trip..."
                        data-testid="input-description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Destinations</FormLabel>
                <div className="flex gap-2">
                  <Select
                    value={currentDestination}
                    onValueChange={setCurrentDestination}
                  >
                    <SelectTrigger className="flex-1" data-testid="select-destination">
                      <SelectValue placeholder="Select a destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((dest) => (
                        <SelectItem
                          key={dest.id}
                          value={dest.id}
                          data-testid={`destination-option-${dest.id}`}
                        >
                          {dest.name}, {dest.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={handleAddDestination}
                    data-testid="button-add-destination"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {selectedDestinations.length > 0 && (
                  <div className="space-y-2" data-testid="selected-destinations">
                    {selectedDestinations.map((dest) => (
                      <div
                        key={dest.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-md"
                        data-testid={`selected-destination-${dest.id}`}
                      >
                        <span className="font-medium">
                          {dest.name}, {dest.country}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDestination(dest.id)}
                          data-testid={`button-remove-${dest.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  data-testid="button-submit"
                >
                  {createMutation.isPending ? "Creating..." : "Create Itinerary"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/itineraries")}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
