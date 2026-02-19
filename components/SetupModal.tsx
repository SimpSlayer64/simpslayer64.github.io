import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, ArrowRight, X } from 'lucide-react';

interface SetupModalProps {
  onComplete: (info: { name: string, players: number, block: string }) => void;
  onCancel: () => void;
}

export function SetupModal({ onComplete, onCancel }: SetupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    players: 3,
    block: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onComplete(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 relative">
          <button 
            onClick={onCancel}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold tracking-tight">Group Entry</h2>
          <p className="text-slate-500 text-sm mt-1">Enter your group details.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Users className="w-3 h-3" /> Group Name
            </label>
            <input 
              required
              autoFocus
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. The Chemist Crew"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Players</label>
              <select 
                value={formData.players}
                onChange={(e) => setFormData(p => ({ ...p, players: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value={2}>2 Players</option>
                <option value={3}>3 Players</option>
                <option value={4}>4 Players</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Block (Opt)
              </label>
              <input 
                value={formData.block}
                onChange={(e) => setFormData(p => ({ ...p, block: e.target.value }))}
                placeholder="A, B, C..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
          >
            ENTER LAB & START TIMER
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[10px] text-center text-slate-400 uppercase tracking-tighter">
            By starting, you agree to follow lab safety protocols.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
