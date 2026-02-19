import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, XCircle, AlertTriangle, ArrowRight, Zap, Flame, Droplets, Wind } from 'lucide-react';
import { PUZZLE3_SETS } from '../lib/puzzles';
import type { SetId } from '../lib/puzzles';

interface Puzzle3Props {
  setId: SetId;
  onComplete: (code: string) => void;
}

const REACTIONS = [
  { id: 'comb' as const, name: 'Combustion', icon: <Flame className="w-4 h-4" /> },
  { id: 'acid' as const, name: 'Acid–Base', icon: <Droplets className="w-4 h-4" /> },
  { id: 'single' as const, name: 'Single Replacement', icon: <Zap className="w-4 h-4" /> },
  { id: 'decomp' as const, name: 'Decomposition', icon: <Wind className="w-4 h-4" /> },
];

export function Puzzle3({ setId, onComplete }: Puzzle3Props) {
  const setData = PUZZLE3_SETS[setId];
  const conditions = setData.conditions;
  const correctMatches = setData.correctMatches;
  const expectedCode = setData.expectedCode;

  const [matches, setMatches] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<'none' | 'incorrect' | 'correct'>('none');
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const handleMatch = (reactionId: string, conditionId: string) => {
    setMatches(prev => ({ ...prev, [reactionId]: conditionId }));
  };

  const checkSolution = () => {
    const isCorrect = Object.entries(correctMatches).every(([rId, cId]) => matches[rId] === cId);
    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => onComplete(expectedCode), 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback('none'), 2000);
    }
  };

  const hints = [
    "Think of common lab setups.",
    "Decomposition often needs extreme energy input (like electricity).",
    "Acid-Base usually occurs in water (aqueous solution)."
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black italic uppercase tracking-tight mb-4">Puzzle 3: Reaction Conditions</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Match each reaction type to its characteristic condition. Use the conversion key to generate the final 3-digit override sequence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
        <div className="space-y-3">
          {REACTIONS.map(r => (
            <div key={r.id} className="flex items-center gap-4">
              <div className="flex-1 p-5 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
                <span className="flex items-center gap-3 font-bold">
                  <span className="p-1.5 bg-slate-900 rounded text-white">{r.icon}</span>
                  {r.name}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300" />
              <select 
                value={matches[r.id] || ''}
                onChange={(e) => handleMatch(r.id, e.target.value)}
                className="flex-1 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-slate-900 transition-all font-medium"
              >
                <option value="">Select Condition</option>
                {conditions.map(c => (
                  <option key={c.id} value={c.id} disabled={Object.values(matches).includes(c.id) && matches[r.id] !== c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Conversion Key</h3>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {conditions.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/5">
                <span className="text-xs">{c.name}</span>
                <span className="font-mono font-bold text-yellow-400">{c.val}</span>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Sequence Order</p>
            <p className="font-bold text-sm">Single → Acid-Base → Combustion</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowHint(true)}
            className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            Show Hints
          </button>
          <button 
            onClick={checkSolution}
            className={`px-12 py-5 rounded-2xl font-black text-lg shadow-xl transition-all ${
              feedback === 'correct' ? 'bg-green-600 text-white' : 
              feedback === 'incorrect' ? 'bg-red-600 text-white animate-shake' : 
              'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {feedback === 'correct' ? 'GENERATING CODE...' : feedback === 'incorrect' ? 'MATCH MISMATCH' : 'VALIDATE MATCHES'}
          </button>
        </div>

        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-green-50 border-2 border-green-200 rounded-3xl text-center"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Override Code Generated</p>
              <p className="text-4xl font-mono font-black text-green-900">{expectedCode}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hint Modal (Shared style, could be a component but keeping logic self-contained for now) */}
      <AnimatePresence>
        {showHint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative"
            >
              <button onClick={() => setShowHint(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full">
                <XCircle className="w-5 h-5 text-slate-400" />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-bold">Field Hints</h3>
              </div>

              <div className="space-y-4">
                {[0, 1, 2].map(level => (
                  <div key={level} className={`p-4 rounded-xl border transition-all ${hintLevel >= level ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-100 grayscale opacity-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hint {level + 1}</span>
                      {hintLevel < level && (
                        <button 
                          onClick={() => setHintLevel(level)}
                          className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded"
                        >
                          REVEAL
                        </button>
                      )}
                    </div>
                    <p className="text-sm font-medium">
                      {hintLevel >= level ? hints[level] : "••••••••••••••••••••••••"}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
