'use client';

import React from 'react';
import type { CountryData } from '@/types';
import { Check } from 'lucide-react';

interface CountrySelectorProps {
  countries: CountryData[];
  selectedCountry: string;
  onSelect: (countryCode: string) => void;
}

export default function CountrySelector({
  countries,
  selectedCountry,
  onSelect,
}: CountrySelectorProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Select Your Country / Region
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Choose where you are appearing for your exams to view national and regional test systems.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {countries.map((country) => {
          const isSelected = selectedCountry === country.code;
          return (
            <button
              key={country.code}
              type="button"
              onClick={() => onSelect(country.code)}
              className={`relative flex flex-col items-center justify-between p-5 rounded-2xl border transition-all duration-200 text-left group ${
                isSelected
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 ring-2 ring-primary-500 shadow-md shadow-primary-500/10'
                  : 'border-[var(--border)] bg-[var(--card)] hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/5'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
              <div className="text-5xl sm:text-6xl mb-3 transform transition-transform group-hover:scale-110 select-none">
                {country.flag}
              </div>
              <div className="w-full text-center">
                <div className="font-semibold text-base text-[var(--foreground)] group-hover:text-primary-500 transition-colors">
                  {country.name}
                </div>
                <div className="mt-1 text-xs text-[var(--muted)]">
                  {country.exams.length} {country.exams.length === 1 ? 'Exam' : 'Exams'} Available
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
