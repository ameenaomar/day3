import { headers } from "next/headers";
import { switchLocale } from "@/app/actions/switch-locale";
import { otherLocale, type Locale } from "@/lib/i18n/config";

const NAMES: Record<Locale, string> = { en: "English", ar: "العربية" };

export async function LanguageSwitch({ locale }: { locale: Locale }) {
  const target = otherLocale(locale);
  const headerList = await headers();
  const path = headerList.get("x-ss-pathname") ?? `/${locale}`;

  return (
    <form action={switchLocale}>
      <input type="hidden" name="locale" value={target} />
      <input type="hidden" name="path" value={path} />
      <button
        type="submit"
        lang={target}
        dir={target === "ar" ? "rtl" : "ltr"}
        className="border border-rule bg-well px-2 py-1 text-xs text-brown shadow-[var(--shadow-hard)] active:translate-y-[2px] active:shadow-none"
      >
        {NAMES[target]}
      </button>
    </form>
  );
}
