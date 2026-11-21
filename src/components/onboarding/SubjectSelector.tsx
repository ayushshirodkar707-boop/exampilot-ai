'use client';

import React, { useState } from 'react';
import { BookOpen, Check, Plus, Trash2, ArrowRight } from 'lucide-react';

interface SubjectSelectorProps {
  initialSubjects: string[];
  selectedSubjects: string[];
  onChange: (subjects: string[]) => void;
  onNext: () => void;
}

export default function SubjectSelector({
  initialSubjects,
  selectedSubjects,
  onChange,
  onNext,
}: SubjectSelectorProps) {
  const [customSubject, setCustomSubject] = useState('');
  const [error, setError] = useState('');

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      if (selectedSubjects.length <= 1) {
        setError('You must select at least one subject for your exam plan.');
        return;
      }
      setError('');
      onChange(selectedSubjects.filter((s) => s !== subject));
    } else {
      setError('');
      onChange([...selectedSubjects, subject]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSubject.trim();
    if (!trimmed) return;
    if (selectedSubjects.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setError('Subject already included in your selection.');
      return;
    }
    setError('');
    onChange([...selectedSubjects, trimmed]);
    setCustomSubject('');
  };

  const handleRemove = (subject: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedSubjects.length <= 1) {
      setError('You must select at least one subject for your exam plan.');
      return;
    }
    setError('');
    onChange(selectedSubjects.filter((s) => s !== subject));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum Customization</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Confirm Your Exam Subjects
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Different streams and boards take different subjects. Select which subjects you are appearing for or add custom ones.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Suggested & Selected Subject Cards */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">
            Active Subjects ({selectedSubjects.length})
          </span>
          <span className="text-xs text-primary-500 font-medium">
            Click to toggle included subjects
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Combine initial exam subjects with any custom added subjects */}
          {Array.from(new Set([...initialSubjects, ...selectedSubjects])).map((subj) => {
            const isSelected = selectedSubjects.includes(subj);
            const isCustom = !initialSubjects.includes(subj);

            return (
              <div
                key={subj}
                onClick={() => toggleSubject(subj)}
                className={`p-3.5 rounded-xl border text-sm font-semibold flex items-center justify-between cursor-pointer transition-all duration-150 select-none ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:border-primary-400'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-xs ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : 'border border-[var(--border)] bg-[var(--card)]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="truncate">{subj}</span>
                  {isCustom && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-normal">
                      Custom
                    </span>
                  )}
                </div>

                {isCustom && (
                  <button
                    type="button"
                    onClick={(e) => handleRemove(subj, e)}
                    className="text-[var(--muted)] hover:text-rose-500 p-1 rounded-md transition-colors"
                    title="Remove custom subject"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Subject Form */}
      <form onSubmit={handleAddCustom} className="card p-4 space-y-3">
        <label className="label text-xs">
          Have an additional subject? (e.g. Computer Science, Statistics, Economics, Language)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            placeholder="Type subject name..."
            className="input-field text-xs py-2.5 flex-1"
          />
          <button
            type="submit"
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-primary-500" />
            <span>Add Subject</span>
          </button>
        </div>
      </form>

      {/* Proceed Button with 1.5s loader trigger */}
      <button
        type="button"
        onClick={onNext}
        className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-primary-500/20"
      >
        <span>Confirm Subjects &amp; Set Daily Routine</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
