import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { signIn } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth/AuthShell";
import { CredentialsForm } from "@/components/auth/CredentialsForm";
import { authCopy } from "@/lib/i18n/auth";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";

/** An account screen has nothing a search engine should hold. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const t = authCopy(locale);

  const { next, error } = await searchParams;

  // Already signed in: the form would be a dead end.
  if (await currentUser()) redirect(`/${locale}/account`);

  const notice =
    error === "link" ? t("errLinkInvalid") : error === "required" ? t("errSignInRequired") : undefined;

  return (
    <AuthShell
      locale={locale}
      title={t("signInTitle")}
      lede={t("signInLede")}
      footer={
        <p>
          {t("signInNoAccount")}{" "}
          <a
            className="text-brown underline decoration-dotted underline-offset-4"
            href={`/${locale}/signup`}
          >
            {t("signInCreate")}
          </a>
        </p>
      }
    >
      {notice ? (
        <p role="alert" className="mb-4 border border-red bg-well px-3 py-2 text-sm text-red">
          ! {notice}
        </p>
      ) : null}

      {isSupabaseConfigured() ? (
        <CredentialsForm mode="signin" locale={locale} action={signIn} next={next} />
      ) : (
        <p className="border border-red bg-well px-3 py-2 text-sm text-red">! {t("errNotConfigured")}</p>
      )}
    </AuthShell>
  );
}
