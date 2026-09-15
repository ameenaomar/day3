"use client";

import Link from "next/link";

import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";
import { Photo } from "@/components/Photo";
import { formatAmount, quoteFor } from "@/lib/pricing";
import { stripImages } from "@/lib/site.config";
import { t } from "@/lib/translations";

/** The small tracked-out label used throughout. */
function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-label uppercase text-ink-muted">{children}</span>;
}

export default function HomePage() {
  const { locale } = useLanguage();
  const copy = t(locale);
  const home = copy.home;

  const rates = [
    { name: home.online, fils: quoteFor("online", 1).filsPerOutfit },
    { name: home.inPerson, fils: quoteFor("inPerson", 1).filsPerOutfit },
  ];

  return (
    <main className="mx-auto max-w-6xl px-gutter">
      {/* Masthead */}
      <header className="flex items-center justify-between rule-b py-7">
        <Label>{copy.meta.title}</Label>
        <span className="hidden text-label uppercase text-sand sm:inline">{home.location}</span>
        <LanguageToggle />
      </header>

      {/* Lead — the wordmark set large, with the standfirst and masthead facts
          below it on a two-column baseline. */}
      <section className="rule-b py-16 sm:py-20">
        <h1 className="text-display font-serif text-ink">
          {home.headlineTop}
          <br />
          {home.headlineBottom}
        </h1>
        <div className="mt-12 grid grid-cols-1 items-end gap-10 sm:grid-cols-[1.1fr_0.9fr] sm:gap-16">
          <p className="max-w-prose text-body text-ink-muted">{home.lede}</p>
          <ul className="text-label uppercase leading-loose text-ink-muted sm:text-end">
            {home.meta.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Three numbered columns, divided by hairlines. */}
      <section className="grid grid-cols-1 rule-b sm:grid-cols-3">
        {home.sections.map((section, i) => (
          <article
            key={section.n}
            className={`py-9 sm:pe-8 ${i > 0 ? "rule-t sm:rule-t-none sm:rule-s sm:ps-8" : ""}`}
          >
            <span className="text-label uppercase text-sand">{section.n}</span>
            <h2 className="mt-4 text-title font-serif text-ink">{section.title}</h2>
            <p className="mt-3 text-caption leading-relaxed text-ink-muted">{section.body}</p>
          </article>
        ))}
      </section>

      {/* Rates */}
      <section className="grid grid-cols-1 rule-b sm:grid-cols-2">
        {rates.map((rate, i) => (
          <div
            key={rate.name}
            data-logical-border={i > 0 ? "" : undefined}
            className={`flex items-baseline justify-between py-10 sm:pe-8 ${
              i > 0 ? "rule-t sm:rule-t-none sm:rule-s sm:ps-8" : ""
            }`}
          >
            <Label>{rate.name}</Label>
            <span className="font-serif text-headline text-ink">
              {formatAmount(rate.fils, locale)} {copy.currency}
            </span>
          </div>
        ))}
      </section>

      <p className="py-5 text-caption text-ink-muted">{home.rateNote}</p>

      {/* Photographic strip */}
      <section className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-4">
        {stripImages.map((src) => (
          <Photo key={src} src={src} />
        ))}
      </section>
      <p className="pt-4 text-caption text-ink-muted">{home.stripNote}</p>

      {/* Close */}
      <section className="mt-14 flex flex-col items-start justify-between gap-8 rule-t py-14 sm:flex-row sm:items-center">
        <h2 className="max-w-[14ch] text-headline font-serif text-ink">{home.ctaTitle}</h2>
        <Link
          href="/quiz"
          className="border border-sand px-10 py-4 text-label uppercase text-sand transition-colors hover:bg-sand hover:text-paper"
        >
          {home.ctaButton}
        </Link>
      </section>
    </main>
  );
}
