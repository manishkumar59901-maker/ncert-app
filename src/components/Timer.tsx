import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Play, Pause, RotateCcw, Timer as TimerIcon, Coffee, Brain } from 'lucide-react';
import { motion } from 'motion/react';

interface TimerProps {
  profile: UserProfile | null;
}

export default function Timer({ profile }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notification here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'study' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'study' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'study' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className="p-6 h-[calc(100vh-140px)] flex flex-col items-center justify-center space-y-12">
      {/* Mode Switcher */}
      <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm flex gap-1">
        <button 
          onClick={() => switchMode('study')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'study' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400'
          }`}
        >
          Study
        </button>
        <button 
          onClick={() => switchMode('break')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'break' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'text-slate-400'
          }`}
        >
          Break
        </button>
      </div>

      {/* Timer Circle */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle 
            cx="144" cy="144" r="130" 
            className="stroke-slate-100 fill-none" 
            strokeWidth="8" 
          />
          <motion.circle 
            cx="144" cy="144" r="130" 
            className={mode === 'study' ? 'stroke-blue-600 fill-none' : 'stroke-green-600 fill-none'}
            strokeWidth="8" 
            strokeLinecap="round"
            strokeDasharray="816"
            animate={{ strokeDashoffset: 816 - (816 * progress) / 100 }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <div className="text-6xl font-black text-slate-900 tracking-tighter">
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            {mode === 'study' ? 'Focus Session' : 'Short Break'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button 
          onClick={resetTimer}
          className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm"
        >
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl transition-transform active:scale-95 ${
            mode === 'study' ? 'bg-blue-600 shadow-blue-200' : 'bg-green-600 shadow-green-200'
          }`}
        >
          {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <div className="w-14 h-14 bg-slate-50 flex items-center justify-center text-slate-300">
          {mode === 'study' ? <Brain size={24} /> : <Coffee size={24} />}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 max-w-xs text-center">
        <p className="text-xs text-blue-700 font-medium">
          {mode === 'study' 
            ? "Tip: Keep your phone away to maximize focus." 
            : "Tip: Stretch your body and drink some water."}
        </p>
      </div>
    </div>
  );
}
