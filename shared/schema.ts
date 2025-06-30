import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const webhookRequests = pgTable("webhook_requests", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  status: text("status").notNull().default("pending"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWebhookRequestSchema = createInsertSchema(webhookRequests).pick({
  month: true,
  year: true,
});

export const consultationSchema = z.object({
  month: z.string().min(2).max(2).regex(/^(0[1-9]|1[0-2])$/, "Mes debe ser entre 01 y 12"),
  year: z.number().int().min(2000).max(2099),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWebhookRequest = z.infer<typeof insertWebhookRequestSchema>;
export type WebhookRequest = typeof webhookRequests.$inferSelect;
export type ConsultationData = z.infer<typeof consultationSchema>;
