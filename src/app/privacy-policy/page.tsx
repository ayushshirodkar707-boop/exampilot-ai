import React from 'react';

export const metadata = {
  title: 'Privacy Policy & Cookie Consent Notice — ExamPilot AI',
  description:
    'ExamPilot AI privacy policy, detailing data protection practices, Google AdSense cookie guidelines, GDPR, CPRA compliance, and student confidentiality.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-[var(--foreground)]">
      <div className="border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Privacy Policy &amp; Cookie Consent Notice
        </h1>
        <p className="text-xs text-[var(--muted)] mt-2">
          Effective Date: November 20, 2026 • Last Updated: November 2026
        </p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            1. Introduction &amp; Commitment to Student Privacy
          </h2>
          <p>
            Welcome to ExamPilot AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We operate the educational web platform at exampilot.ai. We are firmly committed to safeguarding the privacy and personal data of our student users, parents, educators, and global visitors.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, store, process, and disclose information when you visit our website, utilize our AI-powered study planner, log mock test scores, or interact with our educational guides.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            2. Information We Collect
          </h2>
          <p>
            We collect minimal information necessary to deliver and customize your study schedules:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              <strong>Guest / Demo Mode Data:</strong> When using the application without creating an account, your chosen exam, target exam date, study hours, task checklists, and mock test scores are stored strictly within your browser&apos;s <code>localStorage</code>. This data never touches our backend servers.
            </li>
            <li>
              <strong>Google Sign-In Profile Information:</strong> When you voluntarily sign in with Google Firebase Authentication, we receive your name, email address, profile photo URL, and unique authentication identifier (UID). We do not receive or store your Google account password.
            </li>
            <li>
              <strong>Study Configuration Data:</strong> Information you submit in the Onboarding Wizard (chosen country, exam syllabus, target exam date, daily study capacity, weak topics, and mock scores) is saved to Google Cloud Firestore linked to your UID to synchronize your progress across devices.
            </li>
            <li>
              <strong>Technical &amp; Log Data:</strong> Internet Protocol (IP) address, browser type, device operating system, referring URLs, pages visited, and interaction timestamps.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            3. Google AdSense &amp; Advertising Cookies Notice
          </h2>
          <p>
            To keep ExamPilot AI 100% free for students worldwide, we display contextual and interest-based advertisements through Google AdSense and third-party advertising networks.
          </p>
          <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--foreground)]">
              Important AdSense Disclosures:
            </h3>
            <p>
              • Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to our website or other websites.
            </p>
            <p>
              • Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
            </p>
            <p>
              • Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 underline"
              >
                Google Ads Settings
              </a>
              . Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{' '}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 underline"
              >
                aboutads.info
              </a>
              .
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            4. Artificial Intelligence &amp; Generative Processing
          </h2>
          <p>
            Study schedules are generated using Google Gemini AI models. When you request a study plan, only anonymous academic parameters (exam name, days remaining, daily hours, weak subject list) are transmitted to the API endpoint. We never send your personal identifying information (such as your legal name or email address) to generative AI models.
          </p>
        </section>

        {/* Section 5: GDPR */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            5. European Economic Area (EEA) &amp; UK GDPR Rights
          </h2>
          <p>
            If you reside in the European Economic Area or the United Kingdom, you hold statutory rights under the General Data Protection Regulation (GDPR) and UK Data Protection Act:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Right of Access:</strong> You may request a copy of the personal data we maintain about you.</li>
            <li><strong>Right to Rectification:</strong> You may update or correct inaccurate profile details.</li>
            <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request permanent deletion of your account and study logs.</li>
            <li><strong>Right to Data Portability:</strong> You may request your syllabus progress and scores in machine-readable format.</li>
            <li><strong>Right to Withdraw Consent:</strong> You may withdraw consent for data processing at any time.</li>
          </ul>
        </section>

        {/* Section 6: California CPRA */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            6. California Consumer Privacy Act (CCPA / CPRA)
          </h2>
          <p>
            For California residents, the California Consumer Privacy Act and California Privacy Rights Act grant specific rights regarding personal information:
          </p>
          <p>
            • We do <strong>NOT</strong> sell your personal information for monetary compensation.
          </p>
          <p>
            • You have the right to know what personal information is collected, disclosed, or shared.
          </p>
          <p>
            • You have the right to request deletion of personal information and to opt-out of cross-context behavioral advertising.
          </p>
        </section>

        {/* Section 7: Children */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            7. Children&apos;s Privacy (COPPA Compliance)
          </h2>
          <p>
            ExamPilot AI is designed for secondary school, high school, and university students. We do not knowingly collect personal identifiable information from children under the age of 13 without verified parental consent. If we become aware that a child under 13 has provided personal information without consent, we will take immediate steps to delete such data.
          </p>
        </section>

        {/* Section 8: Security & Contact */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            8. Data Security &amp; Contact Information
          </h2>
          <p>
            We enforce industry-standard TLS encryption in transit and AES encryption at rest for all cloud-stored user databases. If you have any inquiries regarding this Privacy Policy or wish to exercise your data rights, please contact:
          </p>
          <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs">
            <p className="font-bold text-[var(--foreground)]">ExamPilot AI Privacy Team</p>
            <p className="mt-1">Email: <a href="mailto:privacy@exampilot.ai" className="text-primary-500 underline">privacy@exampilot.ai</a></p>
            <p>Website: https://exampilot.ai</p>
          </div>
        </section>
      </div>
    </div>
  );
}
