'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useStudyData } from '@/hooks/useStudyData';
import { getTestSet, generateChapterMCQBank } from '@/lib/mcqEngine';
import type { MCQQuestion } from '@/types';
import {
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Play,
  Check,
  Pause,
  BarChart2,
} from 'lucide-react';

interface ObjectiveTestArenaProps {
  initialSubject?: string;
  initialChapter?: string;
}

export default function ObjectiveTestArena({
  initialSubject,
  initialChapter,
}: ObjectiveTestArenaProps) {
  const { profile, chapters, addMockTest } = useStudyData();

  // Available subjects
  const availableSubjects = useMemo(() => {
    if (profile?.selectedSubjects && profile.selectedSubjects.length > 0) {
      return profile.selectedSubjects;
    }
    return ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  }, [profile]);

  const [selectedSubject, setSelectedSubject] = useState<string>(
    initialSubject || availableSubjects[0] || 'Physics'
  );

  // Available chapters for selected subject
  const availableChapters = useMemo(() => {
    const matching = chapters
      .filter((c) => c.subject.toLowerCase() === selectedSubject.toLowerCase())
      .map((c) => c.name);

    if (matching.length > 0) return matching;

    // Fallback default chapters
    if (selectedSubject.includes('Phys')) {
      return ['Kinematics & Motion', 'Laws of Motion', 'Work, Power & Energy', 'Thermodynamics', 'Electrostatics', 'Current Electricity', 'Optics'];
    }
    if (selectedSubject.includes('Chem')) {
      return ['Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium', 'Organic Chemistry Basics', 'Electrochemistry'];
    }
    if (selectedSubject.includes('Math')) {
      return ['Calculus & Limits', 'Differential Equations', 'Coordinate Geometry', 'Vectors & 3D', 'Matrices & Determinants', 'Probability'];
    }
    return ['Unit 1 Core Theory', 'Unit 2 Application', 'Unit 3 Problem Solving', 'Unit 4 Advanced Analysis'];
  }, [chapters, selectedSubject]);

  const [selectedChapter, setSelectedChapter] = useState<string>(
    initialChapter || availableChapters[0] || 'Core Mechanics'
  );

  // Keep selectedChapter synced when subject changes
  useEffect(() => {
    if (!availableChapters.includes(selectedChapter)) {
      setSelectedChapter(availableChapters[0] || 'Core Concepts');
    }
  }, [selectedSubject, availableChapters, selectedChapter]);

  // Test set choice: 1 (Q1-25), 2 (Q26-50), 3 (Q51-75), 4 (Q76-100), or 'random'
  const [selectedSet, setSelectedSet] = useState<1 | 2 | 3 | 4 | 'random'>(1);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(30);

  // Test Execution State
  const [testState, setTestState] = useState<'idle' | 'in-progress' | 'completed'>('idle');
  const [activeQuestions, setActiveQuestions] = useState<MCQQuestion[]>([]);
  const [activeSetName, setActiveSetName] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // User answers: questionIndex (0-24) -> selected option index (0, 1, 2, 3)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  // Marked for review set
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30 * 60);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Review Filter
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'unattempted' | 'correct'>('all');
  const [isLoggedToMocks, setIsLoggedToMocks] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Start Test Handler
  const handleStartTest = (setChoice: 1 | 2 | 3 | 4 | 'random') => {
    const testData = getTestSet(selectedChapter, selectedSubject, setChoice);
    setActiveQuestions(testData.questions);
    setActiveSetName(testData.setName);
    setSelectedSet(setChoice);
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedForReview(new Set());
    setSecondsRemaining(timeLimitMinutes * 60);
    setTimeSpent(0);
    setIsTimerPaused(false);
    setIsLoggedToMocks(false);
    setTestState('in-progress');
  };

  // Timer Tick
  useEffect(() => {
    if (testState !== 'in-progress' || isTimerPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [testState, isTimerPaused]);

  // Finish / Submit Test
  const handleFinishTest = () => {
    setShowSubmitModal(false);
    setTestState('completed');
  };

  // Calculate Test Statistics
  const results = useMemo(() => {
    if (testState !== 'completed' || activeQuestions.length === 0) return null;

    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    activeQuestions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans === undefined) {
        unattempted++;
      } else if (ans === q.correctIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const total = activeQuestions.length; // 25
    const scorePercentage = Math.round((correct / total) * 100);
    // Competitive exam marking: +4 for correct, -1 for wrong
    const competitiveScore = correct * 4 - wrong * 1;
    const maxScore = total * 4;

    return {
      total,
      correct,
      wrong,
      unattempted,
      scorePercentage,
      competitiveScore,
      maxScore,
    };
  }, [testState, activeQuestions, userAnswers]);

  // Save to Mock Tests
  const handleLogScoreToMockTests = async () => {
    if (!results || isLoggedToMocks) return;

    try {
      await addMockTest({
        id: `mcq-test-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        examName: `${selectedSubject}: ${selectedChapter} (${activeSetName})`,
        score: results.correct,
        maxScore: results.total,
        notes: `Objective Test Arena | 25 Questions | ${results.scorePercentage}% Accuracy (${timeSpent}s)`,
      });
      setIsLoggedToMocks(true);
    } catch (err) {
      console.error('Failed to log mock test:', err);
    }
  };

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle user answer selection
  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  // Clear answer
  const handleClearAnswer = () => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentIndex];
      return copy;
    });
  };

  // Toggle Marked for Review
  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const copy = new Set(prev);
      if (copy.has(currentIndex)) {
        copy.delete(currentIndex);
      } else {
        copy.add(currentIndex);
      }
      return copy;
    });
  };

  // ─────────────────────────────────────────────────────────────────
  // VIEW 1: SELECTION & LAUNCH ARENA (IDLE)
  // ─────────────────────────────────────────────────────────────────
  if (testState === 'idle') {
    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Banner */}
        <div className="card bg-gradient-to-br from-primary-600/10 via-primary-500/5 to-transparent border-primary-500/20 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 text-xs font-bold mb-2">
                <Target className="w-3.5 h-3.5" />
                <span>Objective Test Generator</span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                Chapter-Wise Objective Test Arena
              </h2>
              <p className="text-xs text-[var(--muted)] mt-1 max-w-xl">
                Every chapter includes a full <strong>100-Question MCQ Bank</strong> with comprehensive step-by-step solutions. Take targeted tests of <strong>25 questions at a time</strong> to master key concepts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
                <span className="block text-2xl font-black text-primary-600 dark:text-primary-400">100</span>
                <span className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-wider">MCQs / Chapter</span>
              </div>
              <div className="text-center px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
                <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">25</span>
                <span className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-wider">Questions / Test</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Selection Controls */}
        <div className="card space-y-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-500" />
            Step 1: Select Subject &amp; Chapter
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject Selector */}
            <div>
              <label className="label text-xs">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input-field text-xs py-2.5 cursor-pointer font-medium"
              >
                {availableSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Selector */}
            <div>
              <label className="label text-xs">Chapter</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="input-field text-xs py-2.5 cursor-pointer font-medium"
              >
                {availableChapters.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Test Set Selector (25 Questions each) */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Step 2: Choose 25-Question Test Set (From 100 MCQs)
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
              100 Questions Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                id: 1 as const,
                title: 'Set 1: Core Fundamentals & Definitions',
                questions: 'Questions 1 – 25',
                desc: 'Level 1: Primary definitions, SI units, dimensional formulae, and fundamental laws.',
                badge: 'Foundation',
                color: 'blue',
              },
              {
                id: 2 as const,
                title: 'Set 2: Conceptual & Numerical Application',
                questions: 'Questions 26 – 50',
                desc: 'Level 2: Mathematical derivations, proportional scaling, and numerical problems.',
                badge: 'Application',
                color: 'indigo',
              },
              {
                id: 3 as const,
                title: 'Set 3: Assertion-Reasoning & Multi-Concept',
                questions: 'Questions 51 – 75',
                desc: 'Level 3: Critical statements, boundary conditions, and cause-and-effect reasoning.',
                badge: 'Analytical',
                color: 'purple',
              },
              {
                id: 4 as const,
                title: 'Set 4: High-Yield Previous Year (PYQ) Mastery',
                questions: 'Questions 76 – 100',
                desc: 'Level 4: Real exam patterns, rank booster problems, and high-frequency questions.',
                badge: 'PYQ Mastery',
                color: 'amber',
              },
            ].map((set) => {
              const isSelected = selectedSet === set.id;
              return (
                <div
                  key={set.id}
                  onClick={() => setSelectedSet(set.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 ring-2 ring-primary-500 shadow-md'
                      : 'border-[var(--border)] bg-[var(--card)] hover:border-primary-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 font-mono">
                      {set.questions}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--background)] border border-[var(--border)]">
                      {set.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[var(--foreground)]">{set.title}</h4>
                  <p className="text-xs text-[var(--muted)] mt-1">{set.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Random Drill Option */}
          <div
            onClick={() => setSelectedSet('random')}
            className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
              selectedSet === 'random'
                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 ring-2 ring-primary-500 shadow-sm'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-primary-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🎲</span>
              <div>
                <h4 className="font-bold text-xs text-[var(--foreground)]">
                  Speed Drill: 25 Random Questions from the 100 Bank
                </h4>
                <p className="text-[11px] text-[var(--muted)]">
                  Draws a balanced mix across fundamentals, numericals, assertions, and PYQs.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
              Random 25 Qs
            </span>
          </div>

          {/* Time Limit Setting */}
          <div className="pt-2 flex items-center justify-between text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary-500" />
              Standard Exam Duration:
            </span>
            <div className="flex items-center gap-2">
              {[20, 30, 45].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setTimeLimitMinutes(mins)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                    timeLimitMinutes === mins
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-[var(--card)] border-[var(--border)] hover:border-primary-400'
                  }`}
                >
                  {mins} Mins
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          type="button"
          onClick={() => handleStartTest(selectedSet)}
          className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-base font-bold shadow-xl shadow-primary-500/25"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Launch 25-Question Objective Test</span>
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // VIEW 2: LIVE TEST TAKING SCREEN (IN-PROGRESS)
  // ─────────────────────────────────────────────────────────────────
  if (testState === 'in-progress') {
    const currentQ = activeQuestions[currentIndex];
    const totalQ = activeQuestions.length; // 25
    const selectedAns = userAnswers[currentIndex];
    const isMarked = markedForReview.has(currentIndex);

    // Counts
    const answeredCount = Object.keys(userAnswers).length;
    const unansweredCount = totalQ - answeredCount;
    const markedCount = markedForReview.size;

    return (
      <div className="space-y-4 animate-in fade-in">
        {/* Test Header */}
        <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-primary-500/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                {selectedSubject}
              </span>
              <span className="text-xs font-semibold text-[var(--muted)]">
                {selectedChapter}
              </span>
            </div>
            <h3 className="font-bold text-sm text-[var(--foreground)] mt-1">{activeSetName}</h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown Timer */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm shadow-sm ${
                secondsRemaining < 300
                  ? 'bg-red-500/10 border-red-500 text-red-600 animate-pulse'
                  : 'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]'
              }`}
            >
              <Clock className="w-4 h-4 text-primary-500" />
              <span>{formatTime(secondsRemaining)}</span>
              <button
                type="button"
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className="ml-1 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
              >
                {isTimerPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Main Grid: Question View & Question Palette */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Card (Col 1-3) */}
          <div className="lg:col-span-3 card space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-primary-600 dark:text-primary-400">
                  Question {currentIndex + 1}
                </span>
                <span className="text-xs text-[var(--muted)] font-medium">of {totalQ}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] uppercase">
                  {currentQ?.difficulty}
                </span>
                <button
                  type="button"
                  onClick={toggleMarkForReview}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    isMarked
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-[var(--background)] border-[var(--border)] text-[var(--muted)] hover:text-amber-500'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isMarked ? 'Marked' : 'Mark for Review'}</span>
                </button>
              </div>
            </div>

            {/* Question Stem */}
            <div className="text-sm font-medium text-[var(--foreground)] leading-relaxed whitespace-pre-line">
              {currentQ?.question}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ?.options.map((optionText, optIdx) => {
                const isSelected = selectedAns === optIdx;
                const optLetter = ['A', 'B', 'C', 'D'][optIdx];

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-primary-50/80 dark:bg-primary-950/40 border-primary-500 ring-1 ring-primary-500 shadow-sm'
                        : 'bg-[var(--card)] border-[var(--border)] hover:border-primary-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isSelected
                          ? 'bg-primary-600 text-white'
                          : 'bg-[var(--background)] border border-[var(--border)] text-[var(--muted)]'
                      }`}
                    >
                      {optLetter}
                    </div>
                    <span className="text-xs font-medium text-[var(--foreground)] pt-0.5">
                      {optionText}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Navigation & Action Controls */}
            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-3 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold flex items-center gap-1 text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {selectedAns !== undefined && (
                <button
                  type="button"
                  onClick={handleClearAnswer}
                  className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear Answer
                </button>
              )}

              {currentIndex < totalQ - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQ - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md"
                >
                  <span>Finish &amp; Submit</span>
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 25-Question Palette (Col 4) */}
          <div className="card space-y-4">
            <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              25-Question Palette
            </h4>

            {/* Grid of 25 Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {activeQuestions.map((_, idx) => {
                const isAnswered = userAnswers[idx] !== undefined;
                const isItemMarked = markedForReview.has(idx);
                const isCurrent = currentIndex === idx;

                let colorStyle = 'bg-[var(--card)] border-[var(--border)] text-[var(--muted)]';
                if (isAnswered && isItemMarked) {
                  colorStyle = 'bg-purple-600 text-white border-purple-600 font-bold';
                } else if (isItemMarked) {
                  colorStyle = 'bg-amber-500 text-white border-amber-500 font-bold';
                } else if (isAnswered) {
                  colorStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border text-xs font-mono transition-all flex items-center justify-center relative ${colorStyle} ${
                      isCurrent ? 'ring-2 ring-primary-500 scale-105 shadow-md' : 'hover:border-primary-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-2 border-t border-[var(--border)] space-y-1.5 text-[11px] text-[var(--muted)]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  Answered:
                </span>
                <span className="font-bold text-[var(--foreground)]">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Marked:
                </span>
                <span className="font-bold text-[var(--foreground)]">{markedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]"></span>
                  Unattempted:
                </span>
                <span className="font-bold text-[var(--foreground)]">{unansweredCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="card max-w-md w-full space-y-4 animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-primary-500">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-[var(--foreground)]">
                  Ready to Submit Test?
                </h3>
              </div>
              <p className="text-xs text-[var(--muted)]">
                You are about to submit your 25-question test for <strong>{selectedChapter}</strong>.
              </p>

              <div className="p-3 bg-[var(--background)] rounded-xl border border-[var(--border)] grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="font-bold text-emerald-600 text-sm">{answeredCount}</div>
                  <div className="text-[10px] text-[var(--muted)]">Answered</div>
                </div>
                <div>
                  <div className="font-bold text-amber-500 text-sm">{markedCount}</div>
                  <div className="text-[10px] text-[var(--muted)]">Marked</div>
                </div>
                <div>
                  <div className="font-bold text-slate-400 text-sm">{unansweredCount}</div>
                  <div className="text-[10px] text-[var(--muted)]">Unattempted</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  Resume Test
                </button>
                <button
                  type="button"
                  onClick={handleFinishTest}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  Submit &amp; View Solutions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // VIEW 3: INSTANT SCORECARD & QUESTION-BY-QUESTION SOLUTIONS (COMPLETED)
  // ─────────────────────────────────────────────────────────────────
  if (testState === 'completed' && results) {
    const filteredQuestions = activeQuestions.filter((q, idx) => {
      const ans = userAnswers[idx];
      if (reviewFilter === 'correct') return ans === q.correctIndex;
      if (reviewFilter === 'incorrect') return ans !== undefined && ans !== q.correctIndex;
      if (reviewFilter === 'unattempted') return ans === undefined;
      return true; // 'all'
    });

    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Scorecard Hero */}
        <div className="card bg-gradient-to-br from-primary-600/10 via-primary-500/5 to-transparent border-primary-500/30 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 text-xs font-bold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Test Performance Scorecard</span>
              </div>
              <h2 className="text-2xl font-black text-[var(--foreground)]">
                {selectedChapter} ({activeSetName})
              </h2>
              <p className="text-xs text-[var(--muted)] mt-1">
                Completed in {Math.floor(timeSpent / 60)}m {timeSpent % 60}s | 25 Questions Evaluated
              </p>
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-4">
              <div className="text-center px-5 py-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-md">
                <span className="block text-3xl font-black text-primary-600 dark:text-primary-400">
                  {results.scorePercentage}%
                </span>
                <span className="text-[11px] text-[var(--muted)] font-bold">Accuracy Score</span>
              </div>
              <div className="text-center px-5 py-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-md">
                <span className="block text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {results.correct}/{results.total}
                </span>
                <span className="text-[11px] text-[var(--muted)] font-bold">Correct Answers</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-[var(--card)] rounded-xl border border-[var(--border)] text-center">
              <span className="text-xs text-[var(--muted)] block">Total Marks</span>
              <span className="font-bold text-sm text-[var(--foreground)]">
                {results.competitiveScore} / {results.maxScore}
              </span>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-center">
              <span className="text-xs text-emerald-700 dark:text-emerald-300 block">Correct (+4)</span>
              <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                {results.correct}
              </span>
            </div>
            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/30 text-center">
              <span className="text-xs text-red-700 dark:text-red-300 block">Incorrect (-1)</span>
              <span className="font-bold text-sm text-red-600 dark:text-red-400">
                {results.wrong}
              </span>
            </div>
            <div className="p-3 bg-[var(--card)] rounded-xl border border-[var(--border)] text-center">
              <span className="text-xs text-[var(--muted)] block">Unattempted</span>
              <span className="font-bold text-sm text-[var(--muted)]">
                {results.unattempted}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={handleLogScoreToMockTests}
              disabled={isLoggedToMocks}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isLoggedToMocks
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-primary-600 hover:bg-primary-500 text-white shadow-md'
              }`}
            >
              {isLoggedToMocks ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Logged to Mock Test History!</span>
                </>
              ) : (
                <>
                  <BarChart2 className="w-4 h-4" />
                  <span>Log Score to Dashboard Graph</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTestState('idle')}
                className="px-3.5 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Choose Another Chapter
              </button>
              {typeof selectedSet === 'number' && selectedSet < 4 && (
                <button
                  type="button"
                  onClick={() => handleStartTest((selectedSet + 1) as any)}
                  className="px-4 py-2 rounded-xl btn-primary text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <span>Take Next Set (Set {selectedSet + 1})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Solutions & Step-by-Step Review */}
        <div className="card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Detailed Solutions &amp; Step-by-Step Explanations
            </h3>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[var(--background)] p-1 rounded-xl border border-[var(--border)] text-xs">
              {(['all', 'incorrect', 'unattempted', 'correct'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setReviewFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                    reviewFilter === filter
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Question List with Explanations */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const originalIndex = activeQuestions.findIndex((item) => item.id === q.id);
              const userSelected = userAnswers[originalIndex];
              const isCorrect = userSelected === q.correctIndex;
              const isUnattempted = userSelected === undefined;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border space-y-3 transition-all ${
                    isCorrect
                      ? 'border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10'
                      : isUnattempted
                      ? 'border-[var(--border)] bg-[var(--card)]'
                      : 'border-red-500/30 bg-red-50/10 dark:bg-red-950/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-primary-600 dark:text-primary-400">
                      Question {originalIndex + 1} of 25
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : isUnattempted
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {isCorrect && <CheckCircle2 className="w-3 h-3" />}
                      {isCorrect ? 'Correct (+4)' : isUnattempted ? 'Unattempted (0)' : 'Incorrect (-1)'}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[var(--foreground)] leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options with color tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    {q.options.map((optText, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctIndex;
                      const isOptionSelected = optIdx === userSelected;

                      let optStyle = 'border-[var(--border)] bg-[var(--background)] text-[var(--muted)]';
                      if (isOptionCorrect) {
                        optStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold';
                      } else if (isOptionSelected) {
                        optStyle = 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 line-through';
                      }

                      return (
                        <div key={optIdx} className={`p-2.5 rounded-lg border flex items-center gap-2 ${optStyle}`}>
                          <span className="w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center bg-[var(--card)] border border-[var(--border)]">
                            {['A', 'B', 'C', 'D'][optIdx]}
                          </span>
                          <span className="leading-tight">{optText}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Step-by-Step Explanation Box */}
                  <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
                    <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      Step-by-Step Solution &amp; Analytical Concept:
                    </span>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
