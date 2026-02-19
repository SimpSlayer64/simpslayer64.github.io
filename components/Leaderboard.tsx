import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, ArrowLeft, RotateCcw, Medal } from 'lucide-react';

interface Entry {
  group: string;
  time: string;
  date: string;
  seconds: number;
  setId?: string;
}

interface LeaderboardProps {
  onNewStart: () => void;
}

export function Leaderboard({ onNewStart }: LeaderboardProps) {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('chemistry-escape-leaderboard');
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      setEntries([]);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-200">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Leaderboard</h1>
            <p className="text-slate-500 text-sm">Top Stabilization Units of the Week</p>
          </div>
        </div>

        <button 
          onClick={onNewStart}
          className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
        >
          <RotateCcw className="w-4 h-4" />
          NEW GROUP START
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Rank</th>
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Group Name</th>
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Time</th>
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.length > 0 ? entries.map((entry, i) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${i < 3 ? 'bg-yellow-50/30' : ''}`}
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    {i === 0 && <Medal className="w-5 h-5 text-yellow-500" />}
                    {i === 1 && <Medal className="w-5 h-5 text-slate-400" />}
                    {i === 2 && <Medal className="w-5 h-5 text-amber-600" />}
                    <span className={`font-mono font-bold ${i < 3 ? 'text-lg' : 'text-slate-400'}`}>
                      {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`font-bold ${i < 3 ? 'text-slate-900' : 'text-slate-600'}`}>{entry.group}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="font-mono font-bold text-slate-900">{entry.time}</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className="text-slate-400 text-sm">{entry.date}</span>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">
                  No records found. Stabilize the lab to claim the first rank.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
