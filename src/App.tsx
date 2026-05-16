import { useState, useEffect, useRef } from 'react';
import { Play, Square, Hash, History, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateNumber = () => {
    // Range 1-49
    const newNumber = Math.floor(Math.random() * 49) + 1;
    setCurrentNumber(newNumber);
    setHistory((prev) => [newNumber, ...prev]);

    // Calculate next random interval (0.5s to 3.0s, step 0.1s)
    // 5 deciseconds to 30 deciseconds
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
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto p-4 md:p-8 space-y-8">
      {/* 1. Latest Number Display Area */}
      <section id="latest-display" className="flex flex-col items-center justify-center pt-8 pb-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white ring-1 ring-slate-200 rounded-2xl p-12 w-64 h-64 flex items-center justify-center shadow-xl">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentNumber}
                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.5, opacity: 0, y: -20 }}
                className="text-8xl font-extrabold text-slate-800 tabular-nums"
              >
                {currentNumber ?? '--'}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-4 text-slate-400 font-medium tracking-widest uppercase text-xs">
          Latest Number
        </p>
      </section>

      {/* 2. Control Buttons Area */}
      <section id="controls" className="flex gap-4 justify-center items-center py-4">
        <button
          id="btn-start"
          onClick={handleStart}
          disabled={isActive}
          className={`group flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg active:scale-95 ${
            isActive
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-emerald-200'
          }`}
        >
          <Play className={`w-5 h-5 ${isActive ? '' : 'fill-current'}`} />
          <span>Start</span>
        </button>

        <button
          id="btn-stop"
          onClick={handleStop}
          disabled={!isActive}
          className={`group flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg active:scale-95 ${
            !isActive
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-rose-500 text-white hover:bg-rose-600 hover:shadow-rose-200'
          }`}
        >
          <Square className={`w-5 h-5 ${!isActive ? '' : 'fill-current'}`} />
          <span>Stop</span>
        </button>
        
        {history.length > 0 && !isActive && (
           <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-4 text-slate-400 hover:text-slate-600 transition-colors"
            title="Clear History"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
      </section>

      {/* 3. History Area */}
      <section id="history-area" className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex items-center gap-2 mb-4 text-slate-500 px-2">
          <History className="w-4 h-4" />
          <h2 className="font-semibold text-sm uppercase tracking-wider">Historical Records</h2>
          <span className="ml-auto text-xs font-medium px-2 py-0.5 bg-slate-200 rounded-full text-slate-600">
            {history.length}
          </span>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm h-full overflow-y-auto no-scrollbar">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-2 opacity-50">
              <Hash className="w-8 h-8" />
              <p className="text-sm">No records yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-3">
              <AnimatePresence>
                {history.map((num, idx) => (
                  <motion.div
                    key={`${num}-${history.length - idx}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`aspect-square flex items-center justify-center rounded-lg text-lg font-bold border transition-colors ${
                      idx === 0 
                        ? 'bg-blue-50 border-blue-200 text-blue-600 ring-2 ring-blue-100' 
                        : 'bg-slate-50 border-slate-100 text-slate-500'
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

      <footer className="py-6 text-center">
        <p className="text-slate-400 text-xs">
          Built with precision • Random intervals 0.5s - 3.0s
        </p>
      </footer>
    </div>
  );
}

