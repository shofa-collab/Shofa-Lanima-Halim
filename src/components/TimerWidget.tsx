import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Bell, Volume2, X } from 'lucide-react';
import { formatTimer } from '../game/rules';
import { sound } from '../utils/sound';

interface TimerWidgetProps {
  initialSeconds?: number;
  isOpen?: boolean;
  onClose?: () => void;
  floating?: boolean;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({
  initialSeconds = 30,
  isOpen = true,
  onClose,
  floating = false
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSeconds(initialSeconds);
    setTotalTime(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            sound.playTimerAlarm();
            return 0;
          }
          if (prev <= 5) {
            sound.playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleRun = () => {
    sound.playTap();
    setIsRunning((prev) => !prev);
  };

  const resetTimer = (newSecs?: number) => {
    sound.playTap();
    setIsRunning(false);
    const target = newSecs ?? totalTime;
    setSeconds(target);
    if (newSecs) setTotalTime(newSecs);
  };

  const addTime = (delta: number) => {
    sound.playTap();
    setSeconds((prev) => Math.max(0, prev + delta));
    setTotalTime((prev) => Math.max(0, prev + delta));
  };

  const progress = totalTime > 0 ? (seconds / totalTime) * 100 : 0;
  const isUrgent = seconds > 0 && seconds <= 5;
  const isDone = seconds === 0;

  if (!isOpen) return null;

  const content = (
    <div className={`bg-slate-900/95 border-2 border-amber-400/80 text-white rounded-3xl p-5 shadow-2xl backdrop-blur-md ${
      floating ? 'w-80 sm:w-96' : 'w-full'
    }`}>
      <div className="flex items-center justify-between mb-3 border-b border-slate-700/60 pb-2">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400 animate-bounce" />
          <span className="font-bold tracking-wide text-sm text-amber-300">ARENA TIMER</span>
        </div>
        {onClose && (
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close timer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Clock */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <div
          className={`font-mono text-5xl sm:text-6xl font-black tracking-wider transition-colors duration-200 tabular-nums ${
            isDone
              ? 'text-rose-500 animate-pulse'
              : isUrgent
              ? 'text-rose-400 animate-bounce'
              : 'text-amber-300'
          }`}
        >
          {formatTimer(seconds)}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-3 mt-3 overflow-hidden border border-slate-700">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isDone ? 'bg-rose-600' : isUrgent ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-emerald-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Primary Play/Pause and Reset Buttons */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <button
          onClick={toggleRun}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-lg transition-transform active:scale-95 shadow-md ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" /> PAUSE
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" /> START
            </>
          )}
        </button>

        <button
          onClick={() => resetTimer()}
          className="flex items-center justify-center gap-1.5 py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold text-base transition-transform active:scale-95 border border-slate-700"
        >
          <RotateCcw className="w-4 h-4" /> RESET
        </button>

        <button
          onClick={() => addTime(10)}
          className="flex items-center justify-center gap-1 py-3 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-base transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> 10s
        </button>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-slate-800 text-xs">
        <span className="text-slate-400 font-semibold shrink-0">Presets:</span>
        <div className="flex gap-1.5 overflow-x-auto">
          {[15, 30, 45, 60].map((t) => (
            <button
              key={t}
              onClick={() => resetTimer(t)}
              className={`px-2.5 py-1.5 rounded-xl font-bold transition ${
                totalTime === t && !isRunning
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (floating) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in-95 duration-200">
        {content}
      </div>
    );
  }

  return content;
};
