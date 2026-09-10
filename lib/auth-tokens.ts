import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Magic-link tokens. The database only ever holds the hash, so a leaked dump
 * cannot be replayed into somebody's account — the same reason password
 * hashes exist, applied to links.
 *
 * Server-only: this module must never be imported into a client component.
 */

/** 32 bytes of randomness, URL-safe, so the link survives an email client. */
export function newMagicToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Constant-time compare, so a lookup cannot be timed character by character. */
export function tokenHashEquals(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
