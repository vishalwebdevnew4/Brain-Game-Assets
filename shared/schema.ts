import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  maxLevel: integer("max_level").default(1),
  settings: jsonb("settings").$type<{sound: boolean, darkMode: boolean}>().default({sound: true, darkMode: false}),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UpdateProgressRequest = { level: number };
export type UpdateSettingsRequest = { sound?: boolean; darkMode?: boolean };
