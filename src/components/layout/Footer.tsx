'use client';

import Link from 'next/link';
import { GraduationCap, Users } from 'lucide-react';

const FOOTER_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/guides', label: 'Exam Guides' },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Top section ── */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          {/* Brand & Social Proof */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent dark:from-primary-400 dark:to-purple-400">
                ExamPilot AI
              </span>
            </Link>
            <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary-500" />
              <span>Supported by 10,000+ students all over the world</span>
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)] font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Bottom section ── */}
        <div className="mt-8 border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--muted)] gap-3">
          <p>© {currentYear} ExamPilot AI. All rights reserved.</p>
          <p>Empowering high-performance exam revision worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
