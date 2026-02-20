/**
 * Vercel Serverless Function for Leaderboard API (Node.js runtime).
 * Uses Supabase for persistence (same kv table as your Deno server).
 *
 * In Vercel: set Environment Variables:
 *   SUPABASE_URL = your project URL (e.g. https://xxx.supabase.co)
 *   SUPABASE_SERVICE_ROLE_KEY = service role key (bypasses RLS)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface LeaderboardEntry {
  group: string;
  time: string;
  date: string;
  seconds: number;
  setId?: string;
}

// Vercel Node.js handler: req has .method and .body (parsed JSON), res has .status().json()
interface VercelReq {
  method?: string;
  body?: LeaderboardEntry;
}
interface VercelRes {
  setHeader(key: string, value: string): void;
  status(code: number): VercelRes;
  json(body: unknown): void;
  end(chunk?: string): void;
}

const LEADERBOARD_KEY = 'stabilize-lab-leaderboard';
const TABLE = 'kv_store_c3161509';

function setCors(res: VercelRes) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
}

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getFromSupabase(key: string): Promise<any> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) {
    console.error('Supabase get error:', error);
    throw error;
  }
  return data?.value ?? null;
}

async function setToSupabase(key: string, value: unknown): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from(TABLE)
    .upsert({ key, value }, { onConflict: 'key' });
  if (error) {
    console.error('Supabase upsert error:', error);
    throw error;
  }
}

export default async function handler(req: VercelReq, res: VercelRes): Promise<void> {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hasSupabase = getSupabaseClient() !== null;

  if (req.method === 'GET') {
    try {
      let entries: LeaderboardEntry[] = [];
      if (hasSupabase) {
        entries = (await getFromSupabase(LEADERBOARD_KEY)) || [];
      }
      res.status(200).json(entries.sort((a, b) => a.seconds - b.seconds));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const entry = req.body;
      if (!entry || !entry.group || typeof entry.seconds !== 'number') {
        res.status(400).json({ error: 'Invalid entry data' });
        return;
      }
      const newEntry: LeaderboardEntry = {
        ...entry,
        date: entry.date || new Date().toISOString().split('T')[0],
      };
      if (hasSupabase) {
        const entries: LeaderboardEntry[] = (await getFromSupabase(LEADERBOARD_KEY)) || [];
        entries.push(newEntry);
        await setToSupabase(LEADERBOARD_KEY, entries.sort((a, b) => a.seconds - b.seconds));
      } else {
        res.status(500).json({ error: 'Database not configured' });
        return;
      }
      res.status(200).json({ success: true, entry: newEntry });
    } catch (error) {
      console.error('Error submitting to leaderboard:', error);
      res.status(500).json({ error: 'Failed to submit entry' });
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      if (hasSupabase) {
        await setToSupabase(LEADERBOARD_KEY, []);
      }
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
      res.status(500).json({ error: 'Failed to clear leaderboard' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
