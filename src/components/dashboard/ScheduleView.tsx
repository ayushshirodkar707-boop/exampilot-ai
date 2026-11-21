'use client';

import React, { useState } from 'react';
import type { StudyPlan } from '@/types';
import { Calendar, RefreshCw, AlertTriangle, Sparkles, Clock, Target, Info } from 'lucide-react';

interface ScheduleViewProps {
  plan: StudyPlan | null;
  onRegenerate: () => void;
  onMissedDay: () => void;
  isRegenerating?: boolean;
}

export default function ScheduleView({
  plan,
  onRegenerate,
  onMissedDay,
  isRegenerating = false,
}: ScheduleViewProps) {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  if (!plan || !plan.weeks || plan.weeks.length === 0) {
    return (
      <div className="card text-center py-16">
        <Sparkles className="w-12 h-12 text-primary-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[var(--foreground)]">No Active Study Schedule</h3>
        <p className="text-sm text-[var(--muted)] mt-1 max-w-md mx-auto">
          Start by setting up your exam date, subjects, and study hours to let the AI build your customized timetable.
        </p>
        <button
          onClick={onRegenerate}
          className="mt-6 btn-primary inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Schedule</span>
        </button>
      </div>
    );
  }

  const currentWeekPlan = plan.weeks.find((w) => w.weekNumber === selectedWeek) || plan.weeks[0];

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <span>{plan.exam} Precision Timetable</span>
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1">
            Real-world schedule with exact time slots calibrated around your daily routine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onMissedDay}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:border-amber-400"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Missed a Day? Catch Up</span>
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Schedule'}</span>
          </button>
        </div>
      </div>

      {/* Routine Banner if present */}
      {plan.dailyRoutine && (
        <div className="p-3.5 rounded-xl bg-primary-50/50 dark:bg-primary-950/20 border border-primary-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              📅 Calibrated Routine:
            </span>
            <span className="text-[var(--muted)]">
              School: <strong>{plan.dailyRoutine.hasSchool ? plan.dailyRoutine.schoolTimings : 'Off'}</strong>
            </span>
            <span className="text-[var(--muted)]">
              Coaching: <strong>{plan.dailyRoutine.hasCoaching ? plan.dailyRoutine.coachingTimings : 'Self-study'}</strong>
            </span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold capitalize">
            {plan.dailyRoutine.studyPreference.replace('-', ' ')} mode
          </span>
        </div>
      )}

      {/* Week Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {plan.weeks.map((w) => {
          const isSelected = selectedWeek === w.weekNumber;
          return (
            <button
              key={w.weekNumber}
              type="button"
              onClick={() => setSelectedWeek(w.weekNumber)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isSelected
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                  : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--foreground)] hover:border-primary-400'
              }`}
            >
              Week {w.weekNumber}
            </button>
          );
        })}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentWeekPlan.days.map((day, idx) => {
          return (
            <div
              key={idx}
              className={`card flex flex-col justify-between p-4 relative ${
                day.isMockTestDay
                  ? 'border-rose-500/40 bg-rose-500/5'
                  : day.isRevisionDay
                  ? 'border-indigo-500/40 bg-indigo-500/5'
                  : ''
              }`}
            >
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div>
                    <h3 className="font-bold text-sm text-[var(--foreground)]">
                      {day.dayLabel}
                    </h3>
                    <div className="text-[11px] text-[var(--muted)]">
                      {day.date}
                    </div>
                  </div>

                  {day.isMockTestDay && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                      Mock Test
                    </span>
                  )}
                  {day.isRevisionDay && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                      Revision
                    </span>
                  )}
                </div>

                {/* Day Sessions */}
                <div className="mt-3 space-y-2.5">
                  {/* Morning */}
                  <div className="p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-amber-500 font-semibold">
                      <span>☀️ Morning</span>
                      <span>{day.blocks.morning.duration}m</span>
                    </div>
                    {day.blocks.morning.timeSlot && (
                      <div className="text-[10px] font-mono text-primary-500">
                        {day.blocks.morning.timeSlot}
                      </div>
                    )}
                    <div className="font-semibold text-[var(--foreground)] truncate">
                      {day.blocks.morning.subject}
                    </div>
                    <div className="text-[11px] text-[var(--muted)] truncate">
                      {day.blocks.morning.topics.join(' • ')}
                    </div>
                    {day.blocks.morning.actionItem && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 line-clamp-1 flex items-center gap-1 pt-0.5">
                        <Target className="w-2.5 h-2.5 shrink-0" />
                        <span>{day.blocks.morning.actionItem}</span>
                      </div>
                    )}
                  </div>

                  {/* Afternoon */}
                  <div className="p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-orange-500 font-semibold">
                      <span>🌤️ Afternoon</span>
                      <span>{day.blocks.afternoon.duration}m</span>
                    </div>
                    {day.blocks.afternoon.timeSlot && (
                      <div className="text-[10px] font-mono text-primary-500">
                        {day.blocks.afternoon.timeSlot}
                      </div>
                    )}
                    <div className="font-semibold text-[var(--foreground)] truncate">
                      {day.blocks.afternoon.subject}
                    </div>
                    <div className="text-[11px] text-[var(--muted)] truncate">
                      {day.blocks.afternoon.topics.join(' • ')}
                    </div>
                    {day.blocks.afternoon.actionItem && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 line-clamp-1 flex items-center gap-1 pt-0.5">
                        <Target className="w-2.5 h-2.5 shrink-0" />
                        <span>{day.blocks.afternoon.actionItem}</span>
                      </div>
                    )}
                  </div>

                  {/* Evening */}
                  <div className="p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-indigo-400 font-semibold">
                      <span>🌙 Evening</span>
                      <span>{day.blocks.evening.duration}m</span>
                    </div>
                    {day.blocks.evening.timeSlot && (
                      <div className="text-[10px] font-mono text-primary-500">
                        {day.blocks.evening.timeSlot}
                      </div>
                    )}
                    <div className="font-semibold text-[var(--foreground)] truncate">
                      {day.blocks.evening.subject}
                    </div>
                    <div className="text-[11px] text-[var(--muted)] truncate">
                      {day.blocks.evening.topics.join(' • ')}
                    </div>
                    {day.blocks.evening.actionItem && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 line-clamp-1 flex items-center gap-1 pt-0.5">
                        <Target className="w-2.5 h-2.5 shrink-0" />
                        <span>{day.blocks.evening.actionItem}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Day Note */}
                {day.dailyNote && (
                  <div className="mt-2.5 pt-2 border-t border-[var(--border)] text-[10px] text-[var(--muted)] italic flex items-center gap-1">
                    <Info className="w-3 h-3 text-primary-500 shrink-0" />
                    <span className="truncate">{day.dailyNote}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
