import React from 'react';
import Link from 'next/link';
import { GraduationCap, Sparkles, Globe, Heart, Shield, Users, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About ExamPilot AI — Our Mission & Story',
  description:
    'Learn how ExamPilot AI is democratizing high-performance exam planning, study tracking, and adaptive revision for students across the globe.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
          Empowering Every Student to Fly Higher
        </h1>
        <p className="text-base sm:text-lg text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
          ExamPilot AI was built on a simple conviction: high-stakes exam success shouldn’t depend on expensive private tutoring or chaotic last-minute cramming.
        </p>
      </div>

      {/* Origin Story & Mission */}
      <div className="card p-8 sm:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          Our Story &amp; Philosophy
        </h2>
        <div className="space-y-4 text-sm text-[var(--muted)] leading-relaxed">
          <p>
            Whether preparing for the Indian JEE and NEET, the American SAT, British A-Levels, the German Abitur, or the French Baccalauréat, millions of students encounter the exact same crisis: <strong>cognitive overload and schedule paralysis</strong>.
          </p>
          <p>
            Students often spend hours formatting static spreadsheet templates, calculating revision calendars, or stressing over which subject to study first. When life happens and a day of study is missed, traditional static timetables collapse, triggering guilt and abandonment.
          </p>
          <p>
            We created <strong>ExamPilot AI</strong> as an intelligent study flight controller. Combining state-of-the-art generative AI from Google Gemini with proven cognitive science principles — spaced repetition, active recall cycles, and Pomodoro focus intervals — ExamPilot creates realistic, flexible daily study blocks that dynamically adapt whenever life throws you off track.
          </p>
        </div>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[var(--foreground)]">
            Worldwide Accessibility
          </h3>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Free forever for core features. Pre-configured for national curriculums across India, the US, UK, and European educational systems.
          </p>
        </div>

        <div className="card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[var(--foreground)]">
            AI with Pedagogical Integrity
          </h3>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            We don’t generate generic advice. Our algorithms prioritize weak chapters, schedule mandatory review cycles, and interleave distinct topics.
          </p>
        </div>

        <div className="card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[var(--foreground)]">
            Privacy First Architecture
          </h3>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Test the entire application in Guest Mode with zero tracking or account requirements. When signed in, your data is secured with Firebase.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-8">
        <Link
          href="/onboarding"
          className="btn-primary py-3.5 px-8 inline-flex items-center gap-2 font-bold"
        >
          <span>Start Your Custom Prep Plan</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
