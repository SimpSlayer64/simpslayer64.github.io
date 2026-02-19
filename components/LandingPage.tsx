import React from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, AlertTriangle } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onViewLeaderboard: () => void;
}

export function LandingPage({ onStart, onViewLeaderboard }: LandingPageProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border-[40px] border-slate-900 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border-[20px] border-slate-900 rotate-45" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full text-xs font-bold uppercase tracking-widest text-slate-600">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Ever done grade 10 chemistry with your life on the line?
        </div>
        
        <h1 className="text-6xl sm:text-8xl font-black italic tracking-tighter text-slate-900 mb-6 uppercase">
          Stabilize <br />
          <span className="text-outline">The Lab</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-slate-500 mb-12 max-w-xl mx-auto leading-relaxed">
          Science 10 Chemistry Escape Challenge. <br />
          Use the knowledge you have from Science 10 to save the lab.
        </p>

        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onStart}
            className="group relative px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <Play className="w-5 h-5 fill-current" />
            START CHALLENGE
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform skew-x-12" />
          </button>
          
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            Note: The 10-minute stabilization timer begins after group entry.
          </p>
          
          <button 
            onClick={onViewLeaderboard}
            className="mt-2 px-6 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl font-semibold text-sm transition-all hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            View Leaderboard
          </button>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-12 border-t border-slate-100 max-w-2xl mx-auto">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Time Limit</p>
            <p className="font-bold text-lg">10 Minutes</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Group Size</p>
            <p className="font-bold text-lg">2–4 Players</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Subject</p>
            <p className="font-bold text-lg">Science 10</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
