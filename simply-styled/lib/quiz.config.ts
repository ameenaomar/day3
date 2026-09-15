/**
 * The 7-step Style Profile quiz, defined as data.
 *
 * GENERATED from the prototype at public/whatcaniwear.html (the original
 * "What Can I Wear" flow), then reworked for this service: the clothing-budget
 * field is gone (clients buy their own clothes), a delivery-mode field was
 * added because the rate depends on it, and the men's path is removed —
 * styling is for women, so there is no audience to ask about.
 *
 * Structure only. Every visible string — step questions, field labels, option
 * labels, hints — lives in lib/translations.ts and is keyed by the ids here.
 */

export type FieldKind =
  | "single"       /* pick one */
  | "multi"        /* pick any number */
  | "text"         /* free text */
  | "tone"         /* skin undertone, shown as swatches */
  | "measurements" /* the optional exact-measurements panel */;

export type QuizStepId = "basics" | "sizes" | "body" | "cut" | "colour" | "life" | "order";

export type QuizFieldKey = "occasion" | "top" | "bottomW" | "bra" | "shoeW" | "fitpref" | "brand" | "heightW" | "shoulders" | "arms" | "torso" | "shapeW" | "__exact" | "sleeve" | "length" | "modest" | "cover" | "never" | "tone" | "lovecol" | "life" | "bold" | "mode" | "looks";

export type QuizField = {
  readonly key: QuizFieldKey;
  readonly kind: FieldKind;
  /** The answer may be left blank. */
  readonly optional?: boolean;
  /** Options are literal values (sizes, heights) shown as-is, never translated. */
  readonly bare?: boolean;
  /** Lay the options out as a grid rather than a row. */
  readonly grid?: boolean;
  /** Only asked once this other field has an answer. */
  readonly needs?: QuizFieldKey;
  readonly options?: readonly string[];
  /** tone only: the swatch colours shown for each option. */
  readonly swatches?: Readonly<Record<string, readonly string[]>>;
  /** measurements only: the individual centimetre inputs. */
  readonly measurements?: readonly { readonly key: string }[];
};

export type QuizStep = {
  readonly id: QuizStepId;
  readonly fields: readonly QuizField[];
};

export const quizSteps: readonly QuizStep[] = [
  {
    id: "basics",
    fields: [
      { key: "occasion", kind: "single", options: ["wedding", "eid", "grad", "work", "travel", "everyday"] },
    ],
  },
  {
    id: "sizes",
    fields: [
      { key: "top", kind: "single", bare: true, options: ["XS", "S", "M", "L", "XL", "2XL", "3XL"] },
      { key: "bottomW", kind: "single", bare: true, options: ["34", "36", "38", "40", "42", "44", "46", "48"] },
      { key: "bra", kind: "single", optional: true, bare: true, options: ["70", "75", "80", "85", "90", "95", "100", "A", "B", "C", "D", "DD", "E"] },
      { key: "shoeW", kind: "single", bare: true, options: ["35", "36", "37", "38", "39", "40", "41", "42"] },
      { key: "fitpref", kind: "single", options: ["fitted", "true", "relaxed", "oversized"] },
      { key: "brand", kind: "text" },
    ],
  },
  {
    id: "body",
    fields: [
      { key: "heightW", kind: "single", bare: true, options: ["<150", "150-155", "156-160", "161-165", "166-170", "171-175", "176+"] },
      { key: "shoulders", kind: "single", grid: true, options: ["narrow", "average", "broad"] },
      { key: "arms", kind: "single", grid: true, options: ["short", "average", "long"] },
      { key: "torso", kind: "single", grid: true, options: ["short", "average", "long"] },
      { key: "shapeW", kind: "single", grid: true, options: ["hourglass", "pear", "rectangle", "apple", "inverted", "unsure"] },
      { key: "__exact", kind: "measurements", measurements: [{ key: "bust" }, { key: "waist" }, { key: "hip" }, { key: "shoulderCm" }, { key: "armCm" }, { key: "inseam" }] },
    ],
  },
  {
    id: "cut",
    fields: [
      { key: "sleeve", kind: "single", options: ["long", "threequarter", "any"] },
      { key: "length", kind: "single", options: ["maxi", "midi", "any"] },
      { key: "modest", kind: "multi", optional: true, options: ["hijab", "abaya", "opaque", "nolayer"] },
      { key: "cover", kind: "multi", optional: true, options: ["arms", "waist", "legs", "shoulders", "chest", "back", "nothing"] },
      { key: "never", kind: "multi", optional: true, options: ["tight", "prints", "heels", "neon", "crop", "logos"] },
    ],
  },
  {
    id: "colour",
    fields: [
      { key: "tone", kind: "tone", options: ["warm", "cool", "neutral"], swatches: { "warm": ["#F0D9B5", "#DEB887", "#B98A5B", "#8C6239"], "cool": ["#F6DDD8", "#E0B7AE", "#B98A8A", "#7A5450"], "neutral": ["#F2E3D0", "#D9BFA6", "#AD8E74", "#6E5744"] } },
      { key: "lovecol", kind: "multi", optional: true, options: ["black", "earth", "blue", "green", "jewel", "pastel"] },
    ],
  },
  {
    id: "life",
    fields: [
      { key: "life", kind: "multi", options: ["office", "uni", "home", "outings", "travel", "active"] },
      { key: "bold", kind: "single", grid: true, options: ["quiet", "polished", "statement"] },
    ],
  },
  {
    id: "order",
    fields: [
      { key: "mode", kind: "single", options: ["online", "inPerson"] },
      { key: "looks", kind: "single", options: ["1", "2", "3"] },
    ],
  },
] as const;

/** Where answers are persisted, so the quiz survives a refresh. */
export const QUIZ_STORAGE_KEY = "simply-styled:style-profile";

