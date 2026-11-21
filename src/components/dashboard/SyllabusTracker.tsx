'use client';

import React, { useState } from 'react';
import type { Chapter } from '@/types';
import { BookOpen, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronRight, Filter, Target } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';

interface SyllabusTrackerProps {
  chapters: Chapter[];
  onStatusChange: (chapterId: string, newStatus: Chapter['status']) => void;
  onStartTest?: (subject: string, chapter: string) => void;
}

export default function SyllabusTracker({ chapters, onStatusChange, onStartTest }: SyllabusTrackerProps) {
  const [filter, setFilter] = useState<'all' | 'not-started' | 'in-progress' | 'completed' | 'needs-revision'>('all');
  const [collapsedSubjects, setCollapsedSubjects] = useState<Record<string, boolean>>({});

  // Group chapters by subject
  const subjectsMap: Record<string, Chapter[]> = {};
  chapters.forEach((ch) => {
    if (!subjectsMap[ch.subject]) {
      subjectsMap[ch.subject] = [];
    }
    subjectsMap[ch.subject].push(ch);
  });

  const subjects = Object.keys(subjectsMap);

  const toggleSubjectCollapse = (subj: string) => {
    setCollapsedSubjects((prev) => ({
      ...prev,
      [subj]: !prev[subj],
    }));
  };

  // Overall statistics
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((c) => c.status === 'completed').length;
  const inProgressChapters = chapters.filter((c) => c.status === 'in-progress').length;
  const needsRevisionChapters = chapters.filter((c) => c.status === 'needs-revision').length;

  const overallPercent = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const statusConfig: Record<
    Chapter['status'],
    { label: string; color: string; badge: string; icon: any }
  > = {
    'not-started': {
      label: 'Not Started',
      color: 'text-slate-400',
      badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      icon: Clock,
    },
    'in-progress': {
      label: 'In Progress',
      color: 'text-amber-500',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: Clock,
    },
    'completed': {
      label: 'Completed',
      color: 'text-emerald-500',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: CheckCircle2,
    },
    'needs-revision': {
      label: 'Needs Revision',
      color: 'text-rose-500',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: AlertCircle,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header & Overall Progress */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
              Syllabus Completion Tracker
            </h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              Mark chapter completion, track subject mastery, and highlight topics requiring extra review.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--muted)] font-medium">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-[var(--background)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">All Chapters</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="needs-revision">Needs Revision</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-[11px] text-[var(--muted)] font-medium">Total Chapters</div>
            <div className="text-xl font-bold text-[var(--foreground)] mt-0.5">{totalChapters}</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-[11px] text-emerald-500 font-medium">Completed</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {completedChapters}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-[11px] text-amber-500 font-medium">In Progress</div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {inProgressChapters}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-[11px] text-rose-500 font-medium">Needs Revision</div>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">
              {needsRevisionChapters}
            </div>
          </div>
        </div>

        <div>
          <ProgressBar
            value={overallPercent}
            label="Overall Syllabus Progress"
            color="primary"
            showPercentage={true}
          />
        </div>
      </div>

      {/* Subject Sections */}
      {subjects.length === 0 ? (
        <div className="card text-center py-12 text-[var(--muted)] text-sm">
          No syllabus data loaded. Configure your exam in the onboarding wizard to populate chapters.
        </div>
      ) : (
        <div className="space-y-4">
          {subjects.map((subj) => {
            const subjChapters = subjectsMap[subj];
            const filteredChapters = subjChapters.filter(
              (c) => filter === 'all' || c.status === filter
            );
            const subjCompleted = subjChapters.filter((c) => c.status === 'completed').length;
            const subjPercent = Math.round((subjCompleted / subjChapters.length) * 100);
            const isCollapsed = !!collapsedSubjects[subj];

            return (
              <div key={subj} className="card overflow-hidden p-0">
                {/* Subject Header */}
                <div
                  onClick={() => toggleSubjectCollapse(subj)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-[var(--card-hover)] transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <button type="button" className="text-[var(--muted)]">
                      {isCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <h3 className="font-bold text-base text-[var(--foreground)]">{subj}</h3>
                      <div className="text-xs text-[var(--muted)]">
                        {subjCompleted} of {subjChapters.length} chapters completed ({subjPercent}%)
                      </div>
                    </div>
                  </div>

                  <div className="w-32 hidden sm:block">
                    <ProgressBar value={subjPercent} size="sm" color="success" />
                  </div>
                </div>

                {/* Chapter List */}
                {!isCollapsed && (
                  <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
                    {filteredChapters.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[var(--muted)]">
                        No chapters matching filter &quot;{filter}&quot;.
                      </div>
                    ) : (
                      filteredChapters.map((ch) => {
                        return (
                          <div
                            key={ch.id}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--background)]/50 hover:bg-[var(--background)] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-4 h-4 text-primary-500 shrink-0" />
                              <span className="text-sm font-medium text-[var(--foreground)]">
                                {ch.name}
                              </span>
                            </div>

                            {/* Status Buttons & Test Action */}
                            <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                              {onStartTest && (
                                <button
                                  type="button"
                                  onClick={() => onStartTest(ch.subject, ch.name)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900 border border-primary-500/30 flex items-center gap-1 transition-all"
                                  title="Launch 25 MCQs for this chapter"
                                >
                                  <Target className="w-3.5 h-3.5" />
                                  <span>Test 25 MCQs</span>
                                </button>
                              )}

                              <div className="flex items-center gap-1.5 flex-wrap">
                                {(
                                [
                                  'not-started',
                                  'in-progress',
                                  'completed',
                                  'needs-revision',
                                ] as Chapter['status'][]
                              ).map((st) => {
                                const isCurrent = ch.status === st;
                                const cfg = statusConfig[st];
                                return (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => onStatusChange(ch.id, st)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-150 ${
                                      isCurrent
                                        ? `${cfg.badge} ring-1 ring-current font-semibold`
                                        : 'bg-[var(--card)] text-[var(--muted)] border-transparent hover:border-[var(--border)]'
                                    }`}
                                  >
                                    {cfg.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
