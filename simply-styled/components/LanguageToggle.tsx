"use client";

import { Languages } from "lucide-react";

import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/translations";

/**
 * The language switch. Flat, hairline-ruled, no fill — it reads as a mark in
 * the margin rather than a button.
 */
export function LanguageToggle() {
  const { locale, toggleLocale } = useLanguage();
  const copy = t(locale);

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={copy.nav.switchLanguage}
      className="inline-flex items-center gap-2 border border-rule px-4 py-2 text-caption text-ink-muted transition-colors hover:border-sand hover:text-sand"
    >
      <Languages aria-hidden="true" className="size-3.5" strokeWidth={1.25} />
      <span>{copy.nav.otherLanguageName}</span>
    </button>
  );
}
