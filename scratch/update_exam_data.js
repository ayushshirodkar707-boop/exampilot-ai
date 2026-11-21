const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/examData.ts');
let content = fs.readFileSync(filePath, 'utf8');

const examConfigs = {
  'jee-main-advanced': {
    defaultDate: '2027-01-24',
    isBoardExam: false,
  },
  'neet-ug': {
    defaultDate: '2027-05-02',
    isBoardExam: false,
  },
  'cuet': {
    defaultDate: '2027-05-15',
    isBoardExam: false,
  },
  'clat': {
    defaultDate: '2026-12-06',
    isBoardExam: false,
  },
  'cbse-10': {
    defaultDate: '2027-02-15',
    isBoardExam: true,
    paperDates: [
      { paperName: 'Social Science', subject: 'Social Science', date: '2027-02-20' },
      { paperName: 'Science', subject: 'Science', date: '2027-02-25' },
      { paperName: 'English (Lang & Lit)', subject: 'English', date: '2027-02-28' },
      { paperName: 'Mathematics', subject: 'Mathematics', date: '2027-03-10' },
      { paperName: 'Hindi Course A/B', subject: 'Hindi', date: '2027-03-15' },
    ],
  },
  'cbse-12': {
    defaultDate: '2027-02-15',
    isBoardExam: true,
    paperDates: [
      { paperName: 'English Core', subject: 'English', date: '2027-02-20' },
      { paperName: 'Physics', subject: 'Physics', date: '2027-02-27' },
      { paperName: 'Chemistry', subject: 'Chemistry', date: '2027-03-04' },
      { paperName: 'Mathematics', subject: 'Mathematics', date: '2027-03-11' },
      { paperName: 'Biology', subject: 'Biology', date: '2027-03-18' },
      { paperName: 'Computer Science', subject: 'Computer Science', date: '2027-03-25' },
    ],
  },
  'icse-isc': {
    defaultDate: '2027-02-18',
    isBoardExam: true,
    paperDates: [
      { paperName: 'English Language', subject: 'English', date: '2027-02-18' },
      { paperName: 'Literature in English', subject: 'English', date: '2027-02-23' },
      { paperName: 'Physics (Paper 1)', subject: 'Physics', date: '2027-03-01' },
      { paperName: 'Chemistry (Paper 1)', subject: 'Chemistry', date: '2027-03-08' },
      { paperName: 'Mathematics', subject: 'Mathematics', date: '2027-03-15' },
      { paperName: 'Biology (Paper 1)', subject: 'Biology', date: '2027-03-22' },
    ],
  },
  'gate': {
    defaultDate: '2027-02-06',
    isBoardExam: false,
  },
  'cat': {
    defaultDate: '2027-11-28',
    isBoardExam: false,
  },
  'upsc': {
    defaultDate: '2027-05-23',
    isBoardExam: false,
  },
  'sat': {
    defaultDate: '2027-03-14',
    isBoardExam: false,
  },
  'act': {
    defaultDate: '2027-04-10',
    isBoardExam: false,
  },
  'ap-exams': {
    defaultDate: '2027-05-04',
    isBoardExam: true,
    paperDates: [
      { paperName: 'AP Calculus AB/BC', subject: 'Calculus', date: '2027-05-04' },
      { paperName: 'AP Physics 1', subject: 'Physics', date: '2027-05-08' },
      { paperName: 'AP Chemistry', subject: 'Chemistry', date: '2027-05-11' },
      { paperName: 'AP Biology', subject: 'Biology', date: '2027-05-14' },
    ],
  },
  'mcat': {
    defaultDate: '2027-04-18',
    isBoardExam: false,
  },
  'lsat': {
    defaultDate: '2027-04-09',
    isBoardExam: false,
  },
  'gre': {
    defaultDate: '2027-03-01',
    isBoardExam: false,
  },
  'gmat': {
    defaultDate: '2027-02-28',
    isBoardExam: false,
  },
  'gcse': {
    defaultDate: '2027-05-10',
    isBoardExam: true,
    paperDates: [
      { paperName: 'GCSE Mathematics Paper 1', subject: 'Mathematics', date: '2027-05-15' },
      { paperName: 'GCSE Physics Paper 1', subject: 'Physics', date: '2027-05-20' },
      { paperName: 'GCSE Chemistry Paper 1', subject: 'Chemistry', date: '2027-05-26' },
      { paperName: 'GCSE Biology Paper 1', subject: 'Biology', date: '2027-06-02' },
    ],
  },
  'a-levels': {
    defaultDate: '2027-05-18',
    isBoardExam: true,
    paperDates: [
      { paperName: 'Pure Mathematics 1', subject: 'Mathematics', date: '2027-05-18' },
      { paperName: 'Physics Component 1', subject: 'Physics', date: '2027-05-25' },
      { paperName: 'Chemistry Component 1', subject: 'Chemistry', date: '2027-06-01' },
      { paperName: 'Biology Component 1', subject: 'Biology', date: '2027-06-08' },
    ],
  },
  'ucat': {
    defaultDate: '2027-07-15',
    isBoardExam: false,
  },
  'lnat': {
    defaultDate: '2027-01-20',
    isBoardExam: false,
  },
  'scottish-highers': {
    defaultDate: '2027-04-26',
    isBoardExam: true,
    paperDates: [
      { paperName: 'Higher English', subject: 'English', date: '2027-04-28' },
      { paperName: 'Higher Mathematics', subject: 'Mathematics', date: '2027-05-05' },
      { paperName: 'Higher Physics', subject: 'Physics', date: '2027-05-12' },
      { paperName: 'Higher Chemistry', subject: 'Chemistry', date: '2027-05-19' },
    ],
  },
  'abitur': {
    defaultDate: '2027-04-20',
    isBoardExam: true,
    paperDates: [
      { paperName: 'Abitur Deutsch (LK/GK)', subject: 'Deutsch', date: '2027-04-23' },
      { paperName: 'Abitur Mathematik (LK/GK)', subject: 'Mathematik', date: '2027-04-30' },
      { paperName: 'Abitur Englisch (LK/GK)', subject: 'Englisch', date: '2027-05-07' },
      { paperName: 'Abitur Biologie / Physik / Chemie', subject: 'Naturwissenschaften', date: '2027-05-14' },
    ],
  },
  'testas': {
    defaultDate: '2027-04-24',
    isBoardExam: false,
  },
  'tms': {
    defaultDate: '2027-05-08',
    isBoardExam: false,
  },
  'baccalaureat': {
    defaultDate: '2027-06-16',
    isBoardExam: true,
    paperDates: [
      { paperName: 'Philosophie', subject: 'Philosophie', date: '2027-06-16' },
      { paperName: 'Épreuve de spécialité 1', subject: 'Spécialité 1', date: '2027-06-18' },
      { paperName: 'Épreuve de spécialité 2', subject: 'Spécialité 2', date: '2027-06-21' },
      { paperName: 'Grand Oral', subject: 'Grand Oral', date: '2027-06-24' },
    ],
  },
  'concours-cpge': {
    defaultDate: '2027-05-03',
    isBoardExam: false,
  },
  'pass-las': {
    defaultDate: '2027-05-17',
    isBoardExam: false,
  },
  'ebau-pau': {
    defaultDate: '2027-06-08',
    isBoardExam: true,
    paperDates: [
      { paperName: 'Lengua Castellana y Literatura', subject: 'Lengua Castellana', date: '2027-06-08' },
      { paperName: 'Historia de España / Filosofía', subject: 'Historia/Filosofía', date: '2027-06-09' },
      { paperName: 'Primera Lengua Extranjera (Inglés)', subject: 'Inglés', date: '2027-06-10' },
      { paperName: 'Materia de Modalidad', subject: 'Modalidad Troncal', date: '2027-06-11' },
    ],
  },
  'mir': {
    defaultDate: '2027-01-23',
    isBoardExam: false,
  },
  'esame-di-stato': {
    defaultDate: '2027-06-17',
    isBoardExam: true,
    paperDates: [
      { paperName: 'Prima Prova Scritta (Italiano)', subject: 'Italiano', date: '2027-06-17' },
      { paperName: 'Seconda Prova Scritta (Materia d\'indirizzo)', subject: 'Materia d\'indirizzo', date: '2027-06-18' },
      { paperName: 'Colloquio Orale', subject: 'Orale Multidisciplinare', date: '2027-06-23' },
    ],
  },
  'tolc': {
    defaultDate: '2027-03-20',
    isBoardExam: false,
  },
};

for (const [id, config] of Object.entries(examConfigs)) {
  const targetRegex = new RegExp(`id:\\s*['"]${id}['"],([\\s\\S]*?)(chapters:\\s*\\[)`, 'm');
  const match = content.match(targetRegex);
  if (match) {
    let extraProps = `\n        defaultDate: '${config.defaultDate}',\n        isBoardExam: ${Boolean(config.isBoardExam)},`;
    if (config.paperDates) {
      extraProps += `\n        paperDates: ${JSON.stringify(config.paperDates, null, 10).replace(/\n\s{10}/g, '\n          ')},`;
    }
    // Check if defaultDate already added
    if (!match[1].includes('defaultDate')) {
      const replacement = `id: '${id}',${match[1].trimEnd()}${extraProps}\n        ${match[2]}`;
      content = content.replace(targetRegex, replacement);
      console.log(`Updated exam: ${id}`);
    }
  } else {
    console.warn(`Could not find match for exam: ${id}`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished updating examData.ts successfully');
