import fs from 'fs';
import path from 'path';
import os from 'os';
import type { DailyRoutine, StudyPlan } from '@/types';
import {
  purgeMockEntries,
  type UserActivityLog,
  type UserChoiceRecord,
  type AIRequestLog,
  type TelemetryData,
} from './telemetrySanitizer';

export {
  purgeMockEntries,
  type UserActivityLog,
  type UserChoiceRecord,
  type AIRequestLog,
  type TelemetryData,
};

// ── In-Memory Serverless Cache ─────────────────────────────────────
let memoryTelemetryCache: TelemetryData | null = null;

// Determine safe writable location (Supports Vercel serverless /tmp)
function getTelemetryFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), 'exampilot_telemetry.json');
  }

  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    return path.join(dataDir, 'telemetry.json');
  } catch {
    return path.join(os.tmpdir(), 'exampilot_telemetry.json');
  }
}

// Factual clean starting state — ZERO fake users, ZERO fake counts
function getCleanTelemetry(): TelemetryData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    users: {},
    activities: [],
    aiRequests: [],
    plans: {},
    stats: {
      totalRequestsAllTime: 0,
      requestsToday: 0,
      lastResetDate: today,
      dailyLimit: 1500,
      rpmLimit: 15,
    },
  };
}

export function getTelemetry(): TelemetryData {
  if (memoryTelemetryCache) {
    const today = new Date().toISOString().slice(0, 10);
    if (memoryTelemetryCache.stats.lastResetDate !== today) {
      memoryTelemetryCache.stats.requestsToday = 0;
      memoryTelemetryCache.stats.lastResetDate = today;
    }
    return purgeMockEntries(memoryTelemetryCache);
  }

  const filePath = getTelemetryFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data: TelemetryData = JSON.parse(raw);
      if (data && data.stats) {
        const sanitized = purgeMockEntries(data);
        memoryTelemetryCache = sanitized;
        saveTelemetry(sanitized);
        return sanitized;
      }
    }
  } catch (e) {
    console.warn('Telemetry read notice:', e);
  }

  const clean = getCleanTelemetry();
  memoryTelemetryCache = clean;
  saveTelemetry(clean);
  return clean;
}

export function saveTelemetry(data: TelemetryData) {
  memoryTelemetryCache = data;
  const filePath = getTelemetryFilePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Telemetry file write deferred, retained in memory cache:', e);
  }
}

export function resetTelemetry(): TelemetryData {
  const clean = getCleanTelemetry();
  saveTelemetry(clean);
  return clean;
}

export function recordUserLogin(user: { uid: string; email: string; displayName?: string; provider?: string }) {
  if (!user || !user.uid) return;
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

    if (data.activities.length > 500) {
      data.activities = data.activities.slice(0, 500);
    }

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
    } else {
      data.users[user.uid].updatedAt = now;
      if (user.displayName) data.users[user.uid].displayName = user.displayName;
      if (user.email) data.users[user.uid].email = user.email;
    }

    saveTelemetry(data);
  } catch (e) {
    console.warn('Record user login error:', e);
  }
}

export function recordUserChoices(choice: UserChoiceRecord) {
  if (!choice || !choice.uid) return;
  try {
    const data = getTelemetry();
    data.users[choice.uid] = {
      ...(data.users[choice.uid] || {}),
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
    console.warn('Record user choices error:', e);
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

    data.stats.totalRequestsAllTime += 1;
    data.stats.requestsToday += 1;

    const aiLog: AIRequestLog = {
      id: reqId,
      timestamp: now,
      uid: params.uid,
      email: params.email || (params.uid && data.users[params.uid]?.email) || 'Student',
      exam: params.exam,
      country: params.country,
      dailyHours: params.dailyHours,
      sessionDurationMinutes: params.sessionDurationMinutes || 90,
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
    if (data.aiRequests.length > 500) {
      data.aiRequests = data.aiRequests.slice(0, 500);
    }

    if (params.plan && params.plan.id) {
      data.plans[params.plan.id] = params.plan;

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
    console.warn('Record AI request error:', e);
  }
}
