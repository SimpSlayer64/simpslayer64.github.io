/**
 * Admin panel for Stabilize the Lab.
 * Hidden at /admin, gated by PIN.
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ShieldAlert,
  XCircle,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowLeft,
  Shuffle,
  Settings,
} from "lucide-react";
import { getAdminSettings, setAdminSettings, rotateManualSet } from "../lib/admin";
import { getSession, clearSession, ADMIN_PIN } from "../lib/session";
import {
  PUZZLE1_SETS,
  PUZZLE2_SETS,
  PUZZLE3_SETS,
  getFinalCode,
  type SetId,
} from "../lib/puzzles";

export function AdminPage() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [settings, setSettings] = useState(getAdminSettings());

  useEffect(() => {
    const stored = getAdminSettings();
    if (stored.authed) {
      setAuthed(true);
    }
    setSettings(stored);
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAdminSettings({ authed: true });
      setAuthed(true);
      setPin("");
    } else {
      alert("Incorrect PIN");
      setPin("");
    }
  };

  const handleLogout = () => {
    setAdminSettings({ authed: false });
    setAuthed(false);
  };

  const handleModeChange = (mode: "random" | "manual") => {
    setAdminSettings({ mode });
    setSettings((s) => ({ ...s, mode }));
  };

  const handleManualSetChange = (setId: SetId) => {
    setAdminSettings({ manualSetId: setId });
    setSettings((s) => ({ ...s, manualSetId: setId }));
  };

  const handleRotate = () => {
    const next = rotateManualSet();
    setSettings((s) => ({ ...s, manualSetId: next }));
  };

  const handleExcludeLastToggle = () => {
    const next = !settings.excludeLastInRandom;
    setAdminSettings({ excludeLastInRandom: next });
    setSettings((s) => ({ ...s, excludeLastInRandom: next }));
  };

  const handleResetSession = () => {
    if (confirm("Reset current group session? Leaderboard will NOT be cleared.")) {
      clearSession();
      alert("Session cleared. Group will get a new set on next start.");
    }
  };

  const handleDebugOverlayToggle = () => {
    const next = !settings.debugOverlay;
    setAdminSettings({ debugOverlay: next });
    setSettings((s) => ({ ...s, debugOverlay: next }));
  };

  const session = getSession();

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-slate-900 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">Admin Access</h1>
              <p className="text-xs text-slate-500">Enter PIN to continue</p>
            </div>
          </div>
          <form onSubmit={handleUnlock} className="space-y-6">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 outline-none text-center text-2xl tracking-[0.5em] font-mono"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
            >
              UNLOCK
            </button>
          </form>
          <a
            href="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lab
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-slate-900" />
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight">Admin Terminal</h1>
            <p className="text-xs text-slate-500">Stabilize the Lab — Set Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900"
          >
            Logout
          </button>
          <a
            href="/"
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lab
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Assignment Mode */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Assignment Mode
          </h2>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={settings.mode === "random"}
                onChange={() => handleModeChange("random")}
                className="w-4 h-4"
              />
              <span className="font-medium">Random per new group</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={settings.mode === "manual"}
                onChange={() => handleModeChange("manual")}
                className="w-4 h-4"
              />
              <span className="font-medium">Manual fixed set</span>
            </label>
          </div>
          {settings.mode === "manual" && (
            <div className="mt-4 flex items-center gap-4">
              <label className="text-sm font-medium">Manual set:</label>
              <select
                value={settings.manualSetId}
                onChange={(e) => handleManualSetChange(e.target.value as SetId)}
                className="px-4 py-2 border border-slate-200 rounded-xl"
              >
                {(["A", "B", "C", "D"] as const).map((s) => (
                  <option key={s} value={s}>
                    Set {s}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRotate}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800"
              >
                <Shuffle className="w-4 h-4" />
                Rotate (A→B→C→D→A)
              </button>
            </div>
          )}
          {settings.mode === "random" && (
            <label className="mt-4 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.excludeLastInRandom ?? false}
                onChange={handleExcludeLastToggle}
                className="w-4 h-4"
              />
              <span className="text-sm">Exclude last assigned set when randomizing</span>
            </label>
          )}
        </section>

        {/* Current Session */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
            Current Session
          </h2>
          {session ? (
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-slate-500">Group:</span> {session.groupName}
              </p>
              <p>
                <span className="text-slate-500">Set:</span> {session.setId}
              </p>
              <p>
                <span className="text-slate-500">Started:</span>{" "}
                {new Date(session.startedAt).toLocaleString()}
              </p>
              <p>
                <span className="text-slate-500">Progress:</span> P1:{" "}
                {session.p1Complete ? "✓" : "—"} P2: {session.p2Complete ? "✓" : "—"} P3:{" "}
                {session.p3Complete ? "✓" : "—"}
              </p>
              <button
                onClick={handleResetSession}
                className="mt-4 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-amber-100 border border-amber-200"
              >
                <RotateCcw className="w-4 h-4" />
                Reset current group session
              </button>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No active session.</p>
          )}
        </section>

        {/* Admin Preview */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Admin Preview — Expected Codes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-2">Set</th>
                  <th className="text-left py-3 px-2">Puzzle 1</th>
                  <th className="text-left py-3 px-2">Puzzle 2</th>
                  <th className="text-left py-3 px-2">Puzzle 3</th>
                  <th className="text-left py-3 px-2">Final</th>
                </tr>
              </thead>
              <tbody>
                {(["A", "B", "C", "D"] as const).map((setId) => (
                  <tr key={setId} className="border-b border-slate-100">
                    <td className="py-3 px-2 font-mono font-bold">{setId}</td>
                    <td className="py-3 px-2 font-mono">{PUZZLE1_SETS[setId].expectedCode}</td>
                    <td className="py-3 px-2 font-mono">{PUZZLE2_SETS[setId].expectedCode}</td>
                    <td className="py-3 px-2 font-mono">{PUZZLE3_SETS[setId].expectedCode}</td>
                    <td className="py-3 px-2 font-mono font-bold">{getFinalCode(setId)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Debug Overlay */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <EyeOff className="w-4 h-4" />
            Debug Overlay
          </h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.debugOverlay ?? false}
              onChange={handleDebugOverlayToggle}
              className="w-4 h-4"
            />
            <span className="text-sm">Show "Set: X" badge in footer (admin only)</span>
          </label>
        </section>

        {/* Database Controls */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
            Database Controls
          </h2>
          <button
            onClick={async () => {
              if (confirm("Clear ALL leaderboard data?")) {
                try {
                  const { clearLeaderboard } = await import("../lib/api");
                  await clearLeaderboard();
                  alert("Leaderboard cleared.");
                } catch (error) {
                  console.error("Failed to clear leaderboard:", error);
                  alert("Failed to clear leaderboard. Check console.");
                }
              }
            }}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 border border-red-100"
          >
            Clear Global Leaderboard
          </button>
        </section>
      </main>
    </div>
  );
}
