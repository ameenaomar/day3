import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Where the confirmation email lands.
 *
 * Supabase sends one of two shapes depending on the project's email template:
 * a `token_hash` to verify, or a PKCE `code` to exchange. Both are handled, so
 * the link works whichever template the project is on.
 *
 * This route is outside the locale prefix and excluded from the proxy's
 * redirect, because the address is baked into an email that may be opened weeks
 * later — it must not depend on the reader's cookie.
 */
const OTP_TYPES: readonly EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

function isOtpType(value: string): value is EmailOtpType {
  return (OTP_TYPES as readonly string[]).includes(value);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;

  const rawNext = searchParams.get("next") ?? "";
  // Same-site only. `//host` is a protocol-relative URL, not a path.
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : null;

  // The locale is carried on the link, so an Arabic customer whose link
  // expired reads the reason in Arabic. Falls back to the target path's own
  // prefix, then to the default.
  const carried = searchParams.get("locale") ?? "";
  const segment = (next ?? "").split("/")[1] ?? "";
  const locale = isLocale(carried) ? carried : isLocale(segment) ? segment : defaultLocale;

  /** `?e=` is the convention the sign-in page already renders. */
  const failure = (reason: "invalid" | "expired" | "error") =>
    NextResponse.redirect(new URL(`/${locale}/signin?e=${reason}`, origin));

  if (!isSupabaseConfigured()) return failure("error");

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") ?? "";
  const code = searchParams.get("code");

  const supabase = await createSupabaseServerClient();

  if (tokenHash && isOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) return failure(error.code === "otp_expired" ? "expired" : "invalid");
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return failure(error.code === "otp_expired" ? "expired" : "invalid");
  } else {
    // No token and no code: not a link we issued.
    return failure("invalid");
  }

  // Verified, and that call created the session — so this lands on a page that
  // already knows who they are.
  return NextResponse.redirect(new URL(next ?? "/", origin));
}
