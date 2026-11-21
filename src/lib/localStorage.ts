import { UserProfile, StudyPlan, Chapter, MockTest } from '@/types';

// ── Generic helpers ────────────────────────────────────────────────

export function getLocalData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setLocalData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable – silently ignore
  }
}

// ── Profile ────────────────────────────────────────────────────────

const PROFILE_KEY = 'exampilot_profile';

export function getLocalProfile(): UserProfile | null {
  return getLocalData<UserProfile>(PROFILE_KEY);
}

export function setLocalProfile(profile: UserProfile): void {
  setLocalData(PROFILE_KEY, profile);
}

// ── Study Plan ─────────────────────────────────────────────────────

const PLAN_KEY = 'exampilot_plan';

export function getLocalPlan(): StudyPlan | null {
  return getLocalData<StudyPlan>(PLAN_KEY);
}

export function setLocalPlan(plan: StudyPlan): void {
  setLocalData(PLAN_KEY, plan);
}

// ── Chapters ───────────────────────────────────────────────────────

const CHAPTERS_KEY = 'exampilot_chapters';

export function getLocalChapters(): Chapter[] {
  return getLocalData<Chapter[]>(CHAPTERS_KEY) ?? [];
}

export function setLocalChapters(chapters: Chapter[]): void {
  setLocalData(CHAPTERS_KEY, chapters);
}

// ── Mock Tests ─────────────────────────────────────────────────────

const MOCK_TESTS_KEY = 'exampilot_mock_tests';

export function getLocalMockTests(): MockTest[] {
  return getLocalData<MockTest[]>(MOCK_TESTS_KEY) ?? [];
}

export function addLocalMockTest(test: MockTest): void {
  const tests = getLocalMockTests();
  tests.push(test);
  setLocalData(MOCK_TESTS_KEY, tests);
}

// ── Streak ─────────────────────────────────────────────────────────

/**
 * Checks whether the user studied yesterday or today.
 * - If `lastStudyDate` is today → streak unchanged.
 * - If `lastStudyDate` is yesterday → streak incremented by 1.
 * - Otherwise → streak resets to 1 (today counts as day 1).
 *
 * Updates the profile in localStorage and returns the new streak.
 */
export function updateLocalStreak(): number {
  const profile = getLocalProfile();
  if (!profile) return 0;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD

  if (profile.lastStudyDate === todayStr) {
    // Already recorded today – no change
    return profile.streak;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  let newStreak: number;
  if (profile.lastStudyDate === yesterdayStr) {
    newStreak = profile.streak + 1;
  } else {
    newStreak = 1; // streak broken – restart
  }

  const updatedProfile: UserProfile = {
    ...profile,
    streak: newStreak,
    lastStudyDate: todayStr,
  };
  setLocalProfile(updatedProfile);

  return newStreak;
}

// ── Clear everything ───────────────────────────────────────────────

export function clearLocalData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(PLAN_KEY);
  localStorage.removeItem(CHAPTERS_KEY);
  localStorage.removeItem(MOCK_TESTS_KEY);
}
