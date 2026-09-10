"use server";

import { newMagicToken } from "@/lib/auth-tokens";
import { databaseIsConfigured, prisma } from "@/lib/db";
import { sendMagicLink } from "@/lib/email";
import type { Locale } from "@/lib/i18n/config";
import { endSession } from "@/lib/session";
import { siteUrl } from "@/lib/site";
import { TOKEN_TTL_MINUTES, parseSignUp, type SignUpErrorCode } from "@/lib/signup";
import { redirect } from "next/navigation";

/**
 * Signing in is signing up minus the name: an email, and a link in return.
 *
 * An address with no account gets the same "check your inbox" as one with —
 * the form must not become a way to ask whether somebody is a customer here.
 * Nothing is created for an unknown address; the reply is simply the same.
 */

export type SignInState =
  | { status: "idle" }
  | { status: "invalid"; error: SignUpErrorCode }
  | { status: "sent"; email: string; devLink?: string }
  | { status: "failed"; reason: "not_configured" | "no_database" | "unavailable" };

const THROTTLE_WINDOW_MINUTES = 10;
const THROTTLE_MAX_LINKS = 3;

export async function requestSignIn(_previous: SignInState, form: FormData): Promise<SignInState> {
  const rawLocale = form.get("locale");
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";

  // Reuse the sign-up validator with a placeholder name, so "what a valid
  // email is" has exactly one definition in this codebase.
  const parsed = parseSignUp({ name: "ok", email: form.get("email") ?? "", locale });
  if (!parsed.ok) {
    return { status: "invalid", error: parsed.errors.email ?? "email_invalid" };
  }
  const { email } = parsed.values;

  if (!databaseIsConfigured()) return { status: "failed", reason: "no_database" };

  try {
    const customer = await prisma.customer.findUnique({
      where: { email },
      select: { id: true, name: true },
    });

    // Unknown address: same answer, no row, no email.
    if (!customer) return { status: "sent", email };

    const since = new Date(Date.now() - THROTTLE_WINDOW_MINUTES * 60_000);
    const recent = await prisma.magicLinkToken.count({
      where: { customerId: customer.id, usedAt: null, createdAt: { gt: since } },
    });
    if (recent >= THROTTLE_MAX_LINKS) return { status: "sent", email };

    const { token, tokenHash } = newMagicToken();
    await prisma.magicLinkToken.create({
      data: {
        customerId: customer.id,
        tokenHash,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000),
        redirectTo: `/${locale}`,
      },
    });

    const url = `${siteUrl()}/${locale}/signin/${token}`;
    const sent = await sendMagicLink({ to: email, url, name: customer.name, locale });

    if (sent.delivered) return { status: "sent", email };
    if ("devLink" in sent) return { status: "sent", email, devLink: sent.devLink };
    return { status: "failed", reason: "not_configured" };
  } catch (error) {
    console.error("[signin] failed:", error instanceof Error ? error.name : "unknown error");
    return { status: "failed", reason: "unavailable" };
  }
}

export async function signOut(formData: FormData): Promise<void> {
  const rawLocale = formData.get("locale");
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";
  await endSession();
  redirect(`/${locale}/signin?e=signedout`);
}
