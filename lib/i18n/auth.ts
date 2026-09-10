import type { Locale } from "./config";

/**
 * Copy for the account screens, in both languages.
 *
 * It lives here rather than inline in the components for the same reason the
 * rest of the app's wording will: an Arabic reader is a first-class visitor,
 * not a translation of an English one, and nothing renders an English string
 * as a fallback.
 */
type Phrase = Record<Locale, string>;

const phrases = {
  eyebrow: { en: "Personal styling · Kuwait", ar: "تنسيق شخصي · الكويت" },

  signInTitle: { en: "Sign in", ar: "تسجيل الدخول" },
  signInLede: {
    en: "Your style profile, your measurements and your orders are behind this. Nothing else is.",
    ar: "ملفك وقياساتك وطلباتك خلف هذه الشاشة. لا شيء آخر.",
  },
  signInSubmit: { en: "Sign in", ar: "تسجيل الدخول" },
  signInNoAccount: { en: "No account yet?", ar: "لا يوجد حساب؟" },
  signInCreate: { en: "Create one", ar: "أنشئي حسابًا" },

  signUpTitle: { en: "Create an account", ar: "إنشاء حساب" },
  signUpLede: {
    en: "Seven short screens about your body, your colours and the occasion. This is where the answers are kept, so you never fill them in twice.",
    ar: "سبع شاشات قصيرة عن جسمك وألوانك والمناسبة. هنا تُحفظ إجاباتك، فلا تكتبينها مرتين.",
  },
  signUpSubmit: { en: "Create account", ar: "إنشاء الحساب" },
  signUpHaveAccount: { en: "Already have an account?", ar: "لديك حساب بالفعل؟" },
  signUpSignIn: { en: "Sign in", ar: "تسجيل الدخول" },

  name: { en: "Full name", ar: "الاسم الكامل" },
  namePlaceholder: { en: "First and last name", ar: "الاسم الأول والأخير" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  emailHint: {
    en: "Your style profile and order updates are sent here. No marketing unless you ask for it.",
    ar: "يُرسل ملفك وتحديثات طلبك إلى هنا. لا رسائل ترويجية إلا بطلبك.",
  },
  password: { en: "Password", ar: "كلمة المرور" },
  passwordHint: {
    en: "At least 8 characters. Your measurements sit behind it, so use one you do not use elsewhere.",
    ar: "٨ أحرف على الأقل. مقاساتك محفوظة خلفها، فاختاري كلمة لا تستخدمينها في مكان آخر.",
  },
  passwordConfirm: { en: "Password again", ar: "تأكيد كلمة المرور" },
  showPassword: { en: "Show password", ar: "إظهار كلمة المرور" },
  working: { en: "Working…", ar: "جارٍ التنفيذ…" },

  checkEmailTitle: { en: "Check your email", ar: "تحقّقي من بريدك" },
  checkEmailBody: {
    en: "A confirmation link is on its way. Open it on this device and you will be signed in.",
    ar: "أُرسل رابط تأكيد إلى بريدك. افتحيه على هذا الجهاز وسيتم تسجيل دخولك.",
  },
  checkEmailBackToSignIn: { en: "Back to sign in", ar: "رجوع إلى تسجيل الدخول" },

  accountTitle: { en: "Your file", ar: "ملفك" },
  accountGreeting: { en: "Signed in as", ar: "مسجّلة الدخول باسم" },
  accountSignOut: { en: "Sign out", ar: "تسجيل الخروج" },
  accountEmailUnconfirmed: {
    en: "Email not confirmed yet. Open the link we sent you.",
    ar: "لم يُؤكَّد البريد بعد. افتحي الرابط الذي أرسلناه إليك.",
  },
  accountStart: { en: "Start my style profile", ar: "ابدئي ملف التنسيق" },
  accountMemberSince: { en: "Account opened", ar: "تاريخ إنشاء الحساب" },

  // Field-level and form-level errors.
  errNameShort: {
    en: "Please give your first and last name.",
    ar: "يُرجى كتابة الاسم الأول والأخير.",
  },
  errEmailInvalid: { en: "That does not look like an email address.", ar: "هذا البريد غير صحيح." },
  errPasswordShort: {
    en: "Passwords must be at least 8 characters.",
    ar: "كلمة المرور ٨ أحرف على الأقل.",
  },
  errPasswordMismatch: { en: "The two passwords do not match.", ar: "كلمتا المرور غير متطابقتين." },
  errCredentials: {
    en: "That email and password do not match an account.",
    ar: "البريد وكلمة المرور لا يطابقان أي حساب.",
  },
  errEmailNotConfirmed: {
    en: "Confirm your email first — open the link we sent you.",
    ar: "أكّدي بريدك أولًا — افتحي الرابط الذي أرسلناه إليك.",
  },
  errEmailTaken: {
    en: "An account already uses that email. Sign in instead.",
    ar: "هذا البريد مستخدم بالفعل. سجّلي الدخول.",
  },
  errRateLimited: {
    en: "Too many attempts. Wait a minute and try again.",
    ar: "محاولات كثيرة. انتظري دقيقة ثم أعيدي المحاولة.",
  },
  errWeakPassword: {
    en: "That password is too easy to guess. Try a longer one.",
    ar: "كلمة المرور ضعيفة. اختاري كلمة أطول.",
  },
  errGeneric: {
    en: "Something went wrong. Try again.",
    ar: "حدث خطأ. أعيدي المحاولة.",
  },
  errNotConfigured: {
    en: "Accounts are not configured on this deployment yet.",
    ar: "لم تُهيَّأ الحسابات على هذا النشر بعد.",
  },
  errSignInRequired: {
    en: "Sign in to see your file.",
    ar: "سجّلي الدخول لعرض ملفك.",
  },
  errLinkInvalid: {
    en: "That link has expired or has already been used. Sign in, or ask for a new one.",
    ar: "انتهت صلاحية الرابط أو استُخدم من قبل. سجّلي الدخول أو اطلبي رابطًا جديدًا.",
  },
} satisfies Record<string, Phrase>;

export type AuthPhraseKey = keyof typeof phrases;

/** `t("signInTitle")` for the given locale. */
export function authCopy(locale: Locale) {
  return (key: AuthPhraseKey): string => phrases[key][locale];
}
