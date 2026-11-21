'use client';

import Link from 'next/link';
import {
  ClipboardList,
  CheckSquare,
  BookOpen,
  FileText,
  Timer,
  Target,
  ArrowRightLeft,
  Flame,
} from 'lucide-react';

export interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  examName: string;
  examDate: string; // ISO date string
  userName: string;
  userAvatar?: string | null;
  streakCount?: number;
  onChangeExam?: () => void;
}

const NAV_ITEMS = [
  { id: 'study-plan', label: 'Study Plan', icon: ClipboardList, emoji: '📋' },
  { id: 'daily-tasks', label: 'Daily Tasks', icon: CheckSquare, emoji: '✅' },
  { id: 'objective-tests', label: 'Objective Tests (100 MCQs)', icon: Target, emoji: '🎯' },
  { id: 'syllabus-tracker', label: 'Syllabus Tracker', icon: BookOpen, emoji: '📚' },
  { id: 'mock-tests', label: 'Mock Tests', icon: FileText, emoji: '📝' },
  { id: 'pomodoro', label: 'Pomodoro Timer', icon: Timer, emoji: '⏱️' },
] as const;

function getDaysRemaining(dateStr: string): number {
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function Sidebar({
  activeSection,
  onSectionChange,
  examName,
  examDate,
  userName,
  userAvatar,
  streakCount = 0,
  onChangeExam,
}: SidebarProps) {
  const daysRemaining = getDaysRemaining(examDate);

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-20 flex flex-col gap-4">
        {/* ── Profile card ── */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-10 w-10 rounded-full border border-[var(--border)]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-base font-bold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                {userName ? userName.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                {userName || 'Student'}
              </p>
              <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>
                  {streakCount} day{streakCount !== 1 ? 's' : ''} streak 🔥
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-sm">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onSectionChange(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                        : 'text-[var(--muted)] hover:bg-[var(--card-hover)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <span className="text-sm leading-none" aria-hidden="true">
                      {item.emoji}
                    </span>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Exam info ── */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Target Exam
          </p>
          <p className="mt-1 truncate text-sm font-bold text-[var(--foreground)]">
            {examName || 'Exam Not Set'}
          </p>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">
              {daysRemaining}
            </span>
            <span className="text-xs text-[var(--muted)]">
              days remaining
            </span>
          </div>

          {examDate && (
            <div className="mt-1 text-[11px] text-[var(--muted)]">
              {new Date(examDate).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          )}

          {onChangeExam ? (
            <button
              onClick={onChangeExam}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--card-hover)]"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-primary-500" />
              <span>Change Exam</span>
            </button>
          ) : (
            <Link
              href="/onboarding"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--card-hover)]"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-primary-500" />
              <span>Change Exam</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
