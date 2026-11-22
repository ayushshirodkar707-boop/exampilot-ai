'use client';

import { useState } from 'react';
import { LogIn, Sparkles } from 'lucide-react';
import AuthModal from './AuthModal';

interface LoginButtonProps {
  /** When true, renders compact navbar style buttons. */
  compact?: boolean;
}

export default function LoginButton({ compact = false }: LoginButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultMode, setDefaultMode] = useState<'signin' | 'signup'>('signin');

  const openSignIn = () => {
    setDefaultMode('signin');
    setModalOpen(true);
  };

  const openSignUp = () => {
    setDefaultMode('signup');
    setModalOpen(true);
  };

  if (compact) {
    return (
      <>
        <div className="flex items-center gap-2">
          <button
            onClick={openSignIn}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={openSignUp}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-700 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Get Started
          </button>
        </div>

        <AuthModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultMode={defaultMode}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <button
          onClick={openSignUp}
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-6 py-3.5 text-sm font-bold shadow-xl shadow-primary-500/25 transition-all hover:scale-[1.01]"
        >
          <Sparkles className="h-4 w-4" />
          <span>Get Started Free</span>
        </button>

        <button
          onClick={openSignIn}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all"
        >
          <LogIn className="h-4 w-4" />
          <span>Sign In</span>
        </button>
      </div>

      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultMode={defaultMode}
      />
    </>
  );
}
