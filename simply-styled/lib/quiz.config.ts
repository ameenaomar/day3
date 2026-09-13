/**
 * The 7-step Style Profile quiz, defined as data.
 *
 * PLACEHOLDER: the step and option definitions come from §7 of the spec, which
 * is not yet available to this build. The types below are a provisional sketch
 * and WILL be revised against §7 — nothing renders from this file yet.
 *
 * Copy rule: this file holds structure and translation keys only. The visible
 * question and option text lives in lib/translations.ts.
 */

export type QuizOptionId = string;
export type QuizStepId = string;

export type QuizStep = {
  id: QuizStepId;
  /** Single- or multi-select; §7 will confirm which steps are which. */
  kind: "single" | "multi";
  options: readonly { id: QuizOptionId }[];
};

export const quizSteps: readonly QuizStep[] = [];

export const QUIZ_STORAGE_KEY = "simply-styled:style-profile";
