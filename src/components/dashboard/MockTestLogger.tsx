'use client';

import React, { useState } from 'react';
import type { MockTest } from '@/types';
import { PlusCircle, TrendingUp, Calendar, CheckSquare, Award } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MockTestLoggerProps {
  mockTests: MockTest[];
  onAddTest: (test: MockTest) => void;
  defaultExamName?: string;
}

export default function MockTestLogger({
  mockTests,
  onAddTest,
  defaultExamName = 'Mock Test',
}: MockTestLoggerProps) {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [examName, setExamName] = useState(defaultExamName);
  const [score, setScore] = useState<number | ''>('');
  const [maxScore, setMaxScore] = useState<number | ''>(300);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (score === '' || maxScore === '' || Number(score) < 0 || Number(maxScore) <= 0) {
      alert('Please enter valid positive score and max score values.');
      return;
    }

    const newTest: MockTest = {
      id: `mock_${Date.now()}`,
      date,
      examName: examName || defaultExamName,
      score: Number(score),
      maxScore: Number(maxScore),
      notes: notes.trim() || undefined,
    };

    onAddTest(newTest);
    setScore('');
    setNotes('');
    setShowForm(false);
  };

  // Prepare chart data
  const chartData = [...mockTests]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((test, index) => {
      const percentage = Math.round((test.score / test.maxScore) * 100);
      return {
        name: `Test #${index + 1}`,
        date: test.date,
        percentage,
        score: test.score,
        maxScore: test.maxScore,
        examName: test.examName,
      };
    });

  // Calculate average percentage
  const avgScore =
    mockTests.length > 0
      ? Math.round(
          mockTests.reduce((acc, t) => acc + (t.score / t.maxScore) * 100, 0) /
            mockTests.length
        )
      : 0;

  const highestScore =
    mockTests.length > 0
      ? Math.max(...mockTests.map((t) => Math.round((t.score / t.maxScore) * 100)))
      : 0;

  return (
    <div className="space-y-6">
      {/* Header & Quick Stats */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-500" />
              <span>Mock Test Performance Hub</span>
            </h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              Log simulated exam sessions, track score trajectory, and spot scoring plateaus.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showForm ? 'Cancel Logging' : 'Log New Mock Test'}</span>
          </button>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-[11px] text-[var(--muted)]">Total Mocks Taken</div>
            <div className="text-xl font-bold text-[var(--foreground)] mt-0.5">
              {mockTests.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-[11px] text-primary-500">Average Percentage</div>
            <div className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-0.5">
              {avgScore}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] col-span-2 sm:col-span-1">
            <div className="text-[11px] text-emerald-500">Personal Best Score</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {highestScore}%
            </div>
          </div>
        </div>

        {/* Inline Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-5 rounded-2xl bg-primary-50/50 dark:bg-primary-950/20 border border-primary-500/30 space-y-4 animate-in fade-in"
          >
            <h3 className="font-bold text-sm text-[var(--foreground)]">
              Enter Mock Test Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="label text-xs">Date of Test</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="label text-xs">Test Title / Paper</label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. JEE Full Mock #3"
                  className="input-field text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="label text-xs">Your Score</label>
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 215"
                  className="input-field text-xs py-2"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="label text-xs">Maximum Score</label>
                <input
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 300"
                  className="input-field text-xs py-2"
                  required
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="label text-xs">Self-Analysis & Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Silly calculation mistakes in Physics; need to revise Organic reactions"
                className="input-field text-xs py-2"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-ghost text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs py-2 px-5">
                Save Test Result
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Progress Chart */}
      {mockTests.length > 0 && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[var(--foreground)]">
              Score Percentage Progression
            </h3>
            <span className="text-xs text-[var(--muted)]">Target: 85%+</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="var(--muted)" fontSize={11} unit="%" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[var(--card)] border border-[var(--border)] p-2.5 rounded-xl shadow-lg text-xs space-y-1">
                          <div className="font-bold text-[var(--foreground)]">{data.examName}</div>
                          <div className="text-[var(--muted)]">{data.date}</div>
                          <div className="font-semibold text-primary-500">
                            Score: {data.score} / {data.maxScore} ({data.percentage}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#6366f1' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Past Tests Table / List */}
      <div className="card space-y-4">
        <h3 className="font-bold text-base text-[var(--foreground)]">Test History</h3>

        {mockTests.length === 0 ? (
          <div className="text-center py-10 text-[var(--muted)] text-sm">
            No mock tests recorded yet. Hit &quot;Log New Mock Test&quot; above after taking your first practice paper!
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {[...mockTests]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((test) => {
                const percentage = Math.round((test.score / test.maxScore) * 100);
                const scoreColor =
                  percentage >= 70
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : percentage >= 45
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30'
                    : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30';

                return (
                  <div
                    key={test.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-sm text-[var(--foreground)]">
                        {test.examName}
                      </div>
                      <div className="text-xs text-[var(--muted)] flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{test.date}</span>
                        {test.notes && <span>• &quot;{test.notes}&quot;</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-sm text-[var(--foreground)]">
                          {test.score} / {test.maxScore}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-xl text-xs font-bold border ${scoreColor}`}
                      >
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
