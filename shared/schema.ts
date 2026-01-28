import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  coins: integer("coins").default(100),
  maxLevel: integer("max_level").default(1),
  levelData: jsonb("level_data").$type<Record<number, { completed: boolean; hintsUsed: number }>>().default({}),
  settings: jsonb("settings").$type<{ sound: boolean; music: boolean; darkMode: boolean }>().default({ sound: true, music: true, darkMode: false }),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UpdateProgressRequest = { level: number; completed: boolean };
export type UpdateSettingsRequest = { sound?: boolean; music?: boolean; darkMode?: boolean };
export type UseHintRequest = { level: number };
export type AddCoinsRequest = { amount: number };
export type SkipLevelRequest = { level: number };
