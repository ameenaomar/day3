import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Arabic and English users must each be served their own page. Without
 * hreflang alternates a search engine picks one and buries the other, which is
 * exactly what "both indexable" rules out.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const base = siteUrl();

  return {
    metadataBase: new URL(base),
    title: "Simply Styled",
    description:
      locale === "ar" ? "مصمّم أزياء شخصي في الكويت." : "A personal stylist for Kuwait.",
    alternates: {
      canonical: `${base}/${isLocale(locale) ? locale : defaultLocale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}`])),
    },
  };
}

/**
 * <html> and <body> live in the root layout, so this one only validates the
 * locale segment and carries the per-locale metadata.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return children;
}
