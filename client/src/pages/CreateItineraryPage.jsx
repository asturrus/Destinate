import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, ArrowLeft, Sparkles, MapPin, Loader2 } from "lucide-react";

import PageShell from "@/components/PageShell";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { destinations } from "@shared/destinations";
import { supabase } from "@/lib/supabaseClient";
import { itineraryService } from "@/lib/itineraryService";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export default function CreateItineraryPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [currentDestination, setCurrentDestination] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data?.session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        toast({
          title: "Sign in required",
          description: "Please sign in to create an itinerary",
          variant: "destructive",
        });
        setLocation("/signin");
      }
    });
  }, [setLocation, toast]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => itineraryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
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

    const dest = destinations.find((d) => d.id === currentDestination);
    if (!dest) return;

    if (selectedDestinations.some((d) => d.id === dest.id)) {
      toast({
        title: "Already added",
        description: "This destination is already in your itinerary",
        variant: "destructive",
      });
      return;
    }

    setSelectedDestinations([
      ...selectedDestinations,
      {
        id: dest.id,
        name: dest.name,
        country: dest.country,
      },
    ]);

    setCurrentDestination("");
  };

  const handleRemoveDestination = (id) => {
    setSelectedDestinations(selectedDestinations.filter((d) => d.id !== id));
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

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create an itinerary",
        variant: "destructive",
      });
      setLocation("/signin");
      return;
    }

    createMutation.mutate({
      ...data,
      destinations: selectedDestinations,
    });
  };

  const titleValue = form.watch("title");
  const descriptionValue = form.watch("description");

  const stats = useMemo(() => {
    const hasTitle = !!titleValue?.trim();
    const hasDesc = !!descriptionValue?.trim();
    return {
      destinations: selectedDestinations.length,
      completeness: `${(hasTitle ? 1 : 0) + (hasDesc ? 1 : 0) + (selectedDestinations.length ? 1 : 0)}/3`,
      ready: hasTitle && selectedDestinations.length > 0,
    };
  }, [titleValue, descriptionValue, selectedDestinations.length]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <PageShell
      title="Create new itinerary"
      subtitle="Build a trip in minutes — add a title, choose destinations, and save it to your account."
      actions={
        <>
          <Button
            variant="outline"
            onClick={() => setLocation("/itineraries")}
            className="bg-transparent text-slate-100 border-white/10 hover:bg-white/5"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Submit button up top (uses the form="..." attribute) */}
          <Button
            type="submit"
            form="create-itinerary-form"
            disabled={createMutation.isPending || !stats.ready}
            className="shadow-lg"
            data-testid="button-submit-top"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create itinerary
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" data-testid="create-itinerary-page">
        {/* Left: Stats / helper panel */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-300">
                  Progress
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  Trip setup
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  A good itinerary usually has a clear title + at least one destination.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white">
                <div className="text-xs text-slate-300">Complete</div>
                <div className="text-lg font-semibold">{stats.completeness}</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-slate-300">Destinations</div>
                <div className="mt-1 text-xl font-semibold text-white">
                  {stats.destinations}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-slate-300">Saved</div>
                <div className="mt-1 text-xl font-semibold text-white">
                  {stats.ready ? "Yes" : "—"}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-slate-300">Status</div>
                <div className="mt-1 text-xl font-semibold text-white">
                  {stats.ready ? "Ready" : "Draft"}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                Saved to your account
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                Easy to edit later
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                Add more destinations anytime
              </span>
            </div>
          </div>
        </div>

        {/* Right: Form card */}
        <div className="lg:col-span-3">
          <Card className="border-white/10 bg-white/5 backdrop-blur shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle data-testid="page-title" className="text-white">
                Create New Itinerary
              </CardTitle>
              <CardDescription className="text-slate-300">
                Plan your next adventure
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  id="create-itinerary-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-7"
                >
                  {/* Title + Description in a nicer layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-slate-200">
                            Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="My Amazing Trip"
                              data-testid="input-title"
                              className="bg-black/20 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500/40"
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
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-slate-200">
                            Description (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your trip..."
                              data-testid="input-description"
                              className="min-h-[96px] bg-black/20 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Destinations */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-slate-200">
                        Destinations
                      </FormLabel>
                      <span className="text-xs text-slate-400">
                        Add at least 1
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select
                        value={currentDestination}
                        onValueChange={setCurrentDestination}
                      >
                        <SelectTrigger
                          className="flex-1 bg-black/20 border-white/10 text-white"
                          data-testid="select-destination"
                        >
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
                        className="shadow-md"
                        data-testid="button-add-destination"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>

                    {/* Selected destination pills */}
                    {selectedDestinations.length > 0 ? (
                      <div className="flex flex-wrap gap-2" data-testid="selected-destinations">
                        {selectedDestinations.map((dest) => (
                          <div
                            key={dest.id}
                            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-100"
                            data-testid={`selected-destination-${dest.id}`}
                          >
                            <MapPin className="w-3.5 h-3.5 text-slate-300" />
                            <span className="font-medium">
                              {dest.name}
                            </span>
                            <span className="text-slate-400">• {dest.country}</span>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveDestination(dest.id)}
                              className="h-7 w-7 rounded-full text-slate-200 hover:bg-white/10"
                              data-testid={`button-remove-${dest.id}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-slate-300">
                          No destinations added yet. Pick one above and hit <span className="text-slate-100 font-medium">Add</span>.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bottom action bar */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                    <div className="text-xs text-slate-400">
                      Tip: You can always add more destinations after creating the itinerary.
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLocation("/itineraries")}
                        className="bg-transparent text-slate-100 border-white/10 hover:bg-white/5"
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        disabled={createMutation.isPending || !stats.ready}
                        className="shadow-lg"
                        data-testid="button-submit"
                      >
                        {createMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Create Itinerary
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
