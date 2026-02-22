/// <reference types="vite/client" />
/**
 * API client for leaderboard operations
 */

export interface LeaderboardEntry {
  group: string;
  time: string;
  date: string;
  seconds: number;
  setId?: string;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const local = localStorage.getItem('chemistry-escape-leaderboard');
  return local ? JSON.parse(local) : [];
}

export async function submitToLeaderboard(entry: LeaderboardEntry): Promise<void> {
  const local = localStorage.getItem('chemistry-escape-leaderboard') || '[]';
  const entries: LeaderboardEntry[] = JSON.parse(local);
  entries.push(entry);
  entries.sort((a, b) => a.seconds - b.seconds);
  localStorage.setItem('chemistry-escape-leaderboard', JSON.stringify(entries));
}

export async function clearLeaderboard(): Promise<void> {
  localStorage.removeItem('chemistry-escape-leaderboard');
}
