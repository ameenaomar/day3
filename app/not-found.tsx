import { Button } from "@/components/ui/Button";
import { localeFromHeaders } from "@/app/layout";

/**
 * The 404. Rendered against the root layout, so it is server-rendered, styled,
 * and carries the right lang and dir — a mistyped URL should not drop the
 * customer onto an unstyled page in no language.
 */
export default async function NotFound() {
  const locale = await localeFromHeaders();
  const ar = locale === "ar";

  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center gap-6 p-4">
      <p className="wordmark text-2xl leading-none">Simply Styled</p>

      <div className="border border-rule bg-panel p-4 shadow-[var(--shadow-hard)]">
        <p className="text-xs ui-caps text-red">{ar ? "خطأ ٤٠٤" : "Error 404"}</p>
        <h1 className="mt-2 font-display text-2xl leading-tight">
          <span aria-hidden="true" className="text-green">
            {">"}{" "}
          </span>
          {ar ? "لا يوجد ملف بهذا الاسم" : "No file by that name"}
        </h1>
        <p className="mt-3 text-brown-soft">
          {ar
            ? "الصفحة التي طلبتها غير موجودة. قد يكون الرابط قديمًا أو به خطأ مطبعي."
            : "The page you asked for is not here. The link may be old, or have a typo in it."}
        </p>
      </div>

      <div>
        <a href={`/${locale}`}>
          <Button variant="primary">{ar ? "العودة إلى البداية" : "Back to the start"}</Button>
        </a>
      </div>
    </main>
  );
}
