import { cookies } from "next/headers";
import { hashToken, newMagicToken } from "@/lib/auth-tokens";
import { prisma } from "@/lib/db";
import { SESSION_TTL_DAYS, sessionExpiry, sessionIsLive } from "@/lib/magic-link";

/**
 * Sessions. The cookie carries a random token; the database stores only its
 * hash, exactly like the magic links — so the same dump that cannot be
 * replayed into an account cannot be replayed into a session either.
 *
 * Reads are safe anywhere. Writes touch cookies, so they belong in a server
 * action or a route handler, never in a rendered page.
 */

export const SESSION_COOKIE = "ss_session";

export type SignedInCustomer = {
  id: string;
  name: string;
  email: string;
};

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  };
}

/** Issues a session for a customer and sets the cookie. Route handlers only. */
export async function startSession(customerId: string, userAgent?: string | null): Promise<void> {
  const { token, tokenHash } = newMagicToken();
  const expiresAt = sessionExpiry();

  await prisma.session.create({
    data: {
      customerId,
      tokenHash,
      expiresAt,
      // Truncated: enough to tell a phone from a laptop, not a fingerprint.
      userAgent: userAgent ? userAgent.slice(0, 180) : null,
    },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, cookieOptions(expiresAt));
}

/** Who is signed in, or null. Safe to call while rendering. */
export async function currentCustomer(): Promise<SignedInCustomer | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { tokenHash: hashToken(token) },
      select: {
        expiresAt: true,
        customer: { select: { id: true, name: true, email: true } },
      },
    });
    if (!session || !sessionIsLive(session.expiresAt)) return null;
    return session.customer;
  } catch (error) {
    // A database that is down must not take the whole page with it: the
    // viewer is simply treated as signed out.
    console.error("[session] lookup failed:", error instanceof Error ? error.name : "unknown error");
    return null;
  }
}

/** Drops the session row and the cookie. Server actions and routes only. */
export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  store.delete(SESSION_COOKIE);
  if (!token) return;

  try {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  } catch (error) {
    // The cookie is already gone, so the viewer is signed out either way.
    console.error("[session] delete failed:", error instanceof Error ? error.name : "unknown error");
  }
}
