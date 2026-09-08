import type { ReactNode } from "react";

export interface Choice {
  value: string;
  label: string;
  hint?: string;
}

const chip =
  "flex w-full cursor-pointer items-start gap-2 border border-rule bg-well p-3 text-start " +
  "shadow-[var(--shadow-hard)] transition-transform duration-75 " +
  "has-checked:border-green has-checked:text-green " +
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-green " +
  "active:translate-y-[2px] active:shadow-none";

/**
 * Single choice. Native radios in a real fieldset, so it is keyboard-navigable
 * and works with no JS.
 *
 * Deliberately NOT aria-pressed buttons, which the brief asks for: aria-pressed
 * describes a toggle, and on a mutually exclusive set it announces "pressed"
 * without telling a screen-reader user that choosing one unchooses the others.
 * Visually identical — `( )` and `(•)` exactly as specified.
 */
export function ChoiceGroup({
  name,
  legend,
  choices,
  defaultValue,
  required = false,
  describedBy,
}: {
  name: string;
  legend: ReactNode;
  choices: readonly Choice[];
  defaultValue?: string;
  required?: boolean;
  describedBy?: string;
}) {
  return (
    <fieldset aria-describedby={describedBy} aria-required={required || undefined}>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-col gap-2">
        {choices.map((choice) => (
          <label key={choice.value} className={chip}>
            <input
              type="radio"
              name={name}
              value={choice.value}
              defaultChecked={defaultValue === choice.value}
              required={required}
              className="peer sr-only"
            />
            <span aria-hidden="true" className="shrink-0 font-mono peer-checked:hidden">
              ( )
            </span>
            <span aria-hidden="true" className="hidden shrink-0 font-mono peer-checked:inline">
              (•)
            </span>
            <span className="flex-1">
              {choice.label}
              {choice.hint ? (
                <span className="mt-1 block text-xs text-dim">{choice.hint}</span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Multiple choice. Checkboxes, `[ ]` and `[x]`. Same chip, different
 * semantics, because here "checked" genuinely is independent per option.
 */
export function MultiChoiceGroup({
  name,
  legend,
  choices,
  defaultValues = [],
  describedBy,
}: {
  name: string;
  legend: ReactNode;
  choices: readonly Choice[];
  defaultValues?: readonly string[];
  describedBy?: string;
}) {
  return (
    <fieldset aria-describedby={describedBy}>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-col gap-2">
        {choices.map((choice) => (
          <label key={choice.value} className={chip}>
            <input
              type="checkbox"
              name={name}
              value={choice.value}
              defaultChecked={defaultValues.includes(choice.value)}
              className="peer sr-only"
            />
            <span aria-hidden="true" className="shrink-0 font-mono peer-checked:hidden">
              [ ]
            </span>
            <span aria-hidden="true" className="hidden shrink-0 font-mono peer-checked:inline">
              [x]
            </span>
            <span className="flex-1">
              {choice.label}
              {choice.hint ? (
                <span className="mt-1 block text-xs text-dim">{choice.hint}</span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
