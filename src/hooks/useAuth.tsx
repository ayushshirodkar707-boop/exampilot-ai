'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  signInWithGoogle: () => Promise<AuthResponse>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResponse>;
  signUpWithEmail: (displayName: string, email: string, password: string) => Promise<AuthResponse>;
  sendPasswordReset: (email: string) => Promise<AuthResponse>;
  resendVerificationEmail: () => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function formatAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check or sign up.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again or reset your password.';
    case 'auth/too-many-requests':
      return 'Access temporarily locked due to multiple failed attempts. Please reset password or try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled. Please try again.';
    case 'auth/unauthorized-domain':
      return 'Domain not authorized in Firebase. Please ensure exampilotai.live is added under Authorized Domains.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Console yet. Please enable it under Authentication -> Sign-in method.';
    default:
      return error.message || 'Authentication failed. Please check your credentials and try again.';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<AuthResponse> => {
    if (!isFirebaseConfigured() || !auth || !googleProvider) {
      return { success: false, error: 'Firebase is not initialized. Please verify configuration.' };
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return { success: true };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      return { success: false, error: formatAuthError(error) };
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    if (!isFirebaseConfigured() || !auth) {
      return { success: false, error: 'Firebase is not initialized.' };
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      setUser(result.user);
      return { success: true };
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      return { success: false, error: formatAuthError(error) };
    }
  }, []);

  const signUpWithEmail = useCallback(async (displayName: string, email: string, password: string): Promise<AuthResponse> => {
    if (!isFirebaseConfigured() || !auth) {
      return { success: false, error: 'Firebase is not initialized.' };
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (displayName.trim()) {
        await updateProfile(result.user, { displayName: displayName.trim() });
      }
      // Send 100% free Firebase email verification link
      try {
        await sendEmailVerification(result.user);
      } catch (verifyErr) {
        console.warn('Could not auto-send verification email:', verifyErr);
      }
      setUser(result.user);
      return { success: true };
    } catch (error: any) {
      console.error('Email sign-up error:', error);
      return { success: false, error: formatAuthError(error) };
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string): Promise<AuthResponse> => {
    if (!isFirebaseConfigured() || !auth) {
      return { success: false, error: 'Firebase is not initialized.' };
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { success: false, error: formatAuthError(error) };
    }
  }, []);

  const resendVerificationEmail = useCallback(async (): Promise<AuthResponse> => {
    if (!auth || !auth.currentUser) {
      return { success: false, error: 'You must be logged in to resend verification email.' };
    }
    try {
      await sendEmailVerification(auth.currentUser);
      return { success: true };
    } catch (error: any) {
      console.error('Resend verification error:', error);
      return { success: false, error: formatAuthError(error) };
    }
  }, []);

  const signOutUser = useCallback(async () => {
    if (auth) {
      await firebaseSignOut(auth);
      setUser(null);
    }
  }, []);

  const isAuthenticated = !!user;
  const isEmailVerified = !!user?.emailVerified;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isEmailVerified,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        resendVerificationEmail,
        signOut: signOutUser,
      }}
    >
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
