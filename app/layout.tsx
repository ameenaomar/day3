import { cookies, headers } from "next/headers";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { defaultLocale, dirFor, isLocale, type Locale } from "@/lib/i18n/config";
import { THEME_COOKIE, isTheme } from "@/lib/theme";

/**
 * The root layout owns <html>, so that a 404 — which Next renders against the
 * root, not against a nested segment — still arrives server-rendered, styled,
 * and with the right lang and dir.
 *
 * The locale comes off the pathname header the proxy sets, because a root
 * layout has no params. Nothing is lost by reading headers here: this layout
 * already reads the theme cookie, so it was never static.
 */

/**
 * The display face and the body face for each locale. An Arabic page never
 * downloads the latin mono body face, and an English page never downloads the
 * Arabic one.
 */
const PRELOAD: Record<Locale, readonly string[]> = {
  en: ["/fonts/vt323-400.woff2", "/fonts/plex-mono-400.woff2"],
  ar: ["/fonts/vt323-400.woff2", "/fonts/plex-arabic-400.woff2"],
};

export async function localeFromHeaders(): Promise<Locale> {
  const headerList = await headers();
  const first = (headerList.get("x-ss-pathname") ?? "").split("/")[1] ?? "";
  return isLocale(first) ? first : defaultLocale;
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await localeFromHeaders();

  // Read the theme server-side so the first paint is the right machine.
  const store = await cookies();
  const cookieTheme = store.get(THEME_COOKIE)?.value;
  const theme = cookieTheme && isTheme(cookieTheme) ? cookieTheme : undefined;

  return (
    <html lang={locale} dir={dirFor(locale)} data-theme={theme}>
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
