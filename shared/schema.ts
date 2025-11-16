import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const itineraries = pgTable("itineraries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  destinations: jsonb("destinations").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertItinerarySchema = createInsertSchema(itineraries).pick({
  title: true,
  description: true,
  destinations: true,
}).extend({
  destinations: z.array(z.object({
    id: z.string(),
    name: z.string(),
    country: z.string(),
  })),
});

export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = typeof itineraries.$inferSelect;
