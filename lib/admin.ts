/**
 * Admin settings for Stabilize the Lab.
 * Stored in localStorage.
 */

import type { SetId } from "./puzzles";

export interface AdminSettings {
  authed: boolean;
  mode: "random" | "manual";
  manualSetId: SetId;
  lastAssignedSetId?: SetId;
  excludeLastInRandom?: boolean;
  debugOverlay?: boolean;
}

const ADMIN_KEY = "stabilizeLabAdmin";
const SET_IDS: SetId[] = ["A", "B", "C", "D"];

const DEFAULT: AdminSettings = {
  authed: false,
  mode: "random",
  manualSetId: "A",
  excludeLastInRandom: false,
  debugOverlay: false,
};

export function getAdminSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
}

export function setAdminSettings(settings: Partial<AdminSettings>): void {
  const current = getAdminSettings();
  const next = { ...current, ...settings };
  localStorage.setItem(ADMIN_KEY, JSON.stringify(next));
}

/**
 * Assign a setId for a new group based on admin settings.
 * Call this when a group completes setup (after countdown completes).
 */
export function assignSetIdForNewGroup(): SetId {
  const admin = getAdminSettings();
  let setId: SetId;

  if (admin.mode === "manual") {
    setId = admin.manualSetId;
  } else {
    const pool =
      admin.excludeLastInRandom && admin.lastAssignedSetId
        ? SET_IDS.filter((s) => s !== admin.lastAssignedSetId)
        : [...SET_IDS];
    setId = pool[Math.floor(Math.random() * pool.length)] as SetId;
  }

  setAdminSettings({ lastAssignedSetId: setId });
  return setId;
}

/**
 * Rotate manual set: A→B→C→D→A
 */
export function rotateManualSet(): SetId {
  const admin = getAdminSettings();
  const idx = SET_IDS.indexOf(admin.manualSetId);
  const next = SET_IDS[(idx + 1) % 4] as SetId;
  setAdminSettings({ manualSetId: next });
  return next;
}
