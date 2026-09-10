import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { authCopy } from "@/lib/i18n/auth";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Where sign-up lands while email confirmation is on. It deliberately says
 * nothing about whether the address was new — the same screen shows for an
 * address that already has an account, so the form cannot be used to find out
 * who is registered.
 */
export default async function CheckEmailPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const t = authCopy(locale);

  return (
    <AuthShell locale={locale} title={t("checkEmailTitle")} lede={t("checkEmailBody")}>
      <a href={`/${locale}/signin`}>
        <Button variant="secondary" className="w-full">
          {t("checkEmailBackToSignIn")}
        </Button>
      </a>
    </AuthShell>
  );
}
