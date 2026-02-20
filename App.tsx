import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FlaskConical, 
  Timer, 
  CheckCircle2, 
  Trophy,
  Info,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { SetupModal } from './components/SetupModal';
import { Puzzle1 } from './components/Puzzle1';
import { Puzzle2 } from './components/Puzzle2';
import { Puzzle3 } from './components/Puzzle3';
import { FinalCode } from './components/FinalCode';
import { Leaderboard } from './components/Leaderboard';
import { Poster } from './components/Poster';
import { CountdownOverlay } from './components/CountdownOverlay';
import { getSession, setSession, clearSession, updateSessionProgress } from './lib/session';
import { assignSetIdForNewGroup } from './lib/admin';
import type { SetId } from './lib/puzzles';

export type Step = 'landing' | 'setup' | 'countdown' | 'puzzle1' | 'puzzle2' | 'puzzle3' | 'final' | 'success' | 'leaderboard' | 'poster';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [groupInfo, setGroupInfo] = useState({ name: '', players: 2, block: '' });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [codes, setCodes] = useState({ p1: '', p2: '', p3: '' });
  const [showPoster, setShowPoster] = useState(false);
  const [setId, setSetId] = useState<SetId | null>(null);
  const [debugOverlay, setDebugOverlay] = useState(false);

  // Restore from session on mount (e.g. after refresh)
  useEffect(() => {
    const s = getSession();
    if (s) {
      setGroupInfo({ name: s.groupName, players: s.players, block: s.block });
      setStartTime(s.startedAt);
      setSetId(s.setId);
      setCodes({
        p1: s.p1Code ?? '',
        p2: s.p2Code ?? '',
        p3: s.p3Code ?? '',
      });
      if (s.p3Complete) setCurrentStep('final');
      else if (s.p2Complete) setCurrentStep('puzzle3');
      else if (s.p1Complete) setCurrentStep('puzzle2');
      else setCurrentStep('puzzle1');
    }
    const admin = JSON.parse(localStorage.getItem('stabilizeLabAdmin') || '{}');
    setDebugOverlay(!!admin.debugOverlay);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (startTime && !['success', 'leaderboard', 'poster', 'landing', 'countdown'].includes(currentStep)) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, currentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setCurrentStep('setup');
  };
  
  const handleSetupComplete = (info: { name: string, players: number, block: string }) => {
    setGroupInfo(info);
    setCurrentStep('countdown');
  };

  const handleCountdownComplete = () => {
    const assignedSetId = assignSetIdForNewGroup();
    const now = Date.now();
    setSetId(assignedSetId);
    setStartTime(now);
    setSession({
      groupName: groupInfo.name,
      players: groupInfo.players,
      block: groupInfo.block,
      setId: assignedSetId,
      startedAt: now,
    });
    setCurrentStep('puzzle1');
  };

  const handleLeaderboardSubmit = async () => {
    const newEntry = {
      group: groupInfo.name,
      time: formatTime(elapsedTime),
      seconds: elapsedTime,
      date: new Date().toISOString().split('T')[0],
      setId: setId ?? 'A',
    };
    
    try {
      const { submitToLeaderboard } = await import('./lib/api');
      await submitToLeaderboard(newEntry);
    } catch (error) {
      console.error('Failed to submit to leaderboard:', error);
      // Fallback handled in api.ts
    }
    
    clearSession();
    setCurrentStep('leaderboard');
  };

  const nextStep = () => {
    const steps: Step[] = ['puzzle1', 'puzzle2', 'puzzle3', 'final', 'success'];
    const idx = steps.indexOf(currentStep as any);
    if (idx !== -1 && idx < steps.length - 1) {
      setCurrentStep(steps[idx + 1]);
    }
  };

  const progress = () => {
    const steps: Step[] = ['puzzle1', 'puzzle2', 'puzzle3', 'final'];
    const idx = steps.indexOf(currentStep as any);
    if (idx === -1) return 0;
    return ((idx + 1) / steps.length) * 100;
  };

  if (showPoster) {
    return <Poster onClose={() => setShowPoster(false)} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-yellow-200">
      {/* Header & Global UI */}
      {currentStep !== 'landing' && currentStep !== 'poster' && (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-lg">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-sm tracking-tight uppercase">Stabilize the Lab</h1>
                <p className="text-xs text-slate-500">{groupInfo.name || 'Station Active'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-8">
              {startTime && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full font-mono font-medium text-sm">
                  <Timer className="w-4 h-4" />
                  {formatTime(elapsedTime)}
                </div>
              )}
              <button 
                onClick={() => setShowPoster(true)}
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                title="How to Play"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          {['puzzle1', 'puzzle2', 'puzzle3', 'final'].includes(currentStep) && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50">
              <motion.div 
                className="h-full bg-slate-900"
                initial={{ width: 0 }}
                animate={{ width: `${progress()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </header>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-8">
        <AnimatePresence mode="wait">
          {currentStep === 'landing' && (
            <LandingPage key="landing" onStart={handleStart} onViewLeaderboard={() => setCurrentStep('leaderboard')} />
          )}
          
          {currentStep === 'setup' && (
            <SetupModal 
              key="setup" 
              onComplete={handleSetupComplete} 
              onCancel={() => {
                setCurrentStep('landing');
              }}
            />
          )}

          {currentStep === 'countdown' && (
            <CountdownOverlay key="countdown" onComplete={handleCountdownComplete} />
          )}

          {currentStep === 'puzzle1' && setId && (
            <Puzzle1 
              key="puzzle1" 
              setId={setId}
              onComplete={(code) => {
                setCodes(prev => ({ ...prev, p1: code }));
                updateSessionProgress({ p1Complete: true, p1Code: code });
                nextStep();
              }} 
            />
          )}

          {currentStep === 'puzzle2' && setId && (
            <Puzzle2 
              key="puzzle2" 
              setId={setId}
              onComplete={(code) => {
                setCodes(prev => ({ ...prev, p2: code }));
                updateSessionProgress({ p2Complete: true, p2Code: code });
                nextStep();
              }} 
            />
          )}

          {currentStep === 'puzzle3' && setId && (
            <Puzzle3 
              key="puzzle3" 
              setId={setId}
              onComplete={(code) => {
                setCodes(prev => ({ ...prev, p3: code }));
                updateSessionProgress({ p3Complete: true, p3Code: code });
                nextStep();
              }} 
            />
          )}

          {currentStep === 'final' && (
            <FinalCode 
              key="final" 
              puzzleCodes={codes} 
              onComplete={() => setCurrentStep('success')} 
            />
          )}

          {currentStep === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center py-12"
            >
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 italic tracking-tight uppercase">Lab Stabilized</h1>
              <p className="text-slate-500 mb-8 text-lg">
                Excellent work, <span className="text-slate-900 font-semibold">{groupInfo.name}</span>. 
                The containment breach has been averted.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Final Time</p>
                  <p className="text-3xl font-mono font-bold">{formatTime(elapsedTime)}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Status</p>
                  <p className="text-3xl font-bold text-green-600">SAFE</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleLeaderboardSubmit}
                  className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  Submit to Leaderboard
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  New Group Start
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 'leaderboard' && (
            <Leaderboard key="leaderboard" onNewStart={() => window.location.reload()} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto px-4 py-12 border-t border-slate-50 text-center relative">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">Why would you look down here instead of focusing?</p>
        {debugOverlay && (
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-slate-900/10 text-slate-500 px-2 py-0.5 rounded">
            Set: {setId ?? '—'}
          </span>
        )}
      </footer>

      {/* Admin Panel Button - navigates to /admin */}
      <a
        href="/admin"
        className="fixed bottom-4 right-4 p-3 bg-slate-900/5 hover:bg-slate-900/10 rounded-full transition-all text-slate-300 hover:text-slate-500 z-50"
        title="Admin Panel"
      >
        <ShieldAlert className="w-5 h-5" />
      </a>
    </div>
  );
}
