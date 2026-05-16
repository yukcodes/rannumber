// /src/App.tsx

import { useState, useEffect, useRef } from 'react';
import { Play, Square, Hash, History, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateNumber = () => {
    // Range 1-49
    const newNumber = Math.floor(Math.random() * 49) + 1;
    setCurrentNumber(newNumber);
    setHistory((prev) => [newNumber, ...prev]);

    // Calculate next random interval (0.5s to 3.0s, step 0.1s)
    const deciseconds = Math.floor(Math.random() * (30 - 5 + 1) + 5);
    const nextInterval = deciseconds * 100;

    if (isActive) {
      timeoutRef.current = setTimeout(generateNumber, nextInterval);
    }
  };

  useEffect(() => {
    if (isActive) {
      generateNumber();
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentNumber(null);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto p-6 md:p-10 space-y-8">
      {/* 1. Latest Number Display Area */}
      <section id="latest-display" className="w-full">
        <div className="relative group w-full aspect-[16/9] sm:aspect-[21/9]">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-10 transition duration-1000"></div>
          <div className="relative bg-white border border-slate-200 rounded-3xl w-full h-full flex flex-col items-center justify-center shadow-sm overflow-hidden">
            <div className="absolute top-6 left-8 flex items-center gap-2 opacity-50">
               <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
               <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                 {isActive ? 'Live Stream' : 'System Standby'}
               </span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.span
                key={currentNumber}
                initial={{ scale: 0.9, opacity: 0, filter: 'blur(15px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 1.1, opacity: 0, filter: 'blur(15px)' }}
                transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                className="text-[9rem] md:text-[12rem] font-black text-slate-800 tabular-nums leading-none select-none drop-shadow-sm"
              >
                {currentNumber ?? '--'}
              </motion.span>
            </AnimatePresence>
            
            <div className="absolute bottom-6 text-slate-400 font-bold tracking-[0.4em] uppercase text-[11px]">
              Latest Generated Number
            </div>
          </div>
        </div>
      </section>

      {/* 2. Control Buttons Area */}
      <section id="controls" className="flex gap-4 items-center">
        <button
          id="btn-start"
          onClick={handleStart}
          disabled={isActive}
          className={`flex-1 group flex items-center justify-center gap-3 py-6 rounded-2xl font-black text-xl transition-all duration-300 shadow-lg active:scale-[0.98] ${
            isActive
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none border border-slate-100'
              : 'bg-emerald-500 text-white hover:bg-emerald-600 border border-emerald-400/20'
          }`}
        >
          <Play className={`w-6 h-6 ${isActive ? '' : 'fill-current'}`} />
          <span>START</span>
        </button>

        <button
          id="btn-stop"
          onClick={handleStop}
          disabled={!isActive}
          className={`flex-1 group flex items-center justify-center gap-3 py-6 rounded-2xl font-black text-xl transition-all duration-300 shadow-lg active:scale-[0.98] ${
            !isActive
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none border border-slate-100'
              : 'bg-rose-500 text-white hover:bg-rose-600 border border-rose-400/20'
          }`}
        >
          <Square className={`w-6 h-6 ${!isActive ? '' : 'fill-current'}`} />
          <span>STOP</span>
        </button>
        
        {history.length > 0 && !isActive && (
           <button
            onClick={clearHistory}
            className="p-6 rounded-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all active:rotate-180 duration-500 group border border-transparent hover:border-slate-200"
            title="Clear History"
          >
            <RefreshCw className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </section>

      {/* 3. History Area */}
      <section id="history-area" className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-4 text-slate-500 px-1">
          <History className="w-4 h-4" />
          <h2 className="font-bold text-[11px] uppercase tracking-[0.2em]">History Archive</h2>
          <span className="ml-auto text-[10px] font-bold px-3 py-1 bg-slate-200 rounded-lg text-slate-600">
            Total: {history.length}
          </span>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm h-full overflow-y-auto no-scrollbar min-h-[350px]">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 py-16 opacity-40">
              <Hash className="w-16 h-16 mb-4 stroke-[1.5]" />
              <p className="text-xs font-bold uppercase tracking-[0.3em]">No Records Yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
              <AnimatePresence initial={false}>
                {history.map((num, idx) => (
                  <motion.div
                    key={`${num}-${history.length - idx}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`aspect-square flex items-center justify-center rounded-xl text-xl font-extrabold border transition-all ${
                      idx === 0 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100 ring-4 ring-blue-50' 
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    {num}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <footer className="py-6 text-center border-t border-slate-100">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          Random Surge • Interval 0.5s - 3.0s
        </p>
      </footer>
    </div>
  );
}
