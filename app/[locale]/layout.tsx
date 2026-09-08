import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { dirFor, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { THEME_COOKIE, isTheme } from "@/lib/theme";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * The display face and the body face for each locale. Arabic pages never
 * download the latin mono body face, and English pages never download the
 * Arabic one — 88KB that a phone on a bad connection should not be paying for.
 */
const PRELOAD: Record<Locale, readonly string[]> = {
  en: ["/fonts/vt323-400.woff2", "/fonts/plex-mono-400.woff2"],
  ar: ["/fonts/vt323-400.woff2", "/fonts/plex-arabic-400.woff2"],
};

export const metadata: Metadata = {
  title: "Simply Styled",
  description: "A personal stylist for Kuwait.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Read the theme server-side so the first paint is the right machine.
  const store = await cookies();
  const cookieTheme = store.get(THEME_COOKIE)?.value;
  const theme = cookieTheme && isTheme(cookieTheme) ? cookieTheme : undefined;

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      data-theme={theme}
    >
      <head>
        {/* Only the faces this locale actually renders. */}
        {PRELOAD[locale].map((href) => (
          <link key={href} rel="preload" as="font" type="font/woff2" href={href} crossOrigin="anonymous" />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
