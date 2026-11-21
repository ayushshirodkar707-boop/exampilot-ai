import { GoogleGenerativeAI } from '@google/generative-ai';
import type { DailyRoutine } from '@/types';

export function isGeminiConfigured(customKey?: string): boolean {
  return !!(customKey || process.env.GEMINI_API_KEY);
}

export async function generateStudyPlan(params: {
  country: string;
  exam: string;
  examDate: string;
  dailyHours: number;
  selectedSubjects: string[];
  weakSubjects: string[];
  strongSubjects: string[];
  prepLevel: string;
  dailyRoutine?: DailyRoutine;
  customApiKey?: string;
}): Promise<any> {
  const activeKey = params.customApiKey || process.env.GEMINI_API_KEY;

  if (!activeKey) {
    throw new Error('Gemini API key not configured');
  }

  const genAI = new GoogleGenerativeAI(activeKey);

  const daysLeft = Math.max(
    1,
    Math.ceil(
      (new Date(params.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  const routineInfo = params.dailyRoutine
    ? `
Student Real-World Commitments & Timings:
- School / College: ${params.dailyRoutine.hasSchool ? params.dailyRoutine.schoolTimings : 'None (Full-time study/Dropper)'}
- Study Before School Preference: ${params.dailyRoutine.hasSchool ? (params.dailyRoutine.studyBeforeSchool ? 'YES, student likes early morning study before school' : 'NO, student DOES NOT like studying before school. NEVER schedule a study block before school; shift all study hours to afternoon and evening!') : 'N/A (Full-time)'}
- Coaching / Tuition: ${params.dailyRoutine.hasCoaching ? params.dailyRoutine.coachingTimings : 'None (Self-study)'}
- Other Commitments: ${params.dailyRoutine.otherCommitments || 'None'}
- Study Energy / Chronotype: ${params.dailyRoutine.studyPreference}
- Typical Wake Time: ${params.dailyRoutine.wakeUpTime || '06:30 AM'}, Sleep Time: ${params.dailyRoutine.sleepTime || '11:30 PM'}
`
    : 'Full-time flexible schedule.';

  const prompt = `You are an elite academic flight controller. Create a realistic, highly personalized 4-week day-by-day study schedule.

Student Profile:
- Exam: ${params.exam} (${params.country})
- Days remaining: ${daysLeft} days
- Daily study hours target: ${params.dailyHours} hours/day
- Selected Examination Subjects: ${params.selectedSubjects.join(', ')}
- Weak subjects: ${params.weakSubjects.join(', ') || 'None'}
- Strong subjects: ${params.strongSubjects.join(', ') || 'None'}
- Preparation tier: ${params.prepLevel}
${routineInfo}

CRITICAL RULES:
1. NEVER schedule study sessions during school or coaching hours!
2. If student does NOT like studying before school, do NOT schedule study blocks before school starts — place their study sessions in afternoon and evening.
3. Provide exact time slots for each block (e.g. "06:15 AM - 07:45 AM", "03:30 PM - 05:30 PM", "08:00 PM - 10:15 PM").
4. Apply proven online study strategies: Spaced repetition (1-3-7-21 cycle), 25-question timed MCQ drills, and Feynman active recall in 'actionItem' (e.g. "Derive formulas without notes + 25 timed PYQs").
5. If board exam, schedule gap-day intensive reviews before papers.
6. Revision Day every 6th day, Mock Test simulation day every 12th day.

Respond strictly with valid JSON matching:
{
  "weeks": [
    {
      "weekNumber": 1,
      "days": [
        {
          "date": "Day 1",
          "dayLabel": "Monday",
          "blocks": {
            "morning": {
              "subject": "Physics",
              "timeSlot": "06:15 AM - 07:45 AM",
              "topics": ["Kinematics in 1D"],
              "duration": 90,
              "actionItem": "Derive projectile formulas & solve 20 PYQ problems",
              "completed": false
            },
            "afternoon": {
              "subject": "Chemistry",
              "timeSlot": "03:30 PM - 05:00 PM",
              "topics": ["Atomic Structure"],
              "duration": 90,
              "actionItem": "Complete NCERT numericals",
              "completed": false
            },
            "evening": {
              "subject": "Mathematics",
              "timeSlot": "08:00 PM - 10:00 PM",
              "topics": ["Limits & Continuity"],
              "duration": 120,
              "actionItem": "30 timed speed drill questions",
              "completed": false
            }
          },
          "isMockTestDay": false,
          "isRevisionDay": false,
          "dailyNote": "Focus on high accuracy today."
        }
      ]
    }
  ]
}`;

  // Try gemini-3.8-flash with a fast 3.5s timeout. If busy or down, fallback instantly.
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.8-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API 3.5s timeout')), 3500)
  );

  const generatePromise = model.generateContent(prompt);
  const result: any = await Promise.race([generatePromise, timeoutPromise]);

  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('Could not parse Gemini JSON response');
}
