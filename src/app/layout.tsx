import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'ExamPilot AI — Smart AI Exam Planner & Study Tracker',
  description:
    'Free AI-powered personalized study schedules, syllabus progress tracker, mock test logger, and Pomodoro focus timer for students worldwide (JEE, NEET, SAT, GCSE, Abitur, Le Bac, and more).',
  keywords: [
    'exam planner',
    'study tracker',
    'AI study schedule',
    'JEE planner',
    'NEET schedule',
    'SAT study tracker',
    'GCSE revision',
    'Abitur planner',
    'Pomodoro study timer',
    'mock test logger',
  ],
  authors: [{ name: 'ExamPilot AI Team' }],
  openGraph: {
    title: 'ExamPilot AI — Smart AI Exam Planner & Study Tracker',
    description:
      'Personalized day-by-day exam timetables and syllabus progress tracking for students worldwide.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          ============================================================
          GOOGLE ADSENSE VERIFICATION SCRIPT
          ============================================================
          When your AdSense account is approved, uncomment the script below 
          and replace ca-pub-XXXXXXXXXXXXXXXX with your actual Publisher ID:

          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
            crossOrigin="anonymous"
          ></script>
          ============================================================
        */}
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-primary-500/20 selection:text-primary-600">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
