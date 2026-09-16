"use client";

import Link from "next/link";

import { CyclingWord } from "@/components/CyclingWord";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";
import { Marquee } from "@/components/Marquee";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { formatAmount, quoteFor } from "@/lib/pricing";
import { quizSteps } from "@/lib/quiz.config";
import { stripImages } from "@/lib/site.config";
import { t } from "@/lib/translations";

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

  // The cycling word runs on the quiz's own occasion options, so the promise
  // on the front page and the question inside the quiz can never drift apart.
  const occasionField = quizSteps
    .flatMap((step) => step.fields)
    .find((field) => field.key === "occasion");
  const occasions = (occasionField?.options ?? [])
    .map((id) => copy.quiz.options.occasion?.[id]?.label)
    .filter((label): label is string => typeof label === "string");

  return (
    <main>
      <div className="mx-auto max-w-6xl px-gutter">
        <header className="flex items-center justify-between rule-b py-7">
          <Label>{copy.meta.title}</Label>
          <span className="hidden text-label uppercase text-sand sm:inline">{home.location}</span>
          <LanguageToggle />
        </header>

        {/* Lead. The wordmark, then a line that names what the service is for —
            cycling through the occasions the quiz asks about. */}
        <section className="py-16 sm:py-20">
          <h1 className="text-display font-serif text-ink">
            {home.headlineTop}
            <br />
            {home.headlineBottom}
          </h1>
          <p className="mt-8 font-serif text-headline text-ink-muted">
            {home.headlineLead}{" "}
            {occasions.length > 0 ? <CyclingWord words={occasions} /> : null}
          </p>
          <div className="mt-12 grid grid-cols-1 items-end gap-10 sm:grid-cols-[1.1fr_0.9fr] sm:gap-16">
            <p className="max-w-prose text-body text-ink-muted">{home.lede}</p>
            <ul className="text-label uppercase leading-loose text-ink-muted sm:text-end">
              {home.meta.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Ticker — runs the full width, against the reading direction. */}
      <Marquee items={home.marquee} />

      <div className="mx-auto max-w-6xl px-gutter">
        {/* Three numbered columns, each with its index set huge behind it. */}
        <section className="grid grid-cols-1 rule-b sm:grid-cols-3">
          {home.sections.map((section, i) => (
            <Reveal
              key={section.n}
              delay={i * 110}
              className={`relative py-12 sm:pe-8 ${i > 0 ? "rule-t sm:rule-t-none sm:rule-s sm:ps-8" : ""}`}
            >
              <span
                aria-hidden="true"
                className="ghost-numeral absolute -top-2 font-serif"
              >
                {section.n}
              </span>
              <div className="relative">
                <span className="text-label uppercase text-sand">{section.n}</span>
                <h2 className="mt-4 text-title font-serif text-ink">{section.title}</h2>
                <p className="mt-3 text-caption leading-relaxed text-ink-muted">{section.body}</p>
              </div>
            </Reveal>
          ))}
        </section>

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

        {/* Strip — duotoned at rest, full colour on hover or focus. */}
        <Reveal>
          <section className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-4">
            {stripImages.map((src, i) => (
              <Photo key={src} src={src} caption={home.stripCaptions[i] ?? ""} />
            ))}
          </section>
        </Reveal>
        <p className="pt-4 text-caption text-ink-muted">{home.stripNote}</p>

        <section className="mt-14 flex flex-col items-start justify-between gap-8 rule-t py-14 sm:flex-row sm:items-center">
          <h2 className="max-w-[14ch] text-headline font-serif text-ink">{home.ctaTitle}</h2>
          <Link
            href="/quiz"
            className="border border-sand px-10 py-4 text-label uppercase text-sand transition-colors hover:bg-sand hover:text-paper"
          >
            {home.ctaButton}
          </Link>
        </section>
      </div>
    </main>
  );
}
