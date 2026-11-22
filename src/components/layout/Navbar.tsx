'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  LogIn,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import AuthModal from '@/components/auth/AuthModal';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/guides', label: 'Guides' },
  { href: '/about', label: 'About' },
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const { user, isAuthenticated, signOut } = useAuth();

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/80 backdrop-blur-lg dark:border-gray-800/60 dark:bg-gray-950/80">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ── Brand ── */}
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-indigo-400 dark:to-purple-400">
              ExamPilot AI
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* ── Desktop right section ── */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName ?? 'User'}
                      className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                      {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[130px] truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.displayName || user?.email?.split('@')[0] || 'Student'}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAuth('signin')}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-primary-700 hover:to-indigo-700 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* ── Mobile menu button ── */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* ── Mobile slide-in panel ── */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
            mobileOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={`fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-gray-900 md:hidden ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-800">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent dark:from-indigo-400 dark:to-purple-400">
              ExamPilot AI
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName ?? 'User'}
                      className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                      {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.displayName || user?.email || 'Student'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-2.5 px-4 text-sm font-semibold text-white shadow-md hover:from-primary-700 hover:to-indigo-700 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  Get Started Free
                </button>
                <button
                  onClick={() => handleOpenAuth('signin')}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authModalMode}
      />
    </>
  );
}
