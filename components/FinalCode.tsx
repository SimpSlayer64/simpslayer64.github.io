import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, ShieldAlert } from 'lucide-react';

interface FinalCodeProps {
  puzzleCodes: { p1: string; p2: string; p3: string };
  onComplete: () => void;
}

export function FinalCode({ puzzleCodes, onComplete }: FinalCodeProps) {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'error' | 'success'>('idle');

  // Sequence: P1 + P2 + P3
  // 1114 + 1112 + 341 = 11141112341
  const correctCode = `${puzzleCodes.p1}${puzzleCodes.p2}${puzzleCodes.p3}`;

  const handleUnlock = () => {
    setStatus('checking');
    setTimeout(() => {
      if (inputValue === correctCode) {
        setStatus('success');
        setTimeout(onComplete, 1000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-slate-900 rounded-2xl mb-6">
          {status === 'success' ? (
            <Unlock className="w-10 h-10 text-white" />
          ) : (
            <Lock className="w-10 h-10 text-white" />
          )}
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">System Stabilization</h1>
        <p className="text-slate-500">
          Combine the codes from Puzzles 1–3 in sequence to generate the final override string.
        </p>
      </div>

      <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block text-center">Master Access Key</label>
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
            className={`w-full py-8 text-4xl font-mono font-black text-center tracking-[0.2em] bg-white border-4 rounded-3xl outline-none transition-all ${
              status === 'error' ? 'border-red-500 animate-shake' : 
              status === 'success' ? 'border-green-500' : 
              'border-slate-100 focus:border-slate-900'
            }`}
            placeholder="••••••••••"
          />
        </div>

        <button 
          onClick={handleUnlock}
          disabled={status === 'checking'}
          className={`w-full py-6 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95 ${
            status === 'success' ? 'bg-green-600 text-white' : 
            status === 'error' ? 'bg-red-600 text-white' : 
            'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {status === 'checking' ? 'DECRYPTING...' : 'UNLOCK SYSTEM'}
        </button>

        <div className="flex justify-center gap-6">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Puzzle 1</p>
            <p className="font-mono text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded">{puzzleCodes.p1 || '????'}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Puzzle 2</p>
            <p className="font-mono text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded">{puzzleCodes.p2 || '????'}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Puzzle 3</p>
            <p className="font-mono text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded">{puzzleCodes.p3 || '????'}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 text-red-500/60">
        <ShieldAlert className="w-4 h-4" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Unauthorized access is logged</p>
      </div>
    </div>
  );
}
