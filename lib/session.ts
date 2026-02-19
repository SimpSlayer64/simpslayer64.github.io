/**
 * Session storage for Stabilize the Lab.
 * Persists group session in sessionStorage so refresh does not change the set.
 */

import type { SetId } from "./puzzles";

export const ADMIN_PIN = "1010"; // Change this in one place for admin access

export interface SessionData {
  groupName: string;
  players: number;
  block: string;
  setId: SetId;
  startedAt: number;
  p1Complete?: boolean;
  p2Complete?: boolean;
  p3Complete?: boolean;
  p1Code?: string;
  p2Code?: string;
  p3Code?: string;
}

const SESSION_KEY = "stabilizeLabSession";

export function getSession(): SessionData | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function setSession(data: SessionData): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function updateSessionProgress(updates: Partial<Pick<SessionData, "p1Complete" | "p2Complete" | "p3Complete" | "p1Code" | "p2Code" | "p3Code">>): void {
  const s = getSession();
  if (!s) return;
  setSession({ ...s, ...updates });
}
