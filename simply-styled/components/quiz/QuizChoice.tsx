"use client";

import type { ReactNode } from "react";

type QuizChoiceProps = {
  selected: boolean;
  onSelect: () => void;
  /** "single" renders a radio, "multi" a checkbox — announced correctly either way. */
  mode: "single" | "multi";
  label: ReactNode;
  note?: string | undefined;
  /** Swatch colours, for the skin-tone question. */
  swatches?: readonly string[] | undefined;
};

/**
 * One answer. A flat bordered block that inverts to Espresso when chosen —
 * no fill, no radius, no shadow.
 *
 * It is a real button with aria-checked rather than a styled input, so the
 * whole block is the target and screen readers still hear the right role.
 */
export function QuizChoice({
  selected,
  onSelect,
  mode,
  label,
  note,
  swatches,
}: QuizChoiceProps) {
  return (
    <button
      type="button"
      role={mode === "single" ? "radio" : "checkbox"}
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full flex-col gap-2 border px-4 py-3 text-start transition-colors ${
        selected
          ? "border-ink bg-ink text-paper"
          : "border-rule text-ink hover:border-ink"
      }`}
    >
      <span className="text-body leading-snug">{label}</span>
      {note ? (
        <span className={`text-caption ${selected ? "text-paper/75" : "text-ink-muted"}`}>
          {note}
        </span>
      ) : null}
      {swatches ? (
        <span aria-hidden="true" className="mt-1 flex">
          {swatches.map((hex) => (
            <span key={hex} className="h-6 w-6" style={{ backgroundColor: hex }} />
          ))}
        </span>
      ) : null}
    </button>
  );
}
