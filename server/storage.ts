import { type User, type InsertUser, type Itinerary, type InsertItinerary } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getItinerary(id: string): Promise<Itinerary | undefined>;
  getAllItineraries(): Promise<Itinerary[]>;
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;
  deleteItinerary(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private itineraries: Map<string, Itinerary>;

  constructor() {
    this.users = new Map();
    this.itineraries = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getItinerary(id: string): Promise<Itinerary | undefined> {
    return this.itineraries.get(id);
  }

  async getAllItineraries(): Promise<Itinerary[]> {
    return Array.from(this.itineraries.values());
  }

  async createItinerary(insertItinerary: InsertItinerary): Promise<Itinerary> {
    const id = randomUUID();
    const itinerary: Itinerary = {
      id,
      title: insertItinerary.title,
      description: insertItinerary.description ?? null,
      destinations: insertItinerary.destinations as unknown,
      createdAt: new Date(),
    };
    this.itineraries.set(id, itinerary);
    return itinerary;
  }

  async deleteItinerary(id: string): Promise<boolean> {
    return this.itineraries.delete(id);
  }
}

export const storage = new MemStorage();
