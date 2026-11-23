export interface DailyRoutine {
  hasSchool: boolean;
  schoolTimings: string; // e.g. "08:00 AM - 02:00 PM"
  studyBeforeSchool?: boolean; // Does the student prefer studying before school in the morning
  hasCoaching: boolean;
  coachingTimings: string; // e.g. "04:30 PM - 07:30 PM"
  otherCommitments?: string; // e.g. "Gym & Fitness (1 hour)"
  studyPreference: 'early-bird' | 'night-owl' | 'balanced';
  sessionDurationMinutes?: number; // How long to study 1 subject in one go: 45, 60, 90, 120
  wakeUpTime?: string;
  sleepTime?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  country: string;
  exam: string;
  examDate: string;
  dailyHours: number;
  sessionDurationMinutes?: number;
  selectedSubjects: string[];
  weakSubjects: string[];
  strongSubjects: string[];
  prepLevel: 'beginner' | 'intermediate' | 'revision';
  dailyRoutine?: DailyRoutine;
  streak: number;
  lastStudyDate: string;
  createdAt: string;
}

export interface TaskBlock {
  subject: string;
  timeSlot?: string; // e.g. "06:00 AM - 07:30 AM"
  topics: string[];
  duration: number; // minutes
  actionItem?: string; // e.g. "Formula derivations + 25 timed PYQs"
  completed: boolean;
}

export interface DayPlan {
  date: string;
  dayLabel: string;
  blocks: {
    morning: TaskBlock;
    afternoon: TaskBlock;
    evening: TaskBlock;
  };
  isMockTestDay: boolean;
  isRevisionDay: boolean;
  dailyNote?: string;
}

export interface WeekPlan {
  weekNumber: number;
  days: DayPlan[];
}

export interface StudyPlan {
  id: string;
  generatedAt: string;
  exam: string;
  country: string;
  selectedSubjects: string[];
  dailyRoutine?: DailyRoutine;
  weeks: WeekPlan[];
}

export interface Chapter {
  id: string;
  name: string;
  subject: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'needs-revision';
}

export interface MockTest {
  id: string;
  date: string;
  examName: string;
  score: number;
  maxScore: number;
  notes?: string;
}

export interface ExamPaperDate {
  paperName: string;
  subject: string;
  date: string; // YYYY-MM-DD
}

export interface ExamData {
  id: string;
  name: string;
  subjects: string[];
  defaultDate?: string; // Official upcoming exam date YYYY-MM-DD
  paperDates?: ExamPaperDate[]; // If multi-paper board exam
  isBoardExam?: boolean;
  chapters: { subject: string; chapters: string[] }[];
}

export interface CountryData {
  code: string;
  name: string;
  flag: string;
  exams: ExamData[];
}

export interface OnboardingData {
  country: string;
  exam: string;
  examDate: string;
  dailyHours: number;
  selectedSubjects: string[];
  weakSubjects: string[];
  strongSubjects: string[];
  prepLevel: 'beginner' | 'intermediate' | 'revision';
  dailyRoutine: DailyRoutine;
}

// Objective MCQ Test Generator Types
export interface MCQQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MCQTestResult {
  id: string;
  chapterName: string;
  subject: string;
  setNumber: number; // Set 1 (Q1-25), Set 2 (Q26-50), etc.
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  userAnswers: Record<number, number>; // questionId -> selectedIndex
  date: string;
}
