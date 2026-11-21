const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/examData.ts');
let content = fs.readFileSync(filePath, 'utf8');

const cbse9 = `      {
        id: 'cbse-9',
        name: 'CBSE Class 9',
        subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
        defaultDate: '2027-02-16',
        isBoardExam: true,
        paperDates: [
          { paperName: 'Social Science', subject: 'Social Science', date: '2027-02-18' },
          { paperName: 'Science', subject: 'Science', date: '2027-02-23' },
          { paperName: 'Mathematics', subject: 'Mathematics', date: '2027-02-27' },
          { paperName: 'English (Lang & Lit)', subject: 'English', date: '2027-03-04' },
          { paperName: 'Hindi Course A / B', subject: 'Hindi', date: '2027-03-08' },
        ],
        chapters: [
          {
            subject: 'Mathematics',
            chapters: [
              'Number Systems',
              'Polynomials',
              'Coordinate Geometry',
              'Linear Equations in Two Variables',
              'Introduction to Euclid Geometry',
              'Lines and Angles',
              'Triangles',
              'Quadrilaterals',
              'Circles',
              "Heron's Formula",
              'Surface Areas and Volumes',
              'Statistics',
            ],
          },
          {
            subject: 'Science',
            chapters: [
              'Matter in Our Surroundings',
              'Is Matter Around Us Pure?',
              'Atoms and Molecules',
              'Structure of the Atom',
              'The Fundamental Unit of Life (Cell)',
              'Tissues',
              'Motion',
              'Force and Laws of Motion',
              'Gravitation',
              'Work and Energy',
              'Sound',
              'Improvement in Food Resources',
            ],
          },
          {
            subject: 'Social Science',
            chapters: [
              'India – Size and Location',
              'Physical Features of India',
              'Drainage Systems',
              'Climate',
              'Natural Vegetation and Wildlife',
              'Population',
              'The French Revolution',
              'Socialism in Europe & the Russian Revolution',
              'Nazism and the Rise of Hitler',
              'What is Democracy? Why Democracy?',
              'Constitutional Design',
              'Electoral Politics',
              'Working of Institutions',
              'Democratic Rights',
              'The Story of Village Palampur',
              'People as Resource',
              'Poverty as a Challenge',
              'Food Security in India',
            ],
          },
          {
            subject: 'English',
            chapters: [
              'Beehive – Prose & Poetry',
              'Moments – Supplementary Reader',
              'Reading Comprehension (Unseen Passages)',
              'Writing Skills (Descriptive Paragraph, Story Writing)',
              'Applied Grammar (Tenses, Modals, Determiners, Subject-Verb Concord)',
            ],
          },
          {
            subject: 'Hindi',
            chapters: [
              'क्षितिज – गद्य खंड',
              'क्षितिज – काव्य खंड',
              'कृतिका – पूरक पाठ्यपुस्तक',
              'व्याकरण (उपसर्ग, प्रत्यय, समास, अलंकार)',
              'रचनात्मक लेखन (अनुच्छेद, पत्र लेखन, संवाद लेखन)',
            ],
          },
        ],
      },
`;

const cbse11 = `      {
        id: 'cbse-11',
        name: 'CBSE Class 11',
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'],
        defaultDate: '2027-02-15',
        isBoardExam: true,
        paperDates: [
          { paperName: 'English Core', subject: 'English', date: '2027-02-19' },
          { paperName: 'Physics', subject: 'Physics', date: '2027-02-26' },
          { paperName: 'Chemistry', subject: 'Chemistry', date: '2027-03-05' },
          { paperName: 'Mathematics', subject: 'Mathematics', date: '2027-03-12' },
          { paperName: 'Biology / Elective', subject: 'Biology', date: '2027-03-19' },
        ],
        chapters: [
          {
            subject: 'Physics',
            chapters: [
              'Units and Measurements',
              'Motion in a Straight Line',
              'Motion in a Plane',
              'Laws of Motion',
              'Work, Energy and Power',
              'System of Particles and Rotational Motion',
              'Gravitation',
              'Mechanical Properties of Solids',
              'Mechanical Properties of Fluids',
              'Thermal Properties of Matter',
              'Thermodynamics',
              'Kinetic Theory of Gases',
              'Oscillations',
              'Waves',
            ],
          },
          {
            subject: 'Chemistry',
            chapters: [
              'Some Basic Concepts of Chemistry',
              'Structure of Atom',
              'Classification of Elements and Periodicity in Properties',
              'Chemical Bonding and Molecular Structure',
              'Chemical Thermodynamics',
              'Equilibrium',
              'Redox Reactions',
              'Organic Chemistry – Some Basic Principles and Techniques (GOC)',
              'Hydrocarbons',
            ],
          },
          {
            subject: 'Mathematics',
            chapters: [
              'Sets',
              'Relations and Functions',
              'Trigonometric Functions',
              'Complex Numbers and Quadratic Equations',
              'Linear Inequalities',
              'Permutations and Combinations',
              'Binomial Theorem',
              'Sequences and Series',
              'Straight Lines',
              'Conic Sections (Parabola, Ellipse, Hyperbola)',
              'Introduction to Three-Dimensional Geometry',
              'Limits and Derivatives',
              'Statistics',
              'Probability',
            ],
          },
          {
            subject: 'Biology',
            chapters: [
              'The Living World',
              'Biological Classification',
              'Plant Kingdom',
              'Animal Kingdom',
              'Morphology of Flowering Plants',
              'Anatomy of Flowering Plants',
              'Structural Organisation in Animals',
              'Cell: The Unit of Life',
              'Biomolecules',
              'Cell Cycle and Cell Division',
              'Photosynthesis in Higher Plants',
              'Respiration in Plants',
              'Plant Growth and Development',
              'Breathing and Exchange of Gases',
              'Body Fluids and Circulation',
              'Excretory Products and their Elimination',
              'Locomotion and Movement',
              'Neural Control and Coordination',
              'Chemical Coordination and Integration',
            ],
          },
          {
            subject: 'English',
            chapters: [
              'Reading Comprehension (Factual & Discursive Passages)',
              'Creative Writing Skills (Note Making, Poster, Speech, Debate)',
              'Grammar (Tenses, Clauses, Reordering)',
              'Hornbill – Prose & Poetry',
              'Snapshots – Supplementary Reader',
            ],
          },
        ],
      },
`;

// Insert cbse-9 before cbse-10 if not present
if (!content.includes("'cbse-9'")) {
  const cbse10Index = content.indexOf("id: 'cbse-10'");
  if (cbse10Index !== -1) {
    const braceIndex = content.lastIndexOf('{', cbse10Index);
    content = content.slice(0, braceIndex) + cbse9 + content.slice(braceIndex);
    console.log('Inserted cbse-9 before cbse-10');
  }
}

// Insert cbse-11 before cbse-12 if not present
if (!content.includes("'cbse-11'")) {
  const cbse12Index = content.indexOf("id: 'cbse-12'");
  if (cbse12Index !== -1) {
    const braceIndex = content.lastIndexOf('{', cbse12Index);
    content = content.slice(0, braceIndex) + cbse11 + content.slice(braceIndex);
    console.log('Inserted cbse-11 before cbse-12');
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Exam data successfully updated with CBSE Class 9 and CBSE Class 11!');
