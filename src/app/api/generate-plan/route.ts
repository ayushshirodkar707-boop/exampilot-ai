import { NextRequest, NextResponse } from 'next/server';
import { generateStudyPlan, isGeminiConfigured } from '@/lib/gemini';
import { recordAIRequestAndPlan } from '@/lib/telemetry';
import type { StudyPlan, WeekPlan, DayPlan, TaskBlock, DailyRoutine } from '@/types';

// Concrete topic library mapped by subject to ensure rich topic content
const TOPIC_REGISTRY: Record<string, { topic: string; action: string }[]> = {
  Physics: [
    { topic: 'Kinematics & Projectile Motion', action: 'Derive vector trajectories & solve 20 PYQ problems' },
    { topic: "Newton's Laws & Friction", action: 'Draw free-body diagrams for 15 multi-pulley systems' },
    { topic: 'Work, Power & Energy Conservation', action: 'Practice 18 potential energy graph evaluations' },
    { topic: 'Rotational Dynamics & Moment of Inertia', action: 'Calculate parallel-axis theorems & 12 torque balance drills' },
    { topic: 'Thermodynamics & Carnot Cycles', action: 'Evaluate PV work diagrams and heat engine efficiencies' },
    { topic: 'Electrostatics & Gauss Law', action: 'Solve field flux calculations across Gaussian cylinders' },
    { topic: 'Current Electricity & Kirchhoff Laws', action: 'Construct bridge circuit loops & potentiometer sensitivity drills' },
    { topic: 'Magnetism & Ampere Circuital Law', action: 'Calculate Lorentz force on charges & magnetic dipole moments' },
    { topic: 'Ray Optics & Lens Combinations', action: 'Draw ray diagrams for achromatic prisms & compound microscopes' },
    { topic: 'Modern Physics & Photoelectric Effect', action: 'Compute work functions, de Broglie wavelengths & stopping potentials' },
  ],
  Chemistry: [
    { topic: 'Chemical Bonding & VSEPR Theory', action: 'Determine molecular hybridization & dipole moment directions' },
    { topic: 'Thermodynamics & Gibbs Free Energy', action: 'Calculate enthalpy of formation & spontaneity criteria' },
    { topic: 'Chemical Equilibrium & Le Chatelier', action: 'Compute equilibrium constant Kp/Kc for gas-phase reactions' },
    { topic: 'Coordination Compounds & Crystal Field', action: 'Assign IUPAC nomenclature, d-orbital splitting & magnetic moments' },
    { topic: 'General Organic Chemistry (GOC)', action: 'Evaluate carbocation stabilities, inductive & resonance effects' },
    { topic: 'Aldehydes, Ketones & Carboxylic Acids', action: 'Write named reaction mechanisms (Aldol, Cannizzaro, Clemmensen)' },
    { topic: 'Electrochemistry & Nernst Equation', action: 'Calculate standard cell potentials & Faraday electrolysis mass' },
    { topic: 'Chemical Kinetics & Rate Laws', action: 'Determine reaction orders from initial rate concentration tables' },
    { topic: 'Solutions & Colligative Properties', action: 'Compute boiling elevation, osmotic pressure & van’t Hoff factors' },
    { topic: 'd-Block & f-Block Transition Elements', action: 'Document lanthanoid contraction & catalytic oxidation states' },
  ],
  Mathematics: [
    { topic: 'Definite Integrals & Properties', action: 'Evaluate King’s Rule and periodic symmetry integration shortcuts' },
    { topic: 'Differential Equations & Integrating Factors', action: 'Solve linear first-order differential equations and orthogonal curves' },
    { topic: 'Coordinate Geometry (Conics & Parabola)', action: 'Determine focal chords, tangents and normal equations' },
    { topic: 'Vectors & 3D Space Geometry', action: 'Compute shortest distance between skew lines & coplanar planes' },
    { topic: 'Matrices, Determinants & Cramers Rule', action: 'Solve non-trivial system equations and characteristic eigenvalues' },
    { topic: 'Probability & Bayes Theorem', action: 'Solve conditional distribution models & binomial trials' },
    { topic: 'Complex Numbers & De Moivres Theorem', action: 'Find roots of unity and geometric loci in the Argand plane' },
    { topic: 'Sequences, Series & AGP Progressions', action: 'Evaluate telescopic series summations and infinite geometric bounds' },
    { topic: 'Limits, Continuity & Differentiability', action: 'Apply L’Hopital limits and Taylor series polynomial expansions' },
    { topic: 'Application of Derivatives (Maxima/Minima)', action: 'Optimize geometric enclosed volumes and tangent angles' },
  ],
  Biology: [
    { topic: 'Cell Cycle, Mitosis & Meiosis', action: 'Diagram checkpoint phases (G1, S, G2) and chiasmata formation' },
    { topic: 'Human Physiology & Neural Coordination', action: 'Annotate action potential propagation and synaptic transmission' },
    { topic: 'Genetics: Mendelian Inheritance', action: 'Solve dihybrid Punnett squares & pedigree chart linkages' },
    { topic: 'Molecular Basis of Inheritance (DNA)', action: 'Memorize transcription operon models (Lac Operon) & replication enzymes' },
    { topic: 'Ecology & Environmental Biology', action: 'Review trophic pyramid efficiencies & biogeochemical nitrogen cycles' },
  ],
};

function generateTimeSlotsForRoutine(routine?: DailyRoutine, studyPreference?: string): {
  morning: string;
  afternoon: string;
  evening: string;
} {
  // If student has school (e.g. 8:00 AM - 2:00 PM)
  if (routine?.hasSchool) {
    const studyBefore = routine.studyBeforeSchool ?? false;

    if (routine?.hasCoaching) {
      // Packed day: School + Coaching
      if (studyBefore) {
        return {
          morning: '06:00 AM - 07:15 AM (Pre-School Sharp Revision)',
          afternoon: '02:45 PM - 04:15 PM (Post-School Practice Sprint)',
          evening: '08:00 PM - 10:15 PM (Post-Coaching Deep Work & PYQs)',
        };
      } else {
        // No pre-school study: Morning is rest/prep, afternoon & evening take full hours
        return {
          morning: '07:30 AM - 08:00 AM (Quick Mental Warm-Up / School Ready)',
          afternoon: '02:45 PM - 04:30 PM (Post-School High-Focus Practice)',
          evening: '08:00 PM - 10:45 PM (Post-Coaching Mastery Sprint & PYQs)',
        };
      }
    } else {
      // School only: Free afternoon and evening
      if (studyBefore) {
        return {
          morning: '06:15 AM - 07:30 AM (Pre-School Concept Mastery)',
          afternoon: '03:30 PM - 05:30 PM (Core Numerical Practice)',
          evening: '07:30 PM - 09:30 PM (Evening Speed Drill & Notes)',
        };
      } else {
        // No pre-school study: Everything in afternoon and evening
        return {
          morning: '07:30 AM - 08:00 AM (School Prep & Commute - No Heavy Study)',
          afternoon: '03:15 PM - 06:00 PM (Prime Afternoon Problem Solving)',
          evening: '07:30 PM - 10:00 PM (Evening Speed Drills & Comprehensive Revision)',
        };
      }
    }
  }

  // Dropper / Full time study
  if (studyPreference === 'early-bird') {
    return {
      morning: '05:30 AM - 08:30 AM (Peak Brainpower Theory)',
      afternoon: '11:00 AM - 01:30 PM (Problem Solving Marathon)',
      evening: '05:00 PM - 07:30 PM (PYQ Drills & Error Analysis)',
    };
  }

  if (studyPreference === 'night-owl') {
    return {
      morning: '10:00 AM - 12:30 PM (Conceptual Understanding)',
      afternoon: '03:00 PM - 05:30 PM (Timed Practice Sets)',
      evening: '09:00 PM - 12:30 AM (Deep Focus Night Sprint)',
    };
  }

  // Default balanced
  return {
    morning: '07:00 AM - 09:00 AM (Active Recall & High-Yield Theory)',
    afternoon: '02:00 PM - 04:30 PM (Intensive Problem Solving)',
    evening: '07:00 PM - 09:30 PM (Consolidation & Mock Drills)',
  };
}

function createIntelligentFallbackSchedule(params: {
  country: string;
  exam: string;
  examDate: string;
  dailyHours: number;
  selectedSubjects: string[];
  weakSubjects: string[];
  strongSubjects: string[];
  prepLevel: string;
  dailyRoutine?: DailyRoutine;
}): StudyPlan {
  const subjects =
    params.selectedSubjects.length > 0
      ? params.selectedSubjects
      : ['Core Concepts', 'Problem Solving', 'General Revision'];

  const dailyHours = params.dailyHours || 6;
  const targetSessionMins = params.dailyRoutine?.sessionDurationMinutes || 90;

  // Size blocks to match preferred single-subject session duration
  const morningMins = Math.max(targetSessionMins, Math.round(dailyHours * 60 * 0.35));
  const afternoonMins = Math.max(targetSessionMins, Math.round(dailyHours * 60 * 0.35));
  const eveningMins = Math.max(Math.min(targetSessionMins, 60), Math.round(dailyHours * 60 * 0.3));

  const slots = generateTimeSlotsForRoutine(params.dailyRoutine, params.dailyRoutine?.studyPreference);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const weeks: WeekPlan[] = [];
  const totalWeeks = 4;
  let dayCounter = 1;

  for (let w = 1; w <= totalWeeks; w++) {
    const days: DayPlan[] = [];

    for (let d = 0; d < 7; d++) {
      const isMockTestDay = dayCounter % 12 === 0;
      const isRevisionDay = !isMockTestDay && dayCounter % 6 === 0;

      // Prioritize weak subject
      const weakSubject =
        params.weakSubjects.length > 0
          ? params.weakSubjects[d % params.weakSubjects.length]
          : subjects[d % subjects.length];

      const subj2 = subjects[(d + 1) % subjects.length];
      const subj3 =
        params.weakSubjects.length > 0 && d % 2 === 1
          ? params.weakSubjects[(d + 1) % params.weakSubjects.length]
          : subjects[(d + 2) % subjects.length];

      const getTopicData = (subj: string, index: number) => {
        const pool = TOPIC_REGISTRY[subj] || [
          { topic: `${subj} Core Conceptual Chapter`, action: `Solve 25 timed ${subj} problems & log formula shortcuts` },
          { topic: `${subj} Analytical Problem Set`, action: `Review previous year questions & tricky patterns` },
        ];
        return pool[index % pool.length];
      };

      let morning: TaskBlock;
      let afternoon: TaskBlock;
      let evening: TaskBlock;

      if (isMockTestDay) {
        morning = {
          subject: `${params.exam} Full-Length Mock Paper`,
          timeSlot: slots.morning,
          topics: ['Official Timed Simulation', 'Exam Conditions Test'],
          duration: morningMins + 60,
          actionItem: 'Attempt without breaks under exact exam timing',
          completed: false,
        };
        afternoon = {
          subject: 'Score Audit & Error Analysis',
          timeSlot: slots.afternoon,
          topics: ['Detailed Question Analysis', 'Mistake Notebook Logging'],
          duration: afternoonMins,
          actionItem: 'Categorize errors into: Silly Mistake, Concept Gap, or Time Crunch',
          completed: false,
        };
        evening = {
          subject: 'Weak Area Targeted Remediation',
          timeSlot: slots.evening,
          topics: ['High-Yield Formula Review', 'Re-attempt Wrong Questions'],
          duration: eveningMins,
          actionItem: 'Re-solve every question missed during the morning mock',
          completed: false,
        };
      } else if (isRevisionDay) {
        const t1 = getTopicData(weakSubject, dayCounter);
        const t2 = getTopicData(subj2, dayCounter + 1);

        morning = {
          subject: `${weakSubject} Active Recall`,
          timeSlot: slots.morning,
          topics: [t1.topic, 'High-Yield Formula Drill'],
          duration: morningMins,
          actionItem: 'Flashcard active recall & close-book formula reproduction',
          completed: false,
        };
        afternoon = {
          subject: `${subj2} Speed Practice`,
          timeSlot: slots.afternoon,
          topics: [t2.topic, 'Timed Past Paper Sprint'],
          duration: afternoonMins,
          actionItem: 'Solve 30 past exam questions under 45-minute countdown',
          completed: false,
        };
        evening = {
          subject: 'Weekly Progress Review & Planning',
          timeSlot: slots.evening,
          topics: ['Syllabus Progress Audit', 'Upcoming Week Target Setup'],
          duration: eveningMins,
          actionItem: 'Update chapter completion checklists and note down blockers',
          completed: false,
        };
      } else {
        const t1 = getTopicData(weakSubject, dayCounter);
        const t2 = getTopicData(subj2, dayCounter + 1);
        const t3 = getTopicData(subj3, dayCounter + 2);

        morning = {
          subject: weakSubject,
          timeSlot: slots.morning,
          topics: [t1.topic, 'Foundational Theory & Derivations'],
          duration: morningMins,
          actionItem: t1.action,
          completed: false,
        };
        afternoon = {
          subject: subj2,
          timeSlot: slots.afternoon,
          topics: [t2.topic, 'Standard Problem Patterns'],
          duration: afternoonMins,
          actionItem: t2.action,
          completed: false,
        };
        evening = {
          subject: subj3,
          timeSlot: slots.evening,
          topics: [t3.topic, 'Speed Drills & Daily Summary'],
          duration: eveningMins,
          actionItem: t3.action,
          completed: false,
        };
      }

      days.push({
        date: `Day ${dayCounter}`,
        dayLabel: daysOfWeek[d],
        blocks: {
          morning,
          afternoon,
          evening,
        },
        isMockTestDay,
        isRevisionDay,
        dailyNote: isMockTestDay
          ? 'Exam simulation day: keep your phone in another room!'
          : isRevisionDay
          ? 'Consolidation day: focus on reinforcing previous chapters.'
          : `Day focus: Intensive drill on ${weakSubject} while advancing ${subj2}.`,
      });

      dayCounter++;
    }

    weeks.push({
      weekNumber: w,
      days,
    });
  }

  return {
    id: `plan_${Date.now()}`,
    generatedAt: new Date().toISOString(),
    exam: params.exam,
    country: params.country,
    selectedSubjects: params.selectedSubjects,
    dailyRoutine: params.dailyRoutine,
    weeks,
  };
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const {
      uid,
      email,
      country,
      exam,
      examDate,
      dailyHours,
      selectedSubjects = [],
      weakSubjects = [],
      strongSubjects = [],
      prepLevel = 'intermediate',
      dailyRoutine,
      customApiKey,
    } = body;

    if (!exam || !examDate) {
      return NextResponse.json(
        { success: false, error: 'Exam name and target date are required.' },
        { status: 400 }
      );
    }

    const effectiveSubjects =
      selectedSubjects.length > 0
        ? selectedSubjects
        : ['Mathematics', 'Physics', 'Chemistry'];

    // 1. Try ExamPilot AI engine if key is present
    if (isGeminiConfigured(customApiKey)) {
      try {
        const aiResponse = await generateStudyPlan({
          country: country || 'Global',
          exam,
          examDate,
          dailyHours: Number(dailyHours) || 6,
          selectedSubjects: effectiveSubjects,
          weakSubjects,
          strongSubjects,
          prepLevel,
          dailyRoutine,
          customApiKey,
        });

        if (aiResponse && aiResponse.weeks && Array.isArray(aiResponse.weeks)) {
          const plan: StudyPlan = {
            id: `plan_${Date.now()}`,
            generatedAt: new Date().toISOString(),
            exam,
            country: country || 'Global',
            selectedSubjects: effectiveSubjects,
            dailyRoutine,
            weeks: aiResponse.weeks,
          };

          // Record AI telemetry for admin
          recordAIRequestAndPlan({
            uid,
            email,
            exam,
            country: country || 'Global',
            dailyHours: Number(dailyHours) || 6,
            sessionDurationMinutes: dailyRoutine?.sessionDurationMinutes || 90,
            selectedSubjects: effectiveSubjects,
            weakSubjects,
            source: 'ai_engine',
            durationMs: Date.now() - startTime,
            status: 'success',
            plan,
          });

          return NextResponse.json({
            success: true,
            plan,
            source: 'exampilot_ai',
            message: 'Generated with ExamPilot AI Flight Engine!',
          });
        }
      } catch (aiError: any) {
        console.warn('ExamPilot AI engine deferred to precision scheduler:', aiError?.message);
      }
    }

    // 2. Intelligent routine-aware heuristic fallback schedule
    const fallbackPlan = createIntelligentFallbackSchedule({
      country: country || 'Global',
      exam,
      examDate,
      dailyHours: Number(dailyHours) || 6,
      selectedSubjects: effectiveSubjects,
      weakSubjects,
      strongSubjects,
      prepLevel,
      dailyRoutine,
    });

    // Record Precision Scheduler telemetry for admin
    recordAIRequestAndPlan({
      uid,
      email,
      exam,
      country: country || 'Global',
      dailyHours: Number(dailyHours) || 6,
      sessionDurationMinutes: dailyRoutine?.sessionDurationMinutes || 90,
      selectedSubjects: effectiveSubjects,
      weakSubjects,
      source: 'precision_schedule_engine',
      durationMs: Date.now() - startTime,
      status: 'fallback',
      plan: fallbackPlan,
    });

    return NextResponse.json({
      success: true,
      plan: fallbackPlan,
      source: 'exampilot_precision',
      message:
        'Generated with ExamPilot precision schedule engine (incorporating your school & coaching commitments).',
    });
  } catch (error: any) {
    console.error('API Error in /api/generate-plan:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
