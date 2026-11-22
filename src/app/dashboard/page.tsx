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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [forceReady, setForceReady] = useState(false);

  // Maximum 2.5s spinner safeguard so users are never trapped on loading
  useEffect(() => {
    const timer = setTimeout(() => setForceReady(true), 2500);
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
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
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

  // Handle chapter status change
  const handleChapterStatusChange = async (
    chapterId: string,
    newStatus: Chapter['status']
  ) => {
    const updated = chapters.map((c) =>
      c.id === chapterId ? { ...c, status: newStatus } : c
    );
    await setChapters(updated);
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
    setShowMissedModal(false);
    await handleRegenerate();
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
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1.5s Loading Overlay for regeneration */}
      <LoadingOverlay
        isLoading={isRegenerating}
        title="Recalibrating Your Study Schedule"
        subtitle="Optimizing upcoming topic blocks around your school & coaching commitments..."
      />

      {/* Top Countdown Urgency Header */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary-900/90 via-indigo-900/90 to-purple-950/90 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-primary-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-2xl shrink-0">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-75">
                Target Objective
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                On Track
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              {profile?.exam || plan.exam} Countdown
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
          <Link
            href="/onboarding"
            className="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium border border-white/10"
          >
            Adjust Exam
          </Link>

          <div className="text-right pl-2 border-l border-white/20">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono leading-none">
              {daysLeft} Days
            </div>
            <div className="text-[10px] opacity-75 mt-0.5">remaining</div>
          </div>
        </div>
      </div>

      {/* Mobile Top Navigation Tabs */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
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
                  : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--border)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
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

      {/* Missed Day Modal */}
      {showMissedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="card max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-500">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-lg text-[var(--foreground)]">
                Missed Study Hours?
              </h3>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              No stress! Life happens. ExamPilot AI can instantly recalibrate your remaining syllabus topics across your upcoming study blocks so you stay on schedule without burning out.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowMissedModal(false)}
                className="btn-ghost text-xs"
              >
                Keep Current Plan
              </button>
              <button
                type="button"
                onClick={confirmMissedDayAdjustment}
                className="btn-primary text-xs py-2 px-4 font-bold"
              >
                Recalibrate My Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
