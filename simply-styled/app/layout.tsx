import type { Metadata } from "next";
import { Italiana, Inter, Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";

import { LanguageProvider, LanguageScript } from "@/components/LanguageProvider";
import { DEFAULT_LOCALE, dirFor } from "@/lib/i18n";
import { t } from "@/lib/translations";

import "./globals.css";

/* Latin display — STAND-IN for Palmore, which is licensed through Envato and
   so cannot be fetched here. Italiana is the nearest free face: condensed caps,
   large circular O and C, fine high-contrast strokes, deco flavour — the same
   qualities Palmore is built on, at a lighter weight. Once the licensed Palmore
   files are in public/fonts, the @font-face in globals.css takes over and this
   becomes the fallback. See public/fonts/README.md. */
const displayLatin = Italiana({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display-latin",
  display: "swap",
});

/* Latin body — quiet grotesque, only ever used small. */
const bodyLatin = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body-latin",
  display: "swap",
});

/* Arabic display — classical Naskh, the counterpart to the Latin serif. */
const displayArabic = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-display-arabic",
  display: "swap",
});

/* Arabic body. */
const bodyArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500"],
  variable: "--font-body-arabic",
  display: "swap",
});

const copy = t(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

const fontVariables = [
  displayLatin.variable,
  bodyLatin.variable,
  displayArabic.variable,
  bodyArabic.variable,
].join(" ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // lang/dir are the server's default; LanguageScript corrects them from the
  // persisted choice before paint, hence suppressHydrationWarning.
  return (
    <html
      lang={DEFAULT_LOCALE}
      dir={dirFor(DEFAULT_LOCALE)}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <LanguageScript />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
