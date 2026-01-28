import { db } from "./db";
import { users, type User, type InsertUser, type UpdateProgressRequest, type UpdateSettingsRequest } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUserBySessionId(sessionId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateProgress(userId: number, progress: UpdateProgressRequest): Promise<User>;
  updateSettings(userId: number, settings: UpdateSettingsRequest): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUserBySessionId(sessionId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.sessionId, sessionId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateProgress(userId: number, progress: UpdateProgressRequest): Promise<User> {
    // Only update if new level is higher than current maxLevel
    const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
    if (!currentUser) throw new Error("User not found");

    if (progress.level > (currentUser.maxLevel || 0)) {
       const [user] = await db.update(users)
        .set({ maxLevel: progress.level })
        .where(eq(users.id, userId))
        .returning();
       return user;
    }
    return currentUser;
  }

  async updateSettings(userId: number, settings: UpdateSettingsRequest): Promise<User> {
    const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
    if (!currentUser) throw new Error("User not found");

    const newSettings = { ...(currentUser.settings as object), ...settings };

    const [user] = await db.update(users)
      .set({ settings: newSettings })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
