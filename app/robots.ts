import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Rendered per request rather than prerendered: these are prerendered by
// default, which bakes the build-time origin in, and a stale or localhost URL
// in a live robots.txt or sitemap is an SEO problem that is easy to miss.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The stylist's tool and the design check are not for search engines.
      // /admin also carries an X-Robots-Tag header, since robots.txt is a
      // request and not an enforcement.
      disallow: ["/admin", "/en/design", "/ar/design"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
