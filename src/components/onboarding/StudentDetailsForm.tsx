'use client';

import React, { useState, useId, useMemo } from 'react';
import type { OnboardingData, ExamData, ExamPaperDate } from '@/types';
import { Calendar, Clock, Sparkles, AlertCircle, ArrowRight, CheckCircle2, BookOpen, Layers } from 'lucide-react';

interface StudentDetailsFormProps {
  subjects: string[];
  currentExam?: ExamData;
  onSubmit: (details: Omit<OnboardingData, 'country' | 'exam' | 'selectedSubjects' | 'dailyRoutine'>) => void;
  isLoading?: boolean;
}

export default function StudentDetailsForm({
  subjects,
  currentExam,
  onSubmit,
  isLoading = false,
}: StudentDetailsFormProps) {
  // Use official detected exam date if available, otherwise default to 60 days
  const detectedDefaultDate = useMemo(() => {
    if (currentExam?.defaultDate) {
      return currentExam.defaultDate;
    }
    return new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }, [currentExam]);

  const [examDate, setExamDate] = useState<string>(detectedDefaultDate);
  const [dailyHours, setDailyHours] = useState<number>(6);
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [strongSubjects, setStrongSubjects] = useState<string[]>([]);
  const [prepLevel, setPrepLevel] = useState<'beginner' | 'intermediate' | 'revision'>('intermediate');
  const [error, setError] = useState<string | null>(null);

  const examDateId = useId();

  // Calculate days left
  const calculateDaysLeft = (dateStr: string) => {
    if (!dateStr) return 0;
    const target = new Date(dateStr).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const daysLeft = calculateDaysLeft(examDate);

  // Quick Date Preset options (No typing required!)
  const datePresets = useMemo(() => {
    const today = new Date();
    const addDays = (days: number) => {
      const d = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
      return d.toISOString().split('T')[0];
    };

    const presets = [];

    if (currentExam?.defaultDate) {
      const officialDiff = calculateDaysLeft(currentExam.defaultDate);
      presets.push({
        label: `Official Exam Date (${officialDiff} days)`,
        date: currentExam.defaultDate,
        badge: 'Official / Detected',
      });
    }

    presets.push(
      { label: '30-Day Sprint', date: addDays(30), badge: 'Intensive' },
      { label: '60-Day Prep', date: addDays(60), badge: 'Balanced' },
      { label: '90-Day Mastery', date: addDays(90), badge: 'Thorough' },
      { label: '120-Day Deep Prep', date: addDays(120), badge: 'Long Term' }
    );

    return presets;
  }, [currentExam]);

  const toggleWeak = (subj: string) => {
    if (weakSubjects.includes(subj)) {
      setWeakSubjects(weakSubjects.filter((s) => s !== subj));
    } else {
      setWeakSubjects([...weakSubjects, subj]);
      setStrongSubjects(strongSubjects.filter((s) => s !== subj));
    }
  };

  const toggleStrong = (subj: string) => {
    if (strongSubjects.includes(subj)) {
      setStrongSubjects(strongSubjects.filter((s) => s !== subj));
    } else {
      setStrongSubjects([...strongSubjects, subj]);
      setWeakSubjects(weakSubjects.filter((s) => s !== subj));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examDate) {
      setError('Please select your exam date.');
      return;
    }
    if (daysLeft <= 0) {
      setError('Your exam date must be in the future.');
      return;
    }
    setError(null);
    onSubmit({
      examDate,
      dailyHours,
      weakSubjects,
      strongSubjects,
      prepLevel,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Final Strategy Formulation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Target Exam Date &amp; Focus Strategy
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Choose your target exam date with one click. For board exams, your plan automatically incorporates revision cycles before each paper.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Official Board Exam Multi-Paper Timetable (If applicable) */}
      {currentExam?.isBoardExam && currentExam?.paperDates && currentExam.paperDates.length > 0 && (
        <div className="card border-primary-500/30 bg-primary-50/20 dark:bg-primary-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary-500" />
              <h3 className="font-bold text-sm text-[var(--foreground)]">
                Detected Board Exam Timetable ({currentExam.name})
              </h3>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300">
              Multi-Paper Schedule
            </span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            Your study plan reserves dedicated 3-to-4 day intensive gap-day revisions and sample paper drills before each paper date below:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {currentExam.paperDates.map((paper: ExamPaperDate, idx: number) => {
              const paperDays = calculateDaysLeft(paper.date);
              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-[var(--foreground)]">{paper.paperName}</div>
                    <div className="text-[11px] text-[var(--muted)]">{paper.date}</div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-bold">
                    {paperDays}d left
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selectable Exam Date (No typing required) */}
      <div className="card space-y-3">
        <label htmlFor={examDateId} className="label flex items-center justify-between mb-0">
          <span className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
            <Calendar className="w-4 h-4 text-primary-500" />
            Target Exam Date
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-bold">
            {daysLeft} days remaining ({examDate})
          </span>
        </label>

        {/* Quick Date Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-medium text-[var(--muted)]">
            Choose a target timeline (click to select):
          </span>
          <div className="flex flex-wrap gap-2">
            {datePresets.map((preset) => {
              const isSelected = examDate === preset.date;
              return (
                <button
                  key={preset.date}
                  type="button"
                  onClick={() => setExamDate(preset.date)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                      : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:border-primary-400'
                  }`}
                >
                  <span>{preset.label}</span>
                  {preset.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300'
                    }`}>
                      {preset.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Calendar Date Picker */}
        <div className="pt-2 border-t border-[var(--border)] flex items-center gap-3">
          <span className="text-xs text-[var(--muted)] font-medium">Or pick any specific date:</span>
          <input
            id={examDateId}
            type="date"
            value={examDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setExamDate(e.target.value)}
            className="input-field max-w-[200px] text-xs py-1.5 cursor-pointer"
            required
          />
        </div>
      </div>

      {/* Daily Study Hours (Selectable chips + slider) */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <span className="label text-xs font-bold flex items-center gap-2 mb-0">
            <Clock className="w-4 h-4 text-primary-500" />
            Dedicated Self-Study Hours (Per Day)
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
            {dailyHours} Hours / Day
          </span>
        </div>

        {/* Hour selection chips */}
        <div className="flex flex-wrap gap-2">
          {[3, 4, 5, 6, 8, 10, 12].map((hrs) => {
            const isSelected = dailyHours === hrs;
            return (
              <button
                key={hrs}
                type="button"
                onClick={() => setDailyHours(hrs)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:border-primary-400'
                }`}
              >
                {hrs} Hours
              </button>
            );
          })}
        </div>

        <input
          type="range"
          min={2}
          max={14}
          step={1}
          value={dailyHours}
          onChange={(e) => setDailyHours(Number(e.target.value))}
          className="w-full accent-primary-600 h-2 bg-[var(--border)] rounded-lg cursor-pointer"
        />
        <p className="text-[11px] text-[var(--muted)]">
          Self-study hours outside of your school and coaching attendance.
        </p>
      </div>

      {/* Weak & Strong Subjects */}
      <div className="card space-y-4">
        <div>
          <label className="label text-xs font-bold">
            Which subjects need extra remediation? (Weak Subjects)
          </label>
          <p className="text-[11px] text-[var(--muted)] mb-2.5">
            The AI gives these subjects prime morning slots, extra revision cycles, and higher question volume.
          </p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subj) => {
              const isWeak = weakSubjects.includes(subj);
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => toggleWeak(subj)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isWeak
                      ? 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 font-bold shadow-sm'
                      : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:border-red-400 hover:text-[var(--foreground)]'
                  }`}
                >
                  {isWeak ? '⚠️ ' : ''}
                  {subj}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border)]">
          <label className="label text-xs font-bold">
            Which subjects are your strongest? (High Confidence)
          </label>
          <p className="text-[11px] text-[var(--muted)] mb-2.5">
            Strong subjects are scheduled for rapid revision, speed drills, and mock tests.
          </p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subj) => {
              const isStrong = strongSubjects.includes(subj);
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => toggleStrong(subj)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isStrong
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                      : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:border-emerald-400 hover:text-[var(--foreground)]'
                  }`}
                >
                  {isStrong ? '⭐ ' : ''}
                  {subj}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Prep Level */}
      <div className="card space-y-3">
        <label className="label text-xs font-bold">Current Preparation Stage</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'beginner' as const,
              title: 'Beginner / Foundation',
              desc: 'Starting syllabus from scratch. Focus on concept building.',
            },
            {
              id: 'intermediate' as const,
              title: 'Intermediate / In-Progress',
              desc: '50%+ syllabus completed. Focus on question practice & PYQs.',
            },
            {
              id: 'revision' as const,
              title: 'Final Revision / Mastery',
              desc: 'Syllabus done. Focus on full-length mocks, speed & error logs.',
            },
          ].map((item) => {
            const isSelected = prepLevel === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setPrepLevel(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 ring-1 ring-primary-500'
                    : 'border-[var(--border)] bg-[var(--background)] hover:border-primary-400'
                }`}
              >
                <div className="font-bold text-xs text-[var(--foreground)]">{item.title}</div>
                <div className="text-[11px] text-[var(--muted)] mt-1">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50"
      >
        <span>Generate Precision Study Plan</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
