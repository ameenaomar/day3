import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SignUpForm } from "@/components/ui/SignUpForm";
import { dirFor, isLocale, locales, otherLocale, type Locale } from "@/lib/i18n/config";
import { SIGNUP, t } from "@/lib/i18n/signup";
import { siteUrl } from "@/lib/site";
import "./signup.css";

/**
 * Sign-up. The first screen of the prototype asks for a name and an email but
 * keeps them in the browser; this page is the real thing — it creates the
 * Customer row, issues a single-use sign-in link, and records the marketing
 * consent that the front page promises to honour.
 *
 * Styled in the Swiss system the product now uses, scoped in signup.css so it
 * cannot disturb the scaffold pages still running the old palette.
 */

type Params = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const base = siteUrl();
  const title = locale === "ar" ? "التسجيل · SIMPLY STYLED" : "Sign up · SIMPLY STYLED";

  return {
    title,
    description: t(SIGNUP.lede, locale),
    alternates: {
      canonical: `${base}/${locale}/signup`,
      languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}/signup`])),
    },
    openGraph: { title, description: t(SIGNUP.lede, locale), url: `${base}/${locale}/signup` },
  };
}

export default async function SignUpPage({ params }: Params) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const other = otherLocale(locale);

  return (
    <div className="swiss" dir={dirFor(locale)}>
      {/* Inter, the grotesque the prototype uses, so both pages read as one
          product. The Arabic face is self-hosted and already preloaded. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
      />

      <div className="swiss-shell">
        <header className="swiss-mast">
          <a className="swiss-brand" href="/">
            SIMPLY STYLED<i aria-hidden="true">.</i>
          </a>
          <a className="swiss-tool" href={`/${other}/signup`} lang={other} hrefLang={other}>
            {other === "ar" ? "العربية" : "English"}
          </a>
        </header>

        <div className="swiss-sheet">
          <div className="swiss-rail">
            <span className="swiss-mark" aria-hidden="true" />
            <p className="swiss-railtag">{t(SIGNUP.tag, locale)}</p>
            <p className="swiss-railnote">{t(SIGNUP.railNote, locale)}</p>
          </div>

          <main>
            <SignUpForm locale={locale} />
            <p className="swiss-note">
              <a className="swiss-link" href="/">
                {t(SIGNUP.backToFlow, locale)}
              </a>
            </p>
          </main>
        </div>

        <footer className="swiss-foot">
          <span>{locale === "ar" ? "نموذج للتجربة" : "Prototype for testing"}</span>
          <span>{locale === "ar" ? "الكويت" : "KUWAIT"}</span>
        </footer>
      </div>
    </div>
  );
}
