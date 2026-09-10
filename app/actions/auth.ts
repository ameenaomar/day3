"use server";

import { redirect } from "next/navigation";
import { authCopy } from "@/lib/i18n/auth";
import {
  checkSignIn,
  checkSignUp,
  hasErrors,
  normaliseName,
  type AuthField,
  type FieldErrors,
} from "@/lib/auth/rules";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site";

/**
 * Sign-up, sign-in and sign-out.
 *
 * These are Server Actions rather than a client-side call to Supabase for two
 * reasons. The password only ever travels in a POST to our own origin, and the
 * session comes back as `httpOnly` cookies, so no script on the page can read
 * the access token. It also means the forms work with JavaScript switched off.
 */

export type { AuthField } from "@/lib/auth/rules";

export interface AuthFormState {
  /** Form-level message, already in the viewer's language. */
  error?: string;
  fieldErrors?: Partial<Record<AuthField, string>>;
  /** Echoed back so a failed submit does not empty the form. Never the password. */
  values?: { name?: string; email?: string };
}

function localeFrom(formData: FormData): Locale {
  const raw = String(formData.get("locale") ?? "");
  return isLocale(raw) ? raw : defaultLocale;
}

/**
 * Only ever redirect inside this site, and only into the locale the form was
 * submitted in — an open redirect on a sign-in form is a phishing primitive.
 */
function safeNext(formData: FormData, locale: Locale): string {
  const raw = String(formData.get("next") ?? "");
  if (raw.startsWith(`/${locale}/`) || raw === `/${locale}`) return raw;
  return `/${locale}/account`;
}

/**
 * Supabase reports failures by a stable `code`; the human message is ours, in
 * the viewer's language. Anything unrecognised becomes the generic message
 * rather than leaking an English string from the auth server into an Arabic
 * page.
 */
function messageFor(code: string | undefined, status: number | undefined, t: ReturnType<typeof authCopy>): string {
  switch (code) {
    case "invalid_credentials":
      return t("errCredentials");
    case "email_not_confirmed":
      return t("errEmailNotConfirmed");
    case "user_already_exists":
    case "email_exists":
      return t("errEmailTaken");
    case "weak_password":
      return t("errWeakPassword");
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return t("errRateLimited");
    default:
      // 429 without a code still means "slow down", and saying so is more use
      // than "something went wrong".
      return status === 429 ? t("errRateLimited") : t("errGeneric");
  }
}

/** Phrase keys from the shared rules become sentences in the viewer's language. */
function translate(errors: FieldErrors, t: ReturnType<typeof authCopy>): AuthFormState["fieldErrors"] {
  const out: Partial<Record<AuthField, string>> = {};
  for (const [field, key] of Object.entries(errors)) {
    out[field as AuthField] = t(key);
  }
  return out;
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const locale = localeFrom(formData);
  const t = authCopy(locale);

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const values = { email };

  if (!isSupabaseConfigured()) return { error: t("errNotConfigured"), values };

  const problems = checkSignIn({ email, password });
  if (hasErrors(problems)) return { fieldErrors: translate(problems, t), values };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase(),
    password,
  });

  if (error) return { error: messageFor(error.code, error.status, t), values };

  redirect(safeNext(formData, locale));
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const locale = localeFrom(formData);
  const t = authCopy(locale);

  const name = normaliseName(String(formData.get("name") ?? ""));
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const values = { name, email };

  if (!isSupabaseConfigured()) return { error: t("errNotConfigured"), values };

  const problems = checkSignUp({ name, email, password, passwordConfirm });
  if (hasErrors(problems)) return { fieldErrors: translate(problems, t), values };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase(),
    password,
    options: {
      // Read by the on_auth_user_created trigger, which creates the Customer
      // row inside the signup transaction.
      data: { name, locale },
      emailRedirectTo: `${siteUrl()}/auth/confirm?next=${encodeURIComponent(`/${locale}/account`)}`,
    },
  });

  if (error) return { error: messageFor(error.code, error.status, t), values };

  // Email confirmation off: signUp returns a session and the customer is in.
  if (data.session) redirect(`/${locale}/account`);

  // Email confirmation on: no session yet. An address that is already taken
  // lands here too, with `identities: []` — Supabase declines to say which,
  // and neither do we, because "that email exists" is an account-enumeration
  // oracle on a public form.
  redirect(`/${locale}/signup/check-email`);
}

export async function signOut(formData: FormData): Promise<never> {
  const locale = localeFrom(formData);

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect(`/${locale}/signin`);
}
