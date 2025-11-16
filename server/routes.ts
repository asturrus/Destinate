import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertItinerarySchema } from "@shared/schema";
import { destinations } from "@shared/destinations";

export async function registerRoutes(app: Express): Promise<Server> {
  // Destination search endpoint
  app.get("/api/destinations/search", (req, res) => {
    const query = (req.query.q as string || "").toLowerCase();
    
    if (!query) {
      return res.json(destinations);
    }
    
    const filtered = destinations.filter(dest => 
      dest.name.toLowerCase().includes(query) ||
      dest.country.toLowerCase().includes(query) ||
      dest.description.toLowerCase().includes(query)
    );
    
    res.json(filtered);
  });

  // Get all itineraries
  app.get("/api/itineraries", async (req, res) => {
    try {
      const itineraries = await storage.getAllItineraries();
      res.json(itineraries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single itinerary
  app.get("/api/itineraries/:id", async (req, res) => {
    try {
      const itinerary = await storage.getItinerary(req.params.id);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      res.json(itinerary);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create itinerary
  app.post("/api/itineraries", async (req, res) => {
    try {
      const validatedData = insertItinerarySchema.parse(req.body);
      const itinerary = await storage.createItinerary(validatedData);
      res.status(201).json(itinerary);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete itinerary
  app.delete("/api/itineraries/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteItinerary(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
