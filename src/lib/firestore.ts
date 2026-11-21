import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, StudyPlan, Chapter, MockTest } from '@/types';

// ── Helpers ────────────────────────────────────────────────────────

function ensureDb() {
  if (!db) {
    console.warn('Firestore is not configured – operating in offline mode.');
  }
  return db;
}

// ── User Profile ───────────────────────────────────────────────────

export async function saveUserProfile(
  uid: string,
  profile: Partial<UserProfile>,
): Promise<void> {
  const firestore = ensureDb();
  if (!firestore) return;

  const ref = doc(firestore, 'users', uid);
  await setDoc(ref, { ...profile, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const firestore = ensureDb();
  if (!firestore) return null;

  const ref = doc(firestore, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

// ── Study Plan ─────────────────────────────────────────────────────

export async function saveStudyPlan(
  uid: string,
  plan: StudyPlan,
): Promise<void> {
  const firestore = ensureDb();
  if (!firestore) return;

  const ref = doc(firestore, 'users', uid, 'plans', plan.id);
  await setDoc(ref, { ...plan, updatedAt: serverTimestamp() });
}

export async function getStudyPlan(uid: string): Promise<StudyPlan | null> {
  const firestore = ensureDb();
  if (!firestore) return null;

  const col = collection(firestore, 'users', uid, 'plans');
  const q = query(col, orderBy('generatedAt', 'desc'));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as StudyPlan;
}

// ── Chapters ───────────────────────────────────────────────────────

export async function saveChapters(
  uid: string,
  chapters: Chapter[],
): Promise<void> {
  const firestore = ensureDb();
  if (!firestore) return;

  const ref = doc(firestore, 'users', uid, 'data', 'chapters');
  await setDoc(ref, { chapters, updatedAt: serverTimestamp() });
}

export async function getChapters(uid: string): Promise<Chapter[]> {
  const firestore = ensureDb();
  if (!firestore) return [];

  const ref = doc(firestore, 'users', uid, 'data', 'chapters');
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  return (snap.data().chapters ?? []) as Chapter[];
}

// ── Mock Tests ─────────────────────────────────────────────────────

export async function addMockTest(
  uid: string,
  test: MockTest,
): Promise<void> {
  const firestore = ensureDb();
  if (!firestore) return;

  const col = collection(firestore, 'users', uid, 'mockTests');
  await addDoc(col, { ...test, createdAt: serverTimestamp() });
}

export async function getMockTests(uid: string): Promise<MockTest[]> {
  const firestore = ensureDb();
  if (!firestore) return [];

  const col = collection(firestore, 'users', uid, 'mockTests');
  const q = query(col, orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MockTest));
}

// ── Streak ─────────────────────────────────────────────────────────

/**
 * Server-side streak update.  Returns the new streak value.
 *
 * Logic mirrors `updateLocalStreak` from localStorage.ts:
 * - Same day → no change
 * - Yesterday → increment
 * - Older → reset to 1
 */
export async function updateStreak(uid: string): Promise<number> {
  const firestore = ensureDb();
  if (!firestore) return 0;

  const ref = doc(firestore, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return 0;

  const data = snap.data() as UserProfile;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  if (data.lastStudyDate === todayStr) {
    return data.streak;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const newStreak =
    data.lastStudyDate === yesterdayStr ? data.streak + 1 : 1;

  await updateDoc(ref, {
    streak: newStreak,
    lastStudyDate: todayStr,
    updatedAt: serverTimestamp(),
  });

  return newStreak;
}
