/**
 * Every user-facing string in the site lives here. Components never contain
 * literal copy — they read from `t(locale)`.
 *
 * Only the strings the foundation renders are present so far. Section copy,
 * quiz copy and package copy arrive with their build steps.
 */

import { type Locale } from "@/lib/i18n";

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  /** The dinar's unit, written the way each language writes it. */
  currency: string;
  nav: {
    /** Accessible label on the language toggle. */
    switchLanguage: string;
    /** The name of the language being switched TO, shown in that language. */
    otherLanguageName: string;
  };
  foundation: {
    eyebrow: string;
    headline: string;
    standfirst: string;
    directionLabel: string;
    localeLabel: string;
    paletteLabel: string;
    typeLabel: string;
    ratesLabel: string;
    displayFaceNote: string;
    swatches: { paper: string; sand: string; dove: string; ink: string };
    modes: { online: string; inPerson: string };
    perOutfit: string;
  };
};

const en: Dictionary = {
  meta: {
    // PLACEHOLDER — tagline pending §14.
    title: "Simply Styled",
    description: "Personal styling, online worldwide and in person in Kuwait.",
  },
  currency: "KD",
  nav: {
    switchLanguage: "Switch language",
    otherLanguageName: "العربية",
  },
  foundation: {
    eyebrow: "Foundation",
    headline: "Simply Styled",
    standfirst:
      "Design tokens, fonts, and the language layer. Switch the language to confirm the page flips direction and typeface.",
    directionLabel: "Direction",
    localeLabel: "Language",
    paletteLabel: "Palette",
    typeLabel: "Type",
    ratesLabel: "Rates",
    displayFaceNote: "Display face — stand-in for Palmore",
    swatches: {
      paper: "Coconut Milk",
      sand: "Warm Sand",
      dove: "Dove Gray",
      ink: "Espresso",
    },
    modes: { online: "Online", inPerson: "In person" },
    perOutfit: "from, per outfit",
  },
};

const ar: Dictionary = {
  meta: {
    title: "سِمبلي ستايلد",
    description: "تنسيق أزياء شخصي، أونلاين حول العالم وحضورياً في الكويت.",
  },
  currency: "د.ك",
  nav: {
    switchLanguage: "تغيير اللغة",
    otherLanguageName: "English",
  },
  foundation: {
    eyebrow: "الأساس",
    headline: "سِمبلي ستايلد",
    standfirst:
      "الألوان والخطوط وطبقة اللغة. غيّر اللغة للتأكد من أن الصفحة تقلب الاتجاه ونوع الخط.",
    directionLabel: "الاتجاه",
    localeLabel: "اللغة",
    paletteLabel: "الألوان",
    typeLabel: "الخط",
    ratesLabel: "الأسعار",
    displayFaceNote: "خط العناوين — بديل مؤقت عن Palmore",
    swatches: {
      paper: "حليب جوز الهند",
      sand: "رمل دافئ",
      dove: "رمادي حمامي",
      ink: "إسبريسو",
    },
    modes: { online: "أونلاين", inPerson: "حضورياً" },
    perOutfit: "تبدأ من، لكل إطلالة",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}
