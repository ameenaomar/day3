import { z } from "zod";

/**
 * Sign-up is the only place a customer record is created, so the rules about
 * what a customer *is* live here rather than in the form or the action:
 * the form renders these errors, the server action trusts nothing else.
 *
 * Errors are returned as codes, not sentences. The page is bilingual and the
 * wording belongs in the dictionary, not in the validator.
 */

export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const EMAIL_MAX = 200;

/** Supabase's own floor is 6. Eight, because six is not a password. */
export const PASSWORD_MIN = 8;
/** What Supabase Auth accepts; longer than anyone will type. */
export const PASSWORD_MAX = 72;

/** Kuwait mobile numbers: eight digits, and they start 5, 6 or 9. */
const KUWAIT_MOBILE = /^[569]\d{7}$/;

export type SignUpErrorCode =
  | "name_required"
  | "name_short"
  | "email_required"
  | "email_invalid"
  | "phone_invalid"
  | "password_required"
  | "password_short"
  | "password_long"
  | "password_mismatch";

export type SignUpField = "name" | "email" | "phone" | "password" | "passwordConfirm";

/**
 * Strips a Kuwaiti number down to its eight digits, accepting the shapes
 * people actually type: "9988 7766", "+965 9988 7766", "0096599887766".
 * Returns null when what is left is not a Kuwait mobile number.
 */
export function kuwaitMobileDigits(raw: string): string | null {
  let digits = (raw || "").replace(/\D/g, "");
  if (digits.startsWith("00965")) digits = digits.slice(5);
  else if (digits.startsWith("965") && digits.length > 8) digits = digits.slice(3);
  return KUWAIT_MOBILE.test(digits) ? digits : null;
}

/** E.164, which is the only shape that goes in the database. */
export function toE164(digits: string): string {
  return `+965${digits}`;
}

/** What the WhatsApp field shows back to the customer while they type. */
export function formatKuwaitMobile(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "").slice(0, 8);
  return digits.length > 4 ? `${digits.slice(0, 4)} ${digits.slice(4)}` : digits;
}

export const signUpSchema = z.object({
  name: z
    .string()
    // Runs of whitespace collapse: "Noura   Al-Sabah" is one name, and it is
    // printed on the stylist's sheet exactly as it is stored. The database
    // trigger does this too, since metadata reaches it client-supplied.
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .pipe(z.string().min(1, "name_required").min(NAME_MIN, "name_short").max(NAME_MAX)),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "email_required")
    .max(EMAIL_MAX)
    .pipe(z.email("email_invalid")),
  /** Optional at sign-up. The order flow asks again before it ships anything. */
  phone: z
    .string()
    .trim()
    .max(24)
    .optional()
    .transform((value) => value ?? "")
    .refine((value) => value === "" || kuwaitMobileDigits(value) !== null, "phone_invalid")
    .transform((value) => (value === "" ? null : toE164(kuwaitMobileDigits(value)!))),
  /**
   * Supabase Auth holds the credential; this only decides what we refuse to
   * send it. Never echoed back to the page — the form keeps what was typed in
   * its own state, so a rejected submit costs nothing.
   */
  password: z
    .string()
    .min(1, "password_required")
    .min(PASSWORD_MIN, "password_short")
    .max(PASSWORD_MAX, "password_long"),
  passwordConfirm: z.string(),
  marketingOptIn: z.boolean().default(false),
  locale: z.enum(["en", "ar"]).default("en"),
});

/**
 * Checked on the object rather than the field, because it is the only rule
 * that needs two of them. Reported against `passwordConfirm`, which is the
 * box the customer has to change.
 */
const signUpWithConfirmation = signUpSchema.refine(
  (values) => values.password === values.passwordConfirm,
  { path: ["passwordConfirm"], message: "password_mismatch" },
);

export type SignUpInput = z.input<typeof signUpSchema>;
export type SignUpValues = z.output<typeof signUpSchema>;

export type SignUpParse =
  | { ok: true; values: SignUpValues }
  | { ok: false; errors: Partial<Record<SignUpField, SignUpErrorCode>> };

/** One error per field, first one wins — a form should not shout. */
const SIGNUP_FIELDS: readonly SignUpField[] = [
  "name",
  "email",
  "phone",
  "password",
  "passwordConfirm",
];

export function parseSignUp(input: unknown): SignUpParse {
  const result = signUpWithConfirmation.safeParse(input);
  if (result.success) return { ok: true, values: result.data };

  const errors: Partial<Record<SignUpField, SignUpErrorCode>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as SignUpField | undefined;
    if (!field || !SIGNUP_FIELDS.includes(field)) continue;
    if (errors[field]) continue;
    errors[field] = issue.message as SignUpErrorCode;
  }
  // A password too short is not also a mismatch worth mentioning: fix the
  // first and the second usually goes away.
  if (errors.password) delete errors.passwordConfirm;
  return { ok: false, errors };
}

/** Reads a FormData post — the shape the page submits with or without JS. */
export function signUpFromFormData(form: FormData): SignUpParse {
  return parseSignUp({
    name: form.get("name") ?? "",
    email: form.get("email") ?? "",
    phone: form.get("phone") ?? "",
    password: form.get("password") ?? "",
    passwordConfirm: form.get("passwordConfirm") ?? "",
    marketingOptIn: form.get("marketingOptIn") === "on",
    locale: form.get("locale") ?? "en",
  });
}

// ---------------------------------------------------------------------------
// Sign-in
// ---------------------------------------------------------------------------

export type SignInField = "email" | "password";

/**
 * Deliberately not the sign-up rules. An account older than the current
 * minimum must still be able to sign in, so the only question here is whether
 * a password was typed at all — the auth server decides if it is the right one.
 */
export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "email_required")
    .max(EMAIL_MAX)
    .pipe(z.email("email_invalid")),
  password: z.string().min(1, "password_required"),
  locale: z.enum(["en", "ar"]).default("en"),
});

export type SignInValues = z.output<typeof signInSchema>;

export type SignInParse =
  | { ok: true; values: SignInValues }
  | { ok: false; errors: Partial<Record<SignInField, SignUpErrorCode>> };

export function signInFromFormData(form: FormData): SignInParse {
  const result = signInSchema.safeParse({
    email: form.get("email") ?? "",
    password: form.get("password") ?? "",
    locale: form.get("locale") ?? "en",
  });
  if (result.success) return { ok: true, values: result.data };

  const errors: Partial<Record<SignInField, SignUpErrorCode>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field !== "email" && field !== "password") continue;
    if (errors[field]) continue;
    errors[field] = issue.message as SignUpErrorCode;
  }
  return { ok: false, errors };
}
