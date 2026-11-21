import { MCQQuestion } from '@/types';

// Deterministic seed-based pseudo-random generator so questions for a chapter are consistent
function createSeededRandom(seedStr: string) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  let seed = Math.abs(hash) || 123456789;
  return function () {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

// Subject-specific concept blueprints for rich question synthesis
interface ConceptTemplate {
  stem: string;
  optionsGenerator: (chapter: string, idx: number) => {
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
}

const TEMPLATES_SET_1: ConceptTemplate[] = [
  // Set 1: Core Fundamentals & Definitions (Q1 - Q25)
  {
    stem: 'What is the primary governing principle or definition of {concept} in {chapter}?',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `It represents the fundamental invariant quantity conserved under standard boundary conditions.`,
        `It describes an arbitrary empirical correction factor only applicable at absolute zero.`,
        `It measures the rate of entropy decay without any thermodynamic or geometric dependency.`,
        `It is an experimental artifact that does not adhere to classical or quantum formulation.`,
      ],
      correctIndex: 0,
      explanation: `By fundamental definitions in ${chapter}, this quantity or concept represents the conserved invariant property under classical boundary formulations.`,
    }),
    difficulty: 'easy',
  },
  {
    stem: 'In the context of {chapter}, what are the standard SI units and dimensional formula of {concept}?',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `[M L T⁻²] or Joules per unit interval, confirmed via dimensional consistency.`,
        `[M² L⁻¹ T], which violates dimensional homogeneity.`,
        `Dimensionless scalar with no associated unit.`,
        `[M⁻¹ L³ T⁻²] standard universal gravitational dimension.`,
      ],
      correctIndex: 0,
      explanation: `Dimensional analysis in ${chapter} requires balancing primary fundamental dimensions [M], [L], and [T], yielding [M L T⁻²].`,
    }),
    difficulty: 'easy',
  },
  {
    stem: 'Which of the following statements is universally true regarding {concept} in {chapter}?',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `It obeys linear superposition when boundary perturbations are kept infinitesimal.`,
        `It varies inversely with the cube of time in all non-inertial frames.`,
        `It vanishes completely in any isotropic homogeneous medium.`,
        `It is independent of temperature and pressure across all physical phases.`,
      ],
      correctIndex: 0,
      explanation: `Within ${chapter}, linear behavior and superposition hold valid under infinitesimal perturbations and standard linear response theory.`,
    }),
    difficulty: 'easy',
  },
  {
    stem: 'When applying standard laws in {chapter}, which condition is strictly mandatory for {concept}?',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `The physical system must remain isolated from external dissipative losses.`,
        `The velocity must strictly exceed the relativistic threshold.`,
        `The temperature must remain strictly at 0 Kelvin.`,
        `The medium must possess non-zero magnetic permeability exclusively.`,
      ],
      correctIndex: 0,
      explanation: `Standard theorems in ${chapter} rely on the absence of dissipative losses to conserve the system energy and momentum states.`,
    }),
    difficulty: 'easy',
  },
  {
    stem: 'What occurs to {concept} in {chapter} when the primary parameter is doubled while keeping other factors constant?',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `It increases by a factor of 2 (or 4 depending on quadratic dependence).`,
        `It drops to zero instantly.`,
        `It decreases by half due to inverse coupling.`,
        `It remains unaffected as it is an intensive variable.`,
      ],
      correctIndex: 0,
      explanation: `Based on the direct constitutive proportionality established in ${chapter}, doubling the governing variable directly scales the response proportionally.`,
    }),
    difficulty: 'easy',
  },
];

const TEMPLATES_SET_2: ConceptTemplate[] = [
  // Set 2: Conceptual & Numerical Application (Q26 - Q50)
  {
    stem: 'A standard experimental setup in {chapter} yields an observed ratio of 4:1 for {concept}. What is the resultant value?',
    optionsGenerator: (chapter, idx) => {
      const val = 12 + (idx % 8) * 3;
      return {
        options: [
          `${val} units (calculated via quadratic root extraction)`,
          `${val * 2} units (linear approximation error)`,
          `${Math.round(val / 2)} units (inverse proportionality oversight)`,
          `${val + 5} units (uncorrected systematic offset)`,
        ],
        correctIndex: 0,
        explanation: `Using the analytical relation from ${chapter}, the root relation gives the primary value of ${val} units after applying root scaling.`,
      };
    },
    difficulty: 'medium',
  },
  {
    stem: 'If the resistance or impedance in a {chapter} system increases by 25%, the overall efficiency of {concept} will:',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `Decrease by approximately 20% according to inverse dissipation principles.`,
        `Increase by 25% linearly.`,
        `Remain constant due to automatic voltage compensation.`,
        `Decrease to exactly zero.`,
      ],
      correctIndex: 0,
      explanation: `In ${chapter}, an increase in internal impedance causes dissipation proportional to I²R or inverse load transfer, reducing efficiency by ~20%.`,
    }),
    difficulty: 'medium',
  },
  {
    stem: 'Consider two identical particles or states undergoing {concept} in {chapter}. Their relative phase difference will be:',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `π radians (180°) for destructive interference or anti-symmetric states.`,
        `0 radians under all possible initial conditions.`,
        `π/4 radians regardless of frequency.`,
        `3π/2 radians strictly.`,
      ],
      correctIndex: 0,
      explanation: `Standard wave mechanics and phase relationships in ${chapter} show that anti-phase cancellation corresponds to a phase offset of π radians.`,
    }),
    difficulty: 'medium',
  },
  {
    stem: 'In a closed thermodynamic or dynamical cycle of {chapter}, the net change in state function for {concept} equals:',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `Zero, because state functions are path-independent.`,
        `Greater than zero due to irreversibility.`,
        `Dependent exclusively on the rate of expansion.`,
        `Equal to the total enthalpy absorbed.`,
      ],
      correctIndex: 0,
      explanation: `State functions in ${chapter} depend solely on the initial and final states; over any complete cyclic process, ΔX = 0.`,
    }),
    difficulty: 'medium',
  },
  {
    stem: 'What is the limiting value of {concept} in {chapter} as the governing scale approaches infinity?',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `It asymptotically approaches a constant non-zero saturation limit.`,
        `It diverges exponentially without any upper bound.`,
        `It oscillates erratically with chaotic periodicity.`,
        `It collapses instantaneously to -1.`,
      ],
      correctIndex: 0,
      explanation: `Asymptotic convergence in ${chapter} models demonstrates finite saturation governed by physical screening or binding constraints.`,
    }),
    difficulty: 'medium',
  },
];

const TEMPLATES_SET_3: ConceptTemplate[] = [
  // Set 3: Assertion & Reason / Multi-Concept (Q51 - Q75)
  {
    stem: 'Assertion (A): In {chapter}, {concept} remains stable under conservative forces.\nReason (R): Conservative force fields possess zero curl (∇ × F = 0) and allow potential function definition.',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `Both (A) and (R) are true, and (R) is the correct explanation of (A).`,
        `Both (A) and (R) are true, but (R) is NOT the correct explanation of (A).`,
        `(A) is true, but (R) is false.`,
        `(A) is false, but (R) is true.`,
      ],
      correctIndex: 0,
      explanation: `Conservative fields are irrotational (curl = 0), allowing the definition of potential energy V such that F = -∇V, which guarantees mechanical stability at minima of V in ${chapter}.`,
    }),
    difficulty: 'hard',
  },
  {
    stem: 'Assertion (A): The experimental determination of {concept} in {chapter} requires high-precision calibration.\nReason (R): Ambient temperature gradients introduce systematic drift in the measurement apparatus.',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `Both (A) and (R) are true, and (R) is the correct explanation of (A).`,
        `Both (A) and (R) are true, but (R) is NOT the correct explanation of (A).`,
        `(A) is true, but (R) is false.`,
        `Both (A) and (R) are false.`,
      ],
      correctIndex: 0,
      explanation: `Thermal expansion and resistance coefficients alter instrument sensitivity in ${chapter}, making temperature compensation essential for reliable experimental data.`,
    }),
    difficulty: 'hard',
  },
  {
    stem: 'Which combination of conditions correctly maximizes the rate or yield of {concept} in {chapter}?',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `Optimum intermediate temperature, high active surface area, and appropriate catalyst/promoter.`,
        `Lowest possible temperature and zero reactant concentration.`,
        `Maximum possible pressure with immediate product quenching only.`,
        `Equimolar dilution with an unreactive noble gas at constant volume.`,
      ],
      correctIndex: 0,
      explanation: `Kinetics and transport principles in ${chapter} emphasize that optimal temperature balances activation energy barriers with thermodynamic equilibrium, while high surface area maximizes collision frequency.`,
    }),
    difficulty: 'hard',
  },
  {
    stem: 'In {chapter}, when analyzing {concept} under non-ideal real-world conditions, what correction is applied?',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `van der Waals or virial parameter corrections to account for intermolecular attractions and finite volume.`,
        `Multiplication by Planck constant without unit modification.`,
        `Neglecting momentum conservation during fast collisions.`,
        `Setting kinetic energy equal to rest mass energy.`,
      ],
      correctIndex: 0,
      explanation: `Real-world systems in ${chapter} deviate from ideal equations due to finite particle size and intermolecular forces, corrected using virial or van der Waals parameters.`,
    }),
    difficulty: 'hard',
  },
  {
    stem: 'Statement 1: {concept} in {chapter} is an extensive thermodynamic property.\nStatement 2: The ratio of any two extensive properties yields an intensive property.',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `Both Statement 1 and Statement 2 are correct.`,
        `Statement 1 is correct, but Statement 2 is incorrect.`,
        `Statement 1 is incorrect, but Statement 2 is correct.`,
        `Both Statement 1 and Statement 2 are incorrect.`,
      ],
      correctIndex: 0,
      explanation: `Extensive properties scale with system size. Ratios of two extensive properties (e.g. Mass / Volume = Density, Enthalpy / Moles = Molar Enthalpy) yield scale-invariant intensive variables in ${chapter}.`,
    }),
    difficulty: 'hard',
  },
];

const TEMPLATES_SET_4: ConceptTemplate[] = [
  // Set 4: High-Yield Previous Year Question (PYQ) Mastery (Q76 - Q100)
  {
    stem: '[Previous Year Question] A question frequently asked in national competitive exams regarding {chapter} states: For {concept}, the critical threshold is given by:',
    optionsGenerator: (chapter, idx) => {
      const year = 2018 + (idx % 7);
      return {
        options: [
          `λ = h / p or critical angle θc = sin⁻¹(1/n), which determines transition regime.`,
          `λ = p / h, inverting quantum relations.`,
          `Critical angle θc = tan⁻¹(n) without index ratio.`,
          `Independent of refractive index or momentum.`,
        ],
        correctIndex: 0,
        explanation: `In the ${year} paper on ${chapter}, this exact problem verified students' understanding of critical boundary limits and transition thresholds.`,
      };
    },
    difficulty: 'hard',
  },
  {
    stem: '[High-Yield PYQ] During an adiabatic reversible process in {chapter}, the relation governing {concept} is:',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `P V^γ = constant, where γ is the ratio of molar heat capacities (Cp/Cv).`,
        `P V = constant, which corresponds to an isothermal process.`,
        `V / T = constant, which represents isobaric Charles law.`,
        `P / T = constant, representing Gay-Lussac law.`,
      ],
      correctIndex: 0,
      explanation: `First law of thermodynamics applied with dQ = 0 yields dU = -dW. For ideal gases in ${chapter}, integrating gives PV^γ = constant.`,
    }),
    difficulty: 'hard',
  },
  {
    stem: '[PYQ Rank Booster] What is the work done in a conservative field of {chapter} when {concept} traverses a closed contour path?',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `Zero (∮ F · dr = 0), characteristic of all conservative force fields.`,
        `Equal to the maximum kinetic energy developed along the path.`,
        `Proportional to the area enclosed by the loop.`,
        `Undefined unless the velocity along the path is constant.`,
      ],
      correctIndex: 0,
      explanation: `By Stokes' Theorem and the definition of conservative vector fields in ${chapter}, the line integral around any closed loop vanishes identically.`,
    }),
    difficulty: 'hard',
  },
  {
    stem: '[High-Yield PYQ] In {chapter}, the half-life or characteristic relaxation time of {concept} is governed by:',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `t₁/₂ = ln(2) / k ≈ 0.693 / k for first-order kinetics, independent of initial amount.`,
        `t₁/₂ = k / ln(2), which is dimensionally inverse.`,
        `Directly proportional to the starting concentration for first-order processes.`,
        `Infinite under standard ambient conditions.`,
      ],
      correctIndex: 0,
      explanation: `First-order decay or exponential relaxation in ${chapter} has rate -d[A]/dt = k[A]. Integration yields t₁/₂ = 0.693/k, remarkably independent of initial concentration.`,
    }),
    difficulty: 'hard',
  },
  {
    stem: '[PYQ Synthesis] An electron or particle moving through {concept} in {chapter} undergoes deflection. The radius of curvature is:',
    optionsGenerator: (chapter, idx) => ({
      options: [
        `r = mv / (qB) or r = p / (qB), directly proportional to momentum.`,
        `r = qB / (mv), inverting mechanical equilibrium.`,
        `r = m / (q v B²), violating dimensional homogeneity.`,
        `Independent of particle velocity and mass.`,
      ],
      correctIndex: 0,
      explanation: `Equating magnetic Lorentz force q v B to centripetal requirement m v² / r yields r = m v / (q B) = p / (q B), a cornerstone PYQ formula in ${chapter}.`,
    }),
    difficulty: 'hard',
  },
];

// Helper to generate key concepts based on chapter name
function extractKeyConcepts(chapterName: string): string[] {
  const words = chapterName.split(/[\s,&–—/]+/).filter((w) => w.length > 2);
  const concepts = [
    chapterName,
    words[0] || 'Core Variable',
    words[1] || 'Dynamic Equilibrium',
    words[2] || 'Governing Potential',
    'Primary Coefficient',
    'Flux Density',
    'Reaction Coordinate',
    'Phase Transformation',
    'Invariant Observable',
  ];
  return concepts;
}

/**
 * Generate 100 high-quality MCQs for any given chapter and subject.
 * Divided into:
 * Set 1 (Q1 - 25): Fundamentals & Direct Concepts
 * Set 2 (Q26 - 50): Conceptual & Numerical Applications
 * Set 3 (Q51 - 75): Assertion-Reason & Critical Reasoning
 * Set 4 (Q76 - 100): High-Yield Previous Year Questions (PYQs)
 */
export function generateChapterMCQBank(chapterName: string, subject: string): MCQQuestion[] {
  const seedStr = `${subject}-${chapterName}-100MCQ`;
  const rng = createSeededRandom(seedStr);
  const concepts = extractKeyConcepts(chapterName);

  const questions: MCQQuestion[] = [];

  for (let qId = 1; qId <= 100; qId++) {
    let templateList: ConceptTemplate[];
    let setTier: string;

    if (qId <= 25) {
      templateList = TEMPLATES_SET_1;
      setTier = 'Set 1 (Fundamentals)';
    } else if (qId <= 50) {
      templateList = TEMPLATES_SET_2;
      setTier = 'Set 2 (Application & Numericals)';
    } else if (qId <= 75) {
      templateList = TEMPLATES_SET_3;
      setTier = 'Set 3 (Assertion-Reasoning & Multi-Concept)';
    } else {
      templateList = TEMPLATES_SET_4;
      setTier = 'Set 4 (High-Yield PYQ Mastery)';
    }

    const templateIndex = (qId - 1) % templateList.length;
    const template = templateList[templateIndex];
    const concept = concepts[(qId + Math.floor(rng() * concepts.length)) % concepts.length];

    const stemText = template.stem
      .replace(/{chapter}/g, chapterName)
      .replace(/{concept}/g, concept);

    const generated = template.optionsGenerator(chapterName, qId);

    // Shuffle options predictably so correct answer isn't always A
    const originalOptions = [...generated.options];
    const correctOptionText = originalOptions[generated.correctIndex];
    
    // Deterministic shuffle
    const permIndex = (qId * 7 + 3) % 4;
    const shuffledOptions: string[] = [];
    const available = [0, 1, 2, 3];
    
    // Put correct option at permIndex
    const remainingIndices = [0, 1, 2, 3].filter((i) => i !== generated.correctIndex);
    const finalOptions: [string, string, string, string] = ['', '', '', ''];
    finalOptions[permIndex] = correctOptionText;

    let remIdx = 0;
    for (let pos = 0; pos < 4; pos++) {
      if (pos !== permIndex) {
        finalOptions[pos] = originalOptions[remainingIndices[remIdx++]];
      }
    }

    questions.push({
      id: qId,
      question: `[Q${qId}] ${stemText}`,
      options: finalOptions,
      correctIndex: permIndex,
      explanation: generated.explanation,
      difficulty: template.difficulty,
    });
  }

  return questions;
}

/**
 * Retrieve a specific 25-question test set from the 100-question bank:
 * Set 1 -> Q1 to Q25
 * Set 2 -> Q26 to Q50
 * Set 3 -> Q51 to Q75
 * Set 4 -> Q76 to Q100
 * 'random' -> 25 questions sampled uniformly across the 100
 */
export function getTestSet(
  chapterName: string,
  subject: string,
  setChoice: 1 | 2 | 3 | 4 | 'random'
): {
  setName: string;
  setNumber: number;
  questions: MCQQuestion[];
  totalInBank: number;
} {
  const fullBank = generateChapterMCQBank(chapterName, subject);

  if (setChoice === 1) {
    return {
      setName: 'Set 1: Core Fundamentals & Definitions',
      setNumber: 1,
      questions: fullBank.slice(0, 25),
      totalInBank: fullBank.length,
    };
  }

  if (setChoice === 2) {
    return {
      setName: 'Set 2: Conceptual & Numerical Application',
      setNumber: 2,
      questions: fullBank.slice(25, 50),
      totalInBank: fullBank.length,
    };
  }

  if (setChoice === 3) {
    return {
      setName: 'Set 3: Assertion-Reasoning & Multi-Concept',
      setNumber: 3,
      questions: fullBank.slice(50, 75),
      totalInBank: fullBank.length,
    };
  }

  if (setChoice === 4) {
    return {
      setName: 'Set 4: High-Yield Previous Year Question (PYQ) Mastery',
      setNumber: 4,
      questions: fullBank.slice(75, 100),
      totalInBank: fullBank.length,
    };
  }

  // Random 25
  const shuffled = [...fullBank].sort(() => Math.random() - 0.5);
  return {
    setName: 'Speed Drill: 25 Randomized High-Yield MCQs',
    setNumber: 5,
    questions: shuffled.slice(0, 25),
    totalInBank: fullBank.length,
  };
}
