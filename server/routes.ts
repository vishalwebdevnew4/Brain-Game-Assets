import type { Express } from "express";
import { createServer, type Server } from "http";
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
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } as any // 30 days
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
    sessionSettings.cookie.secure = true; // serve secure cookies
  }

  app.use(session(sessionSettings));

  // Helper to get or create user for session
  const getOrCreateUser = async (req: any) => {
    const sessionId = req.sessionID;
    let user = await storage.getUserBySessionId(sessionId);
    if (!user) {
      user = await storage.createUser({ sessionId, maxLevel: 1, settings: { sound: true, darkMode: false } });
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

  app.post(api.progress.update.path, async (req, res) => {
    try {
      const user = await getOrCreateUser(req);
      const input = api.progress.update.input.parse(req.body);
      const updatedUser = await storage.updateProgress(user.id, input);
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

  return httpServer;
}
