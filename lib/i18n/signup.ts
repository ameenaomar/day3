import type { AuthFailure } from "@/app/actions/auth";
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
    en: "An email and a password. From then on your sizes and measurements come back with you, so a second order takes a minute.",
    ar: "بريد إلكتروني وكلمة مرور. ومن بعدها تعود مقاساتك معك، فيأخذ الطلب الثاني دقيقة واحدة.",
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
    en: "Your confirmation, your style profile and your order updates go here.",
    ar: "يُرسل إلى هنا التأكيد وملفك الشخصي وتحديثات طلبك.",
  },
  password: { en: "Password", ar: "كلمة المرور" },
  passwordHint: {
    en: "At least 8 characters. Your measurements sit behind it, so use one you do not use elsewhere.",
    ar: "٨ أحرف على الأقل. مقاساتك محفوظة خلفها، فاختاري كلمة لا تستخدمينها في مكان آخر.",
  },
  passwordConfirm: { en: "Password again", ar: "تأكيد كلمة المرور" },
  passwordConfirmHint: {
    en: "So a typo does not lock you out of your own file.",
    ar: "لكي لا يمنعك خطأ مطبعي من الوصول إلى ملفك.",
  },
  showPassword: { en: "Show password", ar: "إظهار كلمة المرور" },
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
    en: "Been here before? Sign in instead — the same email brings your file back.",
    ar: "زبونة سابقة؟ سجّلي الدخول — البريد نفسه يستعيد ملفك.",
  },
  backToFlow: { en: "Or answer the questions first", ar: "أو أجيبي على الأسئلة أولاً" },
  sentTag: { en: "Check your inbox", ar: "تفقّدي بريدك" },
  sentTitle: { en: "Confirm your email.", ar: "أكّدي بريدك." },
  sentBody: {
    en: "We sent a confirmation link to",
    ar: "أرسلنا رابط تأكيد إلى",
  },
  sentTtl: {
    en: "Open it on this device and your file is ready. If it does not arrive, check spam before asking for another.",
    ar: "افتحيه على هذا الجهاز ويكون ملفك جاهزاً. إن لم يصل، تفقّدي البريد غير المرغوب قبل طلب رابط آخر.",
  },
  sentAgain: { en: "Use a different email", ar: "استخدام بريد آخر" },
  privacy: {
    en: "We keep your name, email and measurements to style you, and nothing else. Ask us and we delete the file.",
    ar: "نحفظ اسمك وبريدك ومقاساتك لتنسيق إطلالاتك فقط. اطلبي منا وسنحذف الملف.",
  },
} satisfies Record<string, Copy>;

export const SIGNIN = {
  tag: { en: "Sign in", ar: "الدخول" },
  title: { en: "Welcome back.", ar: "أهلاً بعودتك." },
  lede: {
    en: "Your email and your password. Your sizes, your measurements and your past orders come back with them.",
    ar: "بريدك وكلمة مرورك. وتعود معهما مقاساتك وقياساتك وطلباتك السابقة.",
  },
  railNote: {
    en: "Your file holds your answers and your measurements. Nothing else.",
    ar: "ملفك يحتوي إجاباتك ومقاساتك. لا شيء غير ذلك.",
  },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  emailHint: {
    en: "The address you signed up with.",
    ar: "البريد الذي سجّلت به.",
  },
  password: { en: "Password", ar: "كلمة المرور" },
  showPassword: { en: "Show password", ar: "إظهار كلمة المرور" },
  submit: { en: "Sign in", ar: "تسجيل الدخول" },
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

/** Why a submit did not go through, apart from the fields themselves. */
export const AUTH_FAILURES: Record<AuthFailure, Copy> = {
  not_configured: {
    en: "Accounts are not switched on for this deployment yet, so nothing was saved. Nothing is wrong with what you typed.",
    ar: "الحسابات غير مفعّلة في هذه النسخة بعد، لذا لم يُحفظ أي شيء. لا خطأ في ما أدخلتِه.",
  },
  credentials: {
    en: "That email and password do not match an account.",
    ar: "البريد وكلمة المرور لا يطابقان أي حساب.",
  },
  email_not_confirmed: {
    en: "Confirm your email first — open the link we sent you.",
    ar: "أكّدي بريدك أولاً — افتحي الرابط الذي أرسلناه إليك.",
  },
  rate_limited: {
    en: "Too many attempts. Wait a minute and try again.",
    ar: "محاولات كثيرة. انتظري دقيقة ثم أعيدي المحاولة.",
  },
  weak_password: {
    en: "That password is too easy to guess. Try a longer one.",
    ar: "كلمة المرور ضعيفة. اختاري كلمة أطول.",
  },
  unavailable: {
    en: "Something broke on our side, not yours. Try again in a moment.",
    ar: "حدث خطأ من جهتنا لا من جهتك. أعيدي المحاولة بعد قليل.",
  },
};

export const SIGNUP_ERRORS: Record<SignUpErrorCode, Copy> = {
  name_required: { en: "Please enter your name.", ar: "الرجاء إدخال الاسم." },
  name_short: { en: "That looks too short to be a name.", ar: "الاسم أقصر من المتوقع." },
  email_required: { en: "Please enter your email.", ar: "الرجاء إدخال البريد الإلكتروني." },
  email_invalid: { en: "That email does not look right.", ar: "البريد الإلكتروني غير صحيح." },
  phone_invalid: {
    en: "Eight digits, starting 5, 6 or 9 — or leave it empty.",
    ar: "ثماني خانات تبدأ بـ ٥ أو ٦ أو ٩ — أو اتركيه فارغاً.",
  },
  password_required: { en: "Please choose a password.", ar: "الرجاء اختيار كلمة مرور." },
  password_short: {
    en: "Passwords need at least 8 characters.",
    ar: "كلمة المرور ٨ أحرف على الأقل.",
  },
  password_long: {
    en: "That is longer than we can store — 72 characters at most.",
    ar: "أطول مما يمكن حفظه — ٧٢ حرفاً كحد أقصى.",
  },
  password_mismatch: {
    en: "The two passwords do not match.",
    ar: "كلمتا المرور غير متطابقتين.",
  },
};

export function t(copy: Copy, locale: Locale): string {
  return copy[locale];
}
