'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  getUserProfile,
  saveUserProfile,
  getStudyPlan,
  saveStudyPlan,
  getChapters,
  saveChapters,
  getMockTests,
  addMockTest as addFirestoreMockTest,
  updateStreak as updateFirestoreStreak,
} from '@/lib/firestore';
import {
  getLocalProfile,
  setLocalProfile,
  getLocalPlan,
  setLocalPlan,
  getLocalChapters,
  setLocalChapters,
  getLocalMockTests,
  addLocalMockTest,
  updateLocalStreak,
} from '@/lib/localStorage';
import type { UserProfile, StudyPlan, Chapter, MockTest } from '@/types';

export interface UseStudyDataReturn {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => Promise<void>;
  plan: StudyPlan | null;
  setPlan: (plan: StudyPlan) => Promise<void>;
  chapters: Chapter[];
  setChapters: (chapters: Chapter[]) => Promise<void>;
  mockTests: MockTest[];
  addMockTest: (test: MockTest) => Promise<void>;
  streak: number;
  updateDailyStreak: () => Promise<void>;
  loading: boolean;
}

export function useStudyData(): UseStudyDataReturn {
  const { user } = useAuth();

  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [plan, setPlanState] = useState<StudyPlan | null>(null);
  const [chapters, setChaptersState] = useState<Chapter[]>([]);
  const [mockTests, setMockTestsState] = useState<MockTest[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const uid = user?.uid ?? null;

  // ── Blazing Fast Local-First Load + Background Cloud Sync ─────────────
  useEffect(() => {
    if (!uid) {
      setProfileState(null);
      setPlanState(null);
      setChaptersState([]);
      setMockTestsState([]);
      setStreak(0);
      setLoading(false);
      return;
    }

    let cancelled = false;

    // 1. Instant local read (0ms latency, zero spinner lockup)
    const localProfile = getLocalProfile();
    const localPlan = getLocalPlan();
    const localChapters = getLocalChapters();
    const localMockTests = getLocalMockTests();

    if (localPlan || localProfile) {
      setProfileState(localProfile);
      setPlanState(localPlan);
      setChaptersState(localChapters);
      setMockTestsState(localMockTests);
      setStreak(localProfile?.streak ?? 0);
      setLoading(false); // UI renders IMMEDIATELY!
    }

    // 2. Cloud sync in background with a tight 2.5-second timeout
    const fetchCloud = Promise.all([
      getUserProfile(uid),
      getStudyPlan(uid),
      getChapters(uid),
      getMockTests(uid),
    ]);

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Cloud sync timeout')), 2500)
    );

    Promise.race([fetchCloud, timeout])
      .then(([fsProfile, fsPlan, fsChapters, fsMockTests]: any) => {
        if (cancelled) return;

        if (fsProfile) {
          setProfileState(fsProfile);
          setLocalProfile(fsProfile);
          setStreak(fsProfile.streak ?? 0);
        }
        if (fsPlan) {
          setPlanState(fsPlan);
          setLocalPlan(fsPlan);
        }
        if (fsChapters && fsChapters.length > 0) {
          setChaptersState(fsChapters);
          setLocalChapters(fsChapters);
        }
        if (fsMockTests && fsMockTests.length > 0) {
          setMockTestsState(fsMockTests);
        }
      })
      .catch((err) => {
        // Cloud timeout or offline: silently keep instant local data
        console.info('Cloud sync deferred, using local speed cache:', err?.message || err);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [uid]);

  // ── Setters (Always instant localStorage + non-blocking cloud sync) ──

  const setProfile = useCallback(
    async (newProfile: UserProfile) => {
      setProfileState(newProfile);
      setStreak(newProfile.streak);
      setLocalProfile(newProfile); // Instant

      if (uid) {
        saveUserProfile(uid, newProfile).catch((e) =>
          console.warn('Background profile save notice:', e?.message)
        );
      }
    },
    [uid],
  );

  const setPlan = useCallback(
    async (newPlan: StudyPlan) => {
      setPlanState(newPlan);
      setLocalPlan(newPlan); // Instant

      if (uid) {
        saveStudyPlan(uid, newPlan).catch((e) =>
          console.warn('Background plan save notice:', e?.message)
        );
      }
    },
    [uid],
  );

  const setChapters = useCallback(
    async (newChapters: Chapter[]) => {
      setChaptersState(newChapters);
      setLocalChapters(newChapters); // Instant

      if (uid) {
        saveChapters(uid, newChapters).catch((e) =>
          console.warn('Background chapters save notice:', e?.message)
        );
      }
    },
    [uid],
  );

  const addMockTest = useCallback(
    async (test: MockTest) => {
      setMockTestsState((prev) => [test, ...prev]);
      addLocalMockTest(test); // Instant

      if (uid) {
        addFirestoreMockTest(uid, test).catch((e) =>
          console.warn('Background mock test save notice:', e?.message)
        );
      }
    },
    [uid],
  );

  // ── Streak ─────────────────────────────────────────────────────────

  const updateDailyStreak = useCallback(async () => {
    if (!uid) return;

    const newStreak = updateLocalStreak();
    setStreak(newStreak);

    updateFirestoreStreak(uid).catch((e) =>
      console.warn('Background streak save notice:', e?.message)
    );

    setProfileState((prev) =>
      prev
        ? {
            ...prev,
            streak: newStreak,
            lastStudyDate: new Date().toISOString().slice(0, 10),
          }
        : prev,
    );
  }, [uid]);

  return {
    profile,
    setProfile,
    plan,
    setPlan,
    chapters,
    setChapters,
    mockTests,
    addMockTest,
    streak,
    updateDailyStreak,
    loading,
  };
}
