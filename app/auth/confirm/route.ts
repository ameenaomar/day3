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

  // The locale for the failure page comes from the target path, so an Arabic
  // customer whose link expired reads Arabic.
  const segment = (next ?? "").split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const failure = new URL(`/${locale}/signin?error=link`, origin);

  if (!isSupabaseConfigured()) return NextResponse.redirect(failure);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") ?? "";
  const code = searchParams.get("code");

  const supabase = await createSupabaseServerClient();

  if (tokenHash && isOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) return NextResponse.redirect(failure);
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(failure);
  } else {
    return NextResponse.redirect(failure);
  }

  return NextResponse.redirect(new URL(next ?? `/${locale}/account`, origin));
}
