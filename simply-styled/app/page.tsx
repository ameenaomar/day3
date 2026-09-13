"use client";

import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/translations";

export default function FoundationPage() {
  const { locale, dir } = useLanguage();
  const copy = t(locale);

  return (
    <main className="min-h-dvh px-gutter">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col">
        {/* Masthead — hairline under, generous height, toggle at inline-end. */}
        <header className="flex items-center justify-between rule-b py-8">
          <span className="text-label uppercase text-ink-muted">
            {copy.foundation.eyebrow}
          </span>
          <LanguageToggle />
        </header>

        {/* The page is deliberately near-empty: whitespace is the test. */}
        <div className="flex flex-1 flex-col justify-center py-section">
          {/* ps- and border-inline-start, so the indent moves side on flip. */}
          <div className="rule-s ps-8 sm:ps-14">
            <h1 className="text-display font-serif font-light text-ink">
              {copy.foundation.headline}
            </h1>
            <p className="mt-10 max-w-prose text-body text-ink-muted">
              {copy.foundation.standfirst}
            </p>
          </div>
        </div>

        {/* Live readout, so the flip is verifiable rather than eyeballed. */}
        <footer className="rule-t py-10">
          <dl className="flex gap-14 text-caption">
            <div>
              <dt className="text-label uppercase text-ink-muted">
                {copy.foundation.localeLabel}
              </dt>
              <dd className="mt-2 font-sans text-ink">{locale}</dd>
            </div>
            <div>
              <dt className="text-label uppercase text-ink-muted">
                {copy.foundation.directionLabel}
              </dt>
              <dd className="mt-2 font-sans text-ink">{dir}</dd>
            </div>
          </dl>
        </footer>
      </div>
    </main>
  );
}
