import { pgTable, text, serial, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  primaryPlatform: text("primary_platform").notNull(),
  followerRange: text("follower_range").notNull(),
  revenueRange: text("revenue_range").notNull(),
  revenueBreakdown: jsonb("revenue_breakdown").notNull(), // Stores the % breakdown
  biggestWorry: text("biggest_worry").notNull(),
  openToCall: boolean("open_to_call").default(false).notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({ id: true });

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
