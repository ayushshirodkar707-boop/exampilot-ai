import fs from 'fs';
import path from 'path';
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

const DATA_DIR = path.join(process.cwd(), 'data');
const TELEMETRY_FILE = path.join(DATA_DIR, 'telemetry.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(TELEMETRY_FILE)) {
      const initial: TelemetryData = {
        users: {},
        activities: [],
        aiRequests: [],
        plans: {},
        stats: {
          totalRequestsAllTime: 0,
          requestsToday: 0,
          lastResetDate: new Date().toISOString().slice(0, 10),
          dailyLimit: 1500,
          rpmLimit: 15,
        },
      };
      fs.writeFileSync(TELEMETRY_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    }
  } catch (e) {
    console.warn('Telemetry dir setup notice:', e);
  }
}

export function getTelemetry(): TelemetryData {
  ensureDataDir();
  try {
    if (fs.existsSync(TELEMETRY_FILE)) {
      const raw = fs.readFileSync(TELEMETRY_FILE, 'utf-8');
      const data: TelemetryData = JSON.parse(raw);
      
      // Auto-reset daily quota on new day
      const today = new Date().toISOString().slice(0, 10);
      if (data.stats.lastResetDate !== today) {
        data.stats.requestsToday = 0;
        data.stats.lastResetDate = today;
        saveTelemetry(data);
      }
      return data;
    }
  } catch (e) {
    console.error('Failed to read telemetry:', e);
  }

  return {
    users: {},
    activities: [],
    aiRequests: [],
    plans: {},
    stats: {
      totalRequestsAllTime: 0,
      requestsToday: 0,
      lastResetDate: new Date().toISOString().slice(0, 10),
      dailyLimit: 1500,
      rpmLimit: 15,
    },
  };
}

export function saveTelemetry(data: TelemetryData) {
  ensureDataDir();
  try {
    fs.writeFileSync(TELEMETRY_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write telemetry:', e);
  }
}

export function recordUserLogin(user: { uid: string; email: string; displayName?: string; provider?: string }) {
  try {
    const data = getTelemetry();
    const now = new Date().toISOString();
    
    // Log activity
    data.activities.unshift({
      uid: user.uid,
      email: user.email || 'anonymous',
      displayName: user.displayName || user.email?.split('@')[0] || 'Student',
      action: 'login',
      provider: user.provider || 'password',
      timestamp: now,
    });

    // Keep max 500 recent activities
    if (data.activities.length > 500) {
      data.activities = data.activities.slice(0, 500);
    }

    // Ensure user record exists
    if (!data.users[user.uid]) {
      data.users[user.uid] = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Student',
        country: '',
        exam: '',
        examDate: '',
        dailyHours: 6,
        sessionDurationMinutes: 90,
        selectedSubjects: [],
        weakSubjects: [],
        strongSubjects: [],
        updatedAt: now,
      };
    }

    saveTelemetry(data);
  } catch (e) {
    console.warn('Record user login notice:', e);
  }
}

export function recordUserChoices(choice: UserChoiceRecord) {
  try {
    const data = getTelemetry();
    data.users[choice.uid] = {
      ...data.users[choice.uid],
      ...choice,
      updatedAt: new Date().toISOString(),
    };

    data.activities.unshift({
      uid: choice.uid,
      email: choice.email,
      displayName: choice.displayName,
      action: 'profile_updated',
      timestamp: new Date().toISOString(),
      details: { exam: choice.exam, country: choice.country, dailyHours: choice.dailyHours },
    });

    saveTelemetry(data);
  } catch (e) {
    console.warn('Record user choices notice:', e);
  }
}

export function recordAIRequestAndPlan(params: {
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
  plan?: StudyPlan;
}) {
  try {
    const data = getTelemetry();
    const now = new Date().toISOString();
    const reqId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Increment AI counters
    data.stats.totalRequestsAllTime += 1;
    data.stats.requestsToday += 1;

    // Log AI Request
    const aiLog: AIRequestLog = {
      id: reqId,
      timestamp: now,
      uid: params.uid,
      email: params.email || (params.uid && data.users[params.uid]?.email) || 'Student',
      exam: params.exam,
      country: params.country,
      dailyHours: params.dailyHours,
      sessionDurationMinutes: params.sessionDurationMinutes,
      selectedSubjects: params.selectedSubjects,
      weakSubjects: params.weakSubjects,
      source: params.source,
      durationMs: params.durationMs,
      status: params.status,
      planId: params.plan?.id,
      totalWeeks: params.plan?.weeks?.length || 4,
      totalDays: (params.plan?.weeks?.length || 4) * 7,
    };

    data.aiRequests.unshift(aiLog);
    if (data.aiRequests.length > 300) {
      data.aiRequests = data.aiRequests.slice(0, 300);
    }

    // Save plan
    if (params.plan && params.plan.id) {
      data.plans[params.plan.id] = params.plan;

      // Keep user choice record updated with this plan
      if (params.uid && data.users[params.uid]) {
        data.users[params.uid].exam = params.exam;
        data.users[params.uid].country = params.country;
        data.users[params.uid].dailyHours = params.dailyHours;
        data.users[params.uid].sessionDurationMinutes = params.sessionDurationMinutes || 90;
        data.users[params.uid].selectedSubjects = params.selectedSubjects;
        data.users[params.uid].weakSubjects = params.weakSubjects;
        data.users[params.uid].updatedAt = now;
      }
    }

    saveTelemetry(data);
  } catch (e) {
    console.warn('Record AI request notice:', e);
  }
}
