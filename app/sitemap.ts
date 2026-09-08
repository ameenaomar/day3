import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/site";

// Rendered per request rather than prerendered: these are prerendered by
// default, which bakes the build-time origin in, and a stale or localhost URL
// in a live robots.txt or sitemap is an SEO problem that is easy to miss.
export const dynamic = "force-dynamic";

/**
 * Both locales are equals, so each entry declares the other as an alternate.
 * Without that a search engine picks one and buries the other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  return locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}`])),
    },
  }));
}
