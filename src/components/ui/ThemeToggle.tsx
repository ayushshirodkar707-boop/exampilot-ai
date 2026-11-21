'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: 'var(--color-surface, transparent)',
        color: 'var(--color-text, currentColor)',
        transition: 'background-color 0.2s ease, color 0.2s ease',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)',
          opacity: theme === 'dark' ? 1 : 0,
          position: 'absolute',
        }}
      >
        <Moon size={20} />
      </span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          transform: theme === 'light' ? 'rotate(0deg)' : 'rotate(-180deg)',
          opacity: theme === 'light' ? 1 : 0,
          position: 'absolute',
        }}
      >
        <Sun size={20} />
      </span>
    </button>
  );
}
