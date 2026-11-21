'use client';

import React, { useState } from 'react';
import type { ExamData } from '@/types';
import { Check, BookOpen, PlusCircle } from 'lucide-react';

interface ExamSelectorProps {
  exams: ExamData[];
  selectedExam: string;
  onSelect: (examId: string) => void;
  onCustomExam?: (customExamName: string) => void;
}

export default function ExamSelector({
  exams,
  selectedExam,
  onSelect,
  onCustomExam,
}: ExamSelectorProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      if (onCustomExam) {
        onCustomExam(customName.trim());
      }
      onSelect(customName.trim());
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Which Exam Are You Preparing For?
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Select your target exam to load the official syllabus and subject weightage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {exams.map((exam) => {
          const isSelected = selectedExam === exam.id && !isCustom;
          return (
            <button
              key={exam.id}
              type="button"
              onClick={() => {
                setIsCustom(false);
                onSelect(exam.id);
              }}
              className={`relative p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                isSelected
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 ring-2 ring-primary-500 shadow-md shadow-primary-500/10'
                  : 'border-[var(--border)] bg-[var(--card)] hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/5'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-lg text-[var(--foreground)] group-hover:text-primary-500 transition-colors">
                  {exam.name}
                </h3>
                <p className="mt-1 text-xs text-[var(--muted)] line-clamp-1">
                  {exam.subjects.join(', ')}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--card-hover)] border border-[var(--border)] text-[var(--muted)]">
                    {exam.subjects.length} Subjects
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--card-hover)] border border-[var(--border)] text-[var(--muted)]">
                    {exam.chapters.reduce((acc, c) => acc + c.chapters.length, 0)} Chapters
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom / Other Exam Option */}
      <div className="mt-6 border-t border-[var(--border)] pt-6">
        {!isCustom ? (
          <button
            type="button"
            onClick={() => setIsCustom(true)}
            className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-primary-400 bg-[var(--card)]/50 hover:bg-[var(--card)] text-[var(--foreground)] flex items-center justify-center gap-2 font-medium transition-all duration-200"
          >
            <PlusCircle className="w-5 h-5 text-primary-500" />
            <span>My exam is not listed — Add Custom / Other Exam</span>
          </button>
        ) : (
          <form
            onSubmit={handleCustomSubmit}
            className="p-6 rounded-2xl border border-primary-500 bg-primary-50/30 dark:bg-primary-950/20"
          >
            <h4 className="font-semibold text-base text-[var(--foreground)] mb-2">
              Enter Your Custom Exam
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g., USMLE Step 1, CFA Level 1, Bar Exam..."
                className="input-field flex-1"
                autoFocus
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Continue with this Exam
              </button>
              <button
                type="button"
                onClick={() => setIsCustom(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
