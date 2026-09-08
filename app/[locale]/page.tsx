import { Button } from "@/components/ui/Button";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatKwd } from "@/lib/money";
import { STYLING_FEE_PER_LOOK_FILS, computeQuote } from "@/lib/pricing";
import { notFound } from "next/navigation";

/**
 * Scaffold front page. The real wording, English and Arabic, is ported
 * verbatim from public/whatcaniwear.html — the working prototype, which `/`
 * serves. Until that port lands, this screen proves out the machine (tokens,
 * both themes, RTL, fonts, the KWD formatter and the pricing module) rather
 * than presenting final copy.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const example = computeQuote({ lookCount: 1, budgetTierFils: 80_000 });

  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col gap-6 p-4">
      <header className="flex items-start justify-between gap-3 rule-b pb-3">
        <p className="wordmark text-3xl leading-none">Simply Styled</p>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitch locale={locale} />
          <ThemeToggle label="THEME" />
        </div>
      </header>

      <section className="border border-rule bg-panel p-4 shadow-[var(--shadow-hard)]">
        <p className="font-display text-2xl leading-none cursor-block">
          {locale === "ar" ? "مصمّم أزياء شخصي في الكويت" : "A personal stylist for Kuwait"}
        </p>
        <p className="mt-3 text-brown-soft">
          {locale === "ar"
            ? "نص هذه الصفحة يُنقل حرفيًا من النموذج الأولي."
            : "Front-page copy is ported verbatim from the prototype."}
        </p>
      </section>

      <section className="border border-rule bg-well p-4">
        <p className="text-dim text-xs ui-caps">
          {locale === "ar" ? "فحص الأسعار" : "Pricing check"}
        </p>
        <dl className="mt-2 space-y-1">
          <div className="flex justify-between gap-4">
            <dt>{locale === "ar" ? "أجر التنسيق لكل إطلالة" : "Styling fee per look"}</dt>
            <dd className="text-red">{formatKwd(STYLING_FEE_PER_LOOK_FILS, locale)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>{locale === "ar" ? "ميزانية الملابس" : "Clothing budget"}</dt>
            <dd>{formatKwd(example.clothingBudgetFils, locale)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>{locale === "ar" ? "التوصيل" : "Delivery"}</dt>
            <dd>{formatKwd(example.deliveryFeeFils, locale)}</dd>
          </div>
          <div className="mt-2 flex justify-between gap-4 border-t border-rule pt-2 font-semibold">
            <dt>{locale === "ar" ? "المطلوب الآن" : "Due now"}</dt>
            <dd className="text-green">{formatKwd(example.dueNowFils, locale)}</dd>
          </div>
        </dl>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button variant="primary">{locale === "ar" ? "ابدأ" : "Start"}</Button>
        <Button variant="secondary">{locale === "ar" ? "كيف يعمل" : "How it works"}</Button>
      </div>

      <p className="text-xs text-dim">
        <a className="underline decoration-dotted underline-offset-4" href={`/${locale}/design`}>
          {locale === "ar" ? "فحص نظام التصميم" : "Design system check"}
        </a>
      </p>
    </main>
  );
}
