import React from 'react';
import Link from 'next/link';
import AdSlot from '@/components/ads/AdSlot';
import { BookOpen, CheckCircle, Clock, Sparkles, Award, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Global Exam Preparation Guides & Syllabi — ExamPilot AI',
  description:
    'Comprehensive syllabus breakdowns, scoring patterns, and high-yield revision strategies for JEE, NEET, SAT, ACT, GCSE, A-Levels, Abitur, Le Bac, and more.',
};

export default function GuidesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curated by Top Educators &amp; AI Analysts</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
          Master Exam Prep Guides &amp; Syllabi
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          Deep-dive breakdowns of scoring patterns, weightage matrices, and daily timetable blueprints for national and international competitive examinations.
        </p>
      </div>

      {/* Top Banner Ad */}
      <div className="flex justify-center">
        <AdSlot size="728x90" label="Recommended Prep Material" />
      </div>

      {/* ── SECTION 1: INDIA ── */}
      <section id="in" className="space-y-8 scroll-mt-20">
        <div className="border-b border-[var(--border)] pb-4 flex items-center gap-3">
          <span className="text-4xl select-none">🇮🇳</span>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
              India — National Entrance &amp; Board Exams
            </h2>
            <p className="text-xs text-[var(--muted)]">
              JEE Main &amp; Advanced, NEET UG, CBSE Board Exams, CUET &amp; CAT
            </p>
          </div>
        </div>

        {/* JEE Main & Advanced */}
        <div className="card space-y-4 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              JEE Main &amp; JEE Advanced (Engineering)
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600">
              STEM • 300 Marks (Main)
            </span>
          </div>

          <p className="text-sm text-[var(--muted)] leading-relaxed">
            The Joint Entrance Examination (JEE) tests mathematical problem-solving speed, conceptual physics intuition, and organic/inorganic chemistry retention. High rankers maintain a strict 3-phase revision cycle: fundamental derivations, chapter-wise previous year questions (PYQs 2019-2024), and full-length timed mock tests.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500 mb-2">
                Physics High-Yield Topics
              </h4>
              <ul className="text-xs text-[var(--muted)] space-y-1.5 list-disc list-inside">
                <li>Rotational Dynamics &amp; MOI</li>
                <li>Electrostatics &amp; Current Electricity</li>
                <li>Thermodynamics &amp; KTG</li>
                <li>Ray &amp; Wave Optics</li>
                <li>Modern Physics &amp; Semiconductors</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 mb-2">
                Chemistry High-Yield Topics
              </h4>
              <ul className="text-xs text-[var(--muted)] space-y-1.5 list-disc list-inside">
                <li>Chemical Bonding &amp; Molecular Orbital</li>
                <li>Coordination Compounds &amp; d-Block</li>
                <li>Organic Reaction Mechanisms (GOC)</li>
                <li>Thermodynamics &amp; Equilibrium</li>
                <li>Solutions &amp; Electrochemistry</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
              <h4 className="font-bold text-xs uppercase tracking-wider text-primary-500 mb-2">
                Mathematics High-Yield Topics
              </h4>
              <ul className="text-xs text-[var(--muted)] space-y-1.5 list-disc list-inside">
                <li>Definite Integrals &amp; Area Under Curves</li>
                <li>Coordinate Geometry (Conic Sections)</li>
                <li>Vectors &amp; 3D Geometry</li>
                <li>Matrices &amp; Determinants</li>
                <li>Probability &amp; Binomial Theorem</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href="/onboarding"
              className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1.5"
            >
              <span>Generate Personalized JEE Timetable</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* NEET UG */}
        <div className="card space-y-4 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              NEET UG (Medical Entrance)
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              Biology / Physics / Chemistry • 720 Marks
            </span>
          </div>

          <p className="text-sm text-[var(--muted)] leading-relaxed">
            The National Eligibility cum Entrance Test requires 100% mastery of NCERT line-by-line text for Biology (Botany &amp; Zoology, contributing 360/720 marks). For Physics and Chemistry, numerical calculation speed without a calculator is paramount. Top scorers recommend dedicating morning hours to Biology memorization and afternoon sessions to Physics numerical problem sets.
          </p>

          <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--muted)] leading-relaxed space-y-2">
            <div className="font-bold text-[var(--foreground)]">
              High-Yield Strategy Tips:
            </div>
            <p>
              1. <strong>NCERT Biology Annotations:</strong> Read every diagram caption, summary paragraph, and historical scientist note at least 5 times prior to exam week.
            </p>
            <p>
              2. <strong>OMR Bubble Discipline:</strong> Practice marking physical OMR sheets during 2:00 PM – 5:20 PM mock sessions to build stamina under actual exam temperature and lighting.
            </p>
          </div>
        </div>
      </section>

      {/* Mid-Article In-Feed Ad */}
      <div className="flex justify-center">
        <AdSlot size="responsive" label="Sponsored Learning Partner" />
      </div>

      {/* ── SECTION 2: UNITED STATES ── */}
      <section id="us" className="space-y-8 scroll-mt-20">
        <div className="border-b border-[var(--border)] pb-4 flex items-center gap-3">
          <span className="text-4xl select-none">🇺🇸</span>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
              United States — College &amp; Graduate Admissions
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Digital SAT, ACT, AP Exams, MCAT, LSAT &amp; GRE
            </p>
          </div>
        </div>

        {/* Digital SAT */}
        <div className="card space-y-4 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              Digital SAT (College Board)
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600">
              Adaptive Format • 1600 Scale
            </span>
          </div>

          <p className="text-sm text-[var(--muted)] leading-relaxed">
            The multi-stage adaptive Digital SAT consists of two sections: Reading &amp; Writing (two 32-minute modules) and Math (two 35-minute modules with built-in Desmos graphing calculator permitted throughout). Performance in Module 1 dictates whether you receive the higher-scoring Module 2 tier.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--muted)] space-y-1.5">
              <span className="font-bold text-[var(--foreground)] block">
                Reading &amp; Writing Key Focus:
              </span>
              <p>• Craft and Structure (Context clues, text structure &amp; purpose)</p>
              <p>• Information and Ideas (Central ideas, textual evidence, quantitative data)</p>
              <p>• Standard English Conventions (Boundaries, form, structure, sense)</p>
              <p>• Expression of Ideas (Rhetorical synthesis and student notes)</p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--muted)] space-y-1.5">
              <span className="font-bold text-[var(--foreground)] block">
                Math Core Domains:
              </span>
              <p>• Algebra (Linear equations, systems, inequalities)</p>
              <p>• Advanced Math (Nonlinear equations, polynomials, quadratics)</p>
              <p>• Problem-Solving &amp; Data Analysis (Ratios, rates, percentages, probability)</p>
              <p>• Geometry &amp; Trigonometry (Area, volume, angles, circles, right triangles)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: UNITED KINGDOM ── */}
      <section id="gb" className="space-y-8 scroll-mt-20">
        <div className="border-b border-[var(--border)] pb-4 flex items-center gap-3">
          <span className="text-4xl select-none">🇬🇧</span>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
              United Kingdom — GCSE, A-Levels &amp; Admissions
            </h2>
            <p className="text-xs text-[var(--muted)]">
              AQA, Edexcel, OCR Boards, UCAT, LNAT
            </p>
          </div>
        </div>

        <div className="card space-y-4 p-6 sm:p-8">
          <h3 className="text-xl font-bold text-[var(--foreground)]">
            A-Level Mastery Blueprint (Grades A* – E)
          </h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Unlike broad standardized tests, UK A-Levels evaluate depth of written exposition, command of command words (&quot;Evaluate&quot;, &quot;Justify&quot;, &quot;Contrast&quot;), and multi-step scientific derivations. The most common pitfall is passive re-reading of revision guides. Proven A* students utilize the &quot;Feynman Technique&quot; and practice directly against official examination mark schemes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--muted)]">
            <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
              <strong className="text-[var(--foreground)] block mb-1">A-Level Mathematics</strong>
              Pure Calculus, Mechanics vectors, and Hypothesis Testing statistics.
            </div>
            <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
              <strong className="text-[var(--foreground)] block mb-1">A-Level Sciences</strong>
              Required practicals recall, molecular biochemistry, and quantum mechanics.
            </div>
            <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
              <strong className="text-[var(--foreground)] block mb-1">A-Level Humanities</strong>
              Historiography, structured 25-mark essays, and balanced conclusions.
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: EUROPE (GERMANY, FRANCE, SPAIN, ITALY) ── */}
      <section id="eu" className="space-y-8 scroll-mt-20">
        <div className="border-b border-[var(--border)] pb-4 flex items-center gap-3">
          <span className="text-4xl select-none">🇪🇺</span>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
              European Secondary &amp; University Matriculation
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Germany (Abitur), France (Le Bac), Spain (EBAU/Selectividad), Italy (Maturità)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Abitur */}
          <div className="card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇩🇪</span>
              <h3 className="font-bold text-base text-[var(--foreground)]">
                German Abitur (Leistungskurse &amp; Grundkurse)
              </h3>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              The Abitur requires rigorous oral and written examinations across advanced profile courses (Leistungskurse) such as Mathematik, Deutsch, and Naturwissenschaften. Strategic preparation requires weekly essay drafting and oral presentation rehearsals under timed constraints.
            </p>
          </div>

          {/* Baccalauréat */}
          <div className="card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇫🇷</span>
              <h3 className="font-bold text-base text-[var(--foreground)]">
                French Baccalauréat &amp; Grand Oral
              </h3>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              The reformed Baccalauréat integrates continuous assessment with terminal specialty examinations and the renowned &quot;Grand Oral&quot; viva voce. Success hinges on articulating structured arguments (Thèse, Antithèse, Synthèse) and connecting academic inquiry to personal career aspirations.
            </p>
          </div>

          {/* Spain EBAU */}
          <div className="card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇪🇸</span>
              <h3 className="font-bold text-base text-[var(--foreground)]">
                Spain EBAU / PAU (Selectividad)
              </h3>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              The Evaluación de Bachillerato para el Acceso a la Universidad tests obligatory common core subjects (Lengua Castellana, Historia de España, Lengua Extranjera) alongside voluntary phase exams to achieve maximum 14.0 cut-off scores for medicine and engineering degrees.
            </p>
          </div>

          {/* Italy Maturità */}
          <div className="card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇮🇹</span>
              <h3 className="font-bold text-base text-[var(--foreground)]">
                Italy Esame di Stato (Maturità)
              </h3>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Consisting of the Prima Prova (Italian essay/literary analysis), the curriculum-specific Seconda Prova (e.g. Greek/Latin or Mathematics/Physics), and the comprehensive multi-disciplinary oral colloquium evaluated out of 100 points.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-primary-900 to-indigo-950 text-white text-center space-y-5 border border-primary-500/20 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Ready to Build Your Personalized Daily Schedule?
        </h2>
        <p className="text-sm text-primary-200 max-w-xl mx-auto">
          Input your remaining days, study hours, and weak areas. ExamPilot AI will construct a tailored day-by-day timetable.
        </p>
        <Link
          href="/onboarding"
          className="btn-primary py-3.5 px-8 inline-flex items-center gap-2 text-sm font-bold shadow-lg shadow-black/20"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>Launch Your Study Plan Now</span>
        </Link>
      </div>
    </div>
  );
}
