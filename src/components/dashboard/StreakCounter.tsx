'use client';

import React from 'react';
import { Flame, Trophy, Zap } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
  bestStreak?: number;
}

export default function StreakCounter({ streak, bestStreak = 7 }: StreakCounterProps) {
  // Motivational message
  const getMessage = (days: number) => {
    if (days === 0) return 'Start today to ignite your study streak!';
    if (days < 3) return 'Great start! Consistency is building.';
    if (days < 7) return "You're on fire! Keep the momentum.";
    if (days < 14) return 'Outstanding discipline! Two full weeks.';
    if (days < 30) return 'Elite study habit unlocked!';
    return 'Legendary consistency! Top 1% student.';
  };

  return (
    <div className="card relative overflow-hidden flex flex-col justify-between p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)] flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          Daily Study Streak
        </span>
        <span className="text-xs text-[var(--muted)] flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5 text-yellow-500" />
          Best: {Math.max(streak, bestStreak)}d
        </span>
      </div>

      <div className="flex items-center gap-4 my-2">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform ${
            streak > 0
              ? 'bg-amber-500/10 text-amber-500 shadow-lg shadow-amber-500/20 animate-pulse-slow'
              : 'bg-[var(--card-hover)] text-[var(--muted)]'
          }`}
        >
          <Flame
            className={`w-8 h-8 ${
              streak > 0 ? 'fill-amber-500 stroke-amber-600' : 'stroke-current'
            }`}
          />
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)]">
              {streak}
            </span>
            <span className="text-sm font-semibold text-[var(--muted)]">
              {streak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {getMessage(streak)}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted)]">
        <span>Log today’s tasks to keep streak active</span>
        <span className="text-emerald-500 font-medium">● Active</span>
      </div>
    </div>
  );
}
