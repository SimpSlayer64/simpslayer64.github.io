import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, AlertTriangle, XCircle, FlaskConical } from 'lucide-react';
import { PUZZLE2_SETS } from '../lib/puzzles';
import type { SetId } from '../lib/puzzles';

interface Puzzle2Props {
  setId: SetId;
  onComplete: (code: string) => void;
}

export function Puzzle2({ setId, onComplete }: Puzzle2Props) {
  const setData = PUZZLE2_SETS[setId];
  const elements = setData.elements;
  const correctCode = setData.expectedCode;

  const [selected, setSelected] = useState<string[]>([]);
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'incorrect' | 'correct'>('none');
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const hints = [
    "Two circled elements are excluded.",
    "Ignore noble gases (Ar) and metals with +3 charge (Al).",
    "Selected: Na (11) and Mg (12). Order by charge."
  ];

  const handleSubmit = () => {
    if (inputCode === correctCode) {
      setFeedback('correct');
      setTimeout(() => onComplete(inputCode), 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback('none'), 3000);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-50 p-8 rounded-3xl border border-slate-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-900 rounded-lg">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold">Puzzle 2: Periodic Table Logic</h2>
        </div>

        <div className="space-y-6 text-sm text-slate-600">
          <div className="p-4 bg-white rounded-2xl border border-slate-200">
            <p className="font-bold text-slate-900 mb-2">Stabilization Protocol:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Select elements that form ionic compounds.</li>
              <li><span className="font-bold text-red-500">Exclude noble gases.</span></li>
              <li>Use only metals that form <span className="font-bold text-slate-900">+1 or +2 ions.</span></li>
              <li>Convert selected elements to atomic numbers.</li>
              <li>Order by <span className="underline">increasing ionic charge</span>, then increasing atomic number.</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-4">
            {elements.map(el => (
              <button
                key={el.symbol}
                onClick={() => setSelected(prev => 
                  prev.includes(el.symbol) ? prev.filter(s => s !== el.symbol) : [...prev, el.symbol]
                )}
                className={`w-24 h-28 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                  selected.includes(el.symbol) 
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xl scale-105' 
                    : 'border-slate-200 bg-white hover:border-slate-400'
                }`}
              >
                <span className="text-[10px] uppercase opacity-60 font-bold">{el.atomic}</span>
                <span className="text-3xl font-black">{el.symbol}</span>
                <span className="text-[10px] mt-1 opacity-80">{el.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setShowHint(true)}
          className="mt-8 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          Need a Hint?
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center"
      >
        <div className="w-full max-w-xs text-center space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Enter 4-Digit Sequence</label>
            <input 
              type="text"
              maxLength={4}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
              placeholder="0000"
              className="w-full py-6 text-6xl font-black tracking-[0.5em] text-center bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-slate-900 outline-none transition-all placeholder:text-slate-200"
            />
          </div>

          <button 
            onClick={handleSubmit}
            className={`w-full py-5 rounded-2xl font-bold text-lg shadow-lg transition-all ${
              feedback === 'correct' ? 'bg-green-600 text-white' : 
              feedback === 'incorrect' ? 'bg-red-600 text-white animate-shake' : 
              'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {feedback === 'correct' ? 'ACCESS GRANTED' : feedback === 'incorrect' ? 'INVALID KEY' : 'UNLOCK NODE'}
          </button>

          <div className="p-4 bg-amber-50 rounded-xl flex gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-[11px] text-amber-700 font-medium">
              Note: Atomic numbers must be arranged according to periodic properties as specified in the rules.
            </p>
          </div>
        </div>
      </motion.div>

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
                <h3 className="text-xl font-bold">Protocol Hints</h3>
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
