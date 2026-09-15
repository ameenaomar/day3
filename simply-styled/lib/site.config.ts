/**
 * Business data — contact details, service rates, links.
 * No user-facing copy lives here; copy lives in lib/translations.ts.
 */

/** The two ways the service is delivered. */
export type ServiceMode = "online" | "inPerson";

/**
 * A rate band. `filsPerOutfit` applies to every outfit in the order once the
 * order reaches `minOutfits` — the more outfits, the lower the rate.
 *
 * Money is held as integer fils, never as a float. The Kuwaiti dinar divides
 * into 1000 fils, so 5 KD is 5000 fils, and 4.5 KD is 4500. Keeping it integer
 * means totals never drift the way 0.1 + 0.2 does.
 */
export type RateBand = {
  readonly minOutfits: number;
  readonly filsPerOutfit: number;
};

export const FILS_PER_DINAR = 1000;

/**
 * PROVISIONAL — the entry rates (5 KD online, 10 KD in person) are confirmed;
 * the volume bands below them are a first sketch and need your numbers before
 * launch. Edit the bands here and every price on the site follows.
 */
export const rates: Readonly<Record<ServiceMode, readonly RateBand[]>> = {
  online: [
    { minOutfits: 1, filsPerOutfit: 5000 }, // 5.000 KD — confirmed
    { minOutfits: 3, filsPerOutfit: 4500 }, // PROVISIONAL
    { minOutfits: 5, filsPerOutfit: 4000 }, // PROVISIONAL
    { minOutfits: 10, filsPerOutfit: 3500 }, // PROVISIONAL
  ],
  inPerson: [
    { minOutfits: 1, filsPerOutfit: 10000 }, // 10.000 KD — confirmed
    { minOutfits: 3, filsPerOutfit: 9000 }, // PROVISIONAL
    { minOutfits: 5, filsPerOutfit: 8000 }, // PROVISIONAL
    { minOutfits: 10, filsPerOutfit: 7000 }, // PROVISIONAL
  ],
} as const;

export type SiteConfig = {
  readonly url: string;
  readonly contact: {
    readonly email: string;
    /**
     * Digits only, in international form without a leading +, as wa.me wants
     * it. Kuwait is country code 965, so a local 5xxxxxxx becomes 9655xxxxxxx.
     */
    readonly whatsapp: string;
    readonly instagram: string;
  };
  readonly location: {
    readonly city: string;
    readonly countryCode: string;
    readonly timeZone: string;
    readonly currency: string;
  };
};

export const siteConfig: SiteConfig = {
  // PENDING: set once the domain is chosen — used for canonical URLs.
  url: "",
  contact: {
    email: "ameena.omar448@gmail.com",
    // PENDING: enquiries are handled over WhatsApp, so this is required before
    // any contact link can be built.
    whatsapp: "",
    // PENDING — optional.
    instagram: "",
  },
  location: {
    city: "Kuwait City",
    countryCode: "KW",
    timeZone: "Asia/Kuwait",
    currency: "KWD",
  },
};

/**
 * Wallpapers — full-bleed photographic bands with display type over them.
 *
 * Filenames are deliberately generic so a photograph can be swapped without
 * touching code. See public/images/README.md.
 */
export const wallpapers = {
  hero: "/images/wallpaper-hero.jpg",
  services: "/images/wallpaper-services.jpg",
} as const;
