import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { SignInForm } from "@/components/ui/SignInForm";
import { dirFor, isLocale, locales, otherLocale, type Locale } from "@/lib/i18n/config";
import { SIGNIN, SIGNUP, t } from "@/lib/i18n/signup";
import { currentUser } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site";
import "../signup/signup.css";

/**
 * Sign-in: email and password, or a reason the last confirmation link did not
 * work.
 *
 * `?e=` says what happened to a link /auth/confirm refused — expired, already
 * used, not ours — because "that did not work" is not an answer anybody can
 * act on.
 */

type Params = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ e?: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const base = siteUrl();
  const title = locale === "ar" ? "الدخول · SIMPLY STYLED" : "Sign in · SIMPLY STYLED";

  return {
    title,
    description: t(SIGNIN.lede, locale),
    alternates: {
      canonical: `${base}/${locale}/signin`,
      languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}/signin`])),
    },
  };
}

const PROBLEM = {
  invalid: SIGNIN.eInvalid,
  expired: SIGNIN.eExpired,
  used: SIGNIN.eUsed,
  error: SIGNIN.eError,
  signedout: SIGNIN.eSignedOut,
} as const;

function isProblem(value: string | undefined): value is keyof typeof PROBLEM {
  return value !== undefined && value in PROBLEM;
}

export default async function SignInPage({ params, searchParams }: Params) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const other = otherLocale(locale);
  const { e } = await searchParams;
  const user = await currentUser();
  const signedInName = (user?.user_metadata?.name as string | undefined) ?? user?.email ?? "";

  return (
    <div className="swiss" dir={dirFor(locale)}>
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
          <a className="swiss-tool" href={`/${other}/signin`} lang={other} hrefLang={other}>
            {other === "ar" ? "العربية" : "English"}
          </a>
        </header>

        <div className="swiss-sheet">
          <div className="swiss-rail">
            <span className="swiss-mark" aria-hidden="true" />
            <p className="swiss-railtag">{t(SIGNIN.tag, locale)}</p>
            <p className="swiss-railnote">{t(SIGNIN.railNote, locale)}</p>
          </div>

          <main>
            {isProblem(e) ? (
              <p className="swiss-err" role="status">
                {t(PROBLEM[e], locale)}
              </p>
            ) : null}

            {user ? (
              /* Already signed in: say so rather than asking again. */
              <div>
                <p className="swiss-stamp">
                  <i aria-hidden="true">✓</i>
                  {t(SIGNIN.signedInAs, locale)}
                </p>
                <h1 className="swiss-display">{signedInName}</h1>
                <p className="swiss-mail">{user.email}</p>
                <div className="swiss-actions">
                  <a className="swiss-btn" href="/">
                    {t(SIGNUP.backToFlow, locale)}
                  </a>
                  <form action={signOut}>
                    <input type="hidden" name="locale" value={locale} />
                    <button className="swiss-link" type="submit">
                      {t(SIGNIN.signOut, locale)}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <>
                <SignInForm locale={locale} />
                <p className="swiss-note">
                  <a className="swiss-link" href="/">
                    {t(SIGNIN.backToFlow, locale)}
                  </a>
                </p>
              </>
            )}
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
