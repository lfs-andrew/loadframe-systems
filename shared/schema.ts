import { pgTable, text, serial, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  link: text("link"), // Optional: YouTube/site/profile
  primaryPlatform: text("primary_platform").notNull(),
  followerRange: text("follower_range").notNull(),
  monthlyRevenueRange: text("monthly_revenue_range").notNull(),
  stuckDuration: text("stuck_duration").notNull(),
  revenueMix: jsonb("revenue_mix").notNull(), // { ads: number, sponsors: number, products: number, affiliates: number, other: number }
  monetizationFlags: jsonb("monetization_flags").notNull(), // string[]
  biggestWorry: text("biggest_worry").notNull(),
  openToCall: boolean("open_to_call").notNull(),
  consent: boolean("consent").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true });

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
