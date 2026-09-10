import type { Locale } from "@/lib/i18n/config";

/**
 * The mailer, behind a seam. Nothing is configured yet, so the default
 * provider is "mock": it logs that a link was issued and hands the link back
 * to the caller for local development only.
 *
 * The link is a bearer credential — anyone holding it is signed in — so it is
 * returned only outside production, and never logged.
 */

export type MagicLinkEmail = {
  to: string;
  url: string;
  name: string;
  locale: Locale;
};

export type SendResult =
  /** Delivered, or handed to a provider that accepted it. */
  | { delivered: true }
  /** Not sent, but safe to show the customer the same "check your inbox". */
  | { delivered: false; devLink: string }
  /** Nowhere to send it and no safe fallback: the operator must fix config. */
  | { delivered: false; reason: "not_configured" };

function provider(): "resend" | "mock" {
  return process.env.RESEND_API_KEY ? "resend" : "mock";
}

const SUBJECT: Record<Locale, string> = {
  en: "Your Simply Styled sign-in link",
  ar: "رابط الدخول إلى Simply Styled",
};

function body(email: MagicLinkEmail): string {
  return email.locale === "ar"
    ? `مرحباً ${email.name}،\n\nاضغطي على الرابط لتسجيل الدخول إلى Simply Styled:\n${email.url}\n\nالرابط صالح لمدة ٣٠ دقيقة ويُستخدم مرة واحدة. إذا لم تطلبي هذا، تجاهلي الرسالة.`
    : `Hello ${email.name},\n\nUse this link to sign in to Simply Styled:\n${email.url}\n\nIt works once and expires in 30 minutes. If you did not ask for it, ignore this email.`;
}

export async function sendMagicLink(email: MagicLinkEmail): Promise<SendResult> {
  if (provider() === "mock") {
    // Never the token itself: the address is enough to debug delivery.
    console.info(`[email:mock] magic link issued for ${email.to}`);
    if (process.env.NODE_ENV === "production") return { delivered: false, reason: "not_configured" };
    return { delivered: false, devLink: email.url };
  }

  const from = process.env.EMAIL_FROM ?? "Simply Styled <hello@example.com>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email.to],
      subject: SUBJECT[email.locale],
      text: body(email),
    }),
  });

  if (!response.ok) {
    // Status only. A provider error body can quote the recipient back at us.
    throw new Error(`resend rejected the message: ${response.status}`);
  }
  return { delivered: true };
}
