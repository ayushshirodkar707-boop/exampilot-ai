'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, CheckCircle2, HelpCircle, Clock, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'Is ExamPilot AI really free to use?',
      a: 'Yes! All core features — including custom AI timetable generation, syllabus chapter tracking, Pomodoro timers, and mock test logging — are 100% free for students worldwide, supported by non-intrusive display advertisements.',
    },
    {
      q: 'Do I need an account to use the application?',
      a: 'No. You can click "Try as Guest" to test every feature instantly without giving your email or signing in. Your study schedule is safely stored in your browser’s local storage.',
    },
    {
      q: 'Can I add a custom exam not listed in the country selector?',
      a: 'Absolutely! On Step 2 of the Onboarding Wizard, choose "My exam is not listed — Add Custom / Other Exam" and type your test name (e.g., USMLE, Bar Exam, CFA, or regional civil service).',
    },
    {
      q: 'How does the AI handle missed days or changes in plans?',
      a: 'Simply click "Missed a Day? Catch Up" in your dashboard. The planner will re-distribute remaining chapters across your future days so you never fall behind.',
    },
    {
      q: 'How can I report a bug or request a new exam syllabus?',
      a: 'Use the contact form on this page or email us directly at support@exampilot.ai with your syllabus PDF or topic breakdown!',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
          Contact &amp; Student Support
        </h1>
        <p className="text-base text-[var(--muted)] max-w-xl mx-auto">
          Have feedback, a feature request, or an exam syllabus you would like pre-mapped? We’re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="space-y-6 md:col-span-1">
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-base text-[var(--foreground)]">
              Direct Contact
            </h3>
            <div className="space-y-3 text-xs text-[var(--muted)]">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[var(--foreground)]">Email Support</div>
                  <a href="mailto:support@exampilot.ai" className="hover:underline text-primary-500">
                    support@exampilot.ai
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[var(--foreground)]">Response Time</div>
                  <div>Within 24–48 hours</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[var(--foreground)]">Global Team</div>
                  <div>Distributed Worldwide 🌍</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-6 sm:p-8 md:col-span-2">
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-in fade-in">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                Message Sent Successfully!
              </h3>
              <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                Thank you for reaching out, {formData.name}. Our student support team will review your message and reply via {formData.email}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                }}
                className="btn-secondary text-xs py-2 px-4 mt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-bold text-lg text-[var(--foreground)] mb-2">
                Send Us a Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Chen"
                    className="input-field text-xs py-2.5"
                  />
                </div>

                <div>
                  <label className="label text-xs">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@example.com"
                    className="input-field text-xs py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="label text-xs">Subject Category</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field text-xs py-2.5"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Exam Syllabus Request">Request New Exam / Country</option>
                  <option value="Bug Report">Technical Bug Report</option>
                  <option value="Partnership / Sponsorship">Partnership / Advertising</option>
                </select>
              </div>

              <div>
                <label className="label text-xs">Your Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you with your study planning?"
                  className="input-field text-xs py-2.5 resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-xs font-bold"
              >
                Submit Message
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6 pt-6 border-t border-[var(--border)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1">
            Quick answers to common questions about ExamPilot AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="card p-5 space-y-2">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <h3 className="font-bold text-sm text-[var(--foreground)]">
                  {faq.q}
                </h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed pl-6.5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
