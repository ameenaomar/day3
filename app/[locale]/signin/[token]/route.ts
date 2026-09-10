import { type NextRequest, NextResponse } from "next/server";
import { hashToken } from "@/lib/auth-tokens";
import { prisma } from "@/lib/db";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { magicLinkState, safeRedirect } from "@/lib/magic-link";
import { startSession } from "@/lib/session";

/**
 * Where a magic link lands. A route handler rather than a page, because
 * signing somebody in means writing a cookie, and a rendered page may not.
 *
 * Spending a link is a single conditional update: `usedAt` is set only if it
 * is still null, so two clicks — a mail client prefetching, then the customer
 * tapping — cannot both open a session.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string; token: string }> },
) {
  const { locale: rawLocale, token } = await context.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const seeOther = (path: string) =>
    new NextResponse(null, { status: 303, headers: { location: path, "cache-control": "no-store" } });
  const fail = (reason: "invalid" | "expired" | "used" | "error") =>
    seeOther(`/${locale}/signin?e=${reason}`);

  if (!token || token.length < 20) return fail("invalid");

  try {
    const link = await prisma.magicLinkToken.findUnique({
      where: { tokenHash: hashToken(token) },
      select: { id: true, customerId: true, expiresAt: true, usedAt: true, redirectTo: true },
    });
    if (!link) return fail("invalid");

    const state = magicLinkState(link);
    if (state !== "valid") return fail(state);

    // Claim it. If another request claimed it first, count is 0 and nobody
    // gets a second session out of one link.
    const claimed = await prisma.magicLinkToken.updateMany({
      where: { id: link.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (claimed.count === 0) return fail("used");

    await startSession(link.customerId, request.headers.get("user-agent"));
    await prisma.customer.update({
      where: { id: link.customerId },
      data: { lastSeenAt: new Date() },
    });

    return seeOther(safeRedirect(link.redirectTo, locale));
  } catch (error) {
    console.error("[signin] link exchange failed:", error instanceof Error ? error.name : "unknown error");
    return fail("error");
  }
}
