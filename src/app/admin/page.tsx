'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Cpu,
  Layers,
  Activity,
  Calendar,
  Clock,
  Sparkles,
  Search,
  RefreshCw,
  Eye,
  X,
  AlertTriangle,
  ArrowRight,
  Lock,
  CheckCircle2,
  FileText,
  Zap,
  BarChart3,
  Server,
} from 'lucide-react';
import type { TelemetryData, UserChoiceRecord, AIRequestLog } from '@/lib/telemetry';
import type { StudyPlan } from '@/types';

export default function AdminDashboardPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'plans' | 'requests' | 'limits'>('overview');

  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [requestFilter, setRequestFilter] = useState<'all' | 'ai_engine' | 'precision_schedule_engine'>('all');

  // Modal inspection
  const [inspectedPlan, setInspectedPlan] = useState<StudyPlan | null>(null);
  const [inspectedRequest, setInspectedRequest] = useState<AIRequestLog | null>(null);

  // Check saved admin passcode session
  useEffect(() => {
    const saved = localStorage.getItem('exampilot_admin_passcode');
    if (saved) {
      setPasscode(saved);
      verifyAndLoad(saved);
    }
  }, []);

  const verifyAndLoad = async (codeToVerify: string) => {
    setLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`/api/admin/telemetry?passcode=${encodeURIComponent(codeToVerify)}`, {
        headers: {
          'x-admin-passcode': codeToVerify,
        },
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setTelemetry(json.data);
        setIsAuthenticated(true);
        localStorage.setItem('exampilot_admin_passcode', codeToVerify);
      } else {
        setIsAuthenticated(false);
        setAuthError(json.error || 'Invalid admin passcode.');
      }
    } catch (e: any) {
      setAuthError('Failed to connect to admin backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError('Please enter the admin passcode.');
      return;
    }
    verifyAndLoad(passcode.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('exampilot_admin_passcode');
    setIsAuthenticated(false);
    setPasscode('');
    setTelemetry(null);
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    if (!telemetry?.users) return [];
    const list = Object.values(telemetry.users);
    if (!userSearch.trim()) return list;
    const q = userSearch.toLowerCase();
    return list.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        u.displayName?.toLowerCase().includes(q) ||
        u.exam?.toLowerCase().includes(q) ||
        u.country?.toLowerCase().includes(q)
    );
  }, [telemetry, userSearch]);

  // Filtered AI Requests
  const filteredRequests = useMemo(() => {
    if (!telemetry?.aiRequests) return [];
    if (requestFilter === 'all') return telemetry.aiRequests;
    return telemetry.aiRequests.filter((r) => r.source === requestFilter);
  }, [telemetry, requestFilter]);

  // If not authenticated, render secure Command Center Lock screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md card p-8 sm:p-10 space-y-6 shadow-2xl border-primary-500/20">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-primary-600/10 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-4 border border-primary-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[var(--foreground)]">
              ExamPilot Flight Command
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Secure administrator portal. Inspect active users, AI telemetry, study schedules, and system limits.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                Admin Security Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[var(--muted)]" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode (e.g. exampilot2026)"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 pl-9 pr-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-primary-500/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Access Admin Cockpit
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-center text-[var(--muted)] pt-2 border-t border-[var(--border)]">
            Default Passcode: <code className="font-mono bg-[var(--background)] px-1.5 py-0.5 rounded border border-[var(--border)]">exampilot2026</code>
          </p>
        </div>
      </div>
    );
  }

  const stats = telemetry?.stats || {
    totalRequestsAllTime: 0,
    requestsToday: 0,
    dailyLimit: 1500,
    rpmLimit: 15,
    lastResetDate: new Date().toISOString().slice(0, 10),
  };

  const usagePercent = Math.min(100, Math.round((stats.requestsToday / stats.dailyLimit) * 100));
  const remainingToday = Math.max(0, stats.dailyLimit - stats.requestsToday);

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-900 via-indigo-950 to-purple-950 text-white shadow-xl border border-indigo-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-bold">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                System Online
              </span>
              <span className="text-xs text-gray-400 font-mono">Telemetry v2.0</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              ExamPilot AI • Master Admin Backend
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={() => verifyAndLoad(passcode)}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold transition-colors border border-red-500/30"
          >
            Exit Admin
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border)] scrollbar-none">
        {[
          { id: 'overview', label: 'Command Overview', icon: BarChart3 },
          { id: 'users', label: 'Students & Choices', icon: Users, count: Object.keys(telemetry?.users || {}).length },
          { id: 'plans', label: 'Generated AI Plans', icon: FileText, count: Object.keys(telemetry?.plans || {}).length },
          { id: 'requests', label: 'AI Request Audit Log', icon: Cpu, count: telemetry?.aiRequests?.length || 0 },
          { id: 'limits', label: 'AI Limits & Quotas', icon: Server },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20' : 'bg-[var(--background)]'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: COMMAND OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span className="font-semibold">Registered Students</span>
                <Users className="w-4 h-4 text-primary-500" />
              </div>
              <div className="text-3xl font-extrabold text-[var(--foreground)]">
                {Object.keys(telemetry?.users || {}).length}
              </div>
              <p className="text-[11px] text-[var(--muted)]">Active profiles in database</p>
            </div>

            <div className="card p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span className="font-semibold">AI Study Plans Created</span>
                <FileText className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {Object.keys(telemetry?.plans || {}).length}
              </div>
              <p className="text-[11px] text-[var(--muted)]">Precision timetables generated</p>
            </div>

            <div className="card p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span className="font-semibold">AI Calls Today</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {stats.requestsToday} <span className="text-sm font-normal text-[var(--muted)]">/ {stats.dailyLimit}</span>
              </div>
              <p className="text-[11px] text-[var(--muted)]">{remainingToday} free requests remaining today</p>
            </div>

            <div className="card p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span className="font-semibold">AI Quota Consumed</span>
                <Server className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {usagePercent}%
              </div>
              <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Recent Activity Feed & Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Logins & Events */}
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary-500" />
                  Recent Student Activity Feed
                </h3>
                <span className="text-xs text-[var(--muted)] font-mono">Real-Time</span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {(telemetry?.activities || []).length === 0 ? (
                  <p className="text-xs text-[var(--muted)] py-8 text-center">No student activity logged yet.</p>
                ) : (
                  telemetry!.activities.slice(0, 15).map((act, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-semibold text-[var(--foreground)]">
                          {act.displayName} <span className="font-normal text-[var(--muted)]">({act.email})</span>
                        </div>
                        <div className="text-[11px] text-[var(--muted)] mt-0.5 capitalize">
                          Action: <span className="font-semibold text-primary-600 dark:text-primary-400">{act.action.replace('_', ' ')}</span>
                          {act.provider && ` via ${act.provider}`}
                        </div>
                      </div>
                      <span className="text-[10px] text-[var(--muted)] font-mono shrink-0">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick AI Requests Monitor */}
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-500" />
                  Latest AI Flight Requests
                </h3>
                <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold cursor-pointer" onClick={() => setActiveTab('requests')}>
                  View All &rarr;
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {(telemetry?.aiRequests || []).length === 0 ? (
                  <p className="text-xs text-[var(--muted)] py-8 text-center">No AI calls recorded yet.</p>
                ) : (
                  telemetry!.aiRequests.slice(0, 8).map((req) => (
                    <div
                      key={req.id}
                      className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-[var(--foreground)]">
                          {req.exam} ({req.country})
                        </div>
                        <div className="text-[11px] text-[var(--muted)] mt-0.5">
                          {req.dailyHours} hrs/day • {req.sessionDurationMinutes || 90}m in 1 go • {req.selectedSubjects.length} subjects
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {req.durationMs}ms
                        </span>
                        <div className="text-[10px] text-[var(--muted)] mt-0.5 capitalize">{req.source.replace(/_/g, ' ')}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: STUDENTS & CHOICES ── */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">Registered Students &amp; Selected Preferences</h2>
              <p className="text-xs text-[var(--muted)]">Track who logged in, target exams, study routine timings, and focus duration in 1 go.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search students, exam, country..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2 pl-9 pr-3 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.length === 0 ? (
              <div className="col-span-2 card text-center py-12 text-sm text-[var(--muted)]">
                No students match your search.
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.uid} className="card p-5 space-y-4 hover:border-primary-400 transition-all">
                  <div className="flex items-start justify-between border-b border-[var(--border)] pb-3">
                    <div>
                      <h4 className="font-bold text-base text-[var(--foreground)]">{user.displayName || 'Student'}</h4>
                      <div className="text-xs text-[var(--muted)] font-mono">{user.email || 'No email provided'}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 uppercase tracking-wider">
                      {user.country || 'Global'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                      <span className="text-[10px] font-semibold text-[var(--muted)] block">Target Exam</span>
                      <span className="font-bold text-[var(--foreground)]">{user.exam || 'Not configured'}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                      <span className="text-[10px] font-semibold text-[var(--muted)] block">Target Exam Date</span>
                      <span className="font-bold text-[var(--foreground)]">{user.examDate || 'Flexible'}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                      <span className="text-[10px] font-semibold text-[var(--muted)] block">Daily Study Hours</span>
                      <span className="font-bold text-primary-600 dark:text-primary-400">{user.dailyHours || 6} Hours/Day</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                      <span className="text-[10px] font-semibold text-[var(--muted)] block">1 Subject in 1 Go</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.sessionDurationMinutes || 90} Minutes</span>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--muted)] block mb-1.5">Exam Subjects</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(user.selectedSubjects || []).length > 0 ? (
                        user.selectedSubjects.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--background)] border border-[var(--border)]">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[var(--muted)] italic">No subjects selected yet</span>
                      )}
                    </div>
                  </div>

                  {/* Daily Routine Summary */}
                  {user.dailyRoutine && (
                    <div className="p-3 rounded-xl bg-primary-50/40 dark:bg-primary-950/20 border border-primary-500/20 text-[11px] space-y-1">
                      <span className="font-bold text-primary-600 dark:text-primary-400 block">Calibrated Routine:</span>
                      <div>School: {user.dailyRoutine.hasSchool ? user.dailyRoutine.schoolTimings : 'None (Full-time)'}</div>
                      <div>Coaching: {user.dailyRoutine.hasCoaching ? user.dailyRoutine.coachingTimings : 'Self-study'}</div>
                      <div>Study Preference: <strong className="capitalize">{user.dailyRoutine.studyPreference}</strong></div>
                    </div>
                  )}

                  <div className="text-[10px] text-[var(--muted)] pt-2 border-t border-[var(--border)] flex items-center justify-between">
                    <span>UID: {user.uid.slice(0, 12)}...</span>
                    <span>Updated: {new Date(user.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: GENERATED AI PLANS ── */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">Study Plans Generated by ExamPilot AI</h2>
            <p className="text-xs text-[var(--muted)]">Inspect the detailed 4-week timetables crafted for each student.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(telemetry?.plans || {}).length === 0 ? (
              <div className="col-span-3 card text-center py-12 text-sm text-[var(--muted)]">
                No study plans generated yet. Complete an onboarding flow to see plans here.
              </div>
            ) : (
              Object.values(telemetry!.plans).map((plan) => (
                <div key={plan.id} className="card p-5 space-y-4 hover:border-primary-400 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {plan.weeks?.length || 4} Weeks Active
                      </span>
                      <span className="text-[10px] text-[var(--muted)] font-mono">{plan.country}</span>
                    </div>
                    <h3 className="font-bold text-base text-[var(--foreground)]">{plan.exam}</h3>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      Subjects: {plan.selectedSubjects?.join(', ') || 'All Core'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-[10px] text-[var(--muted)]">
                      {new Date(plan.generatedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setInspectedPlan(plan)}
                      className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Plan</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: AI REQUEST AUDIT LOG ── */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">AI Request Audit Trail</h2>
              <p className="text-xs text-[var(--muted)]">Every API prompt, request payload, generation latency, and response status.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted)]">Filter:</span>
              <select
                value={requestFilter}
                onChange={(e) => setRequestFilter(e.target.value as any)}
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs text-[var(--foreground)]"
              >
                <option value="all">All Sources</option>
                <option value="ai_engine">AI Flight Engine</option>
                <option value="precision_schedule_engine">Precision Scheduler</option>
              </select>
            </div>
          </div>

          <div className="card overflow-x-auto p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--background)] border-b border-[var(--border)] text-[var(--muted)]">
                <tr>
                  <th className="p-3.5 font-semibold">Timestamp</th>
                  <th className="p-3.5 font-semibold">Requester</th>
                  <th className="p-3.5 font-semibold">Exam &amp; Region</th>
                  <th className="p-3.5 font-semibold">Target / In 1 Go</th>
                  <th className="p-3.5 font-semibold">Engine Source</th>
                  <th className="p-3.5 font-semibold">Latency</th>
                  <th className="p-3.5 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[var(--muted)]">No AI requests logged yet.</td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[var(--card-hover)] transition-colors">
                      <td className="p-3.5 font-mono text-[11px] text-[var(--muted)]">
                        {new Date(req.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-3.5 font-semibold text-[var(--foreground)]">
                        {req.email || req.uid?.slice(0, 10) || 'Student'}
                      </td>
                      <td className="p-3.5 font-medium">{req.exam} ({req.country})</td>
                      <td className="p-3.5 text-[var(--muted)]">
                        {req.dailyHours}h / {req.sessionDurationMinutes || 90}m in 1 go
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.source === 'ai_engine'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {req.source === 'ai_engine' ? 'AI Flight Engine' : 'Precision Engine'}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {req.durationMs}ms
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => setInspectedRequest(req)}
                          className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                        >
                          View Request
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 5: AI LIMITS & SYSTEM STATUS ── */}
      {activeTab === 'limits' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">AI Engine Limits &amp; Infrastructure Capacity</h2>
            <p className="text-xs text-[var(--muted)]">Real-time quota monitoring, RPM rate limit protection, and infrastructure parameters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 space-y-4 md:col-span-2">
              <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                <Server className="w-4 h-4 text-primary-500" />
                Daily AI Allocation (RPD - Requests Per Day)
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--muted)]">Usage Today</span>
                  <span className="font-bold text-[var(--foreground)]">
                    {stats.requestsToday} / {stats.dailyLimit} requests ({usagePercent}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-primary-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, usagePercent)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--muted)]">
                  <span>Resets at 00:00 UTC (Daily cycle)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{remainingToday} calls remaining</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted)] block">Rate Limit (RPM)</span>
                  <span className="font-bold text-sm text-[var(--foreground)]">{stats.rpmLimit} Req/Min</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted)] block">All-Time Requests</span>
                  <span className="font-bold text-sm text-[var(--foreground)]">{stats.totalRequestsAllTime}</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted)] block">Safety Fallback Mode</span>
                  <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">Zero-Downtime Active</span>
                </div>
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Quota Defense System
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                If the external AI key reaches its daily rate limit, ExamPilot AI automatically switches in 0ms to its <strong>Precision Schedule Engine</strong> without student error popups.
              </p>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs space-y-1">
                <span className="font-bold block">100% Free Tier Compliant</span>
                <span>Unlimited precision generation without unexpected cloud billing.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: INSPECT STUDY PLAN ── */}
      {inspectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[var(--card)] p-6 shadow-2xl border border-[var(--border)] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="font-bold text-lg text-[var(--foreground)]">
                  {inspectedPlan.exam} Timetable Breakdown
                </h3>
                <p className="text-xs text-[var(--muted)]">Plan ID: {inspectedPlan.id}</p>
              </div>
              <button
                onClick={() => setInspectedPlan(null)}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--card-hover)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {inspectedPlan.weeks?.map((week) => (
                <div key={week.weekNumber} className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    Week {week.weekNumber}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {week.days?.slice(0, 4).map((day, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-1">
                        <div className="font-bold text-[var(--foreground)]">{day.dayLabel} ({day.date})</div>
                        <div className="text-[11px] text-[var(--muted)]">
                          Morning: {day.blocks.morning.subject} ({day.blocks.morning.timeSlot || `${day.blocks.morning.duration}m`})
                        </div>
                        <div className="text-[11px] text-[var(--muted)]">
                          Afternoon: {day.blocks.afternoon.subject}
                        </div>
                        <div className="text-[11px] text-[var(--muted)]">
                          Evening: {day.blocks.evening.subject}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex justify-end">
              <button
                onClick={() => setInspectedPlan(null)}
                className="btn-secondary py-2 px-4 text-xs font-semibold"
              >
                Close Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: INSPECT AI REQUEST LOG ── */}
      {inspectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl bg-[var(--card)] p-6 shadow-2xl border border-[var(--border)] max-h-[85vh] flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="font-bold text-base text-[var(--foreground)]">
                  AI Request Payload Audit
                </h3>
                <p className="text-xs text-[var(--muted)] font-mono">{inspectedRequest.id}</p>
              </div>
              <button
                onClick={() => setInspectedRequest(null)}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--card-hover)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <pre className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] overflow-x-auto">
                {JSON.stringify(inspectedRequest, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectedRequest(null)}
                className="btn-secondary py-2 px-4 text-xs font-semibold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
