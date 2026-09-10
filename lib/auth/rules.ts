import type { AuthPhraseKey } from "@/lib/i18n/auth";

/**
 * The rules for the credentials, in one place because they are checked twice.
 *
 * The browser checks them so a mistyped password does not cost a round trip —
 * which matters more than it sounds, because a Server Action re-render replaces
 * the form and the password fields come back empty, so a customer who submitted
 * a mismatch would have to retype both. The server checks them again because
 * the browser's check is a convenience, never a control.
 *
 * The functions return phrase keys rather than sentences: the same rule has to
 * be able to speak English or Arabic.
 */

/** Supabase's own minimum is 6. Eight, because six is not a password. */
export const MIN_PASSWORD = 8;

export type AuthField = "name" | "email" | "password" | "passwordConfirm";

export type FieldErrors = Partial<Record<AuthField, AuthPhraseKey>>;

/**
 * Deliberately not a full RFC 5322 parser. It rejects the mistakes people
 * actually make — a missing @, a missing dot, a stray space — and leaves the
 * real verdict to whether the confirmation email arrives. The same expression
 * is used in the prototype, so both front ends accept the same addresses.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function isEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}

/** Collapses runs of whitespace: "  Noura   Al-Sabah " → "Noura Al-Sabah". */
export function normaliseName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function checkSignIn(input: { email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!isEmail(input.email)) errors.email = "errEmailInvalid";
  // No length rule on sign-in: an old account may predate the current minimum,
  // and telling someone their existing password is too short is nonsense.
  if (input.password.length === 0) errors.password = "errPasswordShort";
  return errors;
}

export function checkSignUp(input: {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}): FieldErrors {
  const errors: FieldErrors = {};

  // Two words, because the stylist addresses the customer by first name and the
  // delivery label needs the rest of it.
  const name = normaliseName(input.name);
  if (name.length < 3 || !name.includes(" ")) errors.name = "errNameShort";

  if (!isEmail(input.email)) errors.email = "errEmailInvalid";

  if (input.password.length < MIN_PASSWORD) errors.password = "errPasswordShort";
  else if (input.password !== input.passwordConfirm) errors.passwordConfirm = "errPasswordMismatch";

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
