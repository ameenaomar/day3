import type { Locale } from "@/lib/i18n/config";
import { formatKwd } from "@/lib/money";

/**
 * The live total, pinned to the bottom of the order screen. Brown, because
 * brown is the total bar. The amount is paper-on-brown rather than red: red is
 * the price colour, but red on brown fails contrast, and legibility wins.
 */
export function TotalBar({
  label,
  amountFils,
  locale,
  note,
}: {
  label: string;
  amountFils: number;
  locale: Locale;
  note?: string;
}) {
  return (
    <div className="sticky bottom-0 border-t border-brown bg-brown px-4 py-3 text-paper">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-xs ui-caps">{label}</span>
        <span aria-live="polite" className="font-display text-2xl leading-none">
          {formatKwd(amountFils, locale)}
        </span>
      </div>
      {note ? <p className="mt-1 text-xs opacity-80">{note}</p> : null}
    </div>
  );
}
