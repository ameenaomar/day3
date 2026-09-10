"use server";

import { cookies } from "next/headers";
import { newMagicToken } from "@/lib/auth-tokens";
import { databaseIsConfigured, prisma } from "@/lib/db";
import { sendMagicLink } from "@/lib/email";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/site";
import { TOKEN_TTL_MINUTES, signUpFromFormData, type SignUpErrorCode, type SignUpField } from "@/lib/signup";

/**
 * Creating an account is one server action, and it is deliberately boring:
 *
 *  - The same answer comes back whether the email was already on file or not.
 *    "That email is taken" on a styling service tells a stranger who its
 *    customers are.
 *  - Nothing is a password. The customer gets a single-use link, and only its
 *    hash is stored.
 *  - Asking again just re-sends; after three unused links in ten minutes it
 *    quietly stops, so the form cannot be turned into a mail cannon.
 */

export type SignUpState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<SignUpField, SignUpErrorCode>> }
  /** The customer exists and a link is on its way. */
  | { status: "sent"; email: string; devLink?: string }
  | { status: "failed"; reason: "not_configured" | "no_database" | "unavailable" };

const THROTTLE_WINDOW_MINUTES = 10;
const THROTTLE_MAX_LINKS = 3;

export async function signUp(_previous: SignUpState, form: FormData): Promise<SignUpState> {
  const parsed = signUpFromFormData(form);
  if (!parsed.ok) return { status: "invalid", errors: parsed.errors };

  const { name, email, phone, marketingOptIn, locale } = parsed.values;

  // Told apart from a failure on purpose: an unconfigured deployment is not a
  // transient error, and "try again in a moment" would be a lie.
  if (!databaseIsConfigured()) return { status: "failed", reason: "no_database" };

  try {
    // The customer record. A returning email updates rather than duplicates,
    // which is what makes "the same email loads your saved measurements" true.
    const customer = await prisma.customer.upsert({
      where: { email },
      create: {
        name,
        email,
        phoneE164: phone,
        locale: locale as Locale,
        marketingOptIn,
        marketingOptInAt: marketingOptIn ? new Date() : null,
      },
      update: {
        name,
        locale: locale as Locale,
        lastSeenAt: new Date(),
        // Never blank a saved number with an empty field.
        ...(phone ? { phoneE164: phone } : {}),
        // Consent is only ever granted here, never withdrawn by omission —
        // unticking the box on a later visit is not how you opt out.
        ...(marketingOptIn ? { marketingOptIn: true, marketingOptInAt: new Date() } : {}),
      },
      select: { id: true, name: true },
    });

    const since = new Date(Date.now() - THROTTLE_WINDOW_MINUTES * 60_000);
    const recent = await prisma.magicLinkToken.count({
      where: { customerId: customer.id, usedAt: null, createdAt: { gt: since } },
    });
    if (recent >= THROTTLE_MAX_LINKS) {
      // Same answer as success: a throttle that announces itself is a probe.
      return { status: "sent", email };
    }

    const { token, tokenHash } = newMagicToken();
    await prisma.magicLinkToken.create({
      data: {
        customerId: customer.id,
        tokenHash,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000),
        redirectTo: `/${locale}`,
      },
    });

    // Remember the language they signed up in, so the link lands in it.
    const store = await cookies();
    store.set(LOCALE_COOKIE, locale, { maxAge: 60 * 60 * 24 * 365, sameSite: "lax", path: "/" });

    const url = `${siteUrl()}/${locale}/signin/${token}`;
    const sent = await sendMagicLink({ to: email, url, name: customer.name, locale: locale as Locale });

    if (sent.delivered) return { status: "sent", email };
    if ("devLink" in sent) return { status: "sent", email, devLink: sent.devLink };
    return { status: "failed", reason: "not_configured" };
  } catch (error) {
    // Never the error itself: a Prisma error quotes the row back, and these
    // rows carry names, emails and phone numbers.
    console.error("[signup] failed:", error instanceof Error ? error.name : "unknown error");
    return { status: "failed", reason: "unavailable" };
  }
}
