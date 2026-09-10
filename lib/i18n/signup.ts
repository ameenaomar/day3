import type { Locale } from "@/lib/i18n/config";
import type { SignUpErrorCode } from "@/lib/signup";

/**
 * Copy for the sign-up page, in both languages. Arabic is a first-class
 * language here, not a translation layer bolted on: it ships with the page.
 */

type Copy = Record<Locale, string>;

export const SIGNUP = {
  tag: { en: "Sign up", ar: "التسجيل" },
  title: { en: "Create your file.", ar: "أنشئي ملفك." },
  lede: {
    en: "One email, no password. We send you a link to sign in — and from then on your sizes and measurements come back with you, so a second order takes a minute.",
    ar: "بريد إلكتروني واحد، بلا كلمة مرور. نرسل لك رابط دخول — ومن بعدها تعود مقاساتك معك، فيأخذ الطلب الثاني دقيقة واحدة.",
  },
  railNote: {
    en: "Your file holds your answers and your measurements. Nothing else.",
    ar: "ملفك يحتوي إجاباتك ومقاساتك. لا شيء غير ذلك.",
  },
  name: { en: "Your name", ar: "الاسم" },
  nameHint: { en: "As your stylist should greet you.", ar: "كما تحب أن تناديك المنسّقة." },
  namePlaceholder: { en: "First and last name", ar: "الاسم الأول والأخير" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  emailHint: {
    en: "Your sign-in link, your style profile and your order updates go here.",
    ar: "يُرسل إلى هنا رابط الدخول وملفك الشخصي وتحديثات طلبك.",
  },
  phone: { en: "WhatsApp number", ar: "رقم الواتساب" },
  phoneHint: {
    en: "Only used to send you the look for approval before it ships. You can add it later.",
    ar: "يُستخدم فقط لإرسال الإطلالة للموافقة قبل الشحن. يمكنك إضافته لاحقاً.",
  },
  optional: { en: "optional", ar: "اختياري" },
  consent: {
    en: "Email me occasionally about new looks and seasonal edits.",
    ar: "أرسلوا لي أحياناً رسائل عن إطلالات جديدة وتنسيقات الموسم.",
  },
  consentNote: {
    en: "Off by default, and order updates arrive either way.",
    ar: "غير مفعّل تلقائياً، وتحديثات الطلب تصلك في الحالتين.",
  },
  submit: { en: "Create my file", ar: "أنشئي ملفي" },
  submitting: { en: "One moment…", ar: "لحظة…" },
  returning: {
    en: "Been here before? The same email brings your file back — this is that form too.",
    ar: "زبونة سابقة؟ البريد نفسه يستعيد ملفك — وهذا النموذج نفسه.",
  },
  backToFlow: { en: "Or answer the questions first", ar: "أو أجيبي على الأسئلة أولاً" },
  sentTag: { en: "Check your inbox", ar: "تفقّدي بريدك" },
  sentTitle: { en: "Your link is on its way.", ar: "رابطك في الطريق." },
  sentBody: {
    en: "We sent a sign-in link to",
    ar: "أرسلنا رابط الدخول إلى",
  },
  sentTtl: {
    en: "It signs you in once and expires in 30 minutes. If it does not arrive, check spam before asking for another.",
    ar: "الرابط يعمل مرة واحدة وينتهي بعد ٣٠ دقيقة. إن لم يصل، تفقّدي البريد غير المرغوب قبل طلب رابط آخر.",
  },
  sentAgain: { en: "Use a different email", ar: "استخدام بريد آخر" },
  devLink: {
    en: "Development build — no mailer is configured, so here is the link:",
    ar: "نسخة تطوير — لا يوجد بريد مهيأ، وهذا هو الرابط:",
  },
  failedConfig: {
    en: "Your file is saved, but this deployment has no mailer configured yet, so the link could not be sent. Set RESEND_API_KEY and try again.",
    ar: "تم حفظ ملفك، لكن لا يوجد بريد مهيأ في هذه النسخة، لذا لم يُرسل الرابط. أضيفوا RESEND_API_KEY ثم أعيدوا المحاولة.",
  },
  failedNoDatabase: {
    en: "Accounts are not switched on for this deployment yet, so nothing was saved. Nothing is wrong with what you typed.",
    ar: "الحسابات غير مفعّلة في هذه النسخة بعد، لذا لم يُحفظ أي شيء. لا خطأ في ما أدخلتِه.",
  },
  failedUnavailable: {
    en: "Something broke on our side, not yours. Try again in a moment.",
    ar: "حدث خطأ من جهتنا لا من جهتك. أعيدي المحاولة بعد قليل.",
  },
  privacy: {
    en: "We keep your name, email and measurements to style you, and nothing else. Ask us and we delete the file.",
    ar: "نحفظ اسمك وبريدك ومقاساتك لتنسيق إطلالاتك فقط. اطلبي منا وسنحذف الملف.",
  },
} satisfies Record<string, Copy>;

export const SIGNIN = {
  tag: { en: "Sign in", ar: "الدخول" },
  title: { en: "Welcome back.", ar: "أهلاً بعودتك." },
  lede: {
    en: "Your email is the key. We send a link that signs you in — your sizes, your measurements and your past orders come back with it.",
    ar: "بريدك هو المفتاح. نرسل رابطاً يسجّل دخولك — وتعود معه مقاساتك وقياساتك وطلباتك السابقة.",
  },
  railNote: {
    en: "No password to forget. Links last 30 minutes and work once.",
    ar: "لا كلمة مرور تُنسى. الرابط صالح ٣٠ دقيقة ويعمل مرة واحدة.",
  },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  emailHint: {
    en: "The address you signed up with.",
    ar: "البريد الذي سجّلت به.",
  },
  submit: { en: "Email me a link", ar: "أرسلوا لي رابطاً" },
  submitting: { en: "One moment…", ar: "لحظة…" },
  noAccount: { en: "No file yet? Create one", ar: "لا يوجد ملف؟ أنشئي واحداً" },
  backToFlow: { en: "Or answer the questions first", ar: "أو أجيبي على الأسئلة أولاً" },
  /* what went wrong with a link, by ?e= */
  eInvalid: {
    en: "That link is not one of ours, or it has been changed. Ask for a new one.",
    ar: "هذا الرابط ليس منا أو تم تعديله. اطلبي رابطاً جديداً.",
  },
  eExpired: {
    en: "That link has expired — they last 30 minutes. Here is where to get another.",
    ar: "انتهت صلاحية الرابط — مدته ٣٠ دقيقة. اطلبي رابطاً جديداً من هنا.",
  },
  eUsed: {
    en: "That link has already been used. Each one signs you in once, so ask for a fresh one.",
    ar: "تم استخدام هذا الرابط. كل رابط يعمل مرة واحدة، فاطلبي رابطاً جديداً.",
  },
  eError: {
    en: "We could not check that link just now. Try again in a moment.",
    ar: "لم نتمكن من التحقق من الرابط الآن. أعيدي المحاولة بعد قليل.",
  },
  eSignedOut: { en: "You are signed out.", ar: "تم تسجيل خروجك." },
  signedInAs: { en: "Signed in as", ar: "مسجّلة الدخول باسم" },
  signOut: { en: "Log out", ar: "خروج" },
} satisfies Record<string, Copy>;

export const SIGNUP_ERRORS: Record<SignUpErrorCode, Copy> = {
  name_required: { en: "Please enter your name.", ar: "الرجاء إدخال الاسم." },
  name_short: { en: "That looks too short to be a name.", ar: "الاسم أقصر من المتوقع." },
  email_required: { en: "Please enter your email.", ar: "الرجاء إدخال البريد الإلكتروني." },
  email_invalid: { en: "That email does not look right.", ar: "البريد الإلكتروني غير صحيح." },
  phone_invalid: {
    en: "Eight digits, starting 5, 6 or 9 — or leave it empty.",
    ar: "ثماني خانات تبدأ بـ ٥ أو ٦ أو ٩ — أو اتركيه فارغاً.",
  },
};

export function t(copy: Copy, locale: Locale): string {
  return copy[locale];
}
