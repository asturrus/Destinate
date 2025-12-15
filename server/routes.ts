import type { Express } from "express";
import { createServer, type Server } from "http";
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

  const httpServer = createServer(app);

  return httpServer;
}
