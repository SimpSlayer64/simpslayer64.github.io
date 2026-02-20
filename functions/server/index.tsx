import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c3161509/health", (c) => {
  return c.json({ status: "ok" });
});

// Leaderboard endpoints
const LEADERBOARD_KEY = "stabilize-lab-leaderboard";

interface LeaderboardEntry {
  group: string;
  time: string;
  date: string;
  seconds: number;
  setId?: string;
}

// Get leaderboard
app.get("/api/leaderboard", async (c) => {
  try {
    const entries = await kv.get(LEADERBOARD_KEY);
    return c.json(entries || []);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return c.json({ error: "Failed to fetch leaderboard" }, 500);
  }
});

// Submit to leaderboard
app.post("/api/leaderboard", async (c) => {
  try {
    const entry: LeaderboardEntry = await c.req.json();
    
    // Validate entry
    if (!entry.group || typeof entry.seconds !== "number") {
      return c.json({ error: "Invalid entry data" }, 400);
    }

    // Get current leaderboard
    const entries: LeaderboardEntry[] = (await kv.get(LEADERBOARD_KEY)) || [];
    
    // Add new entry
    const updated = [...entries, {
      ...entry,
      date: entry.date || new Date().toISOString().split('T')[0],
    }].sort((a, b) => a.seconds - b.seconds);
    
    // Store updated leaderboard
    await kv.set(LEADERBOARD_KEY, updated);
    
    return c.json({ success: true, entry });
  } catch (error) {
    console.error("Error submitting to leaderboard:", error);
    return c.json({ error: "Failed to submit entry" }, 500);
  }
});

// Clear leaderboard (admin only - add auth if needed)
app.delete("/api/leaderboard", async (c) => {
  try {
    await kv.set(LEADERBOARD_KEY, []);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error clearing leaderboard:", error);
    return c.json({ error: "Failed to clear leaderboard" }, 500);
  }
});

Deno.serve(app.fetch);