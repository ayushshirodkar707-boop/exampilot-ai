'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Volume2, VolumeX } from 'lucide-react';

export default function PomodoroTimer() {
  const [mode, setMode] = useState<'25/5' | '50/10'>('25/5');
  const [isStudy, setIsStudy] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Mode durations in seconds
  const studyDuration = mode === '25/5' ? 25 * 60 : 50 * 60;
  const breakDuration = mode === '25/5' ? 5 * 60 : 10 * 60;
  const currentTotal = isStudy ? studyDuration : breakDuration;

  const [timeLeft, setTimeLeft] = useState(studyDuration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play a soft pleasant chime using Web Audio API
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      // AudioContext may be blocked before user interaction
    }
  };

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playChime();
            if (isStudy) {
              setSessionsCompleted((c) => c + 1);
              setIsStudy(false);
              return breakDuration;
            } else {
              setIsStudy(true);
              return studyDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isStudy, studyDuration, breakDuration]);

  // Mode switch handler
  const handleModeChange = (newMode: '25/5' | '50/10') => {
    setMode(newMode);
    setIsRunning(false);
    setIsStudy(true);
    setTimeLeft(newMode === '25/5' ? 25 * 60 : 50 * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsStudy(true);
    setTimeLeft(studyDuration);
  };

  // Format mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Circular progress (radius 120 -> circumference ~754)
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = timeLeft / currentTotal;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="card max-w-xl mx-auto flex flex-col items-center p-8 space-y-6">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">Pomodoro Focus Timer</h2>
          <p className="text-xs text-[var(--muted)]">Scientific intervals to maximize retention & prevent mental fatigue.</p>
        </div>

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="btn-ghost p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)]"
          title={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-primary-500" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-2 bg-[var(--background)] p-1.5 rounded-2xl border border-[var(--border)]">
        <button
          type="button"
          onClick={() => handleModeChange('25/5')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === '25/5'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          25 / 5 Standard
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('50/10')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === '50/10'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          50 / 10 Deep Work
        </button>
      </div>

      {/* Circular Timer Visual */}
      <div className="relative flex items-center justify-center my-4">
        <svg className="w-64 h-64 transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="var(--border)"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke={isStudy ? '#6366f1' : '#10b981'}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1">
            {isStudy ? (
              <span className="text-primary-500 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Study Sprint
              </span>
            ) : (
              <span className="text-emerald-500 flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5" /> Rest & Recharge
              </span>
            )}
          </div>
          <span className="text-5xl font-extrabold tracking-tight text-[var(--foreground)] font-mono">
            {timeString}
          </span>
          <span className="text-[11px] text-[var(--muted)] mt-1">
            {isStudy ? 'Stay focused, no distractions' : 'Stretch, hydrate, rest your eyes'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className={`px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg text-white ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
              : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{timeLeft === currentTotal ? 'Start Focus' : 'Resume'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="btn-secondary p-3.5 rounded-2xl"
          title="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Counter */}
      <div className="w-full pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
        <span>Sprints completed today:</span>
        <span className="font-bold text-primary-500 text-sm">
          {sessionsCompleted} {sessionsCompleted === 1 ? 'session' : 'sessions'}
        </span>
      </div>
    </div>
  );
}
