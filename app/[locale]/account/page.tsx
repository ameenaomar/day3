import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { authCopy } from "@/lib/i18n/auth";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { createSupabaseServerClient, currentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** The customer row as row level security hands it back. */
interface CustomerRow {
  name: string | null;
  email: string | null;
  createdAt: string | null;
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const t = authCopy(locale);

  const user = await currentUser();
  if (!user) redirect(`/${locale}/signin?error=required&next=${encodeURIComponent(`/${locale}/account`)}`);

  // Read through the customer's own session, not a service key: the row comes
  // back because the "Customers read their own row" policy allows it, which is
  // the same check that will guard every profile and order read later.
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("Customer")
    .select("name, email, createdAt")
    .eq("authUserId", user.id)
    .maybeSingle<CustomerRow>();

  const name = data?.name?.trim() || (user.user_metadata?.name as string | undefined) || "";
  const firstName = name.split(/\s+/)[0] ?? "";
  const email = data?.email ?? user.email ?? "";
  const opened = data?.createdAt ?? user.created_at;

  return (
    <AuthShell
      locale={locale}
      title={firstName ? `${t("accountTitle")} — ${firstName}` : t("accountTitle")}
    >
      <dl className="flex flex-col gap-2 border border-rule bg-well p-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-dim">{t("accountGreeting")}</dt>
          <dd dir="ltr" className="text-end">
            {email}
          </dd>
        </div>
        {opened ? (
          <div className="flex justify-between gap-4">
            <dt className="text-dim">{t("accountMemberSince")}</dt>
            <dd>
              {new Intl.DateTimeFormat(locale === "ar" ? "ar-KW" : "en-GB", {
                dateStyle: "medium",
              }).format(new Date(opened))}
            </dd>
          </div>
        ) : null}
      </dl>

      {user.email_confirmed_at ? null : (
        <p className="mt-3 border border-red bg-well px-3 py-2 text-xs text-red">
          ! {t("accountEmailUnconfirmed")}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3">
        <a href={`/${locale}`}>
          <Button variant="primary" className="w-full">
            {t("accountStart")}
          </Button>
        </a>

        <form action={signOut}>
          <input type="hidden" name="locale" value={locale} />
          <Button type="submit" variant="secondary" className="w-full">
            {t("accountSignOut")}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
