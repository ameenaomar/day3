"use client";

import { LanguageToggle } from "@/components/LanguageToggle";
import { LtrText } from "@/components/LtrText";
import { useLanguage } from "@/components/LanguageProvider";
import { formatAmount, quoteFor } from "@/lib/pricing";
import { t } from "@/lib/translations";

/** Small all-caps label — the editorial eyebrow. */
function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-label uppercase text-ink-muted">{children}</span>;
}

export default function FoundationPage() {
  const { locale, dir } = useLanguage();
  const copy = t(locale);

  const swatches = [
    { name: copy.foundation.swatches.paper, hex: "#F0E9DD", className: "bg-paper" },
    { name: copy.foundation.swatches.sand, hex: "#C7A68B", className: "bg-sand" },
    { name: copy.foundation.swatches.dove, hex: "#7C7877", className: "bg-dove" },
    { name: copy.foundation.swatches.ink, hex: "#3A2E26", className: "bg-ink" },
  ];

  const modes = [
    { name: copy.foundation.modes.online, quote: quoteFor("online", 1) },
    { name: copy.foundation.modes.inPerson, quote: quoteFor("inPerson", 1) },
  ];

  return (
    <main className="min-h-dvh px-gutter">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between rule-b py-8">
          <Label>{copy.foundation.eyebrow}</Label>
          <LanguageToggle />
        </header>

        {/* Display specimen. ps- and border-inline-start, so the indent moves
            side on flip. */}
        <section className="py-section-sm">
          <div className="rule-s ps-8 sm:ps-14">
            <h1 className="text-display font-serif text-ink">{copy.foundation.headline}</h1>
            <p className="mt-10 max-w-prose text-body text-ink-muted">
              {copy.foundation.standfirst}
            </p>
          </div>
        </section>

        {/* Palette */}
        <section className="rule-t py-16">
          <Label>{copy.foundation.paletteLabel}</Label>
          <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {swatches.map((swatch) => (
              <div key={swatch.hex}>
                <div className={`h-32 border border-rule ${swatch.className}`} />
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="text-caption text-ink">{swatch.name}</span>
                  <span className="text-caption text-ink-muted">
                    <LtrText>{swatch.hex}</LtrText>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Type */}
        <section className="rule-t py-16">
          <Label>{copy.foundation.typeLabel}</Label>
          <p className="mt-8 font-serif text-headline text-ink">{copy.foundation.headline}</p>
          <p className="mt-4 text-caption text-ink-muted">{copy.foundation.displayFaceNote}</p>
        </section>

        {/* Rates */}
        <section className="rule-t py-16">
          <Label>{copy.foundation.ratesLabel}</Label>
          <dl className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2">
            {modes.map((mode) => (
              <div key={mode.name} className="rule-s ps-6">
                <dt className="text-caption text-ink-muted">{mode.name}</dt>
                <dd className="mt-3 font-serif text-title text-ink">
                  {formatAmount(mode.quote.filsPerOutfit, locale)} {copy.currency}
                </dd>
                <dd className="mt-1 text-caption text-ink-muted">
                  {copy.foundation.perOutfit}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Live readout, so the flip is verifiable rather than eyeballed. */}
        <footer className="rule-t py-10">
          <dl className="flex gap-14 text-caption">
            <div>
              <dt>
                <Label>{copy.foundation.localeLabel}</Label>
              </dt>
              <dd className="mt-2 font-sans text-ink">{locale}</dd>
            </div>
            <div>
              <dt>
                <Label>{copy.foundation.directionLabel}</Label>
              </dt>
              <dd className="mt-2 font-sans text-ink">{dir}</dd>
            </div>
          </dl>
        </footer>
      </div>
    </main>
  );
}
