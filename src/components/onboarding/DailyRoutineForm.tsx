'use client';

import React, { useState, useMemo } from 'react';
import type { DailyRoutine } from '@/types';
import { School, GraduationCap, Clock, Sun, Moon, Sparkles, ArrowRight, Activity, Check } from 'lucide-react';

interface DailyRoutineFormProps {
  initialRoutine?: DailyRoutine;
  onSubmit: (routine: DailyRoutine) => void;
}

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '15', '30', '45'];
const PERIODS = ['AM', 'PM'];

// Helper to parse "HH:MM AM"
function parseTimeString(timeStr: string, defaultHour: string, defaultMinute: string, defaultPeriod: string) {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    const h = match[1].padStart(2, '0');
    const m = match[2];
    const p = match[3].toUpperCase();
    return {
      hour: HOURS.includes(h) ? h : defaultHour,
      minute: MINUTES.includes(m) ? m : '00',
      period: p === 'AM' || p === 'PM' ? p : defaultPeriod,
    };
  }
  return { hour: defaultHour, minute: defaultMinute, period: defaultPeriod };
}

// Helper to parse "HH:MM AM - HH:MM PM"
function parseTimeRange(rangeStr: string, defStart: string, defEnd: string) {
  const parts = rangeStr.split('-').map((s) => s.trim());
  const start = parseTimeString(parts[0] || defStart, '08', '00', 'AM');
  const end = parseTimeString(parts[1] || defEnd, '02', '30', 'PM');
  return { start, end };
}

export default function DailyRoutineForm({
  initialRoutine,
  onSubmit,
}: DailyRoutineFormProps) {
  const [hasSchool, setHasSchool] = useState<boolean>(initialRoutine?.hasSchool ?? true);
  const [studyBeforeSchool, setStudyBeforeSchool] = useState<boolean>(
    initialRoutine?.studyBeforeSchool ?? false
  );
  
  // School Range
  const initialSchoolParsed = useMemo(
    () => parseTimeRange(initialRoutine?.schoolTimings || '08:00 AM - 02:30 PM', '08:00 AM', '02:30 PM'),
    [initialRoutine]
  );
  const [schoolStartH, setSchoolStartH] = useState(initialSchoolParsed.start.hour);
  const [schoolStartM, setSchoolStartM] = useState(initialSchoolParsed.start.minute);
  const [schoolStartP, setSchoolStartP] = useState(initialSchoolParsed.start.period);
  const [schoolEndH, setSchoolEndH] = useState(initialSchoolParsed.end.hour);
  const [schoolEndM, setSchoolEndM] = useState(initialSchoolParsed.end.minute);
  const [schoolEndP, setSchoolEndP] = useState(initialSchoolParsed.end.period);

  // Coaching Range
  const [hasCoaching, setHasCoaching] = useState<boolean>(initialRoutine?.hasCoaching ?? true);
  const initialCoachingParsed = useMemo(
    () => parseTimeRange(initialRoutine?.coachingTimings || '04:30 PM - 07:30 PM', '04:30 PM', '07:30 PM'),
    [initialRoutine]
  );
  const [coachingStartH, setCoachingStartH] = useState(initialCoachingParsed.start.hour);
  const [coachingStartM, setCoachingStartM] = useState(initialCoachingParsed.start.minute);
  const [coachingStartP, setCoachingStartP] = useState(initialCoachingParsed.start.period);
  const [coachingEndH, setCoachingEndH] = useState(initialCoachingParsed.end.hour);
  const [coachingEndM, setCoachingEndM] = useState(initialCoachingParsed.end.minute);
  const [coachingEndP, setCoachingEndP] = useState(initialCoachingParsed.end.period);

  // Sleep & Wake up times
  const initialWake = useMemo(
    () => parseTimeString(initialRoutine?.wakeUpTime || '06:30 AM', '06', '30', 'AM'),
    [initialRoutine]
  );
  const [wakeH, setWakeH] = useState(initialWake.hour);
  const [wakeM, setWakeM] = useState(initialWake.minute);
  const [wakeP, setWakeP] = useState(initialWake.period);

  const initialSleep = useMemo(
    () => parseTimeString(initialRoutine?.sleepTime || '11:30 PM', '11', '30', 'PM'),
    [initialRoutine]
  );
  const [sleepH, setSleepH] = useState(initialSleep.hour);
  const [sleepM, setSleepM] = useState(initialSleep.minute);
  const [sleepP, setSleepP] = useState(initialSleep.period);

  // Chronotype
  const [studyPreference, setStudyPreference] = useState<'early-bird' | 'night-owl' | 'balanced'>(
    initialRoutine?.studyPreference || 'balanced'
  );

  // Other Commitments (Selectable chips)
  const defaultCommitments = ['Gym & Sports (1 hour)', 'Evening walk & Relaxation'];
  const [selectedCommitments, setSelectedCommitments] = useState<string[]>(() => {
    if (initialRoutine?.otherCommitments) {
      return initialRoutine.otherCommitments.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return defaultCommitments;
  });

  const commitmentPresets = [
    'Gym & Fitness (1 hour)',
    'Sports / Football / Badminton (1 hour)',
    'Evening Walk & Relaxation (45 min)',
    'Yoga & Meditation (30 min)',
    'Family Dinner & Social Time (1 hour)',
    'Music / Creative Break (30 min)',
    'None (Full-time Focus)',
  ];

  const toggleCommitment = (item: string) => {
    if (item === 'None (Full-time Focus)') {
      setSelectedCommitments(['None']);
      return;
    }
    const filtered = selectedCommitments.filter((c) => c !== 'None');
    if (filtered.includes(item)) {
      setSelectedCommitments(filtered.filter((c) => c !== item));
    } else {
      setSelectedCommitments([...filtered, item]);
    }
  };

  // Quick preset setters for School
  const applySchoolPreset = (preset: string) => {
    const p = parseTimeRange(preset, '08:00 AM', '02:30 PM');
    setSchoolStartH(p.start.hour);
    setSchoolStartM(p.start.minute);
    setSchoolStartP(p.start.period);
    setSchoolEndH(p.end.hour);
    setSchoolEndM(p.end.minute);
    setSchoolEndP(p.end.period);
  };

  // Quick preset setters for Coaching
  const applyCoachingPreset = (preset: string) => {
    const p = parseTimeRange(preset, '04:30 PM', '07:30 PM');
    setCoachingStartH(p.start.hour);
    setCoachingStartM(p.start.minute);
    setCoachingStartP(p.start.period);
    setCoachingEndH(p.end.hour);
    setCoachingEndM(p.end.minute);
    setCoachingEndP(p.end.period);
  };

  const applyWakePreset = (val: string) => {
    const p = parseTimeString(val, '06', '30', 'AM');
    setWakeH(p.hour);
    setWakeM(p.minute);
    setWakeP(p.period);
  };

  const applySleepPreset = (val: string) => {
    const p = parseTimeString(val, '11', '30', 'PM');
    setSleepH(p.hour);
    setSleepM(p.minute);
    setSleepP(p.period);
  };

  // Formatted Strings
  const formattedSchoolTimings = `${schoolStartH}:${schoolStartM} ${schoolStartP} - ${schoolEndH}:${schoolEndM} ${schoolEndP}`;
  const formattedCoachingTimings = `${coachingStartH}:${coachingStartM} ${coachingStartP} - ${coachingEndH}:${coachingEndM} ${coachingEndP}`;
  const formattedWakeUpTime = `${wakeH}:${wakeM} ${wakeP}`;
  const formattedSleepTime = `${sleepH}:${sleepM} ${sleepP}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      hasSchool,
      schoolTimings: hasSchool ? formattedSchoolTimings : 'None (Full-time self-study / Dropper)',
      studyBeforeSchool: hasSchool ? studyBeforeSchool : false,
      hasCoaching,
      coachingTimings: hasCoaching ? formattedCoachingTimings : 'None (Self-prep only)',
      otherCommitments: selectedCommitments.length > 0 ? selectedCommitments.join(', ') : 'None',
      studyPreference,
      wakeUpTime: formattedWakeUpTime,
      sleepTime: formattedSleepTime,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>Real-World Day Calibration</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Select Your Daily Routine &amp; Schedule
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Choose your hours with one click. No manual typing needed — our scheduler automatically avoids clashes with school, tuition, and sleep.
        </p>
      </div>

      {/* 1. School / College Commitments */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <School className="w-5 h-5 text-primary-500" />
            <div>
              <h3 className="font-bold text-sm text-[var(--foreground)]">
                School or College Timings
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Do you attend school or college on weekdays?
              </p>
            </div>
          </div>

          <div className="flex items-center bg-[var(--background)] p-1 rounded-xl border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setHasSchool(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                hasSchool
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setHasSchool(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !hasSchool
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              No (Dropper / Free Day)
            </button>
          </div>
        </div>

        {hasSchool && (
          <div className="pt-2 border-t border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">Quick Preset Slots:</span>
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                Selected: {formattedSchoolTimings}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                '08:00 AM - 02:00 PM',
                '08:00 AM - 02:30 PM',
                '08:30 AM - 03:00 PM',
                '07:30 AM - 01:30 PM',
                '09:00 AM - 03:30 PM',
              ].map((preset) => {
                const isSelected = formattedSchoolTimings === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applySchoolPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                        : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:border-primary-400'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>

            {/* Granular Time Dropdowns (Hour / Minute / Period) */}
            <div className="p-3 bg-[var(--background)] rounded-xl border border-[var(--border)] space-y-2">
              <span className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider block">
                Fine-tune School Start &amp; End Time
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Time */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--muted)] w-12 font-medium">Start:</span>
                  <select
                    value={schoolStartH}
                    onChange={(e) => setSchoolStartH(e.target.value)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <span className="font-bold text-xs">:</span>
                  <select
                    value={schoolStartM}
                    onChange={(e) => setSchoolStartM(e.target.value)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono"
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={schoolStartP}
                    onChange={(e) => setSchoolStartP(e.target.value)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-semibold"
                  >
                    {PERIODS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* End Time */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--muted)] w-12 font-medium">End:</span>
                  <select
                    value={schoolEndH}
                    onChange={(e) => setSchoolEndH(e.target.value)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <span className="font-bold text-xs">:</span>
                  <select
                    value={schoolEndM}
                    onChange={(e) => setSchoolEndM(e.target.value)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono"
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={schoolEndP}
                    onChange={(e) => setSchoolEndP(e.target.value)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-semibold"
                  >
                    {PERIODS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pre-School Study Preference Selector */}
            <div className="p-3.5 bg-[var(--background)] rounded-xl border border-[var(--border)] space-y-2.5">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <div>
                  <h4 className="font-bold text-xs text-[var(--foreground)]">
                    Do you like studying before school in the morning?
                  </h4>
                  <p className="text-[11px] text-[var(--muted)]">
                    Choose whether the AI should schedule an early study block before you leave for school.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStudyBeforeSchool(true)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    studyBeforeSchool
                      ? 'bg-amber-500/10 border-amber-500 text-amber-800 dark:text-amber-200 ring-1 ring-amber-500 font-bold'
                      : 'bg-[var(--card)] border-[var(--border)] text-[var(--muted)] hover:border-amber-400'
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--foreground)] flex items-center justify-between">
                    <span>Yes, I study before school 🌅</span>
                    {studyBeforeSchool && <Check className="w-4 h-4 text-amber-500" />}
                  </div>
                  <p className="text-[11px] text-[var(--muted)] mt-1 font-normal">
                    Adds a focused 45–75 min morning concept block (e.g. 05:45 AM – 07:15 AM) before school.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setStudyBeforeSchool(false)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    !studyBeforeSchool
                      ? 'bg-primary-500/10 border-primary-500 text-primary-800 dark:text-primary-200 ring-1 ring-primary-500 font-bold'
                      : 'bg-[var(--card)] border-[var(--border)] text-[var(--muted)] hover:border-primary-400'
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--foreground)] flex items-center justify-between">
                    <span>No, study after school &amp; night only 🌙</span>
                    {!studyBeforeSchool && <Check className="w-4 h-4 text-primary-500" />}
                  </div>
                  <p className="text-[11px] text-[var(--muted)] mt-1 font-normal">
                    Mornings are strictly for rest &amp; commute. All study hours are scheduled in afternoon &amp; evening.
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Coaching / Tuition Classes */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="font-bold text-sm text-[var(--foreground)]">
                Coaching / Tuition / Online Classes
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Do you attend coaching classes or live test batches?
              </p>
            </div>
          </div>

          <div className="flex items-center bg-[var(--background)] p-1 rounded-xl border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setHasCoaching(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                hasCoaching
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setHasCoaching(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !hasCoaching
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              No (Self-Study)
            </button>
          </div>
        </div>

        {hasCoaching && (
          <div className="pt-2 border-t border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">Quick Preset Slots:</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Selected: {formattedCoachingTimings}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {[
                '04:00 PM - 07:00 PM',
                '04:30 PM - 07:30 PM',
                '05:00 PM - 08:00 PM',
                '06:00 PM - 09:00 PM',
                '09:00 AM - 01:00 PM',
              ].map((preset) => {
                const isSelected = formattedCoachingTimings === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applyCoachingPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-400'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>

            {/* Granular Time Dropdowns for Coaching */}
            <div className="p-3 bg-[var(--background)] rounded-xl border border-[var(--border)] space-y-2">
              <span className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider block">
                Fine-tune Coaching Batch Time
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--muted)] w-12 font-medium">Start:</span>
                  <select
                    value={coachingStartH}
                    onChange={(e) => setCoachingStartH(e.target.value)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <span className="font-bold text-xs">:</span>
                  <select
                    value={coachingStartM}
                    onChange={(e) => setCoachingStartM(e.target.value)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono"
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={coachingStartP}
                    onChange={(e) => setCoachingStartP(e.target.value)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-semibold"
                  >
                    {PERIODS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* End */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--muted)] w-12 font-medium">End:</span>
                  <select
                    value={coachingEndH}
                    onChange={(e) => setCoachingEndH(e.target.value)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <span className="font-bold text-xs">:</span>
                  <select
                    value={coachingEndM}
                    onChange={(e) => setCoachingEndM(e.target.value)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono"
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={coachingEndP}
                    onChange={(e) => setCoachingEndP(e.target.value)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-semibold"
                  >
                    {PERIODS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Sleep & Wake-up Schedule */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2.5">
          <Sun className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="font-bold text-sm text-[var(--foreground)]">
              Sleep &amp; Wake-Up Schedule
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Ensures your study plan leaves at least 7-8 hours of healthy rest.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Wake-up Time */}
          <div className="p-3.5 bg-[var(--background)] rounded-xl border border-[var(--border)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Wake-Up Time
              </span>
              <span className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">
                {formattedWakeUpTime}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['05:30 AM', '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => applyWakePreset(t)}
                  className={`px-2 py-1 text-[11px] rounded-md border font-medium transition-all ${
                    formattedWakeUpTime === t
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-[var(--card)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-[var(--border)]">
              <span className="text-[11px] text-[var(--muted)]">Custom:</span>
              <select
                value={wakeH}
                onChange={(e) => setWakeH(e.target.value)}
                className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono"
              >
                {['04', '05', '06', '07', '08', '09', '10'].map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <span className="font-bold text-xs">:</span>
              <select
                value={wakeM}
                onChange={(e) => setWakeM(e.target.value)}
                className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono"
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={wakeP}
                onChange={(e) => setWakeP(e.target.value)}
                className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-semibold"
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sleep Time */}
          <div className="p-3.5 bg-[var(--background)] rounded-xl border border-[var(--border)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                Sleep Time
              </span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {formattedSleepTime}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => applySleepPreset(t)}
                  className={`px-2 py-1 text-[11px] rounded-md border font-medium transition-all ${
                    formattedSleepTime === t
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-[var(--card)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-[var(--border)]">
              <span className="text-[11px] text-[var(--muted)]">Custom:</span>
              <select
                value={sleepH}
                onChange={(e) => setSleepH(e.target.value)}
                className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono"
              >
                {['09', '10', '11', '12', '01', '02'].map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <span className="font-bold text-xs">:</span>
              <select
                value={sleepM}
                onChange={(e) => setSleepM(e.target.value)}
                className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono"
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={sleepP}
                onChange={(e) => setSleepP(e.target.value)}
                className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-semibold"
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Energy Chronotype / Best Study Hours */}
      <div className="card space-y-3">
        <label className="label text-xs">
          When is your focus &amp; energy highest? (Study Chronotype)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'early-bird' as const,
              title: 'Early Bird 🌅',
              desc: 'High focus in morning (5:00 AM – 9:00 AM).',
            },
            {
              id: 'balanced' as const,
              title: 'Balanced 🌤️',
              desc: 'Steady afternoon & evening blocks.',
            },
            {
              id: 'night-owl' as const,
              title: 'Night Owl 🌙',
              desc: 'Peak concentration late night (9:00 PM – 2:00 AM).',
            },
          ].map((item) => {
            const isSelected = studyPreference === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setStudyPreference(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 ring-1 ring-primary-500'
                    : 'border-[var(--border)] bg-[var(--background)] hover:border-primary-400'
                }`}
              >
                <div className="font-bold text-xs text-[var(--foreground)]">{item.title}</div>
                <div className="text-[11px] text-[var(--muted)] mt-1">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Other Regular Commitments (Selectable Chips) */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <h3 className="font-bold text-xs text-[var(--foreground)]">
            Other Daily Activities &amp; Breaks (Choose all that apply)
          </h3>
        </div>
        <p className="text-xs text-[var(--muted)]">
          The planner preserves healthy buffer periods for your sports, gym, or relaxation so you don&apos;t burn out.
        </p>
        
        <div className="flex flex-wrap gap-2 pt-1">
          {commitmentPresets.map((preset) => {
            const isSelected = selectedCommitments.includes(preset) || (preset.startsWith('None') && selectedCommitments.includes('None'));
            return (
              <button
                key={preset}
                type="button"
                onClick={() => toggleCommitment(preset)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold shadow-sm'
                    : 'bg-[var(--background)] border-[var(--border)] text-[var(--muted)] hover:border-emerald-400 hover:text-[var(--foreground)]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{preset}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-primary-500/20"
      >
        <span>Save Schedule &amp; Target Exam Date</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
