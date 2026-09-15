"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useLanguage } from "@/components/LanguageProvider";
import { QuizField } from "@/components/quiz/QuizField";
import {
  audienceOf,
  clearState,
  EMPTY_STATE,
  isStepComplete,
  loadState,
  missingFields,
  progressOf,
  saveState,
  visibleFields,
  type Answer,
  type QuizState,
} from "@/lib/quiz-state";
import { quizSteps, type QuizFieldKey } from "@/lib/quiz.config";
import { formatNumber } from "@/lib/pricing";
import { t } from "@/lib/translations";

export function Quiz() {
  const { locale, dir } = useLanguage();
  const copy = t(locale);

  const [state, setState] = useState<QuizState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [attempted, setAttempted] = useState(false);

  // Adopt any saved answers before the first paint the user can act on.
  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  // Persist on every change, once the saved state has been adopted — writing
  // before that would overwrite a saved quiz with the empty one.
  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const step = quizSteps[state.step] ?? quizSteps[0];
  if (step === undefined) throw new Error("quizSteps is empty");

  const stepCopy = copy.quiz.steps[step.id];
  const audience = audienceOf(state.answers);
  const fields = visibleFields(step, state.answers);
  const complete = isStepComplete(step, state.answers);
  const missing = useMemo(
    () => new Set<QuizFieldKey>(attempted ? missingFields(step, state.answers) : []),
    [attempted, step, state.answers],
  );

  const setAnswer = useCallback((key: QuizFieldKey, value: Answer) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [key]: value } }));
  }, []);

  const setMeasure = useCallback((key: string, value: string) => {
    setState((s) => ({ ...s, measurements: { ...s.measurements, [key]: value } }));
  }, []);

  const go = useCallback((delta: number) => {
    setAttempted(false);
    setState((s) => ({
      ...s,
      step: Math.min(Math.max(s.step + delta, 0), quizSteps.length - 1),
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onNext = () => {
    if (!complete) {
      setAttempted(true);
      return;
    }
    go(1);
  };

  const isLast = state.step === quizSteps.length - 1;
  // Arabic-Indic digits in Arabic, to match the prices.
  const stepLabel = copy.quiz.chrome.stepOf
    .replace("%s", formatNumber(state.step + 1, locale))
    .replace("%s", formatNumber(quizSteps.length, locale));

  // Nothing is rendered until the saved answers are in, so a half-finished
  // quiz never flashes as empty.
  if (!ready) return <div className="min-h-dvh" aria-busy="true" />;

  return (
    <div className="mx-auto min-h-dvh max-w-3xl px-gutter pb-section-sm">
      {/* Progress — a hairline that fills, not a bar. */}
      <div className="sticky top-0 bg-paper pt-8">
        <div className="flex items-baseline justify-between">
          <span className="text-label uppercase text-ink-muted">{stepLabel}</span>
          <span className="text-label uppercase text-ink-muted">{stepCopy.tag}</span>
        </div>
        <div className="mt-3 h-px w-full bg-rule" role="presentation">
          <div
            className="h-px bg-ink transition-[width] duration-500"
            style={{ width: `${Math.round(progressOf(state) * 100)}%` }}
          />
        </div>
      </div>

      <header className="pt-14">
        <h1 className="text-headline font-serif text-ink">{stepCopy.question}</h1>
        <p className="mt-5 max-w-prose text-body text-ink-muted">{stepCopy.sub}</p>
      </header>

      <div className="mt-14 flex flex-col gap-10">
        {fields.map((field) => (
          <QuizField
            key={field.key}
            field={field}
            copy={copy}
            answers={state.answers}
            measurements={state.measurements}
            audience={audience}
            missing={missing.has(field.key)}
            showMeasurements={showMeasurements}
            onToggleMeasurements={() => setShowMeasurements((v) => !v)}
            onAnswer={setAnswer}
            onMeasure={setMeasure}
          />
        ))}
      </div>

      <nav className="mt-16 flex items-center justify-between rule-t pt-8">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={state.step === 0}
          className="inline-flex items-center gap-2 text-caption text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
        >
          {/* The arrow must point back, which is the other way round in Arabic. */}
          {dir === "rtl" ? (
            <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.25} />
          ) : (
            <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.25} />
          )}
          {copy.quiz.chrome.back}
        </button>

        {/* Deliberately never disabled. A greyed-out Continue tells the visitor
            they are stuck without telling them why; pressing it instead marks
            the questions still wanting an answer. */}
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-3 border border-ink bg-ink px-8 py-3 text-caption text-paper transition-opacity hover:opacity-85"
        >
          {isLast ? copy.quiz.chrome.finish : copy.quiz.chrome.next}
          {dir === "rtl" ? (
            <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.25} />
          ) : (
            <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.25} />
          )}
        </button>
      </nav>

      <div className="mt-8 flex items-center justify-between gap-6">
        <p className="text-caption text-ink-muted">{copy.quiz.chrome.savedNote}</p>
        <button
          type="button"
          onClick={() => {
            clearState();
            setState(EMPTY_STATE);
            setAttempted(false);
          }}
          className="text-caption text-ink-muted underline underline-offset-4 hover:text-ink"
        >
          {copy.quiz.chrome.startOver}
        </button>
      </div>
    </div>
  );
}
