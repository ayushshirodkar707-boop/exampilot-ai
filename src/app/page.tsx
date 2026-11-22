'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoginButton from '@/components/auth/LoginButton';
import AdSlot from '@/components/ads/AdSlot';
import { countries } from '@/lib/examData';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Timer,
  BookOpen,
  ArrowRight,
  Globe,
  Flame,
  ShieldCheck,
  Zap,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[var(--border)]">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow & Social Proof Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Exam Preparation for 32+ Global Tests</span>
            </div>

            {/* Supported by 10,000+ students all over the world */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm text-xs">
              <div className="flex -space-x-1.5">
                <span className="inline-flex h-5 w-5 rounded-full bg-indigo-500 text-[9px] font-bold text-white items-center justify-center ring-1 ring-[var(--card)]">A</span>
                <span className="inline-flex h-5 w-5 rounded-full bg-purple-500 text-[9px] font-bold text-white items-center justify-center ring-1 ring-[var(--card)]">R</span>
                <span className="inline-flex h-5 w-5 rounded-full bg-emerald-500 text-[9px] font-bold text-white items-center justify-center ring-1 ring-[var(--card)]">S</span>
                <span className="inline-flex h-5 w-5 rounded-full bg-amber-500 text-[9px] font-bold text-white items-center justify-center ring-1 ring-[var(--card)]">K</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 text-[11px]">★★★★★</span>
                <span className="font-bold text-[var(--foreground)]">Supported by 10,000+ students all over the world</span>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--foreground)] max-w-4xl mx-auto leading-[1.1]">
            Turn Exam Stress Into A{' '}
            <span className="bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Precision Daily Plan
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
            ExamPilot AI maps your remaining days into balanced morning, afternoon, and evening study blocks — with automated revision cycles, 100-MCQ chapter test arenas, and Pomodoro sprints.
          </p>

          {/* Auth Gate / Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="w-full btn-primary py-3.5 px-6 flex items-center justify-center gap-2 text-base font-bold shadow-xl shadow-primary-500/20"
              >
                <span>Open Your Study Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="w-full flex flex-col gap-3">
                <LoginButton />
              </div>
            )}
          </div>

          {/* Micro Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1.5 font-bold text-primary-600 dark:text-primary-400">
              <Users className="w-4 h-4 text-primary-500" />
              Supported by 10,000+ Students Worldwide
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Free to Use
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="w-4 h-4 text-amber-500" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Globe className="w-4 h-4 text-primary-500" />
              India, US, UK, EU &amp; Global
            </span>
          </div>
        </div>
      </section>

      {/* ── Global Impact Statistics Banner ── */}
      <section className="py-8 border-b border-[var(--border)] bg-[var(--card)]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary-600 dark:text-primary-400 font-mono">10,000+</div>
              <div className="text-xs text-[var(--muted)] font-semibold">Students Supported Worldwide</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">32+</div>
              <div className="text-xs text-[var(--muted)] font-semibold">National &amp; Global Exams</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">100 MCQs</div>
              <div className="text-xs text-[var(--muted)] font-semibold">Per Chapter Question Bank</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">98.4%</div>
              <div className="text-xs text-[var(--muted)] font-semibold">Study Plan Adherence Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AdSense Leaderboard Placement (728x90) ── */}
      <section className="py-6 max-w-5xl mx-auto px-4 w-full flex justify-center">
        <AdSlot size="728x90" label="Sponsored Educational Resource" />
      </section>

      {/* ── Feature Highlights ── */}
      <section className="py-16 md:py-24 bg-[var(--card)]/50 border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
              Engineered For High-Stakes Performance
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--muted)]">
              Everything you need to master your syllabus without burning out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="card hover:border-primary-400 p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 flex items-center justify-center mb-4 font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[var(--foreground)]">
                  AI Schedule Generator
                </h3>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                  Calculates syllabus weightage and generates calibrated morning, afternoon, and evening blocks tailored to your weak subjects.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1">
                <span>Personalized by Gemini</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card hover:border-primary-400 p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-4 font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[var(--foreground)]">
                  Syllabus Chapter Matrix
                </h3>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                  Pre-populated chapters for JEE, NEET, SAT, GCSE, and Abitur. Mark status as Not Started, In Progress, Completed, or Needs Revision.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span>Visual Subject Progress</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card hover:border-primary-400 p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-4 font-bold">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[var(--foreground)]">
                  Mock Test Analytics
                </h3>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                  Log practice exams with custom score thresholds. Track your percentage trajectory over time with clean interactive charts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <span>Spot Score Plateaus</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="card hover:border-primary-400 p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-4 font-bold">
                  <Timer className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[var(--foreground)]">
                  Pomodoro Focus Timer
                </h3>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                  Built-in 25/5 Classic and 50/10 Deep Work timers with gentle audio chimes and sprint logs to keep you in flow state.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                <span>Scientifically Proven</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Supported Global Exams Section ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-primary-500">
                Worldwide Coverage
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] mt-1">
                Supported Exam Systems
              </h2>
            </div>
            <Link
              href="/guides"
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              <span>Explore full exam syllabi &amp; guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((c) => (
              <div key={c.code} className="card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl select-none">{c.flag}</span>
                    <div>
                      <h3 className="font-bold text-base text-[var(--foreground)]">
                        {c.name}
                      </h3>
                      <span className="text-xs text-[var(--muted)]">
                        {c.exams.length} Exams Pre-Mapped
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {c.exams.slice(0, 4).map((ex) => (
                      <span
                        key={ex.id}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] font-medium"
                      >
                        {ex.name}
                      </span>
                    ))}
                    {c.exams.length > 4 && (
                      <span className="text-[11px] px-2 py-1 text-[var(--muted)]">
                        +{c.exams.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--border)]">
                  <Link
                    href={`/guides#${c.code.toLowerCase()}`}
                    className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center justify-between"
                  >
                    <span>Read {c.name} prep strategy</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom Call To Action ── */}
      <section className="py-20 bg-gradient-to-b from-transparent to-primary-500/10 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-primary-500/30">
            <Flame className="w-8 h-8 fill-current" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
            Ready to Take Control of Your Exam Results?
          </h2>

          <p className="text-sm sm:text-base text-[var(--muted)] max-w-xl mx-auto">
            Supported by 10,000+ students all over the world. Start building your custom timetable and mastering chapter objective tests today in under 2 minutes.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="btn-primary py-3.5 px-8 text-base font-bold shadow-xl shadow-primary-500/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="w-full max-w-xs">
                <LoginButton />
              </div>
            )}
            <Link
              href="/guides"
              className="btn-secondary py-3.5 px-8 text-base font-semibold"
            >
              Browse Exam Guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
