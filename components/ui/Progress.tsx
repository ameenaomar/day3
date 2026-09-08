/**
 * `FILE 3/7 ███░░░░`.
 *
 * The blocks are decoration; the accessible value comes from role=progressbar,
 * so a screen reader hears "file 3 of 7" rather than a row of block glyphs.
 */
export function Progress({
  step,
  total,
  label,
}: {
  step: number;
  total: number;
  label: string;
}) {
  const filled = "█".repeat(step);
  const empty = "░".repeat(Math.max(0, total - step));

  return (
    <div
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={label}
      className="flex items-baseline gap-2 text-xs ui-caps text-dim"
    >
      <span>
        {label} {step}/{total}
      </span>
      {/* LTR even in Arabic: progress fills the same way on both machines. */}
      <span aria-hidden="true" dir="ltr" className="text-green">
        {filled}
        <span className="text-rule">{empty}</span>
      </span>
    </div>
  );
}
