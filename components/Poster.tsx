import React from 'react';
import { motion } from 'motion/react';
import { QrCode, X, Play, Clock, Users, ArrowRight, ShieldAlert } from 'lucide-react';

interface PosterProps {
  onClose: () => void;
}

export function Poster({ onClose }: PosterProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background hazard accents */}
      <div className="absolute top-0 left-0 w-full h-24 bg-yellow-400 -skew-y-3 -translate-y-12" />
      <div className="absolute bottom-0 right-0 w-full h-24 bg-slate-800 -skew-y-3 translate-y-12" />
      
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-slate-900" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest text-yellow-400">Classified Challenge</h2>
          </div>

          <h1 className="text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none">
            Stabilize <br />
            <span className="text-slate-400">The Lab</span>
          </h1>

          <div className="flex gap-8 mb-12">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="font-bold uppercase tracking-widest text-sm">10 Minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-yellow-400" />
              <span className="font-bold uppercase tracking-widest text-sm">3–4 Players</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <span className="text-4xl font-black text-white/20 italic">01</span>
              <div>
                <h3 className="font-bold uppercase tracking-widest mb-1">Assemble Unit</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Gather your group and scan the QR code to register your team name.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-4xl font-black text-white/20 italic">02</span>
              <div>
                <h3 className="font-bold uppercase tracking-widest mb-1">Solve Sequences</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Complete three chemistry logic puzzles to unlock the containment field.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-4xl font-black text-white/20 italic">03</span>
              <div>
                <h3 className="font-bold uppercase tracking-widest mb-1">Stabilize Node</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Enter the master override code to stop the breach and freeze your timer.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white text-slate-900 p-12 rounded-[60px] flex flex-col items-center text-center shadow-2xl shadow-white/5">
          <div className="mb-8 p-4 border-4 border-slate-900 rounded-3xl">
            <QrCode className="w-48 h-48" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Scan to Begin Stabilization</p>
          
          <div className="w-full p-8 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
            <h4 className="font-black italic uppercase tracking-tighter text-2xl mb-2">Ready to Start?</h4>
            <p className="text-slate-500 text-sm">No writing tools required. Use the digital terminal at this station.</p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>Science 10</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>Chemistry</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>CAS Exhibition</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
          <span>HAZARD</span>
          <span>STABILIZATION</span>
          <span>HAZARD</span>
          <span>STABILIZATION</span>
        </div>
      </div>
    </div>
  );
}
