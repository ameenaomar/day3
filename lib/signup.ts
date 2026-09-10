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

/** Magic links are short-lived: long enough to walk to your inbox, no longer. */
export const TOKEN_TTL_MINUTES = 30;

/** Kuwait mobile numbers: eight digits, and they start 5, 6 or 9. */
const KUWAIT_MOBILE = /^[569]\d{7}$/;

export type SignUpErrorCode =
  | "name_required"
  | "name_short"
  | "email_required"
  | "email_invalid"
  | "phone_invalid";

export type SignUpField = "name" | "email" | "phone";

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
    .trim()
    .min(1, "name_required")
    .min(NAME_MIN, "name_short")
    .max(NAME_MAX),
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
  marketingOptIn: z.boolean().default(false),
  locale: z.enum(["en", "ar"]).default("en"),
});

export type SignUpInput = z.input<typeof signUpSchema>;
export type SignUpValues = z.output<typeof signUpSchema>;

export type SignUpParse =
  | { ok: true; values: SignUpValues }
  | { ok: false; errors: Partial<Record<SignUpField, SignUpErrorCode>> };

/** One error per field, first one wins — a form should not shout. */
export function parseSignUp(input: unknown): SignUpParse {
  const result = signUpSchema.safeParse(input);
  if (result.success) return { ok: true, values: result.data };

  const errors: Partial<Record<SignUpField, SignUpErrorCode>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field !== "name" && field !== "email" && field !== "phone") continue;
    if (errors[field]) continue;
    errors[field] = issue.message as SignUpErrorCode;
  }
  return { ok: false, errors };
}

/** Reads a FormData post — the shape the page submits with or without JS. */
export function signUpFromFormData(form: FormData): SignUpParse {
  return parseSignUp({
    name: form.get("name") ?? "",
    email: form.get("email") ?? "",
    phone: form.get("phone") ?? "",
    marketingOptIn: form.get("marketingOptIn") === "on",
    locale: form.get("locale") ?? "en",
  });
}
