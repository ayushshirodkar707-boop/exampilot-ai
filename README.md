# ExamPilot AI 🎓✈️

**ExamPilot AI** is a full-stack, responsive AI-powered exam planner and study tracker designed for students worldwide. It automatically generates personalized day-by-day study schedules (morning, afternoon, and evening blocks) based on days remaining, daily available study hours, and weak/strong subjects. It features pre-populated syllabus chapter tracking, mock test score visualization, a built-in Pomodoro study timer, and policy-compliant Google AdSense display advertising slots.

---

## 🌟 Key Features

1. **Instant Demo / Guest Mode**: Test the entire application immediately without configuring any API keys or creating an account — all data persists in `localStorage`.
2. **AI Study Plan Generator**: Powered by **Google Gemini AI** via a secure Next.js API route (`/api/generate-plan`). Automatically balances daily learning blocks with spaced revision cycles and timed mock examination days. Includes automatic fallback if no key is configured.
3. **Worldwide Exam Coverage**:
   - 🇮🇳 **India**: JEE Main & Advanced, NEET UG, CUET, CLAT, CBSE Class 10 & 12, ICSE/ISC, State Boards, GATE, CAT, UPSC.
   - 🇺🇸 **United States**: Digital SAT, ACT, AP Exams, MCAT, LSAT, GRE, GMAT.
   - 🇬🇧 **United Kingdom**: GCSE, A-Levels, UCAT, LNAT, Scottish Highers.
   - 🇩🇪 **Germany**: Abitur, TestAS, TMS (Medizinertest).
   - 🇫🇷 **France**: Baccalauréat (Le Bac), Concours CPGE, PASS / LAS.
   - 🇪🇸 **Spain**: EBAU / PAU (Selectividad), MIR.
   - 🇮🇹 **Italy**: Esame di Stato (Maturità), TOLC.
   - 🌍 **Custom Exam Input**: Any student can add unlisted tests (e.g. USMLE, CFA, Bar Exam).
4. **Interactive Dashboard**:
   - **Daily Task Checklists**: Mark off morning, afternoon, and evening blocks with automatic completion percentages and fire-emoji study streak tracking.
   - **Pre-populated Syllabus Matrix**: Categorized chapters marked as *Not Started*, *In Progress*, *Completed*, or *Needs Revision* with per-subject progress bars.
   - **Mock Test Analytics**: Interactive line graph (Recharts) mapping your percentage scores over time with personal best benchmarks.
   - **Pomodoro Focus Timer**: 25/5 Classic and 50/10 Deep Work intervals with audio alert chime and daily session logging.
5. **Monetization & AdSense-Ready Architecture**:
   - **3-Column Desktop Layout**: Left navigation, Center planner workspace, Right sticky 300px sidebar featuring `300x250` and `300x600` ad units.
   - **Mobile Collapsible Banner**: Clean, non-intrusive `320x50` bottom ad banner that avoids accidental clicks and adheres to Google AdSense policies.
   - **AdSense Verification Tag**: Global placeholder script tag in `src/app/layout.tsx`.
6. **SEO & AdSense Compliance Content**:
   - `/guides`: Deep educational syllabi & prep strategies for all 7 countries.
   - `/about`, `/contact` (interactive form & FAQ), `/privacy-policy` (GDPR, CPRA, Cookie consent), and `/terms`.

---

## 🚀 Quick Start (Zero Config Demo Mode)

You can run and test the full application immediately without any Firebase or Gemini credentials.

```bash
# 1. Navigate to the project directory
cd exampilot-ai

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
1. Click **"Try as Guest"** or **"Start Instantly as Guest"**.
2. Pick your country (e.g. India, United States, Germany) and select your target exam.
3. Configure your exam date, daily hours, and weak subjects.
4. Click **"Generate My AI Study Plan"** to enter your personal cockpit.

---

## 🔑 Production Setup (Firebase & Gemini API)

When you are ready to enable Google Cloud persistence and live Gemini AI models:

### 1. Configure `.env.local`

Copy the example environment file:
```bash
cp .env.local.example .env.local
```

### 2. Google Gemini AI Setup
1. Visit [Google AI Studio](https://aistudio.google.com/apikey).
2. Generate an API key.
3. In `.env.local`, set:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### 3. Firebase Authentication & Cloud Firestore Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new Firebase project (e.g., `exampilot-ai`).
3. Under **Build > Authentication**, click **Get Started** and enable **Google Sign-In**.
4. Under **Build > Firestore Database**, click **Create Database** (start in Production or Test mode).
5. Go to **Project Settings** (gear icon) > **General** > **Your apps** > Add a **Web app** (`</>`).
6. Copy the Firebase configuration keys into your `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=exampilot-ai.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=exampilot-ai
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=exampilot-ai.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
   NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:...
   ```

---

## 💰 Google AdSense Integration Guide

The app contains pre-built ad unit components and layout positions designed to comply with Google AdSense Policies (never obstructing buttons or triggering accidental clicks).

### 1. Site Verification Script
In `src/app/layout.tsx`, uncomment the `<script>` tag inside `<head>` and insert your AdSense Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`):
```tsx
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossOrigin="anonymous"
></script>
```

### 2. AdSlot Component Locations
Each ad placement uses the `AdSlot` component (`src/components/ads/AdSlot.tsx`):
- **Right Sidebar (Desktop)**: `300x250` and `300x600` in `src/components/layout/AdSidebar.tsx`.
- **Homepage Leaderboard**: `728x90` in `src/app/page.tsx`.
- **Public Guides In-Feed**: Responsive ad in `src/app/guides/page.tsx`.
- **Mobile Bottom Banner**: `320x50` in `src/app/dashboard/page.tsx`.

To paste live AdSense `<ins>` unit code, open `src/components/ads/AdSlot.tsx` and follow the clear in-code comments:
```tsx
<ins className="adsbygoogle"
  style={{ display: 'block' }}
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto"
  data-full-width-responsive="true">
</ins>
```

---

## 📁 Project Structure

```
exampilot-ai/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with AdSense head script & theme
│   │   ├── globals.css             # Tailwind CSS & theme tokens
│   │   ├── page.tsx                # Public, SEO-friendly landing page
│   │   ├── onboarding/
│   │   │   └── page.tsx            # Multi-step country/exam strategy wizard
│   │   ├── dashboard/
│   │   │   └── page.tsx            # 3-column personal study hub
│   │   ├── guides/
│   │   │   └── page.tsx            # Content-rich syllabus & prep guides
│   │   ├── about/
│   │   │   └── page.tsx            # Mission and team overview
│   │   ├── contact/
│   │   │   └── page.tsx            # Interactive contact form & FAQ
│   │   ├── privacy-policy/
│   │   │   └── page.tsx            # GDPR / CPRA / Cookie consent policy
│   │   ├── terms/
│   │   │   └── page.tsx            # Terms of service & academic disclaimer
│   │   └── api/
│   │       └── generate-plan/
│   │           └── route.ts        # Gemini AI & heuristic fallback schedule endpoint
│   ├── components/
│   │   ├── ads/
│   │   │   └── AdSlot.tsx          # Reusable AdSense placeholder with sizes
│   │   ├── auth/
│   │   │   ├── LoginButton.tsx     # Google Sign-in + Guest mode triggers
│   │   ├── dashboard/
│   │   │   ├── DailyTasks.tsx      # Checkpoint checklists & completion bar
│   │   │   ├── MockTestLogger.tsx  # Test scoring log & Recharts line graph
│   │   │   ├── PomodoroTimer.tsx   # 25/5 and 50/10 focus interval timer
│   │   │   ├── ScheduleView.tsx    # Day-by-day morning/afternoon/evening blocks
│   │   │   ├── StreakCounter.tsx   # Daily study streak visualizer
│   │   │   └── SyllabusTracker.tsx # Chapter status & subject progress bars
│   │   ├── layout/
│   │   │   ├── AdSidebar.tsx       # Sticky 300px desktop ad sidebar
│   │   │   ├── Footer.tsx          # Global legal & social footer
│   │   │   ├── Navbar.tsx          # Global navigation with theme & auth toggle
│   │   │   └── Sidebar.tsx         # Dashboard navigation & countdown info
│   │   ├── onboarding/
│   │   │   ├── CountrySelector.tsx # National flag selection cards
│   │   │   ├── ExamSelector.tsx    # National exam selection + custom option
│   │   │   └── StudentDetailsForm.tsx # Exam date, hours, weak areas, prep level
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── ProgressBar.tsx
│   │       └── ThemeToggle.tsx
│   ├── hooks/
│   │   ├── useAuth.ts              # Firebase & Guest authentication state
│   │   ├── useStudyData.ts         # Cloud Firestore & localStorage dual backend
│   │   └── useTheme.ts             # Dark/Light theme mode hook
│   ├── lib/
│   │   ├── examData.ts             # Curated countries, exams & chapter syllabi
│   │   ├── firebase.ts             # Firebase client initialization
│   │   ├── firestore.ts            # Firestore document CRUD operations
│   │   ├── gemini.ts               # Google Gemini generative AI client
│   │   └── localStorage.ts         # Mirror offline storage for guest mode
│   └── types/
│       └── index.ts                # TypeScript interfaces
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🚢 Deployment to Vercel

ExamPilot AI is optimized for single-click deployment to [Vercel](https://vercel.com):

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `exampilot-ai` repository.
4. Under **Environment Variables**, add the keys from your `.env.local` (`GEMINI_API_KEY`, Firebase keys, etc.).
5. Click **"Deploy"**. Your application will be live globally on Vercel's Edge Network in under 2 minutes.

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Framework | **Next.js 14 (App Router)** |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS 3** with Dark/Light mode tokens |
| AI Engine | **Google Gemini 2.0 Flash (`@google/generative-ai`)** |
| Database & Auth | **Firebase Auth (Google) + Cloud Firestore** |
| Local Fallback | **Browser `localStorage` (Guest Mode)** |
| Charts | **Recharts** |
| Icons | **Lucide React** |
| Themes | **next-themes** |

---

## 📄 License
This project is open-source and released under the [MIT License](LICENSE).
