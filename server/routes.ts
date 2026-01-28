import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { pool } from "./db";

const PgStore = pgSession(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const sessionSettings = {
    store: new PgStore({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET || "brain_challenge_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } as any
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionSettings.cookie.secure = true;
  }

  app.use(session(sessionSettings));

  const getOrCreateUser = async (req: any) => {
    const sessionId = req.sessionID;
    let user = await storage.getUserBySessionId(sessionId);
    if (!user) {
      user = await storage.createUser({ 
        sessionId, 
        coins: 100,
        maxLevel: 1, 
        levelData: {},
        settings: { sound: true, music: true, darkMode: false } 
      });
    }
    return user;
  };

  app.get(api.progress.get.path, async (req, res) => {
    try {
      const user = await getOrCreateUser(req);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.progress.complete.path, async (req, res) => {
    try {
      const user = await getOrCreateUser(req);
      const input = api.progress.complete.input.parse(req.body);
      const updatedUser = await storage.completeLevel(user.id, input);
      res.json(updatedUser);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.patch(api.progress.updateSettings.path, async (req, res) => {
    try {
      const user = await getOrCreateUser(req);
      const input = api.progress.updateSettings.input.parse(req.body);
      const updatedUser = await storage.updateSettings(user.id, input);
      res.json(updatedUser);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.progress.useHint.path, async (req, res) => {
    try {
      const user = await getOrCreateUser(req);
      const input = api.progress.useHint.input.parse(req.body);
      const updatedUser = await storage.useHint(user.id, input);
      if (!updatedUser) {
        return res.status(400).json({ message: "Not enough coins for hint" });
      }
      res.json(updatedUser);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.progress.addCoins.path, async (req, res) => {
    try {
      const user = await getOrCreateUser(req);
      const input = api.progress.addCoins.input.parse(req.body);
      const updatedUser = await storage.addCoins(user.id, input);
      res.json(updatedUser);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.progress.skipLevel.path, async (req, res) => {
    try {
      const user = await getOrCreateUser(req);
      const input = api.progress.skipLevel.input.parse(req.body);
      const updatedUser = await storage.skipLevel(user.id, input);
      if (!updatedUser) {
        return res.status(400).json({ message: "Not enough coins to skip level" });
      }
      res.json(updatedUser);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.progress.resetProgress.path, async (req, res) => {
    try {
      const user = await getOrCreateUser(req);
      const updatedUser = await storage.resetProgress(user.id);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return httpServer;
}
