"use client";

/**
 * An editorial ticker. The phrase is rendered twice inside a track that slides
 * exactly half its width, so the loop is seamless with no JavaScript and no
 * measurement.
 *
 * It travels against the reading direction in both languages — handled in CSS
 * by reversing the animation under [dir="rtl"], so the component itself stays
 * direction-agnostic.
 *
 * Decorative: the same words are already on the page, so the duplicate copy is
 * hidden from assistive technology rather than read out twice.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  const run = [...items, ...items];

  return (
    <div className="overflow-hidden rule-t rule-b py-4" aria-hidden="true">
      <div className="marquee-track">
        {run.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center whitespace-nowrap">
            <span className="text-label uppercase text-sand">{item}</span>
            <span className="mx-8 text-label text-rule">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
