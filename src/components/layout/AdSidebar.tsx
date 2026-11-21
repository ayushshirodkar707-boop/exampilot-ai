'use client';

import AdSlot from '@/components/ads/AdSlot';

export default function AdSidebar() {
  return (
    <aside className="hidden w-[300px] shrink-0 xl:block" aria-label="Sponsored content">
      <div className="sticky top-20 flex max-h-[calc(100vh-6rem)] flex-col gap-5">
        {/* Label */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
          Sponsored
        </p>

        {/* 300 × 250 — Medium Rectangle */}
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <AdSlot size="300x250" label="Sponsored Partner" />
        </div>

        {/* 300 × 600 — Half Page */}
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <AdSlot size="300x600" label="Featured Study Tools" />
        </div>
      </div>
    </aside>
  );
}
