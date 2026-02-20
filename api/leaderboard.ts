/**
 * Vercel Serverless Function for Leaderboard API
 * Uses Supabase for persistence
 */

import { createClient } from '@supabase/supabase-js';

interface LeaderboardEntry {
  group: string;
  time: string;
  date: string;
  seconds: number;
  setId?: string;
}

const LEADERBOARD_KEY = 'stabilize-lab-leaderboard';

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  return createClient(url, key);
}

async function getFromSupabase(key: string): Promise<any> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('kv_store_c3161509')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) throw error;
  return data?.value;
}

async function setToSupabase(key: string, value: any): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('kv_store_c3161509').upsert({
    key,
    value,
  });
  if (error) throw error;
}

export default async function handler(req: Request): Promise<Response> {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  const hasSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (req.method === 'GET') {
    try {
      let entries: LeaderboardEntry[] = [];

      if (hasSupabase) {
        entries = (await getFromSupabase(LEADERBOARD_KEY)) || [];
      } else {
        // Fallback: return empty array if no database
        entries = [];
      }

      return new Response(
        JSON.stringify(entries.sort((a, b) => a.seconds - b.seconds)),
        { status: 200, headers }
      );
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch leaderboard' }),
        { status: 500, headers }
      );
    }
  }

  if (req.method === 'POST') {
    try {
      const entry: LeaderboardEntry = await req.json();

      if (!entry.group || typeof entry.seconds !== 'number') {
        return new Response(
          JSON.stringify({ error: 'Invalid entry data' }),
          { status: 400, headers }
        );
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
        return new Response(
          JSON.stringify({ error: 'Database not configured' }),
          { status: 500, headers }
        );
      }

      return new Response(
        JSON.stringify({ success: true, entry: newEntry }),
        { status: 200, headers }
      );
    } catch (error) {
      console.error('Error submitting to leaderboard:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to submit entry' }),
        { status: 500, headers }
      );
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (hasSupabase) {
        await setToSupabase(LEADERBOARD_KEY, []);
      }
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers }
      );
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to clear leaderboard' }),
        { status: 500, headers }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers }
  );
}
