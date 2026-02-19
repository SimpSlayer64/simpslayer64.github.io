import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, HelpCircle, CheckCircle2, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import { PUZZLE1_SETS } from '../lib/puzzles';
import type { SetId } from '../lib/puzzles';

interface Puzzle1Props {
  setId: SetId;
  onComplete: (code: string) => void;
}

export function Puzzle1({ setId, onComplete }: Puzzle1Props) {
  const setData = PUZZLE1_SETS[setId];
  const equations = setData.equations;

  const initialCoeffInputs = useMemo(() => {
    const out: { [key: number]: string[] } = {};
    equations.forEach((eq, i) => {
      const formulaCount = eq.parts.filter((p) => !["+", "→"].includes(p)).length;
      out[i] = Array(formulaCount).fill('');
    });
    return out;
  }, [equations]);

  const [answers, setAnswers] = useState(['', '', '', '']);
  const [coeffInputs, setCoeffInputs] = useState<{ [key: number]: string[] }>(initialCoeffInputs);
  const [feedback, setFeedback] = useState<'none' | 'incorrect' | 'correct'>('none');
  const [hintLevel, setHintLevel] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const correctCode = setData.expectedCode;

  const updateCoeff = (eqIdx: number, partIdx: number, val: string) => {
    const newVal = val.replace(/\D/g, '');
    setCoeffInputs(prev => ({
      ...prev,
      [eqIdx]: prev[eqIdx].map((c, i) => i === partIdx ? newVal : c)
    }));
  };

  const handleSubmit = () => {
    const code = answers.join('');
    if (code === correctCode) {
      setFeedback('correct');
      setTimeout(() => onComplete(code), 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback('none'), 3000);
    }
  };

  const hints = [
    "One equation is a decoy (Decomposition).",
    "Use the product with the same metal as the reactant (e.g. Zn → ZnSO₄).",
    "Order: Single → Double → Acid-Base → Combustion."
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
      {/* Left: Instructions */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-50 p-8 rounded-3xl border border-slate-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-900 rounded-lg">
            <Info className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold">Puzzle 1: Reaction Logic</h2>
        </div>

        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p className="font-medium text-slate-900">Task: Balance and classify.</p>
          <ul className="space-y-2 list-disc pl-5 text-sm">
            <li>Balance all reactions.</li>
            <li>Classify: <span className="text-slate-900 font-semibold">Single replacement, Double replacement, Acid–Base, Combustion.</span></li>
            <li>Ignore reactions outside these types.</li>
          </ul>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-1">Extraction Rule</h4>
            <p className="text-sm text-slate-700 leading-snug">
              For each valid reaction, use the <span className="font-bold underline decoration-amber-500/50 decoration-2">coefficient of the product that contains the same metal</span> as the reactant.
            </p>
            <div className="mt-2 pt-2 border-t border-amber-200/50 flex items-center gap-2">
              <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">COMBUSTION</span>
              <p className="text-xs italic text-slate-600">Use the H₂O coefficient.</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-white rounded-xl border border-slate-200">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Sequence Order</p>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-1 bg-slate-100 rounded">Single</span>
              <ChevronRight className="w-3 h-3" />
              <span className="px-2 py-1 bg-slate-100 rounded">Double</span>
              <ChevronRight className="w-3 h-3" />
              <span className="px-2 py-1 bg-slate-100 rounded">Acid-Base</span>
              <ChevronRight className="w-3 h-3" />
              <span className="px-2 py-1 bg-slate-100 rounded">Combustion</span>
            </div>
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

      {/* Right: Puzzle */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
      >
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Reaction Set</h3>
        <div className="space-y-4 mb-10">
          {equations.map((eq, i) => {
            let coeffCounter = 0;
            return (
              <div key={i} className="p-4 bg-slate-50 rounded-xl font-mono text-sm sm:text-base border border-transparent hover:border-slate-200 transition-colors flex flex-wrap items-center gap-x-2 gap-y-2">
                <span className="text-slate-400 mr-2">0{i+1}</span>
                {eq.parts.map((part, pIdx) => {
                  const isFormula = !["+", "→"].includes(part);
                  if (isFormula) {
                    const currentCoeffIdx = coeffCounter++;
                    return (
                      <div key={pIdx} className="flex items-center gap-1">
                        <input
                          type="text"
                          maxLength={2}
                          value={coeffInputs[i][currentCoeffIdx] || ''}
                          onChange={(e) => updateCoeff(i, currentCoeffIdx, e.target.value)}
                          className="w-8 h-8 text-center bg-white border border-slate-200 rounded-md focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-sm font-bold shadow-sm transition-all"
                          placeholder="1"
                        />
                        <span>{part}</span>
                      </div>
                    );
                  }
                  return <span key={pIdx} className="text-slate-400 px-1">{part}</span>;
                })}
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Security Code Entry</label>
          <div className="flex gap-4">
            {answers.map((val, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={val}
                onChange={(e) => {
                  const newAns = [...answers];
                  newAns[i] = e.target.value.replace(/\D/g, '');
                  setAnswers(newAns);
                  if (e.target.value && i < 3) {
                    (e.target.nextElementSibling as HTMLInputElement)?.focus();
                  }
                }}
                className="w-full aspect-square text-center text-3xl font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all"
                placeholder="_"
              />
            ))}
          </div>

          <button 
            onClick={handleSubmit}
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              feedback === 'correct' ? 'bg-green-600 text-white' : 
              feedback === 'incorrect' ? 'bg-red-600 text-white animate-shake' : 
              'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {feedback === 'correct' ? (
              <><CheckCircle2 className="w-5 h-5" /> Correct, Continue</>
            ) : feedback === 'incorrect' ? (
              <><XCircle className="w-5 h-5" /> Incorrect, Try Again</>
            ) : (
              'SUBMIT CODE'
            )}
          </button>
        </div>
      </motion.div>

      {/* Hint Modal */}
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
                <h3 className="text-xl font-bold">Progressive Hints</h3>
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
