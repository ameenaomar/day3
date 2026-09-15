/**
 * Quiz state: what has been answered, which fields to ask, and persistence.
 *
 * Answers are stored as option *ids*, never as labels. That is what lets the
 * language switch mid-quiz without losing or corrupting anything — the ids are
 * language-neutral and the labels are looked up at render time.
 */

import {
  AUDIENCE_FIELD,
  QUIZ_STORAGE_KEY,
  quizSteps,
  type Audience,
  type QuizField,
  type QuizFieldKey,
  type QuizStep,
} from "@/lib/quiz.config";

export type Answer = string | readonly string[];
export type Answers = Partial<Record<QuizFieldKey, Answer>>;
export type Measurements = Partial<Record<string, string>>;

export type QuizState = {
  readonly answers: Answers;
  readonly measurements: Measurements;
  /** Index into quizSteps. */
  readonly step: number;
};

export const EMPTY_STATE: QuizState = { answers: {}, measurements: {}, step: 0 };

/** Bumped when the shape changes, so a stale saved quiz is discarded not crashed. */
const STATE_VERSION = 1;

export function audienceOf(answers: Answers): Audience | null {
  const who = answers[AUDIENCE_FIELD];
  return who === "women" || who === "men" ? who : null;
}

/**
 * Which fields of a step are currently asked. A field is hidden when it is for
 * the other audience, or when the field it depends on is still unanswered.
 */
export function visibleFields(step: QuizStep, answers: Answers): readonly QuizField[] {
  const audience = audienceOf(answers);
  return step.fields.filter((field) => {
    if (field.only && field.only !== audience) return false;
    if (field.needs && !hasAnswer(answers[field.needs])) return false;
    return true;
  });
}

export function hasAnswer(value: Answer | undefined): boolean {
  if (value === undefined) return false;
  return Array.isArray(value) ? value.length > 0 : String(value).trim().length > 0;
}

/** A step may be left once every visible, non-optional field has an answer. */
export function isStepComplete(step: QuizStep, answers: Answers): boolean {
  return visibleFields(step, answers).every(
    (field) =>
      field.optional || field.kind === "measurements" || hasAnswer(answers[field.key]),
  );
}

/** Visible, non-optional fields still missing an answer — used to mark them. */
export function missingFields(step: QuizStep, answers: Answers): readonly QuizFieldKey[] {
  return visibleFields(step, answers)
    .filter((f) => !f.optional && f.kind !== "measurements" && !hasAnswer(answers[f.key]))
    .map((f) => f.key);
}

export function toggleMulti(current: Answer | undefined, option: string): readonly string[] {
  const list = Array.isArray(current) ? [...current] : [];
  const at = list.indexOf(option);
  if (at >= 0) list.splice(at, 1);
  else list.push(option);
  return list;
}

export function isSelected(current: Answer | undefined, option: string): boolean {
  return Array.isArray(current) ? current.includes(option) : current === option;
}

/** How far through the quiz, as a fraction, for the progress rule. */
export function progressOf(state: QuizState): number {
  const done = quizSteps.filter((s, i) => i < state.step || isStepComplete(s, state.answers)).length;
  return Math.min(1, done / quizSteps.length);
}

/* ------------------------------ persistence ------------------------------ */

type Persisted = { version: number } & QuizState;

export function loadState(): QuizState {
  if (typeof window === "undefined") return EMPTY_STATE;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
  } catch {
    return EMPTY_STATE; // storage blocked; the quiz still works for this visit
  }
  if (raw === null) return EMPTY_STATE;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      (parsed as Persisted).version !== STATE_VERSION
    ) {
      return EMPTY_STATE;
    }
    const { answers, measurements, step } = parsed as Persisted;
    return {
      answers: typeof answers === "object" && answers !== null ? answers : {},
      measurements: typeof measurements === "object" && measurements !== null ? measurements : {},
      // Clamp: the saved index may exceed the steps if the quiz was shortened.
      step: Number.isInteger(step) ? Math.min(Math.max(step, 0), quizSteps.length - 1) : 0,
    };
  } catch {
    return EMPTY_STATE; // corrupt payload — start clean rather than throw
  }
}

export function saveState(state: QuizState): void {
  try {
    const payload: Persisted = { version: STATE_VERSION, ...state };
    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota or private mode: answers stay in memory for this visit.
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(QUIZ_STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
}
