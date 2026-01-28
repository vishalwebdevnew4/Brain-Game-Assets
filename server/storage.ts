import { db } from "./db";
import { users, type User, type InsertUser, type UpdateProgressRequest, type UpdateSettingsRequest, type UseHintRequest, type AddCoinsRequest, type SkipLevelRequest } from "@shared/schema";
import { HINT_COST, SKIP_COST, LEVEL_REWARD } from "@shared/routes";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUserBySessionId(sessionId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  completeLevel(userId: number, request: UpdateProgressRequest): Promise<User>;
  updateSettings(userId: number, settings: UpdateSettingsRequest): Promise<User>;
  useHint(userId: number, request: UseHintRequest): Promise<User | null>;
  addCoins(userId: number, request: AddCoinsRequest): Promise<User>;
  skipLevel(userId: number, request: SkipLevelRequest): Promise<User | null>;
  resetProgress(userId: number): Promise<User>;
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

  async completeLevel(userId: number, request: UpdateProgressRequest): Promise<User> {
    const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
    if (!currentUser) throw new Error("User not found");

    const levelData = (currentUser.levelData || {}) as Record<number, { completed: boolean; hintsUsed: number }>;
    const wasAlreadyCompleted = levelData[request.level]?.completed;
    
    levelData[request.level] = {
      ...levelData[request.level],
      completed: request.completed,
      hintsUsed: levelData[request.level]?.hintsUsed || 0
    };

    let newCoins = currentUser.coins || 0;
    if (request.completed && !wasAlreadyCompleted) {
      newCoins += LEVEL_REWARD;
    }

    const newMaxLevel = Math.max(currentUser.maxLevel || 1, request.level + 1);

    const [user] = await db.update(users)
      .set({ 
        levelData, 
        coins: newCoins,
        maxLevel: Math.min(newMaxLevel, 100)
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
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

  async useHint(userId: number, request: UseHintRequest): Promise<User | null> {
    const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
    if (!currentUser) throw new Error("User not found");

    if ((currentUser.coins || 0) < HINT_COST) {
      return null;
    }

    const levelData = (currentUser.levelData || {}) as Record<number, { completed: boolean; hintsUsed: number }>;
    levelData[request.level] = {
      ...levelData[request.level],
      completed: levelData[request.level]?.completed || false,
      hintsUsed: (levelData[request.level]?.hintsUsed || 0) + 1
    };

    const [user] = await db.update(users)
      .set({ 
        coins: (currentUser.coins || 0) - HINT_COST,
        levelData
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async addCoins(userId: number, request: AddCoinsRequest): Promise<User> {
    const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
    if (!currentUser) throw new Error("User not found");

    const [user] = await db.update(users)
      .set({ coins: (currentUser.coins || 0) + request.amount })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async skipLevel(userId: number, request: SkipLevelRequest): Promise<User | null> {
    const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
    if (!currentUser) throw new Error("User not found");

    if ((currentUser.coins || 0) < SKIP_COST) {
      return null;
    }

    const levelData = (currentUser.levelData || {}) as Record<number, { completed: boolean; hintsUsed: number }>;
    levelData[request.level] = {
      completed: true,
      hintsUsed: levelData[request.level]?.hintsUsed || 0
    };

    const newMaxLevel = Math.max(currentUser.maxLevel || 1, request.level + 1);

    const [user] = await db.update(users)
      .set({ 
        coins: (currentUser.coins || 0) - SKIP_COST,
        levelData,
        maxLevel: Math.min(newMaxLevel, 100)
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async resetProgress(userId: number): Promise<User> {
    const [user] = await db.update(users)
      .set({ 
        coins: 100,
        maxLevel: 1,
        levelData: {}
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
