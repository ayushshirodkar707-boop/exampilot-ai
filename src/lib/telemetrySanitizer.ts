import type { DailyRoutine, StudyPlan } from '@/types';

export interface UserActivityLog {
  uid: string;
  email: string;
  displayName: string;
  action: 'login' | 'signup' | 'plan_generated' | 'profile_updated';
  provider?: string;
  timestamp: string;
  details?: any;
}

export interface UserChoiceRecord {
  uid: string;
  email: string;
  displayName: string;
  country: string;
  exam: string;
  examDate: string;
  dailyHours: number;
  sessionDurationMinutes?: number;
  selectedSubjects: string[];
  weakSubjects: string[];
  strongSubjects: string[];
  prepLevel?: string;
  dailyRoutine?: DailyRoutine;
  updatedAt: string;
}

export interface AIRequestLog {
  id: string;
  timestamp: string;
  uid?: string;
  email?: string;
  exam: string;
  country: string;
  dailyHours: number;
  sessionDurationMinutes?: number;
  selectedSubjects: string[];
  weakSubjects: string[];
  source: 'ai_engine' | 'precision_schedule_engine';
  durationMs: number;
  status: 'success' | 'fallback' | 'error';
  planId?: string;
  totalWeeks?: number;
  totalDays?: number;
}

export interface TelemetryData {
  users: Record<string, UserChoiceRecord>;
  activities: UserActivityLog[];
  aiRequests: AIRequestLog[];
  plans: Record<string, StudyPlan>;
  stats: {
    totalRequestsAllTime: number;
    requestsToday: number;
    lastResetDate: string;
    dailyLimit: number;
    rpmLimit: number;
  };
}

// Purge any legacy mock or test data so ONLY 100% genuine user data is returned
export function purgeMockEntries(data: TelemetryData): TelemetryData {
  if (!data) return data;

  const mockUids = ['user_ayush_admin', 'user_alex_smith', 'user_priya_sharma', 'user_sample'];
  const mockEmails = ['ayush.shirodkar@exampilot.ai', 'alex.smith@gmail.com', 'priya.sharma99@outlook.com'];

  const sanitized: TelemetryData = {
    users: { ...(data.users || {}) },
    activities: [...(data.activities || [])],
    aiRequests: [...(data.aiRequests || [])],
    plans: { ...(data.plans || {}) },
    stats: { ...(data.stats || { totalRequestsAllTime: 0, requestsToday: 0, lastResetDate: new Date().toISOString().slice(0, 10), dailyLimit: 1500, rpmLimit: 15 }) },
  };

  // 1. Purge legacy mock users
  if (sanitized.users) {
    mockUids.forEach((uid) => delete sanitized.users[uid]);
    Object.keys(sanitized.users).forEach((uid) => {
      const email = sanitized.users[uid]?.email?.toLowerCase();
      if (email && mockEmails.includes(email)) {
        delete sanitized.users[uid];
      }
    });
  }

  // 2. Purge legacy mock activities
  if (sanitized.activities) {
    sanitized.activities = sanitized.activities.filter(
      (a) => !mockUids.includes(a.uid) && !mockEmails.includes(a.email?.toLowerCase())
    );
  }

  // 3. Purge legacy mock AI requests
  if (sanitized.aiRequests) {
    sanitized.aiRequests = sanitized.aiRequests.filter(
      (r) =>
        !(r.uid && mockUids.includes(r.uid)) &&
        !(r.email && mockEmails.includes(r.email.toLowerCase())) &&
        !r.id.includes('9a2f1') &&
        !r.id.includes('4c7b2') &&
        !r.id.includes('1e8d4')
    );
  }

  // 4. Purge legacy mock plans
  if (sanitized.plans) {
    delete sanitized.plans['plan_ayush_cbse_2026'];
    delete sanitized.plans['plan_alex_sat_2026'];
    delete sanitized.plans['plan_priya_jee_2026'];
  }

  // 5. Ensure stats reflect genuine counts
  if (sanitized.stats) {
    const today = new Date().toISOString().slice(0, 10);
    sanitized.stats.totalRequestsAllTime = (sanitized.aiRequests || []).length;
    sanitized.stats.requestsToday = (sanitized.aiRequests || []).filter(
      (r) => r.timestamp && r.timestamp.slice(0, 10) === today
    ).length;
  }

  return sanitized;
}
