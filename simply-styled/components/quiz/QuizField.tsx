"use client";

import { QuizChoice } from "@/components/quiz/QuizChoice";
import type { Answer, Answers, Measurements } from "@/lib/quiz-state";
import { isSelected, toggleMulti } from "@/lib/quiz-state";
import type { Audience, QuizField as Field } from "@/lib/quiz.config";
import type { Dictionary } from "@/lib/translations";

type QuizFieldProps = {
  field: Field;
  copy: Dictionary;
  answers: Answers;
  measurements: Measurements;
  audience: Audience | null;
  missing: boolean;
  showMeasurements: boolean;
  onToggleMeasurements: () => void;
  onAnswer: (key: Field["key"], value: Answer) => void;
  onMeasure: (key: string, value: string) => void;
};

export function QuizField({
  field,
  copy,
  answers,
  measurements,
  audience,
  missing,
  showMeasurements,
  onToggleMeasurements,
  onAnswer,
  onMeasure,
}: QuizFieldProps) {
  const text = copy.quiz.fields[field.key];
  const current = answers[field.key];
  const options = copy.quiz.options[field.key];

  const legend = (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-label uppercase text-ink-muted">
        {text.label}
        {field.optional ? null : <span aria-hidden="true"> *</span>}
      </span>
      {field.optional ? (
        <span className="text-caption text-ink-muted">{copy.quiz.chrome.optional}</span>
      ) : null}
    </div>
  );

  if (field.kind === "text") {
    return (
      <div className="rule-t pt-8">
        <label className="block">
          {legend}
          <input
            type="text"
            value={typeof current === "string" ? current : ""}
            placeholder={text.placeholder ?? ""}
            onChange={(e) => onAnswer(field.key, e.target.value)}
            className="mt-4 w-full border border-rule bg-transparent px-4 py-3 text-body text-ink placeholder:text-ink-muted/70 focus:border-ink focus:outline-none"
          />
        </label>
        {text.hint ? <p className="mt-3 text-caption text-ink-muted">{text.hint}</p> : null}
      </div>
    );
  }

  if (field.kind === "measurements") {
    const inputs = (field.measurements ?? []).filter(
      (m) => !m.only || m.only === audience,
    );
    return (
      <div className="rule-t pt-8">
        <button
          type="button"
          onClick={onToggleMeasurements}
          aria-expanded={showMeasurements}
          className="text-caption text-ink underline underline-offset-4"
        >
          {showMeasurements
            ? copy.quiz.chrome.hideMeasurements
            : copy.quiz.chrome.showMeasurements}
        </button>
        {showMeasurements ? (
          <>
            <p className="mt-4 text-caption text-ink-muted">
              {copy.quiz.chrome.measurementsHint}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {inputs.map((m) => (
                <label key={m.key} className="block">
                  <span className="text-label uppercase text-ink-muted">
                    {copy.quiz.measurements[m.key] ?? m.key}
                  </span>
                  <span className="mt-2 flex items-center gap-3">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={measurements[m.key] ?? ""}
                      onChange={(e) => onMeasure(m.key, e.target.value)}
                      className="w-full border border-rule bg-transparent px-4 py-3 text-body text-ink focus:border-ink focus:outline-none"
                    />
                    <span className="text-caption text-ink-muted">
                      {copy.quiz.chrome.centimetres}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </>
        ) : null}
      </div>
    );
  }

  const mode = field.kind === "multi" ? "multi" : "single";
  const layout =
    field.bare || field.grid
      ? "grid grid-cols-3 gap-3 sm:grid-cols-4"
      : field.kind === "tone"
        ? "grid grid-cols-1 gap-3 sm:grid-cols-3"
        : "grid grid-cols-1 gap-3 sm:grid-cols-2";

  return (
    <fieldset className="rule-t pt-8">
      <legend className="sr-only">{text.label}</legend>
      {legend}
      {missing ? (
        <p className="mt-2 text-caption text-ink">{copy.quiz.chrome.answerRequired}</p>
      ) : null}
      <div role={mode === "single" ? "radiogroup" : "group"} className={`mt-4 ${layout}`}>
        {(field.options ?? []).map((option) => (
          <QuizChoice
            key={option}
            mode={mode}
            selected={isSelected(current, option)}
            // bare options are literal values (sizes) and are shown as-is.
            label={field.bare ? option : (options?.[option]?.label ?? option)}
            note={field.bare ? undefined : options?.[option]?.note}
            swatches={field.swatches?.[option]}
            onSelect={() =>
              onAnswer(
                field.key,
                mode === "multi" ? toggleMulti(current, option) : option,
              )
            }
          />
        ))}
      </div>
      {text.hint ? <p className="mt-3 text-caption text-ink-muted">{text.hint}</p> : null}
    </fieldset>
  );
}
