import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ChoiceGroup, MultiChoiceGroup } from "@/components/ui/ChoiceGroup";
import { Collapsible } from "@/components/ui/Collapsible";
import { Field, TextInput } from "@/components/ui/Field";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { Panel } from "@/components/ui/Panel";
import { Progress } from "@/components/ui/Progress";
import { Prompt } from "@/components/ui/Prompt";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { TotalBar } from "@/components/ui/TotalBar";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { computeQuote } from "@/lib/pricing";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Design-system check. Every primitive on one screen so both machines, RTL and
 * 375px can be eyeballed at once.
 *
 * The labels here are generic on purpose — this is not product copy. The real
 * questions and their wording come verbatim from simply-styled.html.
 */
export default async function DesignPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const ar = locale === "ar";

  const quote = computeQuote({ lookCount: 2, budgetTierFils: 80_000 });

  const single = [
    { value: "a", label: ar ? "الخيار الأول" : "First option" },
    { value: "b", label: ar ? "الخيار الثاني" : "Second option", hint: ar ? "نص مساعد" : "Helper text" },
    { value: "c", label: ar ? "الخيار الثالث" : "Third option" },
  ] as const;

  const multi = [
    { value: "x", label: ar ? "اختيار متعدد أ" : "Multi choice A" },
    { value: "y", label: ar ? "اختيار متعدد ب" : "Multi choice B" },
  ] as const;

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-5 p-4">
        <header className="flex items-start justify-between gap-3 rule-b pb-3">
          <p className="wordmark text-2xl leading-none">Simply Styled</p>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitch locale={locale} />
            <ThemeToggle label="THEME" />
          </div>
        </header>

        <Progress step={3} total={7} label={ar ? "ملف" : "FILE"} />

        <Panel>
          <Prompt>{ar ? "هذا عنوان سؤال" : "This is a question heading"}</Prompt>
          <p className="mt-2 text-sm text-brown-soft">
            {ar ? "نص توضيحي أسفل السؤال." : "Helper text under the question."}
          </p>
          <div className="mt-4">
            <ChoiceGroup
              name="single"
              legend={ar ? "خيار واحد" : "Single choice"}
              choices={single}
              defaultValue="b"
              required
            />
          </div>
        </Panel>

        <Panel tone="well">
          <p className="mb-3 text-xs ui-caps text-dim">
            {ar ? "اختيار متعدد" : "Multiple choice"}
          </p>
          <MultiChoiceGroup
            name="multi"
            legend={ar ? "اختيار متعدد" : "Multiple choice"}
            choices={multi}
            defaultValues={["x"]}
          />
        </Panel>

        <Panel>
          <div className="flex flex-col gap-4">
            <Field
              id="required-field"
              label={ar ? "حقل مطلوب" : "Required field"}
              required
              hint={ar ? "نص مساعد قصير." : "A short hint."}
            >
              <TextInput id="required-field" name="required-field" />
            </Field>
            <Field
              id="optional-field"
              label={ar ? "حقل اختياري" : "Optional field"}
              optionalLabel={ar ? "اختياري" : "optional"}
            >
              <TextInput id="optional-field" name="optional-field" />
            </Field>
            <Field
              id="error-field"
              label={ar ? "حقل به خطأ" : "Field with an error"}
              required
              error={ar ? "هذا الحقل مطلوب." : "This field is required."}
            >
              <TextInput id="error-field" name="error-field" hasError defaultValue="—" />
            </Field>
          </div>
        </Panel>

        <Collapsible
          summary={ar ? "قياسات بالسنتيمتر (اختياري)" : "Exact measurements in cm (optional)"}
          note={ar ? "النقرات وحدها كافية." : "The taps above are enough on their own."}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field id="m1" label={ar ? "الصدر" : "Bust / chest"} optionalLabel="cm">
              <TextInput id="m1" name="m1" inputMode="numeric" />
            </Field>
            <Field id="m2" label={ar ? "الخصر" : "Waist"} optionalLabel="cm">
              <TextInput id="m2" name="m2" inputMode="numeric" />
            </Field>
          </div>
        </Collapsible>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary">{ar ? "متابعة" : "Continue"}</Button>
          <Button variant="secondary">{ar ? "رجوع" : "Back"}</Button>
          <Button variant="primary" disabled>
            {ar ? "متابعة" : "Continue"}
          </Button>
          <Button variant="quiet">{ar ? "تخطّي" : "Skip"}</Button>
        </div>

        <Panel tone="inset">
          <p className="text-xs ui-caps text-dim">
            {ar ? "الأدوار اللونية" : "Colour roles"}
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li className="text-green">{ar ? "أخضر — مؤكَّد" : "green — confirmed"}</li>
            <li className="text-red">{ar ? "أحمر — السعر والمطلوب" : "red — price and required"}</li>
            <li className="text-brown-soft">{ar ? "بنّي فاتح — نص ثانوي" : "brown-soft — secondary text"}</li>
            <li className="text-dim">{ar ? "خافت — نص مساعد" : "dim — helper text"}</li>
          </ul>
        </Panel>
      </main>

      <TotalBar
        label={ar ? "الإجمالي" : "Total"}
        amountFils={quote.dueNowFils}
        locale={locale}
        note={ar ? "أجر التنسيق الآن، الملابس بعد الموافقة." : "Styling fee now, clothes after approval."}
      />
    </div>
  );
}
