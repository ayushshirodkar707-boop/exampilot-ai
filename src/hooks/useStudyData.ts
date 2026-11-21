'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
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
import type { UserProfile, StudyPlan, Chapter, MockTest } from '@/types';

interface UseStudyDataReturn {
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
  const { user, isGuest, guestProfile } = useAuth();

  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [plan, setPlanState] = useState<StudyPlan | null>(null);
  const [chapters, setChaptersState] = useState<Chapter[]>([]);
  const [mockTests, setMockTestsState] = useState<MockTest[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Determine the storage backend based on auth state
  const uid = user?.uid ?? (isGuest ? 'guest' : null);
  const useFirestore = !!user && !isGuest;

  // ── Load all data on mount or auth change ─────────────────────────
  useEffect(() => {
    if (!uid) {
      // Not authenticated – clear state and stop loading
      setProfileState(null);
      setPlanState(null);
      setChaptersState([]);
      setMockTestsState([]);
      setStreak(0);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadData() {
      setLoading(true);

      try {
        if (useFirestore) {
          // ── Firestore backend ──────────────────────────────────
          const [fsProfile, fsPlan, fsChapters, fsMockTests] = await Promise.all([
            getUserProfile(uid!),
            getStudyPlan(uid!),
            getChapters(uid!),
            getMockTests(uid!),
          ]);

          if (cancelled) return;

          setProfileState(fsProfile);
          setPlanState(fsPlan);
          setChaptersState(fsChapters);
          setMockTestsState(fsMockTests);
          setStreak(fsProfile?.streak ?? 0);
        } else {
          // ── localStorage backend (guest) ───────────────────────
          const localProfile = getLocalProfile();
          const localPlan = getLocalPlan();
          const localChapters = getLocalChapters();
          const localMockTests = getLocalMockTests();

          if (cancelled) return;

          setProfileState(localProfile ?? guestProfile);
          setPlanState(localPlan);
          setChaptersState(localChapters);
          setMockTestsState(localMockTests);
          setStreak(localProfile?.streak ?? guestProfile?.streak ?? 0);
        }
      } catch (error) {
        console.error('Failed to load study data:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [uid, useFirestore, guestProfile]);

  // ── Setters ────────────────────────────────────────────────────────

  const setProfile = useCallback(
    async (newProfile: UserProfile) => {
      setProfileState(newProfile);
      setStreak(newProfile.streak);

      if (useFirestore && uid) {
        await saveUserProfile(uid, newProfile);
      } else {
        setLocalProfile(newProfile);
      }
    },
    [useFirestore, uid],
  );

  const setPlan = useCallback(
    async (newPlan: StudyPlan) => {
      setPlanState(newPlan);

      if (useFirestore && uid) {
        await saveStudyPlan(uid, newPlan);
      } else {
        setLocalPlan(newPlan);
      }
    },
    [useFirestore, uid],
  );

  const setChapters = useCallback(
    async (newChapters: Chapter[]) => {
      setChaptersState(newChapters);

      if (useFirestore && uid) {
        await saveChapters(uid, newChapters);
      } else {
        setLocalChapters(newChapters);
      }
    },
    [useFirestore, uid],
  );

  const addMockTest = useCallback(
    async (test: MockTest) => {
      setMockTestsState((prev) => [test, ...prev]);

      if (useFirestore && uid) {
        await addFirestoreMockTest(uid, test);
      } else {
        addLocalMockTest(test);
      }
    },
    [useFirestore, uid],
  );

  // ── Streak ─────────────────────────────────────────────────────────

  const updateDailyStreak = useCallback(async () => {
    if (!uid) return;

    let newStreak: number;

    if (useFirestore) {
      newStreak = await updateFirestoreStreak(uid);
    } else {
      newStreak = updateLocalStreak();
    }

    setStreak(newStreak);

    // Keep local profile state in sync
    setProfileState((prev) =>
      prev
        ? {
            ...prev,
            streak: newStreak,
            lastStudyDate: new Date().toISOString().slice(0, 10),
          }
        : prev,
    );
  }, [useFirestore, uid]);

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
