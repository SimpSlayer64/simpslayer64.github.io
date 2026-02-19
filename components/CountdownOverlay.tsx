import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => onComplete(), 800);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ opacity: 0, scale: 2, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          {count > 0 ? (
            <div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-bold uppercase tracking-[0.5em] text-slate-400 mb-4"
              >
                Initializing Stabilization
              </motion.p>
              <h1 className="text-[12rem] font-black italic leading-none text-slate-900">
                {count}
              </h1>
            </div>
          ) : (
            <div className="space-y-4">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                className="flex justify-center mb-6"
              >
                <div className="p-6 bg-slate-900 rounded-3xl">
                  <AlertTriangle className="w-20 h-20 text-white animate-pulse" />
                </div>
              </motion.div>
              <h1 className="text-8xl font-black italic uppercase text-slate-900 tracking-tighter">
                START!
              </h1>
              <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">
                Contain the breach
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Decorative scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
