/**
 * Business data — contact details, packages, prices, social links.
 * No copy lives here; copy lives in lib/translations.ts.
 *
 * PLACEHOLDER: every value below is pending §14 of the spec. The shapes are
 * provisional and will be confirmed against §14 before any of it is rendered.
 */

export type SiteConfig = {
  /** Base of the canonical URL, no trailing slash. */
  url: string;
  contact: {
    email: string;
    /** E.164, for tel: and wa.me links. */
    phone: string;
    instagram: string;
    whatsapp: string;
  };
  location: {
    city: string;
    countryCode: string;
    /** IANA zone, for any scheduling copy. */
    timeZone: string;
  };
};

export const siteConfig: SiteConfig = {
  url: "",
  contact: {
    email: "",
    phone: "",
    instagram: "",
    whatsapp: "",
  },
  location: {
    city: "Kuwait City",
    countryCode: "KW",
    timeZone: "Asia/Kuwait",
  },
};

/** Packages and prices — pending §14. */
export const packages: readonly never[] = [];
