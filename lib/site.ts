/**
 * The site's own origin, for metadata, sitemap and magic links.
 *
 * APP_URL wins, so a custom domain can be set explicitly. Otherwise fall back
 * to the URL Vercel injects, which is right for preview deployments, and then
 * to localhost for development.
 */
export function siteUrl(): string {
  const configured = process.env.APP_URL;
  if (configured) return configured.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
