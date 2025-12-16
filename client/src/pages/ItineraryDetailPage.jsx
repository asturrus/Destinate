import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { itineraryService } from "@/lib/itineraryService";
import PageShell from "@/components/PageShell";

export default function ItineraryDetailPage() {
  const [, params] = useRoute("/itineraries/:id");
  const itineraryId = params?.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data?.session?.user ?? null;
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) {
        toast({
          title: "Sign in required",
          description: "Please sign in to view this itinerary",
          variant: "destructive",
        });
        setLocation("/signin");
      }
    });
  }, [setLocation, toast]);

  const { data: itinerary, isLoading, error } = useQuery({
    queryKey: ["itineraries", itineraryId],
    queryFn: () => itineraryService.getById(itineraryId),
    enabled: !!itineraryId && !!user?.id,
  });

  // Loading state
  if (authLoading || isLoading) {
    return (
      <PageShell title="Loading itinerary…" subtitle="Fetching your trip details.">
        <div className="mx-auto max-w-4xl">
          <Card className="border-white/10 bg-white/5 shadow-xl">
            <CardContent className="py-10">
              <div className="text-center text-slate-300">Loading…</div>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    );
  }

  if (!user) return null;

  // Not found / error state
  if (error || !itinerary) {
    return (
      <PageShell
        title="Itinerary not found"
        subtitle="It may not exist, or you may not have access."
        actions={
          <Link href="/itineraries">
            <Button variant="secondary" className="bg-white/10 hover:bg-white/15 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Itineraries
            </Button>
          </Link>
        }
      >
        <div className="mx-auto max-w-4xl">
          <Card className="border-white/10 bg-white/5 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Couldn’t load itinerary</CardTitle>
              <CardDescription className="text-slate-300">
                Try going back and selecting another itinerary.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </PageShell>
    );
  }

  const createdDate = itinerary?.createdAt
    ? new Date(itinerary.createdAt).toLocaleDateString()
    : "";

  const destinationCount = itinerary?.destinations?.length ?? 0;

  return (
    <PageShell
      title={itinerary.title}
      subtitle={itinerary.description || "Your saved trip details and destinations."}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/itineraries">
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/15 text-white"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      }
    >
      <div className="mx-auto max-w-4xl" data-testid="itinerary-detail-page">
        {/* Top meta row */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-white/10 bg-white/5 shadow-lg">
            <CardContent className="py-5">
              <div className="text-xs uppercase tracking-wide text-slate-300">
                Destinations
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {destinationCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 shadow-lg sm:col-span-2">
            <CardContent className="py-5">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Created on <span className="text-white/90">{createdDate}</span>
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                This itinerary is saved to your account.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main card */}
        <Card className="border-white/10 bg-white/5 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Destinations
            </CardTitle>
            <CardDescription className="text-slate-300">
              Your trip route in order — click an itinerary from the list to revisit it anytime.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3" data-testid="destinations-list">
              {itinerary.destinations.map((dest, index) => (
                <div
                  key={dest.id}
                  className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-4 shadow-sm transition hover:bg-white/8"
                  data-testid={`destination-item-${dest.id}`}
                >
                  {/* Number badge */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 text-blue-200 border border-blue-500/20 font-semibold">
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-blue-300 mt-0.5" />
                      <div>
                        <p
                          className="text-white font-semibold leading-tight"
                          data-testid={`destination-name-${dest.id}`}
                        >
                          {dest.name}
                        </p>
                        <p
                          className="text-sm text-slate-300"
                          data-testid={`destination-country-${dest.id}`}
                        >
                          {dest.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom hint */}
            <div className="mt-5 text-xs text-slate-400">
              Tip: Create more itineraries to compare trip ideas side-by-side.
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
