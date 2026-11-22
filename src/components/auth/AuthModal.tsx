'use client';

import { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Send,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = 'signin',
}: AuthModalProps) {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetFormState = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleGoogleSignIn = async () => {
    resetFormState();
    setLoading(true);
    const res = await signInWithGoogle();
    setLoading(false);
    if (res.success) {
      onClose();
    } else if (res.error) {
      setError(res.error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    const res = await signInWithEmail(email, password);
    setLoading(false);

    if (res.success) {
      onClose();
    } else if (res.error) {
      setError(res.error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim() || !password) {
      setError('Please enter all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await signUpWithEmail(name, email, password);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(
        'Account created successfully! We sent a free verification link to your email. You are now logged in.'
      );
      setTimeout(() => {
        onClose();
      }, 2500);
    } else if (res.error) {
      setError(res.error);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim()) {
      setError('Please enter your email address to receive a reset link.');
      return;
    }

    setLoading(true);
    const res = await sendPasswordReset(email);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(
        `A password reset link has been sent to ${email}. Check your inbox and spam folder.`
      );
    } else if (res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ── FORGOT PASSWORD VIEW ── */}
        {mode === 'forgot' ? (
          <div>
            <button
              onClick={() => {
                setMode('signin');
                resetFormState();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </button>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Reset Your Password
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter your account email and we&apos;ll send you a free, instant password reset link.
            </p>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/50">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/80 py-2.5 pl-9 pr-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-4 text-sm font-semibold shadow-md transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* ── SIGN IN / SIGN UP VIEW ── */
          <div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {mode === 'signin' ? 'Welcome Back' : 'Create Free Account'}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {mode === 'signin'
                  ? 'Sign in to access your study schedules, mock test arena & syllabus'
                  : 'Get your customized AI study timetable & unlimited MCQ tests'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  resetFormState();
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  resetFormState();
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Google Quick Sign-In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/80 disabled:opacity-50"
            >
              <GoogleIcon className="h-4 w-4" />
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400 dark:bg-gray-900">
                  Or with email &amp; password
                </span>
              </div>
            </div>

            {/* Notifications */}
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/50">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}
              className="space-y-3.5"
            >
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/80 py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/80 py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        resetFormState();
                      }}
                      className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/80 py-2 pl-9 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      required
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/80 py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white py-2.5 px-4 text-sm font-semibold shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Please wait...
                  </>
                ) : mode === 'signin' ? (
                  'Sign In'
                ) : (
                  'Create Free Account'
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-[11px] text-gray-500 dark:text-gray-400">
              {mode === 'signin' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      resetFormState();
                    }}
                    className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Sign Up Free
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      resetFormState();
                    }}
                    className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
