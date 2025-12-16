import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Plus, Trash2, Calendar, MapPin, Sparkles, ArrowRight } from "lucide-react";

import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { itineraryService } from "@/lib/itineraryService";

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-300">{label}</p>
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
          <Icon className="h-4 w-4 text-slate-200" />
        </div>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
        {value}
      </div>
    </div>
  );
}

export default function ItinerariesPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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
          description: "Please sign in to view your itineraries",
          variant: "destructive",
        });
        setLocation("/signin");
      }
    });
  }, [setLocation, toast]);

  const { data: itineraries, isLoading } = useQuery({
    queryKey: ["itineraries", user?.id],
    queryFn: () => itineraryService.getAll(),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => itineraryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries", user?.id] });
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
    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      deleteMutation.mutate(id);
    }
  };

  const stats = useMemo(() => {
    const list = itineraries ?? [];
    const totalItineraries = list.length;

    const totalDestinations = list.reduce((sum, it) => {
      const n = Array.isArray(it?.destinations) ? it.destinations.length : 0;
      return sum + n;
    }, 0);

    const latest = list
      .map((it) => ({
        id: it.id,
        createdAt: it.createdAt ? new Date(it.createdAt) : null,
      }))
      .filter((x) => x.createdAt instanceof Date && !isNaN(x.createdAt))
      .sort((a, b) => b.createdAt - a.createdAt)[0]?.createdAt;

    return {
      totalItineraries,
      totalDestinations,
      latestLabel: latest ? latest.toLocaleDateString() : "—",
    };
  }, [itineraries]);

  if (authLoading || isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-slate-200">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const hasItineraries = Array.isArray(itineraries) && itineraries.length > 0;

  return (
    <PageShell
      title="My Itineraries"
      subtitle="Plan, organize, and revisit your trips — everything in one place."
      actions={
        <Link href="/itineraries/create">
          <Button className="rounded-xl px-4 shadow-lg shadow-blue-500/10">
            <Plus className="w-4 h-4 mr-2" />
            Create itinerary
          </Button>
        </Link>
      }
    >
      {/* Stats row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total itineraries" value={stats.totalItineraries} icon={Sparkles} />
        <StatCard label="Total destinations" value={stats.totalDestinations} icon={MapPin} />
        <StatCard label="Latest created" value={stats.latestLabel} icon={Calendar} />
      </div>

      {!hasItineraries ? (
        <Card
          data-testid="empty-state"
          className="rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]"
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <MapPin className="h-5 w-5 text-slate-100" />
                </div>
                <div>
                  <CardTitle className="text-white">No itineraries yet</CardTitle>
                  <CardDescription className="text-slate-300">
                    Create your first itinerary to start planning your travels.
                  </CardDescription>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Saved to your account
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Easy to edit later
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-300">
                Start with a title, add destinations, and build a day-by-day plan.
              </div>

              <Link href="/itineraries/create">
                <Button className="w-full sm:w-auto rounded-xl px-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first itinerary
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="itineraries-grid"
        >
          {itineraries.map((itinerary) => {
            const destCount = Array.isArray(itinerary?.destinations)
              ? itinerary.destinations.length
              : 0;

            return (
              <Card
                key={itinerary.id}
                className="group rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm transition
                           hover:-translate-y-1 hover:bg-white/7 hover:shadow-[0_18px_55px_-30px_rgba(0,0,0,0.9)]"
                data-testid={`itinerary-card-${itinerary.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-white">
                      <Link href={`/itineraries/${itinerary.id}`}>
                        <span
                          className="cursor-pointer hover:text-blue-200 transition"
                          data-testid={`itinerary-title-${itinerary.id}`}
                        >
                          {itinerary.title}
                        </span>
                      </Link>
                    </CardTitle>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(itinerary.id)}
                      className="rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5"
                      data-testid={`button-delete-${itinerary.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-300" />
                    </Button>
                  </div>

                  {itinerary.description && (
                    <CardDescription
                      className="text-slate-300"
                      data-testid={`itinerary-description-${itinerary.id}`}
                    >
                      {itinerary.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-slate-200" />
                      {itinerary.createdAt
                        ? new Date(itinerary.createdAt).toLocaleDateString()
                        : "—"}
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                      {destCount} destination{destCount !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(itinerary.destinations ?? []).slice(0, 3).map((dest, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                        data-testid={`destination-tag-${dest.id ?? idx}`}
                      >
                        {dest.name}
                      </span>
                    ))}

                    {destCount > 3 && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        +{destCount - 3} more
                      </span>
                    )}
                  </div>

                  <div className="mt-5">
                    <Link href={`/itineraries/${itinerary.id}`}>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-white/10 bg-transparent text-slate-100
                                   hover:bg-white/5 hover:text-white"
                      >
                        View itinerary
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
