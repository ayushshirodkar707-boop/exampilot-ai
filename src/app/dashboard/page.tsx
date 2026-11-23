'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useStudyData } from '@/hooks/useStudyData';
import AuthModal from '@/components/auth/AuthModal';
import Sidebar from '@/components/layout/Sidebar';
import AdSidebar from '@/components/layout/AdSidebar';
import AdSlot from '@/components/ads/AdSlot';
import StreakCounter from '@/components/dashboard/StreakCounter';
import ScheduleView from '@/components/dashboard/ScheduleView';
import DailyTasks from '@/components/dashboard/DailyTasks';
import SyllabusTracker from '@/components/dashboard/SyllabusTracker';
import MockTestLogger from '@/components/dashboard/MockTestLogger';
import PomodoroTimer from '@/components/dashboard/PomodoroTimer';
import ObjectiveTestArena from '@/components/dashboard/ObjectiveTestArena';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { adjustPlanForChapter, recalibrateForMissedDay } from '@/lib/planAdjuster';
import type { DayPlan, MockTest, Chapter } from '@/types';
import {
  Calendar,
  Sparkles,
  ClipboardList,
  CheckSquare,
  BookOpen,
  FileText,
  Timer,
  Target,
  AlertCircle,
  School,
  Clock,
  LogIn,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isEmailVerified,
    resendVerificationEmail,
    isLoading: authLoading,
  } = useAuth();
  const {
    profile,
    plan,
    chapters,
    mockTests,
    streak,
    loading: dataLoading,
    setPlan,
    setChapters,
    addMockTest,
    updateDailyStreak,
  } = useStudyData();

  const [activeSection, setActiveSection] = useState<string>('study-plan');
  const [testSubject, setTestSubject] = useState<string | undefined>(undefined);
  const [testChapter, setTestChapter] = useState<string | undefined>(undefined);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showMissedModal, setShowMissedModal] = useState(false);
  const [missedStrategy, setMissedStrategy] = useState<'redistribute' | 'shift' | 'weekend'>('redistribute');
  const [catchUpStatus, setCatchUpStatus] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [forceReady, setForceReady] = useState(false);

  // Maximum 1.2s spinner safeguard so users are never trapped on loading
  useEffect(() => {
    const timer = setTimeout(() => setForceReady(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleResendVerification = async () => {
    const res = await resendVerificationEmail();
    if (res.success) {
      setResendStatus('Verification link sent! Please check your inbox & spam folder.');
      setTimeout(() => setResendStatus(null), 5000);
    } else {
      setResendStatus(res.error || 'Failed to resend. Please try again later.');
    }
  };

  // Loading screen with safeguard
  if (!forceReady && (authLoading || (dataLoading && !plan && isAuthenticated))) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[var(--muted)]">Loading your personal exam cockpit...</p>
      </div>
    );
  }

  // Not Authenticated Gate
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4 shadow-sm">
          <LogIn className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sign In to Access Your Dashboard
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)] mb-6">
          Sign in or create your free account to access your customized exam timetable, daily tasks, and MCQ test arena.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="btn-primary py-3 px-6 text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary-500/25"
        >
          <Sparkles className="w-4 h-4" />
          <span>Sign In / Create Account</span>
        </button>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultMode="signin"
        />
      </div>
    );
  }

  // If no plan created yet, prompt to run onboarding
  if (!plan) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="card p-8 sm:p-10 space-y-5">
          <div className="w-14 h-14 bg-primary-100 dark:bg-primary-950/60 text-primary-600 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Welcome to ExamPilot AI
          </h2>
          <p className="text-sm text-[var(--muted)]">
            You haven’t configured your exam schedule yet. Choose your country and target exam to let the AI build your customized study timetable and syllabus tracker.
          </p>
          <div className="pt-2">
            <Link
              href="/onboarding"
              className="btn-primary py-3.5 px-8 inline-flex items-center gap-2 font-bold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Onboarding Wizard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate days remaining
  const daysLeft = profile?.examDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(profile.examDate).getTime() - new Date().setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 45;

  // Find today's plan from Week 1 Day 1
  const todayPlan: DayPlan | null =
    plan?.weeks?.[0]?.days?.[0] || null;

  // Handle task check/uncheck
  const handleTaskToggle = async (
    blockKey: 'morning' | 'afternoon' | 'evening',
    completed: boolean
  ) => {
    if (!plan || !plan.weeks || plan.weeks.length === 0) return;

    const newWeeks = [...plan.weeks];
    const firstWeek = { ...newWeeks[0] };
    const firstDays = [...firstWeek.days];
    const targetDay = { ...firstDays[0] };

    targetDay.blocks = {
      ...targetDay.blocks,
      [blockKey]: {
        ...targetDay.blocks[blockKey],
        completed,
      },
    };

    firstDays[0] = targetDay;
    firstWeek.days = firstDays;
    newWeeks[0] = firstWeek;

    const updatedPlan = { ...plan, weeks: newWeeks };
    await setPlan(updatedPlan);

    // If all three completed, bump streak
    if (
      completed &&
      targetDay.blocks.morning.completed &&
      targetDay.blocks.afternoon.completed &&
      targetDay.blocks.evening.completed
    ) {
      await updateDailyStreak();
    }
  };

  // Handle chapter status change with smart plan adjustment
  const handleChapterStatusChange = async (
    chapterId: string,
    newStatus: Chapter['status']
  ) => {
    const targetChapter = chapters.find((c) => c.id === chapterId);
    const updated = chapters.map((c) =>
      c.id === chapterId ? { ...c, status: newStatus } : c
    );
    await setChapters(updated);

    if (targetChapter && plan) {
      const adjusted = adjustPlanForChapter(
        plan,
        targetChapter.name,
        targetChapter.subject,
        newStatus
      );
      await setPlan(adjusted);
    }
  };

  // Handle Mock Test submission
  const handleAddMockTest = async (test: MockTest) => {
    await addMockTest(test);
  };

  // Handle Plan Regeneration with 1.5s visual feedback
  const handleRegenerate = async () => {
    if (!profile) return;
    setIsRegenerating(true);
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: profile.country,
          exam: profile.exam,
          examDate: profile.examDate,
          dailyHours: profile.dailyHours,
          selectedSubjects: profile.selectedSubjects || Array.from(new Set(chapters.map((c) => c.subject))),
          weakSubjects: profile.weakSubjects,
          strongSubjects: profile.strongSubjects,
          prepLevel: profile.prepLevel,
          dailyRoutine: profile.dailyRoutine,
        }),
      });

      const data = await res.json();
      if (data.success && data.plan) {
        await setPlan(data.plan);
      }
    } catch (e) {
      console.error('Failed to regenerate plan:', e);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Handle Missed Day catch-up
  const handleMissedDay = () => {
    setShowMissedModal(true);
  };

  const confirmMissedDayAdjustment = async () => {
    if (!plan) return;
    setShowMissedModal(false);
    setIsRegenerating(true);

    try {
      const res = recalibrateForMissedDay(plan, {
        strategy: missedStrategy,
      });

      if (res.success && res.plan) {
        await setPlan(res.plan);
        setCatchUpStatus(res.message);
        setTimeout(() => setCatchUpStatus(null), 6000);
      }
    } catch (e: any) {
      console.error('Missed day catch-up error:', e);
    } finally {
      setIsRegenerating(false);
    }
  };

  const mobileNavItems = [
    { id: 'study-plan', label: 'Plan', icon: ClipboardList },
    { id: 'daily-tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'objective-tests', label: '100 MCQs', icon: Target },
    { id: 'syllabus-tracker', label: 'Syllabus', icon: BookOpen },
    { id: 'mock-tests', label: 'Mocks', icon: FileText },
    { id: 'pomodoro', label: 'Timer', icon: Timer },
  ];

  return (
    <div className="max-w-[1500px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* 1.5s Loading Overlay for regeneration */}
      <LoadingOverlay
        isLoading={isRegenerating}
        title="Recalibrating Your Study Schedule"
        subtitle="Optimizing upcoming topic blocks around your school & coaching commitments..."
      />

      {/* Dismissable Catch-Up Toast Banner */}
      {catchUpStatus && (
        <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between text-xs sm:text-sm shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            <span className="font-semibold">{catchUpStatus}</span>
          </div>
          <button
            onClick={() => setCatchUpStatus(null)}
            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 font-bold p-1 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Countdown Urgency Header */}
      <div className="mb-4 sm:mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary-900/90 via-indigo-900/90 to-purple-950/90 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-lg border border-primary-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold opacity-75">
                Target Objective
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                On Track
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-extrabold tracking-tight truncate max-w-[240px] sm:max-w-none">
              {profile?.exam || plan.exam} Countdown
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
          <Link
            href="/onboarding"
            className="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium border border-white/10"
          >
            Adjust Exam
          </Link>

          <div className="text-right pl-3 border-l border-white/20">
            <div className="text-xl sm:text-3xl font-extrabold text-amber-300 font-mono leading-none">
              {daysLeft} Days
            </div>
            <div className="text-[10px] opacity-75 mt-0.5">remaining</div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Navigation Tabs */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md -mx-3 px-3 py-2.5 mb-4 border-b border-[var(--border)] flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-sm">
        {mobileNavItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3-Column Desktop Layout */}
      <div className="flex items-start gap-6">
        {/* Column 1: Left Navigation Sidebar (desktop) */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          examName={profile?.exam || plan.exam}
          examDate={profile?.examDate || new Date(Date.now() + 45 * 86400000).toISOString()}
          userName={user?.displayName || user?.email?.split('@')[0] || 'Student'}
          userAvatar={user?.photoURL}
          streakCount={streak}
          onChangeExam={() => router.push('/onboarding')}
        />

        {/* Column 2: Main Workspace Center */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Email Verification Banner (Free Firebase Email Verification) */}
          {!isEmailVerified && user?.email && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Mail className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                    Verify your email address for account recovery &amp; backups
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300/80">
                    A free verification link was sent to <span className="font-semibold">{user.email}</span>. Click the link in your inbox to confirm.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {resendStatus ? (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {resendStatus}
                  </span>
                ) : (
                  <button
                    onClick={handleResendVerification}
                    className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
                  >
                    Resend Verification
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Streak & Routine Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <StreakCounter streak={streak} />
            </div>

            <div className="card md:col-span-2 flex flex-col justify-between p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">
                  Preparation Intensity
                </span>
                <span className="text-xs font-semibold text-primary-500">
                  {profile?.dailyHours || 6} Hours / Day
                </span>
              </div>
              <div className="mt-1">
                <h3 className="font-bold text-base text-[var(--foreground)]">
                  Level: {profile?.prepLevel ? profile.prepLevel.toUpperCase() : 'INTERMEDIATE'}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Focusing on weak areas: {profile?.weakSubjects?.length ? profile.weakSubjects.join(', ') : 'All Selected Subjects'}
                </p>
                {profile?.dailyRoutine && (
                  <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5" />
                    <span>School: {profile.dailyRoutine.schoolTimings} • Coaching: {profile.dailyRoutine.coachingTimings}</span>
                  </p>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setActiveSection('pomodoro')}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Timer className="w-3.5 h-3.5 text-primary-500" />
                  <span>Start Focus Sprint</span>
                </button>
                <button
                  onClick={() => setActiveSection('daily-tasks')}
                  className="btn-ghost text-xs py-1.5 px-3"
                >
                  View Today&apos;s Checklist →
                </button>
              </div>
            </div>
          </div>

          {/* Active Section Content */}
          <div className="animate-in fade-in duration-200">
            {activeSection === 'study-plan' && (
              <ScheduleView
                plan={plan}
                onRegenerate={handleRegenerate}
                onMissedDay={handleMissedDay}
                isRegenerating={isRegenerating}
              />
            )}

            {activeSection === 'daily-tasks' && (
              <DailyTasks
                todayPlan={todayPlan}
                onTaskToggle={handleTaskToggle}
              />
            )}

            {activeSection === 'objective-tests' && (
              <ObjectiveTestArena
                initialSubject={testSubject}
                initialChapter={testChapter}
              />
            )}

            {activeSection === 'syllabus-tracker' && (
              <SyllabusTracker
                chapters={chapters}
                onStatusChange={handleChapterStatusChange}
                onStartTest={(subj, chap) => {
                  setTestSubject(subj);
                  setTestChapter(chap);
                  setActiveSection('objective-tests');
                }}
              />
            )}

            {activeSection === 'mock-tests' && (
              <MockTestLogger
                mockTests={mockTests}
                onAddTest={handleAddMockTest}
                defaultExamName={profile?.exam || plan.exam}
              />
            )}

            {activeSection === 'pomodoro' && <PomodoroTimer />}
          </div>

          {/* Mobile Bottom Banner Ad */}
          <div className="xl:hidden pt-4">
            <AdSlot
              size="320x50"
              className="mx-auto"
              label="Sponsored Partner"
            />
          </div>
        </div>

        {/* Column 3: Right Ad Sidebar (desktop sticky 300px) */}
        <AdSidebar />
      </div>

      {/* Missed Day Catch-Up Modal */}
      {showMissedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="card max-w-lg w-full p-6 space-y-5 shadow-2xl border border-[var(--border)]">
            <div className="flex items-center gap-3 text-amber-500">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[var(--foreground)]">
                  Missed Study Hours? Catch Up Fast
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  No stress! Life happens. Choose how ExamPilot AI should recalibrate your timetable:
                </p>
              </div>
            </div>

            {/* Strategy Options */}
            <div className="space-y-2.5">
              <label
                onClick={() => setMissedStrategy('redistribute')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  missedStrategy === 'redistribute'
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 ring-1 ring-primary-500/40'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="strategy"
                  checked={missedStrategy === 'redistribute'}
                  onChange={() => setMissedStrategy('redistribute')}
                  className="mt-0.5 text-primary-600"
                />
                <div className="text-xs">
                  <div className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <span>⚡ Smart Micro-Sprints (Recommended)</span>
                  </div>
                  <p className="text-[var(--muted)] mt-0.5 leading-relaxed">
                    Injects missed topics as +20 min micro-sprints across your next 3-4 study days so you catch up without feeling overwhelmed.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setMissedStrategy('weekend')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  missedStrategy === 'weekend'
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 ring-1 ring-primary-500/40'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="strategy"
                  checked={missedStrategy === 'weekend'}
                  onChange={() => setMissedStrategy('weekend')}
                  className="mt-0.5 text-primary-600"
                />
                <div className="text-xs">
                  <div className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <span>📅 Weekend Buffer Catch-Up</span>
                  </div>
                  <p className="text-[var(--muted)] mt-0.5 leading-relaxed">
                    Absorbs missed topics into your upcoming Sunday / Revision buffer session, leaving your weekday routine intact.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setMissedStrategy('shift')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  missedStrategy === 'shift'
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 ring-1 ring-primary-500/40'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="strategy"
                  checked={missedStrategy === 'shift'}
                  onChange={() => setMissedStrategy('shift')}
                  className="mt-0.5 text-primary-600"
                />
                <div className="text-xs">
                  <div className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <span>⏩ Calendar Push (+1 Day)</span>
                  </div>
                  <p className="text-[var(--muted)] mt-0.5 leading-relaxed">
                    Shifts upcoming days forward by 1 calendar day. Today becomes a buffer rest day, giving you a fresh start tomorrow.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setShowMissedModal(false)}
                className="btn-ghost text-xs py-2 px-3.5"
              >
                Keep Current Plan
              </button>
              <button
                type="button"
                onClick={confirmMissedDayAdjustment}
                className="btn-primary text-xs py-2.5 px-5 font-bold shadow-md shadow-primary-500/20"
              >
                Apply Catch-Up &amp; Recalibrate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
