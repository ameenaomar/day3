"use client";

import { Languages } from "lucide-react";

import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/translations";

type LanguageToggleProps = {
  /**
   * "ink" on the paper ground; "paper" when it sits over a wallpaper, where
   * ink-coloured chrome would disappear into the scrim.
   */
  tone?: "ink" | "paper";
};

/**
 * The language switch. Flat, hairline-ruled, no fill — it reads as a mark in
 * the margin rather than a button.
 */
export function LanguageToggle({ tone = "ink" }: LanguageToggleProps) {
  const { locale, toggleLocale } = useLanguage();
  const copy = t(locale);

  const tones =
    tone === "paper"
      ? "border-paper/45 text-paper hover:border-paper hover:text-paper"
      : "border-rule text-ink-muted hover:border-ink hover:text-ink";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={copy.nav.switchLanguage}
      className={`inline-flex items-center gap-2 border px-4 py-2 text-caption transition-colors ${tones}`}
    >
      <Languages aria-hidden="true" className="size-3.5" strokeWidth={1.25} />
      <span>{copy.nav.otherLanguageName}</span>
    </button>
  );
}
