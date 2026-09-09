/**
 * Whether a magic link may be spent, kept as a pure function so the rules are
 * testable without a database — and so "expired" and "already used" stay
 * different answers. They are different mistakes, and a customer staring at a
 * dead link deserves to know which one they made.
 */

export type MagicLinkRow = {
  expiresAt: Date;
  usedAt: Date | null;
};

export type MagicLinkState = "valid" | "used" | "expired";

export function magicLinkState(row: MagicLinkRow, now: Date = new Date()): MagicLinkState {
  if (row.usedAt) return "used";
  /** Exactly on the expiry second counts as expired: the boundary is not ours to lend. */
  if (row.expiresAt.getTime() <= now.getTime()) return "expired";
  return "valid";
}

/** How long a signed-in session lasts before the customer signs in again. */
export const SESSION_TTL_DAYS = 60;

export function sessionExpiry(from: Date = new Date()): Date {
  return new Date(from.getTime() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
}

/** A session row is only good while it is unexpired; there is no grace. */
export function sessionIsLive(expiresAt: Date, now: Date = new Date()): boolean {
  return expiresAt.getTime() > now.getTime();
}

/** Only the locale-relative paths this app owns are safe to land on. */
export function safeRedirect(target: string | null, locale: string): string {
  if (!target) return `/${locale}`;
  if (!target.startsWith("/") || target.startsWith("//")) return `/${locale}`;
  return target;
}
