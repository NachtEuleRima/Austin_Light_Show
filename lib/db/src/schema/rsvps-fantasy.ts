import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rsvpsFantasyTable = pgTable("rsvps_fantasy", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  guests: integer("guests").notNull().default(1),
  phone: text("phone"),
  robot: text("robot"),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRsvpFantasySchema = createInsertSchema(rsvpsFantasyTable).omit({ id: true, createdAt: true });
export type InsertRsvpFantasy = z.infer<typeof insertRsvpFantasySchema>;
export type RsvpFantasy = typeof rsvpsFantasyTable.$inferSelect;
