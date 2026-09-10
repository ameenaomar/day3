"use server";

import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import {
  signInFromFormData,
  signUpFromFormData,
  type SignInField,
  type SignUpErrorCode,
  type SignUpField,
} from "@/lib/signup";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site";

/**
 * Sign-up and sign-in, on Supabase Auth.
 *
 * Server Actions rather than a client-side call to Supabase, for two reasons.
 * The password only ever travels in a POST to our own origin, and the session
 * comes back as httpOnly cookies, so no script on the page can read the access
 * token. It also means both forms still work with JavaScript switched off.
 *
 * What Supabase owns: the credential, the session, and the confirmation and
 * password-reset emails. What we own: the Customer row, created by the
 * `on_auth_user_created` trigger from the metadata sent here.
 */

/** Why a submit did not go through, apart from the fields themselves. */
export type AuthFailure =
  | "not_configured"
  | "credentials"
  | "email_not_confirmed"
  | "rate_limited"
  | "weak_password"
  | "unavailable";

export type SignUpState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<SignUpField, SignUpErrorCode>> }
  /** Confirmation is on: the account exists and a link is on its way. */
  | { status: "sent"; email: string }
  | { status: "failed"; reason: AuthFailure };

export type SignInState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<SignInField, SignUpErrorCode>> }
  | { status: "failed"; reason: AuthFailure };

/**
 * Supabase reports failures by a stable `code`. The wording shown to the
 * customer is ours, in their language, so nothing English from the auth server
 * can surface on an Arabic page.
 */
function failureFor(code: string | undefined, status: number | undefined): AuthFailure {
  switch (code) {
    case "invalid_credentials":
      return "credentials";
    case "email_not_confirmed":
      return "email_not_confirmed";
    case "weak_password":
      return "weak_password";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "rate_limited";
    default:
      // 429 without a code still means "slow down", and saying so is more use
      // than "something broke".
      return status === 429 ? "rate_limited" : "unavailable";
  }
}

function localeOf(raw: string | undefined): Locale {
  return raw && isLocale(raw) ? raw : "en";
}

export async function signUp(_previous: SignUpState, form: FormData): Promise<SignUpState> {
  const parsed = signUpFromFormData(form);
  if (!parsed.ok) return { status: "invalid", errors: parsed.errors };

  const { name, email, phone, password, marketingOptIn, locale } = parsed.values;

  // Told apart from a failure on purpose: an unconfigured deployment is not a
  // transient error, and "try again in a moment" would be a lie.
  if (!isSupabaseConfigured()) return { status: "failed", reason: "not_configured" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Read by the on_auth_user_created trigger, which writes the Customer
      // row inside the signup transaction — so a customer cannot exist
      // without one, and the page never makes a second, failable write.
      data: {
        name,
        locale,
        phone_e164: phone ?? null,
        marketing_opt_in: marketingOptIn,
      },
      // verifyOtp on a signup link creates the session, so the customer lands
      // on the front door already signed in rather than on a form.
      emailRedirectTo: `${siteUrl()}/auth/confirm?next=%2F&locale=${locale}`,
    },
  });

  if (error) return { status: "failed", reason: failureFor(error.code, error.status) };

  // Confirmation off: signUp returns a session and they are already in.
  if (data.session) redirect("/");

  // Confirmation on: no session until the link is opened. An address that
  // already has an account lands here too, with `identities: []` — Supabase
  // declines to say which, and neither do we, because "that email is taken" is
  // an account-enumeration oracle on a public form.
  return { status: "sent", email };
}

export async function signIn(_previous: SignInState, form: FormData): Promise<SignInState> {
  const parsed = signInFromFormData(form);
  if (!parsed.ok) return { status: "invalid", errors: parsed.errors };

  const { email, password } = parsed.values;

  if (!isSupabaseConfigured()) return { status: "failed", reason: "not_configured" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { status: "failed", reason: failureFor(error.code, error.status) };

  // The front door is the signed-in screen: it asks /api/me who this is and
  // picks the flow up where the customer left it.
  redirect("/");
}

export async function signOut(form: FormData): Promise<never> {
  const locale = localeOf(String(form.get("locale") ?? ""));

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    // Revokes the refresh token at Supabase and clears the cookies here, so
    // the tab and the auth server agree about who is signed in.
    await supabase.auth.signOut();
  }

  redirect(`/${locale}/signin?e=signedout`);
}
