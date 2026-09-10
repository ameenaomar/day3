import type { ReactNode } from "react";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { authCopy } from "@/lib/i18n/auth";
import type { Locale } from "@/lib/i18n/config";

/**
 * The frame every account screen sits in: the wordmark, the language switch and
 * the theme toggle above one panel. Same fascia as the rest of the machine.
 */
export function AuthShell({
  locale,
  title,
  lede,
  children,
  footer,
}: {
  locale: Locale;
  title: string;
  lede?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const t = authCopy(locale);

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center gap-5 p-4">
      <header className="flex items-start justify-between gap-3">
        <a href={`/${locale}`} className="wordmark text-2xl leading-none">
          Simply Styled
        </a>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitch locale={locale} />
          <ThemeToggle label="THEME" />
        </div>
      </header>

      <section className="border border-rule bg-panel p-4 shadow-[var(--shadow-hard)]">
        <p className="text-xs text-dim ui-caps">{t("eyebrow")}</p>
        <h1 className="mt-2 font-display text-2xl leading-tight">
          <span aria-hidden="true" className="text-green">
            {">"}{" "}
          </span>
          {title}
        </h1>
        {lede ? <p className="mt-3 text-sm text-brown-soft">{lede}</p> : null}
        <div className="mt-5">{children}</div>
      </section>

      {footer ? <div className="text-sm text-brown-soft">{footer}</div> : null}
    </main>
  );
}
