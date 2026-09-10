import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { signUp } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth/AuthShell";
import { CredentialsForm } from "@/components/auth/CredentialsForm";
import { authCopy } from "@/lib/i18n/auth";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SignUpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const t = authCopy(locale);

  if (await currentUser()) redirect(`/${locale}/account`);

  return (
    <AuthShell
      locale={locale}
      title={t("signUpTitle")}
      lede={t("signUpLede")}
      footer={
        <p>
          {t("signUpHaveAccount")}{" "}
          <a
            className="text-brown underline decoration-dotted underline-offset-4"
            href={`/${locale}/signin`}
          >
            {t("signUpSignIn")}
          </a>
        </p>
      }
    >
      {isSupabaseConfigured() ? (
        <CredentialsForm mode="signup" locale={locale} action={signUp} />
      ) : (
        <p className="border border-red bg-well px-3 py-2 text-sm text-red">! {t("errNotConfigured")}</p>
      )}
    </AuthShell>
  );
}
