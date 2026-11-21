'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { getLocalProfile, setLocalProfile, clearLocalData } from '@/lib/localStorage';
import type { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  guestProfile: UserProfile | null;
  isGuest: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [guestProfile, setGuestProfile] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for guest session
    const savedGuest = getLocalProfile();
    if (savedGuest && savedGuest.uid === 'guest') {
      setGuestProfile(savedGuest);
      setIsGuest(true);
    }

    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          setIsGuest(false);
          setGuestProfile(null);
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const signInAsGuest = useCallback(() => {
    const profile: UserProfile = {
      uid: 'guest',
      displayName: 'Guest User',
      email: 'guest@exampilot.ai',
      country: '',
      exam: '',
      examDate: '',
      dailyHours: 6,
      selectedSubjects: [],
      weakSubjects: [],
      strongSubjects: [],
      prepLevel: 'beginner',
      streak: 0,
      lastStudyDate: '',
      createdAt: new Date().toISOString(),
    };
    setLocalProfile(profile);
    setGuestProfile(profile);
    setIsGuest(true);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured() || !auth || !googleProvider) {
      // Seamlessly fall back to instant Guest mode without asking the visitor for keys
      signInAsGuest();
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Sign-in error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        signInAsGuest();
      }
    }
  }, [signInAsGuest]);

  const signOutUser = useCallback(async () => {
    if (isGuest) {
      clearLocalData();
      setGuestProfile(null);
      setIsGuest(false);
    } else if (auth) {
      await firebaseSignOut(auth);
      setUser(null);
    }
  }, [isGuest]);

  const isAuthenticated = !!user || isGuest;

  return (
    <AuthContext.Provider value={{
      user,
      guestProfile,
      isGuest,
      isLoading,
      isAuthenticated,
      signInWithGoogle,
      signInAsGuest,
      signOut: signOutUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
