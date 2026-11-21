'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Clock, ShieldCheck } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  title?: string;
  subtitle?: string;
}

const MESSAGES = [
  'Mapping school & coaching commitments into free slots...',
  'Balancing high-yield topics for your selected subjects...',
  'Prioritizing weak subjects with extra problem sets...',
  'Inserting spaced revision cycles & timed mock exams...',
  'Applying Pomodoro recovery intervals to prevent burnout...',
  'Finalizing your precision day-by-day timetable...',
];

export default function LoadingOverlay({
  isLoading,
  title = 'AI Flight Controller is Calibrating Your Plan',
  subtitle = 'Crafting realistic day-by-day study sessions around your real commitments...',
}: LoadingOverlayProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isLoading) {
      setProgress(15);
      setMsgIndex(0);
      return;
    }

    // Increment progress smoothly
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.floor(Math.random() * 15) + 10;
      });
    }, 250);

    // Cycle informative AI thought messages
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 450);

    return () => {
      clearInterval(progressInterval);
      clearInterval(msgInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="card max-w-lg w-full p-8 text-center space-y-6 shadow-2xl border-primary-500/30 bg-[var(--card)] relative overflow-hidden">
        {/* Subtle glow accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Central Animated Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 animate-spin opacity-40 blur-sm" />
          <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-xl relative z-10">
            <Brain className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-[var(--foreground)] tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-[var(--muted)] max-w-sm mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Smooth Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2.5 bg-[var(--background)] rounded-full overflow-hidden border border-[var(--border)]">
            <div
              className="h-full bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[var(--muted)]">
            <span className="font-mono">{progress}% Complete</span>
            <span className="flex items-center gap-1 text-primary-500 font-medium">
              <Sparkles className="w-3 h-3" /> Real-time Synthesis
            </span>
          </div>
        </div>

        {/* Active Thought Bubble */}
        <div className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs font-medium text-primary-600 dark:text-primary-400 min-h-[46px] flex items-center justify-center transition-all">
          <span className="animate-in fade-in key={msgIndex}">
            {MESSAGES[msgIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}
