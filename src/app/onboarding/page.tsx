'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { countries } from '@/lib/examData';
import { useAuth } from '@/hooks/useAuth';
import { useStudyData } from '@/hooks/useStudyData';
import AuthModal from '@/components/auth/AuthModal';
import CountrySelector from '@/components/onboarding/CountrySelector';
import ExamSelector from '@/components/onboarding/ExamSelector';
import SubjectSelector from '@/components/onboarding/SubjectSelector';
import DailyRoutineForm from '@/components/onboarding/DailyRoutineForm';
import StudentDetailsForm from '@/components/onboarding/StudentDetailsForm';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import type { CountryData, ExamData, OnboardingData, Chapter, UserProfile, DailyRoutine } from '@/types';
import { ArrowLeft, Sparkles, LogIn } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { setProfile, setPlan, setChapters } = useStudyData();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('IN');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [customExamName, setCustomExamName] = useState<string>('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [dailyRoutine, setDailyRoutine] = useState<DailyRoutine>({
    hasSchool: true,
    schoolTimings: '08:00 AM - 02:30 PM',
    studyBeforeSchool: false,
    hasCoaching: true,
    coachingTimings: '04:30 PM - 07:30 PM',
    otherCommitments: 'Gym & Sports (1 hour), Evening walk',
    studyPreference: 'balanced',
    wakeUpTime: '06:30 AM',
    sleepTime: '11:30 PM',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState('AI Flight Controller is Calibrating Your Plan');
  const [loadingSubtitle, setLoadingSubtitle] = useState('Crafting realistic day-by-day study sessions around your real commitments...');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Helper for minimum 1.5 second loading experience requested by user
  const wait1500ms = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const currentCountry = countries.find((c) => c.code === selectedCountryCode) || countries[0];
  const currentExam = currentCountry.exams.find((e) => e.id === selectedExamId);

  // Initialize selected subjects when exam changes
  useEffect(() => {
    if (currentExam && currentExam.subjects) {
      setSelectedSubjects(currentExam.subjects);
    } else if (selectedExamId) {
      setSelectedSubjects(['Core Theory', 'Problem Solving', 'Formula Mastery']);
    }
  }, [selectedExamId, currentExam]);

  const handleCountrySelect = async (code: string) => {
    setSelectedCountryCode(code);
    setSelectedExamId('');
    setCustomExamName('');
    setIsLoading(true);
    setLoadingTitle(`Loading ${countries.find(c => c.code === code)?.name || ''} Exams`);
    setLoadingSubtitle('Fetching official national and regional examination syllabi...');
    await wait1500ms();
    setIsLoading(false);
    setStep(2);
  };

  const handleExamSelect = async (examId: string) => {
    setSelectedExamId(examId);
    setIsLoading(true);
    setLoadingTitle('Loading Exam Curriculum');
    setLoadingSubtitle('Mapping subject combinations and official topic weightage...');
    await wait1500ms();
    setIsLoading(false);
    setStep(3);
  };

  const handleCustomExam = async (name: string) => {
    setCustomExamName(name);
    setSelectedExamId(name);
    setIsLoading(true);
    setLoadingTitle('Configuring Custom Examination');
    setLoadingSubtitle(`Setting up custom curriculum framework for ${name}...`);
    await wait1500ms();
    setIsLoading(false);
    setStep(3);
  };

  const handleSubjectsConfirm = async () => {
    setIsLoading(true);
    setLoadingTitle('Saving Subject Profile');
    setLoadingSubtitle('Preparing real-world daily routine & commitments questionnaire...');
    await wait1500ms();
    setIsLoading(false);
    setStep(4);
  };

  const handleRoutineSubmit = async (routine: DailyRoutine) => {
    setDailyRoutine(routine);
    setIsLoading(true);
    setLoadingTitle('Calibrating Daily Schedule Blocks');
    setLoadingSubtitle('Protecting your school, coaching, and sleep hours from conflict...');
    await wait1500ms();
    setIsLoading(false);
    setStep(5);
  };

  const handleFinalSubmit = async (details: Omit<OnboardingData, 'country' | 'exam' | 'selectedSubjects' | 'dailyRoutine'>) => {
    setIsLoading(true);
    setLoadingTitle('Synthesizing Precision AI Study Plan');
    setLoadingSubtitle('Running Gemini AI scheduling engine with your school, coaching, and weak subject parameters...');

    const finalExamName = customExamName || currentExam?.name || selectedExamId;

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: currentCountry.name,
          exam: finalExamName,
          examDate: details.examDate,
          dailyHours: details.dailyHours,
          selectedSubjects,
          weakSubjects: details.weakSubjects,
          strongSubjects: details.strongSubjects,
          prepLevel: details.prepLevel,
          dailyRoutine,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate study plan');
      }

      // Prepare pre-populated chapters from examData
      const initialChapters: Chapter[] = [];
      if (currentExam && currentExam.chapters) {
        currentExam.chapters.forEach((sc) => {
          if (selectedSubjects.includes(sc.subject)) {
            sc.chapters.forEach((chName, idx) => {
              initialChapters.push({
                id: `ch_${sc.subject}_${idx}_${Date.now()}`,
                name: chName,
                subject: sc.subject,
                status: 'not-started',
              });
            });
          }
        });
      }

      // If custom subjects without pre-mapped chapters, add standard high-yield chapters
      selectedSubjects.forEach((subj) => {
        const alreadyHasChapters = initialChapters.some((c) => c.subject === subj);
        if (!alreadyHasChapters) {
          ['Foundations & Core Principles', 'Analytical Problem Solving', 'Advanced Problem Patterns', 'High-Yield Formula Review'].forEach((chName, idx) => {
            initialChapters.push({
              id: `ch_${subj}_${idx}_${Date.now()}`,
              name: `${subj}: ${chName}`,
              subject: subj,
              status: 'not-started',
            });
          });
        }
      });

      if (!isAuthenticated) {
        setIsLoading(false);
        setAuthModalOpen(true);
        return;
      }

      // Save profile, plan, and syllabus chapters
      const newProfile: UserProfile = {
        uid: user?.uid || 'user',
        displayName: user?.displayName || user?.email?.split('@')[0] || 'Student',
        email: user?.email || '',
        country: currentCountry.name,
        exam: finalExamName,
        examDate: details.examDate,
        dailyHours: details.dailyHours,
        selectedSubjects,
        weakSubjects: details.weakSubjects,
        strongSubjects: details.strongSubjects,
        prepLevel: details.prepLevel,
        dailyRoutine,
        streak: 1,
        lastStudyDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      await setProfile(newProfile);
      await setPlan(data.plan);
      await setChapters(initialChapters);

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error during plan generation:', err);
      alert(err.message || 'An error occurred while creating your plan. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* 1.5 Second Loading Overlay */}
      <LoadingOverlay
        isLoading={isLoading}
        title={loadingTitle}
        subtitle={loadingSubtitle}
      />

      {/* Top Stepper Indicator (5 Steps) */}
      <div className="mb-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)] mb-2">
          <span className={step >= 1 ? 'text-primary-600 dark:text-primary-400 font-bold' : ''}>
            1. Country
          </span>
          <span className={step >= 2 ? 'text-primary-600 dark:text-primary-400 font-bold' : ''}>
            2. Exam
          </span>
          <span className={step >= 3 ? 'text-primary-600 dark:text-primary-400 font-bold' : ''}>
            3. Subjects
          </span>
          <span className={step >= 4 ? 'text-primary-600 dark:text-primary-400 font-bold' : ''}>
            4. Routine
          </span>
          <span className={step >= 5 ? 'text-primary-600 dark:text-primary-400 font-bold' : ''}>
            5. Strategy
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Back navigation */}
        {step > 1 && !isLoading && (
          <button
            type="button"
            onClick={() => setStep((prev) => (prev - 1) as any)}
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Step {step - 1}</span>
          </button>
        )}
      </div>

      {/* Step Content */}
      <div className="animate-in fade-in duration-300">
        {step === 1 && (
          <CountrySelector
            countries={countries}
            selectedCountry={selectedCountryCode}
            onSelect={handleCountrySelect}
          />
        )}

        {step === 2 && (
          <ExamSelector
            exams={currentCountry.exams}
            selectedExam={selectedExamId}
            onSelect={handleExamSelect}
            onCustomExam={handleCustomExam}
          />
        )}

        {step === 3 && (
          <SubjectSelector
            initialSubjects={currentExam?.subjects || ['Core Theory', 'Problem Solving']}
            selectedSubjects={selectedSubjects}
            onChange={setSelectedSubjects}
            onNext={handleSubjectsConfirm}
          />
        )}

        {step === 4 && (
          <DailyRoutineForm
            initialRoutine={dailyRoutine}
            onSubmit={handleRoutineSubmit}
          />
        )}

        {step === 5 && (
          <StudentDetailsForm
            subjects={selectedSubjects}
            currentExam={currentExam}
            onSubmit={handleFinalSubmit}
            isLoading={isLoading}
          />
        )}
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="signup"
      />
    </div>
  );
}
