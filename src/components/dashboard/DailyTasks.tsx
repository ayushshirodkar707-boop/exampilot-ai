'use client';

import React from 'react';
import type { DayPlan, TaskBlock } from '@/types';
import { CheckCircle2, Circle, Sun, CloudSun, Moon, Award, Calendar, Target, Clock } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';

interface DailyTasksProps {
  todayPlan: DayPlan | null;
  onTaskToggle: (blockKey: 'morning' | 'afternoon' | 'evening', completed: boolean) => void;
}

export default function DailyTasks({ todayPlan, onTaskToggle }: DailyTasksProps) {
  if (!todayPlan) {
    return (
      <div className="card text-center py-12">
        <Calendar className="w-10 h-10 text-[var(--muted)] mx-auto mb-3" />
        <h3 className="font-semibold text-lg text-[var(--foreground)]">No Tasks Scheduled for Today</h3>
        <p className="text-xs text-[var(--muted)] mt-1">
          Generate or choose a study week in the schedule viewer to assign daily learning targets.
        </p>
      </div>
    );
  }

  const { blocks, isMockTestDay, isRevisionDay, date, dayLabel, dailyNote } = todayPlan;
  const blocksList: { key: 'morning' | 'afternoon' | 'evening'; block: TaskBlock; title: string; icon: any; color: string }[] = [
    { key: 'morning', block: blocks.morning, title: 'Morning Session', icon: Sun, color: 'text-amber-500' },
    { key: 'afternoon', block: blocks.afternoon, title: 'Afternoon Session', icon: CloudSun, color: 'text-orange-500' },
    { key: 'evening', block: blocks.evening, title: 'Evening Wrap-Up', icon: Moon, color: 'text-indigo-400' },
  ];

  const completedCount = blocksList.filter((b) => b.block.completed).length;
  const percent = Math.round((completedCount / 3) * 100);

  return (
    <div className="card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[var(--foreground)]">Today’s Study Checkpoints</h2>
            {isMockTestDay && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                📝 Mock Test Day
              </span>
            )}
            {isRevisionDay && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                🔄 Revision Day
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {dayLabel} • {date} • Complete your daily learning blocks
          </p>
          {dailyNote && (
            <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-1">
              💡 {dailyNote}
            </p>
          )}
        </div>

        <div className="w-full sm:w-48">
          <ProgressBar
            value={percent}
            label={`${completedCount}/3 Completed`}
            color={percent === 100 ? 'success' : 'primary'}
            showPercentage={true}
          />
        </div>
      </div>

      {percent === 100 && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 animate-in fade-in">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm">Target Achieved for Today! 🎉</div>
            <div className="text-xs opacity-90">All 3 study sessions completed. Your streak is protected.</div>
          </div>
        </div>
      )}

      {/* Task Checklist */}
      <div className="space-y-3">
        {blocksList.map(({ key, block, title, icon: Icon, color }) => {
          const isDone = block.completed;
          return (
            <div
              key={key}
              onClick={() => onTaskToggle(key, !isDone)}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 select-none ${
                isDone
                  ? 'bg-emerald-500/5 border-emerald-500/30 opacity-80'
                  : 'bg-[var(--background)] border-[var(--border)] hover:border-primary-400 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <button
                  type="button"
                  aria-label={`Toggle ${title}`}
                  className="mt-0.5 text-[var(--muted)] hover:text-primary-500 transition-colors shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-6 h-6 text-[var(--muted)]" />
                  )}
                </button>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                        {title}
                      </span>
                    </div>

                    {block.timeSlot && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-primary-100/60 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 font-semibold">
                        {block.timeSlot}
                      </span>
                    )}

                    <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--card-hover)] text-[var(--muted)] border border-[var(--border)]">
                      {block.duration} min
                    </span>
                  </div>

                  <h3
                    className={`font-semibold text-base ${
                      isDone ? 'line-through text-[var(--muted)]' : 'text-[var(--foreground)]'
                    }`}
                  >
                    {block.subject}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {block.topics.map((t, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {block.actionItem && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
                      <Target className="w-3.5 h-3.5 shrink-0" />
                      <span>{block.actionItem}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
