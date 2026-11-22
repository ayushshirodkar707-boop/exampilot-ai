import { CountryData } from '@/types';

export const countries: CountryData[] = [
  // ─────────────────────────────────────────────────────────────────
  // INDIA
  // ─────────────────────────────────────────────────────────────────
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    exams: [
      {
        id: 'jee-main-advanced',
        name: 'JEE Main & Advanced',
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        defaultDate: '2027-01-24',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Physics',
            chapters: [
              'Units & Measurements',
              'Kinematics',
              'Laws of Motion',
              'Work, Energy & Power',
              'Rotational Motion',
              'Gravitation',
              'Properties of Solids & Liquids',
              'Thermodynamics',
              'Kinetic Theory of Gases',
              'Oscillations & Waves',
              'Electrostatics',
              'Current Electricity',
              'Magnetic Effects of Current & Magnetism',
              'Electromagnetic Induction & AC',
              'Electromagnetic Waves',
              'Optics',
              'Dual Nature of Matter & Radiation',
              'Atoms & Nuclei',
              'Electronic Devices',
            ],
          },
          {
            subject: 'Chemistry',
            chapters: [
              'Some Basic Concepts of Chemistry',
              'Atomic Structure',
              'Chemical Bonding & Molecular Structure',
              'Chemical Thermodynamics',
              'Equilibrium',
              'Redox Reactions',
              'Electrochemistry',
              'Chemical Kinetics',
              'Classification of Elements & Periodicity',
              'p-Block Elements',
              'd & f Block Elements',
              'Coordination Compounds',
              'Organic Chemistry – Basic Principles (GOC)',
              'Hydrocarbons',
              'Haloalkanes & Haloarenes',
              'Alcohols, Phenols & Ethers',
              'Aldehydes, Ketones & Carboxylic Acids',
              'Amines',
              'Biomolecules',
            ],
          },
          {
            subject: 'Mathematics',
            chapters: [
              'Sets, Relations & Functions',
              'Complex Numbers & Quadratic Equations',
              'Matrices & Determinants',
              'Permutations & Combinations',
              'Binomial Theorem',
              'Sequences & Series',
              'Limits, Continuity & Differentiability',
              'Applications of Derivatives',
              'Indefinite Integration',
              'Definite Integration & Area Under Curves',
              'Differential Equations',
              'Coordinate Geometry – Straight Lines',
              'Circles',
              'Conic Sections (Parabola, Ellipse, Hyperbola)',
              'Three-Dimensional Geometry',
              'Vector Algebra',
              'Probability',
              'Statistics',
              'Trigonometry',
            ],
          },
        ],
      },
      {
        id: 'neet-ug',
        name: 'NEET UG',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        defaultDate: '2027-05-02',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Physics',
            chapters: [
              'Physical World & Measurement',
              'Kinematics',
              'Laws of Motion',
              'Work, Energy & Power',
              'Motion of System of Particles & Rigid Body',
              'Gravitation',
              'Properties of Bulk Matter',
              'Thermodynamics',
              'Behaviour of Perfect Gas & Kinetic Theory',
              'Oscillations & Waves',
              'Electrostatics',
              'Current Electricity',
              'Magnetic Effects of Current & Magnetism',
              'Electromagnetic Induction & AC',
              'Electromagnetic Waves',
              'Optics',
              'Dual Nature of Matter & Radiation',
              'Atoms & Nuclei',
              'Electronic Devices',
            ],
          },
          {
            subject: 'Chemistry',
            chapters: [
              'Some Basic Concepts of Chemistry',
              'Structure of Atom',
              'Classification of Elements & Periodicity',
              'Chemical Bonding & Molecular Structure',
              'Chemical Thermodynamics',
              'Equilibrium',
              'Redox Reactions',
              'Solutions',
              'Electrochemistry',
              'Chemical Kinetics',
              'd & f Block Elements',
              'Coordination Compounds',
              'Organic Chemistry – Basic Principles',
              'Hydrocarbons',
              'Haloalkanes & Haloarenes',
              'Alcohols, Phenols & Ethers',
              'Aldehydes, Ketones & Carboxylic Acids',
              'Amines',
              'Biomolecules',
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
              'Cell Cycle & Cell Division',
              'Photosynthesis in Higher Plants',
              'Respiration in Plants',
              'Plant Growth & Development',
              'Breathing & Exchange of Gases',
              'Body Fluids & Circulation',
              'Excretory Products & Their Elimination',
              'Locomotion & Movement',
              'Neural Control & Coordination',
              'Chemical Coordination & Integration',
              'Sexual Reproduction in Flowering Plants',
              'Human Reproduction',
              'Reproductive Health',
              'Principles of Inheritance & Variation',
              'Molecular Basis of Inheritance',
              'Evolution',
              'Human Health & Diseases',
              'Microbes in Human Welfare',
              'Biotechnology: Principles & Processes',
              'Biotechnology & Its Applications',
              'Organisms & Populations',
              'Ecosystem',
              'Biodiversity & Conservation',
            ],
          },
        ],
      },
      {
        id: 'cuet',
        name: 'CUET',
        subjects: ['English', 'General Test', 'Domain Subjects'],
        defaultDate: '2027-05-15',
        isBoardExam: false,
        chapters: [
          {
            subject: 'English',
            chapters: [
              'Reading Comprehension',
              'Verbal Ability & Vocabulary',
              'Rearrangement of Sentences',
              'Error Correction',
              'Sentence Completion',
            ],
          },
          {
            subject: 'General Test',
            chapters: [
              'General Knowledge & Current Affairs',
              'General Mental Ability',
              'Numerical Ability',
              'Quantitative Reasoning',
              'Logical & Analytical Reasoning',
            ],
          },
          {
            subject: 'Domain Subjects',
            chapters: [
              'Physics',
              'Chemistry',
              'Mathematics',
              'Biology',
              'Economics',
              'History',
              'Political Science',
              'Psychology',
              'Accountancy',
              'Business Studies',
            ],
          },
        ],
      },
      {
        id: 'clat',
        name: 'CLAT',
        subjects: ['English Language', 'Current Affairs & GK', 'Legal Reasoning', 'Logical Reasoning', 'Quantitative Techniques'],
        defaultDate: '2026-12-06',
        isBoardExam: false,
        chapters: [
          {
            subject: 'English Language',
            chapters: [
              'Reading Comprehension',
              'Grammar & Vocabulary',
              'Critical Reasoning in Passages',
              'Inference & Assumption',
              'Para Jumbles',
            ],
          },
          {
            subject: 'Current Affairs & GK',
            chapters: [
              'National Current Affairs',
              'International Current Affairs',
              'Arts & Culture',
              'Historical Events of Legal Significance',
              'Polity & Governance',
            ],
          },
          {
            subject: 'Legal Reasoning',
            chapters: [
              'Legal Principles & Rules',
              'Passage-Based Legal Reasoning',
              'Indian Constitution Basics',
              'Criminal & Civil Law Principles',
              'Legal Maxims',
              'Landmark Judgments',
            ],
          },
          {
            subject: 'Logical Reasoning',
            chapters: [
              'Syllogisms',
              'Analogies',
              'Logical Sequences',
              'Blood Relations',
              'Arrangements & Patterns',
            ],
          },
          {
            subject: 'Quantitative Techniques',
            chapters: [
              'Arithmetic',
              'Data Interpretation',
              'Percentage & Ratio',
              'Mensuration',
              'Algebra Basics',
            ],
          },
        ],
      },
            {
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
{
        id: 'cbse-10',
        name: 'CBSE Class 10',
        subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
        defaultDate: '2027-02-15',
        isBoardExam: true,
        paperDates: [
          {
                    "paperName": "Social Science",
                    "subject": "Social Science",
                    "date": "2027-02-20"
          },
          {
                    "paperName": "Science",
                    "subject": "Science",
                    "date": "2027-02-25"
          },
          {
                    "paperName": "English (Lang & Lit)",
                    "subject": "English",
                    "date": "2027-02-28"
          },
          {
                    "paperName": "Mathematics",
                    "subject": "Mathematics",
                    "date": "2027-03-10"
          },
          {
                    "paperName": "Hindi Course A/B",
                    "subject": "Hindi",
                    "date": "2027-03-15"
          }
],
        chapters: [
          {
            subject: 'Mathematics',
            chapters: [
              'Real Numbers',
              'Polynomials',
              'Pair of Linear Equations in Two Variables',
              'Quadratic Equations',
              'Arithmetic Progressions',
              'Triangles',
              'Coordinate Geometry',
              'Introduction to Trigonometry',
              'Applications of Trigonometry',
              'Circles',
              'Areas Related to Circles',
              'Surface Areas & Volumes',
              'Statistics',
              'Probability',
            ],
          },
          {
            subject: 'Science',
            chapters: [
              'Chemical Reactions & Equations',
              'Acids, Bases & Salts',
              'Metals & Non-Metals',
              'Carbon & Its Compounds',
              'Life Processes',
              'Control & Coordination',
              'How Do Organisms Reproduce?',
              'Heredity',
              'Light – Reflection & Refraction',
              'The Human Eye & The Colourful World',
              'Electricity',
              'Magnetic Effects of Electric Current',
              'Our Environment',
            ],
          },
          {
            subject: 'Social Science',
            chapters: [
              'The Rise of Nationalism in Europe',
              'Nationalism in India',
              'The Making of a Global World',
              'The Age of Industrialisation',
              'Resources & Development',
              'Forest & Wildlife Resources',
              'Water Resources',
              'Agriculture',
              'Power Sharing',
              'Federalism',
              'Political Parties',
              'Outcomes of Democracy',
              'Development',
              'Sectors of the Indian Economy',
              'Money & Credit',
              'Globalisation & the Indian Economy',
            ],
          },
          {
            subject: 'English',
            chapters: [
              'Reading Comprehension (Unseen Passages)',
              'Writing Skills (Letter, Article, Story)',
              'Grammar (Tenses, Modals, Clauses)',
              'First Flight – Prose & Poetry',
              'Footprints Without Feet – Supplementary Reader',
            ],
          },
          {
            subject: 'Hindi',
            chapters: [
              'क्षितिज – गद्य खंड',
              'क्षितिज – काव्य खंड',
              'कृतिका – पूरक पाठ्यपुस्तक',
              'व्याकरण (रस, छंद, अलंकार)',
              'लेखन (पत्र, निबंध, अनुच्छेद)',
            ],
          },
        ],
      },
            {
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
{
        id: 'cbse-12',
        name: 'CBSE Class 12',
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Biology'],
        defaultDate: '2027-02-15',
        isBoardExam: true,
        paperDates: [
          {
                    "paperName": "English Core",
                    "subject": "English",
                    "date": "2027-02-20"
          },
          {
                    "paperName": "Physics",
                    "subject": "Physics",
                    "date": "2027-02-27"
          },
          {
                    "paperName": "Chemistry",
                    "subject": "Chemistry",
                    "date": "2027-03-04"
          },
          {
                    "paperName": "Mathematics",
                    "subject": "Mathematics",
                    "date": "2027-03-11"
          },
          {
                    "paperName": "Biology",
                    "subject": "Biology",
                    "date": "2027-03-18"
          },
          {
                    "paperName": "Computer Science",
                    "subject": "Computer Science",
                    "date": "2027-03-25"
          }
],
        chapters: [
          {
            subject: 'Physics',
            chapters: [
              'Electric Charges & Fields',
              'Electrostatic Potential & Capacitance',
              'Current Electricity',
              'Moving Charges & Magnetism',
              'Magnetism & Matter',
              'Electromagnetic Induction',
              'Alternating Current',
              'Electromagnetic Waves',
              'Ray Optics & Optical Instruments',
              'Wave Optics',
              'Dual Nature of Radiation & Matter',
              'Atoms',
              'Nuclei',
              'Semiconductor Electronics',
            ],
          },
          {
            subject: 'Chemistry',
            chapters: [
              'Solutions',
              'Electrochemistry',
              'Chemical Kinetics',
              'd & f Block Elements',
              'Coordination Compounds',
              'Haloalkanes & Haloarenes',
              'Alcohols, Phenols & Ethers',
              'Aldehydes, Ketones & Carboxylic Acids',
              'Amines',
              'Biomolecules',
            ],
          },
          {
            subject: 'Mathematics',
            chapters: [
              'Relations & Functions',
              'Inverse Trigonometric Functions',
              'Matrices',
              'Determinants',
              'Continuity & Differentiability',
              'Application of Derivatives',
              'Integrals',
              'Application of Integrals',
              'Differential Equations',
              'Vector Algebra',
              'Three Dimensional Geometry',
              'Linear Programming',
              'Probability',
            ],
          },
          {
            subject: 'English',
            chapters: [
              'Reading Comprehension',
              'Note Making & Summarizing',
              'Writing Skills (Articles, Reports, Letters)',
              'Flamingo – Prose',
              'Flamingo – Poetry',
              'Vistas – Supplementary Reader',
            ],
          },
          {
            subject: 'Biology',
            chapters: [
              'Sexual Reproduction in Flowering Plants',
              'Human Reproduction',
              'Reproductive Health',
              'Principles of Inheritance & Variation',
              'Molecular Basis of Inheritance',
              'Evolution',
              'Human Health & Diseases',
              'Microbes in Human Welfare',
              'Biotechnology: Principles & Processes',
              'Biotechnology & Its Applications',
              'Organisms & Populations',
              'Ecosystem',
              'Biodiversity & Conservation',
            ],
          },
        ],
      },
      {
        id: 'icse-isc',
        name: 'ICSE / ISC',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'],
        defaultDate: '2027-02-18',
        isBoardExam: true,
        paperDates: [
          {
                    "paperName": "English Language",
                    "subject": "English",
                    "date": "2027-02-18"
          },
          {
                    "paperName": "Literature in English",
                    "subject": "English",
                    "date": "2027-02-23"
          },
          {
                    "paperName": "Physics (Paper 1)",
                    "subject": "Physics",
                    "date": "2027-03-01"
          },
          {
                    "paperName": "Chemistry (Paper 1)",
                    "subject": "Chemistry",
                    "date": "2027-03-08"
          },
          {
                    "paperName": "Mathematics",
                    "subject": "Mathematics",
                    "date": "2027-03-15"
          },
          {
                    "paperName": "Biology (Paper 1)",
                    "subject": "Biology",
                    "date": "2027-03-22"
          }
],
        chapters: [
          {
            subject: 'Mathematics',
            chapters: [
              'Sets & Functions',
              'Algebra',
              'Coordinate Geometry',
              'Calculus',
              'Statistics & Probability',
              'Linear Programming',
            ],
          },
          {
            subject: 'Physics',
            chapters: [
              'Electrostatics',
              'Current Electricity',
              'Magnetic Effects of Current',
              'Electromagnetic Induction',
              'Optics',
              'Modern Physics',
            ],
          },
          {
            subject: 'Chemistry',
            chapters: [
              'Solutions',
              'Electrochemistry',
              'Chemical Kinetics',
              'Organic Chemistry',
              'Coordination Compounds',
              'Biomolecules & Polymers',
            ],
          },
          {
            subject: 'English',
            chapters: [
              'Prose (Prescribed Texts)',
              'Poetry (Prescribed Poems)',
              'Drama (Shakespeare Play)',
              'Composition & Grammar',
              'Comprehension & Summary',
            ],
          },
          {
            subject: 'Computer Science',
            chapters: [
              'Java Programming Basics',
              'Object-Oriented Programming',
              'Data Structures (Arrays, Stacks, Queues)',
              'Boolean Algebra',
              'Networking Concepts',
            ],
          },
        ],
      },
      {
        id: 'gate',
        name: 'GATE',
        subjects: ['Engineering Mathematics', 'Core Subject', 'General Aptitude'],
        defaultDate: '2027-02-06',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Engineering Mathematics',
            chapters: [
              'Linear Algebra',
              'Calculus',
              'Differential Equations',
              'Complex Analysis',
              'Probability & Statistics',
              'Numerical Methods',
              'Discrete Mathematics',
            ],
          },
          {
            subject: 'Core Subject',
            chapters: [
              'Digital Logic',
              'Computer Organization & Architecture',
              'Programming & Data Structures',
              'Algorithms',
              'Theory of Computation',
              'Compiler Design',
              'Operating Systems',
              'Databases',
              'Computer Networks',
            ],
          },
          {
            subject: 'General Aptitude',
            chapters: [
              'Verbal Ability',
              'Numerical Ability',
              'Analytical Reasoning',
              'Spatial Reasoning',
              'Data Interpretation',
            ],
          },
        ],
      },
      {
        id: 'cat',
        name: 'CAT',
        subjects: ['Verbal Ability & Reading Comprehension', 'Data Interpretation & Logical Reasoning', 'Quantitative Ability'],
        defaultDate: '2027-11-28',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Verbal Ability & Reading Comprehension',
            chapters: [
              'Reading Comprehension Passages',
              'Para Jumbles',
              'Para Summary',
              'Sentence Completion & Correction',
              'Critical Reasoning',
              'Vocabulary in Context',
            ],
          },
          {
            subject: 'Data Interpretation & Logical Reasoning',
            chapters: [
              'Tables & Charts',
              'Bar Graphs & Line Graphs',
              'Pie Charts & Caselets',
              'Arrangements (Linear & Circular)',
              'Puzzles & Games',
              'Logical Connectives & Binary Logic',
            ],
          },
          {
            subject: 'Quantitative Ability',
            chapters: [
              'Number Systems',
              'Arithmetic (Percentage, Profit/Loss, Time & Work)',
              'Algebra',
              'Geometry & Mensuration',
              'Modern Math (Probability, Combinatorics)',
              'Trigonometry',
            ],
          },
        ],
      },
      {
        id: 'upsc',
        name: 'UPSC CSE',
        subjects: ['General Studies I', 'General Studies II', 'General Studies III', 'General Studies IV', 'CSAT'],
        defaultDate: '2027-05-23',
        isBoardExam: false,
        chapters: [
          {
            subject: 'General Studies I',
            chapters: [
              'Indian Heritage, Art & Culture',
              'Modern Indian History',
              'World History',
              'Indian Society',
              'Geography of India & the World',
            ],
          },
          {
            subject: 'General Studies II',
            chapters: [
              'Indian Constitution & Polity',
              'Governance & Social Justice',
              'International Relations',
              'Important Institutions & Bodies',
              'Welfare Schemes & Policies',
            ],
          },
          {
            subject: 'General Studies III',
            chapters: [
              'Indian Economy & Planning',
              'Agriculture & Food Processing',
              'Science & Technology',
              'Environment & Ecology',
              'Internal Security & Disaster Management',
            ],
          },
          {
            subject: 'General Studies IV',
            chapters: [
              'Ethics & Human Interface',
              'Attitude & Aptitude',
              'Emotional Intelligence',
              'Public Administration Ethics',
              'Case Studies',
            ],
          },
          {
            subject: 'CSAT',
            chapters: [
              'Comprehension',
              'Logical Reasoning & Analytical Ability',
              'Decision Making & Problem Solving',
              'General Mental Ability',
              'Basic Numeracy & Data Interpretation',
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // UNITED STATES
  // ─────────────────────────────────────────────────────────────────
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    exams: [
      {
        id: 'sat',
        name: 'SAT',
        subjects: ['Reading & Writing', 'Mathematics'],
        defaultDate: '2027-03-14',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Reading & Writing',
            chapters: [
              'Craft & Structure',
              'Information & Ideas',
              'Standard English Conventions – Sentence Structure',
              'Standard English Conventions – Usage',
              'Standard English Conventions – Punctuation',
              'Expression of Ideas – Rhetorical Synthesis',
              'Expression of Ideas – Transitions',
              'Command of Evidence – Textual',
              'Command of Evidence – Quantitative',
            ],
          },
          {
            subject: 'Mathematics',
            chapters: [
              'Linear Equations in One Variable',
              'Linear Equations in Two Variables',
              'Linear Functions',
              'Systems of Two Linear Equations',
              'Linear Inequalities',
              'Nonlinear Equations & Functions',
              'Equivalent Expressions',
              'Ratios, Rates & Proportional Relationships',
              'Percentages',
              'One-Variable Data: Distributions & Measures',
              'Two-Variable Data: Models & Scatterplots',
              'Probability & Conditional Probability',
              'Inference from Sample Statistics',
              'Area & Volume',
              'Lines, Angles & Triangles',
              'Right Triangles & Trigonometry',
              'Circles',
            ],
          },
        ],
      },
      {
        id: 'act',
        name: 'ACT',
        subjects: ['English', 'Mathematics', 'Reading', 'Science'],
        defaultDate: '2027-04-10',
        isBoardExam: false,
        chapters: [
          {
            subject: 'English',
            chapters: [
              'Conventions of Standard English – Sentence Structure',
              'Conventions of Standard English – Punctuation',
              'Conventions of Standard English – Usage',
              'Production of Writing – Topic Development',
              'Production of Writing – Organization',
              'Knowledge of Language – Style & Tone',
            ],
          },
          {
            subject: 'Mathematics',
            chapters: [
              'Pre-Algebra (Fractions, Decimals, Integers)',
              'Elementary Algebra',
              'Intermediate Algebra',
              'Coordinate Geometry',
              'Plane Geometry',
              'Trigonometry',
              'Statistics & Probability',
              'Number & Quantity',
            ],
          },
          {
            subject: 'Reading',
            chapters: [
              'Key Ideas & Details',
              'Craft & Structure',
              'Integration of Knowledge & Ideas',
              'Literary Narrative / Prose Fiction',
              'Social Science Passages',
              'Humanities Passages',
              'Natural Science Passages',
            ],
          },
          {
            subject: 'Science',
            chapters: [
              'Data Representation',
              'Research Summaries',
              'Conflicting Viewpoints',
              'Interpretation of Experiments',
              'Scientific Investigation',
              'Evaluation of Models & Hypotheses',
            ],
          },
        ],
      },
      {
        id: 'ap-exams',
        name: 'AP Exams',
        subjects: ['AP Calculus', 'AP Physics', 'AP Chemistry', 'AP Biology', 'AP English'],
        defaultDate: '2027-05-04',
        isBoardExam: true,
        paperDates: [
          {
                    "paperName": "AP Calculus AB/BC",
                    "subject": "Calculus",
                    "date": "2027-05-04"
          },
          {
                    "paperName": "AP Physics 1",
                    "subject": "Physics",
                    "date": "2027-05-08"
          },
          {
                    "paperName": "AP Chemistry",
                    "subject": "Chemistry",
                    "date": "2027-05-11"
          },
          {
                    "paperName": "AP Biology",
                    "subject": "Biology",
                    "date": "2027-05-14"
          }
],
        chapters: [
          {
            subject: 'AP Calculus',
            chapters: [
              'Limits & Continuity',
              'Differentiation: Definition & Fundamental Properties',
              'Differentiation: Composite, Implicit & Inverse Functions',
              'Contextual Applications of Differentiation',
              'Analytical Applications of Differentiation',
              'Integration & Accumulation of Change',
              'Differential Equations',
              'Applications of Integration',
            ],
          },
          {
            subject: 'AP Physics',
            chapters: [
              'Kinematics',
              'Dynamics (Newton\'s Laws)',
              'Circular Motion & Gravitation',
              'Energy',
              'Momentum',
              'Simple Harmonic Motion',
              'Torque & Rotational Motion',
              'Electric Charge & Electric Force',
              'DC Circuits',
              'Waves & Sound',
            ],
          },
          {
            subject: 'AP Chemistry',
            chapters: [
              'Atomic Structure & Properties',
              'Molecular & Ionic Compound Structure',
              'Intermolecular Forces',
              'Chemical Reactions',
              'Kinetics',
              'Thermodynamics',
              'Equilibrium',
              'Acids & Bases',
              'Electrochemistry',
            ],
          },
          {
            subject: 'AP Biology',
            chapters: [
              'Chemistry of Life',
              'Cell Structure & Function',
              'Cellular Energetics',
              'Cell Communication & Cell Cycle',
              'Heredity',
              'Gene Expression & Regulation',
              'Natural Selection',
              'Ecology',
            ],
          },
          {
            subject: 'AP English',
            chapters: [
              'Rhetorical Situation',
              'Claims & Evidence',
              'Reasoning & Organization',
              'Style & Tone',
              'Synthesis Essay',
              'Rhetorical Analysis Essay',
              'Argument Essay',
            ],
          },
        ],
      },
      {
        id: 'mcat',
        name: 'MCAT',
        subjects: ['Chemical & Physical Foundations', 'Biological & Biochemical Foundations', 'Psychological, Social & Biological Foundations', 'Critical Analysis & Reasoning Skills'],
        defaultDate: '2027-04-18',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Chemical & Physical Foundations',
            chapters: [
              'General Chemistry',
              'Organic Chemistry',
              'Physics – Mechanics & Thermodynamics',
              'Physics – Electricity & Magnetism',
              'Physics – Waves & Optics',
              'Biochemistry',
            ],
          },
          {
            subject: 'Biological & Biochemical Foundations',
            chapters: [
              'Molecular Biology',
              'Cell Biology',
              'Organ Systems',
              'Genetics',
              'Biochemistry & Metabolism',
              'Microbiology',
            ],
          },
          {
            subject: 'Psychological, Social & Biological Foundations',
            chapters: [
              'Sensation & Perception',
              'Learning, Memory & Cognition',
              'Identity & Personality',
              'Psychological Disorders',
              'Social Thinking & Attitudes',
              'Social Structure & Demographics',
            ],
          },
          {
            subject: 'Critical Analysis & Reasoning Skills',
            chapters: [
              'Foundations of Comprehension',
              'Reasoning Within the Text',
              'Reasoning Beyond the Text',
              'Humanities Passages',
              'Social Sciences Passages',
            ],
          },
        ],
      },
      {
        id: 'lsat',
        name: 'LSAT',
        subjects: ['Logical Reasoning', 'Analytical Reasoning', 'Reading Comprehension'],
        defaultDate: '2027-04-09',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Logical Reasoning',
            chapters: [
              'Flaw Questions',
              'Strengthen & Weaken Questions',
              'Assumption Questions',
              'Must Be True / Inference',
              'Parallel Reasoning',
              'Point at Issue / Principle',
            ],
          },
          {
            subject: 'Analytical Reasoning',
            chapters: [
              'Sequencing Games',
              'Grouping Games',
              'Matching Games',
              'Hybrid Games',
              'Rule Substitution',
            ],
          },
          {
            subject: 'Reading Comprehension',
            chapters: [
              'Main Point & Primary Purpose',
              'Inference Questions',
              'Structure & Organization',
              'Comparative Reading',
              'Specific Detail Questions',
            ],
          },
        ],
      },
      {
        id: 'gre',
        name: 'GRE',
        subjects: ['Verbal Reasoning', 'Quantitative Reasoning', 'Analytical Writing'],
        defaultDate: '2027-03-01',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Verbal Reasoning',
            chapters: [
              'Reading Comprehension',
              'Text Completion',
              'Sentence Equivalence',
              'Vocabulary in Context',
              'Critical Reasoning',
            ],
          },
          {
            subject: 'Quantitative Reasoning',
            chapters: [
              'Arithmetic',
              'Algebra',
              'Geometry',
              'Data Analysis & Statistics',
              'Quantitative Comparison',
              'Word Problems',
            ],
          },
          {
            subject: 'Analytical Writing',
            chapters: [
              'Analyze an Issue Essay',
              'Analyze an Argument Essay',
              'Essay Structure & Organization',
              'Evidence & Reasoning',
              'Language & Conventions',
            ],
          },
        ],
      },
      {
        id: 'gmat',
        name: 'GMAT',
        subjects: ['Quantitative Reasoning', 'Verbal Reasoning', 'Data Insights'],
        defaultDate: '2027-02-28',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Quantitative Reasoning',
            chapters: [
              'Problem Solving',
              'Data Sufficiency',
              'Arithmetic & Number Properties',
              'Algebra & Inequalities',
              'Geometry & Coordinate Geometry',
              'Word Problems (Rate, Work, Mixture)',
            ],
          },
          {
            subject: 'Verbal Reasoning',
            chapters: [
              'Reading Comprehension',
              'Critical Reasoning',
              'Sentence Correction',
              'Vocabulary & Idioms',
              'Argument Structure',
            ],
          },
          {
            subject: 'Data Insights',
            chapters: [
              'Multi-Source Reasoning',
              'Table Analysis',
              'Graphics Interpretation',
              'Two-Part Analysis',
              'Data Sufficiency',
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // UNITED KINGDOM
  // ─────────────────────────────────────────────────────────────────
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    exams: [
      {
        id: 'gcse',
        name: 'GCSE',
        subjects: ['Mathematics', 'English Language', 'English Literature', 'Combined Science', 'History'],
        defaultDate: '2027-05-10',
        isBoardExam: true,
        paperDates: [
          {
                    "paperName": "GCSE Mathematics Paper 1",
                    "subject": "Mathematics",
                    "date": "2027-05-15"
          },
          {
                    "paperName": "GCSE Physics Paper 1",
                    "subject": "Physics",
                    "date": "2027-05-20"
          },
          {
                    "paperName": "GCSE Chemistry Paper 1",
                    "subject": "Chemistry",
                    "date": "2027-05-26"
          },
          {
                    "paperName": "GCSE Biology Paper 1",
                    "subject": "Biology",
                    "date": "2027-06-02"
          }
],
        chapters: [
          {
            subject: 'Mathematics',
            chapters: [
              'Number – Fractions, Decimals & Percentages',
              'Number – Indices & Standard Form',
              'Algebra – Expressions & Formulae',
              'Algebra – Equations & Inequalities',
              'Algebra – Sequences & Graphs',
              'Ratio, Proportion & Rates of Change',
              'Geometry – Properties & Constructions',
              'Geometry – Mensuration (Perimeter, Area, Volume)',
              'Geometry – Transformations & Vectors',
              'Probability',
              'Statistics – Data Handling & Representation',
            ],
          },
          {
            subject: 'English Language',
            chapters: [
              'Explorations in Creative Reading',
              'Writers\' Viewpoints & Perspectives',
              'Creative Writing – Descriptive & Narrative',
              'Non-Fiction & Transactional Writing',
              'Spoken Language Endorsement',
            ],
          },
          {
            subject: 'English Literature',
            chapters: [
              'Shakespeare (Set Play)',
              '19th Century Novel',
              'Modern Texts (Play / Novel)',
              'Poetry Anthology (Power & Conflict / Love & Relationships)',
              'Unseen Poetry',
            ],
          },
          {
            subject: 'Combined Science',
            chapters: [
              'Cell Biology',
              'Organisation in Animals & Plants',
              'Infection & Response',
              'Bioenergetics',
              'Atomic Structure & Periodic Table',
              'Bonding, Structure & Properties of Matter',
              'Quantitative Chemistry',
              'Chemical Changes & Energy Changes',
              'Forces',
              'Energy & Electricity',
              'Particle Model of Matter',
              'Waves & Magnetism',
            ],
          },
          {
            subject: 'History',
            chapters: [
              'Medicine Through Time',
              'The American West (c.1835–c.1895)',
              'Weimar & Nazi Germany (1918–1939)',
              'Elizabethan England (1558–1603)',
              'Superpower Relations & The Cold War',
            ],
          },
        ],
      },
      {
        id: 'a-levels',
        name: 'A-Levels',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics'],
        defaultDate: '2027-05-18',
        isBoardExam: true,
        paperDates: [
          {
                    "paperName": "Pure Mathematics 1",
                    "subject": "Mathematics",
                    "date": "2027-05-18"
          },
          {
                    "paperName": "Physics Component 1",
                    "subject": "Physics",
                    "date": "2027-05-25"
          },
          {
                    "paperName": "Chemistry Component 1",
                    "subject": "Chemistry",
                    "date": "2027-06-01"
          },
          {
                    "paperName": "Biology Component 1",
                    "subject": "Biology",
                    "date": "2027-06-08"
          }
],
        chapters: [
          {
            subject: 'Mathematics',
            chapters: [
              'Pure Mathematics – Proof',
              'Pure Mathematics – Algebra & Functions',
              'Pure Mathematics – Coordinate Geometry',
              'Pure Mathematics – Sequences & Series',
              'Pure Mathematics – Trigonometry',
              'Pure Mathematics – Exponentials & Logarithms',
              'Pure Mathematics – Differentiation',
              'Pure Mathematics – Integration',
              'Pure Mathematics – Numerical Methods',
              'Pure Mathematics – Vectors',
              'Statistics – Statistical Sampling & Data Presentation',
              'Statistics – Probability & Distributions',
              'Statistics – Statistical Hypothesis Testing',
              'Mechanics – Quantities & Units in Mechanics',
              'Mechanics – Kinematics',
              'Mechanics – Forces & Newton\'s Laws',
              'Mechanics – Moments',
            ],
          },
          {
            subject: 'Physics',
            chapters: [
              'Measurements & Their Errors',
              'Particles & Radiation',
              'Waves',
              'Mechanics & Materials',
              'Electricity',
              'Further Mechanics & Thermal Physics',
              'Fields & Their Consequences',
              'Nuclear Physics',
              'Astrophysics / Medical Physics / Engineering Physics (Option)',
            ],
          },
          {
            subject: 'Chemistry',
            chapters: [
              'Atomic Structure',
              'Amount of Substance',
              'Bonding',
              'Energetics',
              'Kinetics',
              'Chemical Equilibria',
              'Oxidation, Reduction & Redox Equations',
              'Organic Chemistry – Alkanes to Polymers',
              'Organic Chemistry – Optical Isomerism to Synthesis',
              'Thermodynamics',
              'Electrode Potentials & Electrochemical Cells',
              'Acids & Bases',
              'Transition Metals',
            ],
          },
          {
            subject: 'Biology',
            chapters: [
              'Biological Molecules',
              'Cells',
              'Exchange of Substances',
              'Genetic Information, Variation & Relationships',
              'Energy Transfers in & Between Organisms',
              'Organisms Respond to Changes (Homeostasis)',
              'Genetics, Populations, Evolution & Ecosystems',
              'The Control of Gene Expression',
            ],
          },
          {
            subject: 'Economics',
            chapters: [
              'Markets & Market Failure',
              'The National & International Economy',
              'Individuals, Firms, Markets & Market Failure',
              'The National & International Economy (Macro)',
              'Economic Methodology & the Economic Problem',
            ],
          },
        ],
      },
      {
        id: 'ucat',
        name: 'UCAT',
        subjects: ['Verbal Reasoning', 'Decision Making', 'Quantitative Reasoning', 'Abstract Reasoning', 'Situational Judgement'],
        defaultDate: '2027-07-15',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Verbal Reasoning',
            chapters: [
              'True / False / Can\'t Tell Questions',
              'Inference & Conclusion',
              'Speed Reading Techniques',
              'Keyword Identification',
              'Passage Analysis',
            ],
          },
          {
            subject: 'Decision Making',
            chapters: [
              'Logical Puzzles',
              'Syllogisms',
              'Venn Diagrams',
              'Probabilistic Reasoning',
              'Interpreting Information',
            ],
          },
          {
            subject: 'Quantitative Reasoning',
            chapters: [
              'Tables & Charts',
              'Percentage & Ratio Calculations',
              'Speed, Distance & Time',
              'Unit Conversions',
              'Multi-Step Calculations',
            ],
          },
          {
            subject: 'Abstract Reasoning',
            chapters: [
              'Pattern Recognition (Type 1)',
              'Sequence Completion',
              'Set A / Set B / Neither',
              'Shape Relationships',
              'Spatial Reasoning',
            ],
          },
          {
            subject: 'Situational Judgement',
            chapters: [
              'Medical Ethics Scenarios',
              'Appropriateness Judgement',
              'Importance Rating',
              'Teamwork & Communication',
              'Patient-Centred Care',
            ],
          },
        ],
      },
      {
        id: 'lnat',
        name: 'LNAT',
        subjects: ['Multiple Choice (Comprehension)', 'Essay'],
        defaultDate: '2027-01-20',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Multiple Choice (Comprehension)',
            chapters: [
              'Argument Identification',
              'Inference & Assumption',
              'Identifying Conclusions',
              'Flaw Detection',
              'Passage-Based Reasoning',
            ],
          },
          {
            subject: 'Essay',
            chapters: [
              'Structuring a Legal / Philosophical Argument',
              'Analysing Both Sides',
              'Use of Evidence & Examples',
              'Clarity, Coherence & Persuasion',
              'Current Affairs & Ethical Topics',
            ],
          },
        ],
      },
      {
        id: 'scottish-highers',
        name: 'Scottish Highers',
        subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'],
        defaultDate: '2027-04-26',
        isBoardExam: true,
        paperDates: [
          {
                    "paperName": "Higher English",
                    "subject": "English",
                    "date": "2027-04-28"
          },
          {
                    "paperName": "Higher Mathematics",
                    "subject": "Mathematics",
                    "date": "2027-05-05"
          },
          {
                    "paperName": "Higher Physics",
                    "subject": "Physics",
                    "date": "2027-05-12"
          },
          {
                    "paperName": "Higher Chemistry",
                    "subject": "Chemistry",
                    "date": "2027-05-19"
          }
],
        chapters: [
          {
            subject: 'Mathematics',
            chapters: [
              'Algebra – Expressions & Formulae',
              'Relationships & Calculus',
              'Applications (Vectors, Recurrence, Optimisation)',
              'Trigonometry',
              'Statistics',
            ],
          },
          {
            subject: 'English',
            chapters: [
              'Reading for Understanding, Analysis & Evaluation',
              'Critical Essay',
              'Scottish Text',
              'Portfolio Writing – Creative & Discursive',
              'Textual Analysis',
            ],
          },
          {
            subject: 'Physics',
            chapters: [
              'Our Dynamic Universe',
              'Particles & Waves',
              'Electricity',
              'Researching Physics',
              'Problem Solving & Analysis',
            ],
          },
          {
            subject: 'Chemistry',
            chapters: [
              'Chemical Changes & Structure',
              'Nature\'s Chemistry',
              'Chemistry in Society',
              'Researching Chemistry',
              'Problem Solving & Analysis',
            ],
          },
          {
            subject: 'Biology',
            chapters: [
              'DNA & the Genome',
              'Metabolism & Survival',
              'Sustainability & Interdependence',
              'Researching Biology',
              'Problem Solving & Analysis',
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // GERMANY
  // ─────────────────────────────────────────────────────────────────
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    exams: [
      {
        id: 'abitur',
        name: 'Abitur',
        subjects: ['Mathematik', 'Deutsch', 'Englisch', 'Physik', 'Biologie'],
        defaultDate: '2027-04-20',
        isBoardExam: true,
        paperDates: [
          {
                    "paperName": "Abitur Deutsch (LK/GK)",
                    "subject": "Deutsch",
                    "date": "2027-04-23"
          },
          {
                    "paperName": "Abitur Mathematik (LK/GK)",
                    "subject": "Mathematik",
                    "date": "2027-04-30"
          },
          {
                    "paperName": "Abitur Englisch (LK/GK)",
                    "subject": "Englisch",
                    "date": "2027-05-07"
          },
          {
                    "paperName": "Abitur Biologie / Physik / Chemie",
                    "subject": "Naturwissenschaften",
                    "date": "2027-05-14"
          }
],
        chapters: [
          {
            subject: 'Mathematik',
            chapters: [
              'Analysis – Funktionen & Kurvendiskussion',
              'Analysis – Integralrechnung',
              'Analysis – Differentialrechnung & Anwendungen',
              'Analytische Geometrie – Vektoren',
              'Analytische Geometrie – Geraden & Ebenen',
              'Analytische Geometrie – Abstände & Winkel',
              'Stochastik – Wahrscheinlichkeitsrechnung',
              'Stochastik – Binomialverteilung',
              'Stochastik – Hypothesentests',
            ],
          },
          {
            subject: 'Deutsch',
            chapters: [
              'Textanalyse – Epik',
              'Textanalyse – Lyrik',
              'Textanalyse – Dramatik',
              'Erörterung (literarisch & pragmatisch)',
              'Sprachbetrachtung & Kommunikationsmodelle',
              'Literaturepochen (Aufklärung bis Gegenwart)',
            ],
          },
          {
            subject: 'Englisch',
            chapters: [
              'Textanalyse & Comprehension',
              'Writing – Comment & Essay',
              'Mediation (Sprachmittlung)',
              'Listening & Oral Communication',
              'Landeskunde – USA, UK, Globalisation',
            ],
          },
          {
            subject: 'Physik',
            chapters: [
              'Mechanik – Kinematik & Dynamik',
              'Elektrische & Magnetische Felder',
              'Elektromagnetische Schwingungen & Wellen',
              'Quantenphysik',
              'Atom- & Kernphysik',
              'Relativitätstheorie (Grundlagen)',
            ],
          },
          {
            subject: 'Biologie',
            chapters: [
              'Zellbiologie & Stoffwechsel',
              'Genetik – Klassische & Molekulare Genetik',
              'Neurobiologie',
              'Ökologie',
              'Evolution',
              'Immunbiologie',
            ],
          },
        ],
      },
      {
        id: 'testas',
        name: 'TestAS',
        subjects: ['Core Test', 'Subject-Specific Module'],
        defaultDate: '2027-04-24',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Core Test',
            chapters: [
              'Solving Quantitative Problems',
              'Inferring Relationships',
              'Completing Patterns',
              'Continuing Numerical Series',
              'Processing Linguistic Information',
            ],
          },
          {
            subject: 'Subject-Specific Module',
            chapters: [
              'Mathematics, Informatics & Natural Sciences',
              'Engineering',
              'Humanities, Cultural Studies & Social Sciences',
              'Economics',
              'Formal & Analytical Thinking',
            ],
          },
        ],
      },
      {
        id: 'tms',
        name: 'TMS (Medizinertest)',
        subjects: ['Pattern Recognition', 'Quantitative & Formal Problems', 'Text Comprehension', 'Spatial Reasoning', 'Science Comprehension'],
        defaultDate: '2027-05-08',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Pattern Recognition',
            chapters: [
              'Figuren & Muster lernen',
              'Schlauchfiguren',
              'Muster zuordnen',
              'Figuren vervollständigen',
              'Visuelle Wahrnehmung',
            ],
          },
          {
            subject: 'Quantitative & Formal Problems',
            chapters: [
              'Mathematische Textaufgaben',
              'Zahlenreihen',
              'Einheiten & Umrechnungen',
              'Logische Schlussfolgerungen',
              'Dateninterpretation',
            ],
          },
          {
            subject: 'Text Comprehension',
            chapters: [
              'Medizinische Texte verstehen',
              'Fakten & Details merken',
              'Textstruktur analysieren',
              'Schlüsselbegriffe identifizieren',
              'Zusammenfassungen erstellen',
            ],
          },
          {
            subject: 'Spatial Reasoning',
            chapters: [
              'Räumliches Vorstellungsvermögen',
              'Schnittbilder',
              '3D-Rotation',
              'Faltvorlagen',
              'Perspektivenwechsel',
            ],
          },
          {
            subject: 'Science Comprehension',
            chapters: [
              'Naturwissenschaftliche Texte',
              'Experimentanalyse',
              'Diagramme & Tabellen interpretieren',
              'Hypothesen bewerten',
              'Wissenschaftliche Methodik',
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // FRANCE
  // ─────────────────────────────────────────────────────────────────
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    exams: [
      {
        id: 'baccalaureat',
        name: 'Baccalauréat (Le Bac)',
        subjects: ['Mathématiques', 'Physique-Chimie', 'SVT (Sciences de la Vie et de la Terre)', 'Philosophie', 'Français'],
        defaultDate: '2027-06-16',
        isBoardExam: true,
        paperDates: [
          {
                    "paperName": "Philosophie",
                    "subject": "Philosophie",
                    "date": "2027-06-16"
          },
          {
                    "paperName": "Épreuve de spécialité 1",
                    "subject": "Spécialité 1",
                    "date": "2027-06-18"
          },
          {
                    "paperName": "Épreuve de spécialité 2",
                    "subject": "Spécialité 2",
                    "date": "2027-06-21"
          },
          {
                    "paperName": "Grand Oral",
                    "subject": "Grand Oral",
                    "date": "2027-06-24"
          }
],
        chapters: [
          {
            subject: 'Mathématiques',
            chapters: [
              'Suites numériques',
              'Fonctions – Limites & Continuité',
              'Dérivation & Applications',
              'Fonction exponentielle & Logarithme',
              'Intégration',
              'Probabilités & Statistiques',
              'Géométrie dans l\'espace (Vecteurs)',
              'Calcul matriciel (Spécialité)',
              'Algorithmique & Programmation',
            ],
          },
          {
            subject: 'Physique-Chimie',
            chapters: [
              'Constitution & transformations de la matière',
              'Mouvement & interactions',
              'L\'énergie : conversions & transferts',
              'Ondes & signaux',
              'Chimie organique',
              'Mécanique des fluides',
            ],
          },
          {
            subject: 'SVT (Sciences de la Vie et de la Terre)',
            chapters: [
              'La Terre, la vie et l\'organisation du vivant',
              'Enjeux contemporains de la planète',
              'Le corps humain et la santé',
              'Génétique & Évolution',
              'Écologie & Biodiversité',
              'Géologie & Dynamique terrestre',
            ],
          },
          {
            subject: 'Philosophie',
            chapters: [
              'Le sujet (Conscience, Inconscient, Désir)',
              'La culture (Art, Technique, Langage, Religion)',
              'La raison & le réel (Vérité, Science, Démonstration)',
              'La politique (État, Justice, Liberté)',
              'La morale (Devoir, Bonheur)',
              'Méthodologie de la dissertation & explication de texte',
            ],
          },
          {
            subject: 'Français',
            chapters: [
              'Le roman & le récit du XVIIIe au XXIe siècle',
              'La poésie du XIXe au XXIe siècle',
              'Le théâtre du XVIIe au XXIe siècle',
              'La littérature d\'idées du XVIe au XVIIIe siècle',
              'Commentaire composé – Méthodologie',
              'Dissertation littéraire',
              'Contraction de texte & essai',
            ],
          },
        ],
      },
      {
        id: 'concours-cpge',
        name: 'Concours CPGE',
        subjects: ['Mathématiques', 'Physique', 'Chimie', 'Sciences de l\'Ingénieur', 'Français / Philosophie'],
        defaultDate: '2027-05-03',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Mathématiques',
            chapters: [
              'Algèbre linéaire',
              'Analyse réelle & complexe',
              'Topologie',
              'Probabilités & Dénombrement',
              'Suites & Séries',
              'Espaces vectoriels',
            ],
          },
          {
            subject: 'Physique',
            chapters: [
              'Mécanique du point & du solide',
              'Thermodynamique',
              'Électromagnétisme',
              'Optique ondulatoire',
              'Mécanique quantique (Introduction)',
            ],
          },
          {
            subject: 'Chimie',
            chapters: [
              'Chimie des solutions',
              'Thermochimie',
              'Cinétique chimique',
              'Chimie organique',
              'Électrochimie',
            ],
          },
          {
            subject: 'Sciences de l\'Ingénieur',
            chapters: [
              'Modélisation des systèmes',
              'Automatique & Asservissement',
              'Mécanique des structures',
              'Électronique analogique & numérique',
              'Informatique (Python & Algorithmique)',
            ],
          },
          {
            subject: 'Français / Philosophie',
            chapters: [
              'Thème annuel – Analyse des œuvres',
              'Dissertation – Méthodologie',
              'Résumé de texte',
              'Synthèse de documents',
              'Expression & Argumentation',
            ],
          },
        ],
      },
      {
        id: 'pass-las',
        name: 'PASS / LAS',
        subjects: ['UE1 – Chimie & Biochimie', 'UE2 – Biologie cellulaire & Histologie', 'UE3 – Physique & Biophysique', 'UE4 – Biostatistiques', 'UE5 – Anatomie'],
        defaultDate: '2027-05-17',
        isBoardExam: false,
        chapters: [
          {
            subject: 'UE1 – Chimie & Biochimie',
            chapters: [
              'Chimie générale & organique',
              'Biochimie structurale',
              'Enzymologie',
              'Métabolisme (Glucides, Lipides, Protéines)',
              'Biologie moléculaire',
            ],
          },
          {
            subject: 'UE2 – Biologie cellulaire & Histologie',
            chapters: [
              'Structure de la cellule',
              'Communication cellulaire',
              'Cycle cellulaire & Apoptose',
              'Tissus épithéliaux & conjonctifs',
              'Embryologie générale',
            ],
          },
          {
            subject: 'UE3 – Physique & Biophysique',
            chapters: [
              'États de la matière',
              'Thermodynamique biologique',
              'Électricité & Magnétisme biologique',
              'Optique & Rayonnements ionisants',
              'Mécanique des fluides biologiques',
            ],
          },
          {
            subject: 'UE4 – Biostatistiques',
            chapters: [
              'Probabilités',
              'Variables aléatoires & Lois de probabilité',
              'Estimation & Tests d\'hypothèses',
              'Régression & Corrélation',
              'Épidémiologie & Études cliniques',
            ],
          },
          {
            subject: 'UE5 – Anatomie',
            chapters: [
              'Anatomie du membre supérieur',
              'Anatomie du membre inférieur',
              'Anatomie du tronc (Thorax, Abdomen, Pelvis)',
              'Anatomie de la tête & du cou',
              'Neuro-anatomie',
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // SPAIN
  // ─────────────────────────────────────────────────────────────────
  {
    code: 'ES',
    name: 'Spain',
    flag: '🇪🇸',
    exams: [
      {
        id: 'ebau-pau',
        name: 'EBAU / PAU (Selectividad)',
        subjects: ['Matemáticas', 'Lengua Castellana y Literatura', 'Inglés', 'Historia de España', 'Física'],
        defaultDate: '2027-06-08',
        isBoardExam: true,
        paperDates: [
          {
                    "paperName": "Lengua Castellana y Literatura",
                    "subject": "Lengua Castellana",
                    "date": "2027-06-08"
          },
          {
                    "paperName": "Historia de España / Filosofía",
                    "subject": "Historia/Filosofía",
                    "date": "2027-06-09"
          },
          {
                    "paperName": "Primera Lengua Extranjera (Inglés)",
                    "subject": "Inglés",
                    "date": "2027-06-10"
          },
          {
                    "paperName": "Materia de Modalidad",
                    "subject": "Modalidad Troncal",
                    "date": "2027-06-11"
          }
],
        chapters: [
          {
            subject: 'Matemáticas',
            chapters: [
              'Álgebra – Matrices y Determinantes',
              'Álgebra – Sistemas de Ecuaciones',
              'Análisis – Límites y Continuidad',
              'Análisis – Derivadas y Aplicaciones',
              'Análisis – Integrales y Cálculo de Áreas',
              'Geometría – Vectores y Rectas en el espacio',
              'Geometría – Planos y Distancias',
              'Probabilidad y Estadística',
            ],
          },
          {
            subject: 'Lengua Castellana y Literatura',
            chapters: [
              'Comentario de texto – Análisis lingüístico',
              'Morfología y Sintaxis',
              'Semántica y Lexicología',
              'Literatura española – Edad Media al Siglo de Oro',
              'Literatura española – Siglos XVIII–XXI',
              'Producción textual (Argumentación, Exposición)',
            ],
          },
          {
            subject: 'Inglés',
            chapters: [
              'Reading Comprehension',
              'Use of English (Grammar & Vocabulary)',
              'Writing (Essay, Letter, Report)',
              'Listening (where applicable)',
              'Mediation & Translation',
            ],
          },
          {
            subject: 'Historia de España',
            chapters: [
              'Crisis del Antiguo Régimen',
              'La construcción del Estado Liberal',
              'La Restauración y crisis (1874–1931)',
              'La Segunda República y la Guerra Civil',
              'La Dictadura Franquista',
              'La Transición y la España Democrática',
            ],
          },
          {
            subject: 'Física',
            chapters: [
              'Campo Gravitatorio',
              'Campo Eléctrico',
              'Campo Magnético',
              'Inducción Electromagnética',
              'Ondas',
              'Óptica',
              'Física Nuclear',
              'Física Cuántica (Introducción)',
            ],
          },
        ],
      },
      {
        id: 'mir',
        name: 'MIR',
        subjects: ['Medicina Interna', 'Cirugía', 'Pediatría', 'Ginecología y Obstetricia', 'Farmacología'],
        defaultDate: '2027-01-23',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Medicina Interna',
            chapters: [
              'Cardiología',
              'Neumología',
              'Gastroenterología',
              'Nefrología',
              'Endocrinología',
              'Reumatología',
              'Enfermedades Infecciosas',
            ],
          },
          {
            subject: 'Cirugía',
            chapters: [
              'Cirugía General',
              'Traumatología y Ortopedia',
              'Neurocirugía',
              'Cirugía Cardiovascular',
              'Cirugía Pediátrica',
            ],
          },
          {
            subject: 'Pediatría',
            chapters: [
              'Neonatología',
              'Crecimiento y Desarrollo',
              'Enfermedades Infecciosas Pediátricas',
              'Nutrición Infantil',
              'Urgencias Pediátricas',
            ],
          },
          {
            subject: 'Ginecología y Obstetricia',
            chapters: [
              'Embarazo Normal y Patológico',
              'Parto y Puerperio',
              'Patología Ginecológica',
              'Oncología Ginecológica',
              'Reproducción Asistida',
            ],
          },
          {
            subject: 'Farmacología',
            chapters: [
              'Farmacocinética y Farmacodinamia',
              'Fármacos del Sistema Nervioso',
              'Fármacos Cardiovasculares',
              'Antibióticos y Antivirales',
              'Farmacología Endocrina',
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // ITALY
  // ─────────────────────────────────────────────────────────────────
  {
    code: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    exams: [
      {
        id: 'esame-di-stato',
        name: 'Esame di Stato (Maturità)',
        subjects: ['Matematica', 'Italiano', 'Fisica', 'Scienze Naturali', 'Filosofia'],
        defaultDate: '2027-06-17',
        isBoardExam: true,
        paperDates: [
          {
                    "paperName": "Prima Prova Scritta (Italiano)",
                    "subject": "Italiano",
                    "date": "2027-06-17"
          },
          {
                    "paperName": "Seconda Prova Scritta (Materia d'indirizzo)",
                    "subject": "Materia d'indirizzo",
                    "date": "2027-06-18"
          },
          {
                    "paperName": "Colloquio Orale",
                    "subject": "Orale Multidisciplinare",
                    "date": "2027-06-23"
          }
],
        chapters: [
          {
            subject: 'Matematica',
            chapters: [
              'Funzioni reali e limiti',
              'Derivate e studio di funzione',
              'Integrali definiti e indefiniti',
              'Equazioni differenziali',
              'Probabilità e Statistica',
              'Geometria analitica nello spazio',
            ],
          },
          {
            subject: 'Italiano',
            chapters: [
              'Analisi del testo letterario',
              'Testo argomentativo',
              'Tema di attualità',
              'Letteratura – Dal Romanticismo al Novecento',
              'Letteratura – Dante, Petrarca, Boccaccio',
              'Letteratura – Il secondo Novecento e contemporanea',
            ],
          },
          {
            subject: 'Fisica',
            chapters: [
              'Elettrostatica',
              'Corrente elettrica e circuiti',
              'Magnetismo ed Elettromagnetismo',
              'Onde elettromagnetiche',
              'Relatività ristretta',
              'Fisica quantistica (cenni)',
            ],
          },
          {
            subject: 'Scienze Naturali',
            chapters: [
              'Chimica organica e Biochimica',
              'Biotecnologie',
              'Scienze della Terra – Tettonica delle placche',
              'Scienze della Terra – Vulcani e Terremoti',
              'Biologia molecolare',
            ],
          },
          {
            subject: 'Filosofia',
            chapters: [
              'Kant e l\'Idealismo tedesco',
              'Marx, Nietzsche, Freud',
              'Esistenzialismo e Fenomenologia',
              'Filosofia del linguaggio',
              'Etica contemporanea',
            ],
          },
        ],
      },
      {
        id: 'tolc',
        name: 'TOLC',
        subjects: ['Matematica', 'Logica', 'Scienze (Biologia, Chimica, Fisica)', 'Comprensione del testo', 'Inglese'],
        defaultDate: '2027-03-20',
        isBoardExam: false,
        chapters: [
          {
            subject: 'Matematica',
            chapters: [
              'Aritmetica e Algebra',
              'Geometria piana e solida',
              'Funzioni e Grafici',
              'Trigonometria',
              'Probabilità, Statistica e Combinatoria',
            ],
          },
          {
            subject: 'Logica',
            chapters: [
              'Ragionamento logico-verbale',
              'Ragionamento logico-numerico',
              'Sequenze e Pattern',
              'Sillogismi e Deduzioni',
              'Problem Solving',
            ],
          },
          {
            subject: 'Scienze (Biologia, Chimica, Fisica)',
            chapters: [
              'Biologia – Cellula, Genetica, Evoluzione',
              'Chimica – Struttura atomica e Legami',
              'Chimica – Reazioni e Stechiometria',
              'Fisica – Meccanica e Termodinamica',
              'Fisica – Elettromagnetismo e Ottica',
            ],
          },
          {
            subject: 'Comprensione del testo',
            chapters: [
              'Comprensione di brani scientifici',
              'Comprensione di brani umanistici',
              'Individuare tesi e argomenti',
              'Inferenze e conclusioni',
              'Analisi critica del testo',
            ],
          },
          {
            subject: 'Inglese',
            chapters: [
              'Grammar (B1–B2 level)',
              'Reading Comprehension',
              'Vocabulary in Context',
              'Sentence Completion',
              'Error Identification',
            ],
          },
        ],
      },
    ],
  },
];
