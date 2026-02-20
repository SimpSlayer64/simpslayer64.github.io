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

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(`${API_BASE}/leaderboard`);
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    // Fallback to localStorage if API fails
    const local = localStorage.getItem('chemistry-escape-leaderboard');
    return local ? JSON.parse(local) : [];
  }
}

export async function submitToLeaderboard(entry: LeaderboardEntry): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error('Failed to submit to leaderboard');
    }

    // Also save to localStorage as backup
    const local = localStorage.getItem('chemistry-escape-leaderboard') || '[]';
    const entries = JSON.parse(local);
    entries.push(entry);
    entries.sort((a: LeaderboardEntry, b: LeaderboardEntry) => a.seconds - b.seconds);
    localStorage.setItem('chemistry-escape-leaderboard', JSON.stringify(entries));
  } catch (error) {
    console.error('Error submitting to leaderboard:', error);
    // Fallback to localStorage
    const local = localStorage.getItem('chemistry-escape-leaderboard') || '[]';
    const entries = JSON.parse(local);
    entries.push(entry);
    entries.sort((a: LeaderboardEntry, b: LeaderboardEntry) => a.seconds - b.seconds);
    localStorage.setItem('chemistry-escape-leaderboard', JSON.stringify(entries));
    throw error;
  }
}

export async function clearLeaderboard(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/leaderboard`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to clear leaderboard');
    }
    localStorage.removeItem('chemistry-escape-leaderboard');
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    localStorage.removeItem('chemistry-escape-leaderboard');
    throw error;
  }
}
