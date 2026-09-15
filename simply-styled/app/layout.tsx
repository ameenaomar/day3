import type { Metadata } from "next";
import { Yeseva_One, Inter, Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";

import { LanguageProvider, LanguageScript } from "@/components/LanguageProvider";
import { DEFAULT_LOCALE, dirFor } from "@/lib/i18n";
import { t } from "@/lib/translations";

import "./globals.css";

/* Latin display — STAND-IN for Palmore, which is licensed through Envato and
   so cannot be fetched here. Yeseva One: vintage, flared, high-contrast, with
   the weight and presence to carry a headline. Chosen for its solidity rather
   than for matching Palmore's condensed width. Once the licensed Palmore files
   are in public/fonts, the @font-face in globals.css takes over and this
   becomes the fallback. See public/fonts/README.md. */
const displayLatin = Yeseva_One({
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
        {/* Duotone filter for photography. Maps luminance onto a ramp from
            Espresso (shadows) to Coconut Milk (highlights), so every shot sits
            in the palette whatever ground it was photographed on. Values are
            the two colours' channels as 0–1. */}
        <svg aria-hidden="true" focusable="false" className="absolute size-0">
          <filter id="ss-duotone" colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.2275 0.9412" />
              <feFuncG type="table" tableValues="0.1804 0.9137" />
              <feFuncB type="table" tableValues="0.1490 0.8667" />
            </feComponentTransfer>
          </filter>
        </svg>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
