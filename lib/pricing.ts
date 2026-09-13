/**
 * The only thing in the codebase that knows the prices.
 *
 * The client renders the numbers this returns; on submit the server recomputes
 * from the stored answers and refuses any total that arrived from a browser.
 */

/** 10.000 KD per look. */
export const STYLING_FEE_PER_LOOK_FILS = 10_000;

/** The four clothing budget tiers, held per look. */
export const BUDGET_TIERS_FILS = [40_000, 80_000, 150_000, 250_000] as const;

export type BudgetTierFils = (typeof BUDGET_TIERS_FILS)[number];

export const MIN_LOOKS = 1;
/** TODO: confirm against public/simply-styled.html — the prototype sets the ceiling. */
export const MAX_LOOKS = 5;

/**
 * `prepaid_full` — styling fee plus the whole clothing budget up front, unused
 * budget refunded within 3 working days.
 * `fee_first` — styling fee up front, clothes charged after the customer
 * approves the look on WhatsApp.
 *
 * Both are supported by the schema so switching is configuration, not a
 * migration.
 */
export const paymentModels = ["prepaid_full", "fee_first"] as const;
export type PaymentModel = (typeof paymentModels)[number];

export const DEFAULT_PAYMENT_MODEL: PaymentModel = "fee_first";

export interface QuoteInput {
  lookCount: number;
  budgetTierFils: number;
  paymentModel?: PaymentModel;
}

export interface Quote {
  lookCount: number;
  budgetTierFils: number;
  paymentModel: PaymentModel;
  /** 10.000 KD × looks. */
  stylingFeeFils: number;
  /** tier × looks — held, not spent. */
  clothingBudgetFils: number;
  totalFils: number;
  /** Charged at checkout. */
  dueNowFils: number;
  /** Charged after the customer approves the look. Zero under prepaid_full. */
  dueOnApprovalFils: number;
}

export class PricingError extends Error {}

export function isBudgetTier(value: number): value is BudgetTierFils {
  return (BUDGET_TIERS_FILS as readonly number[]).includes(value);
}

export function computeQuote(input: QuoteInput): Quote {
  const { lookCount, budgetTierFils } = input;
  const paymentModel = input.paymentModel ?? DEFAULT_PAYMENT_MODEL;

  if (!Number.isInteger(lookCount) || lookCount < MIN_LOOKS || lookCount > MAX_LOOKS) {
    throw new PricingError(`lookCount must be an integer ${MIN_LOOKS}-${MAX_LOOKS}, got ${lookCount}`);
  }
  if (!isBudgetTier(budgetTierFils)) {
    throw new PricingError(`budgetTierFils must be one of the offered tiers, got ${budgetTierFils}`);
  }

  const stylingFeeFils = STYLING_FEE_PER_LOOK_FILS * lookCount;
  const clothingBudgetFils = budgetTierFils * lookCount;
  const totalFils = stylingFeeFils + clothingBudgetFils;

  const dueNowFils = paymentModel === "fee_first" ? stylingFeeFils : totalFils;
  const dueOnApprovalFils = totalFils - dueNowFils;

  return {
    lookCount,
    budgetTierFils,
    paymentModel,
    stylingFeeFils,
    clothingBudgetFils,
    totalFils,
    dueNowFils,
    dueOnApprovalFils,
  };
}

/**
 * What goes back to the customer when the stylist spends less than the held
 * budget. Under fee_first there is usually nothing to refund, because the
 * clothes are charged at their actual cost.
 */
export function computeRefund(quote: Quote, spentFils: number): number {
  if (!Number.isInteger(spentFils) || spentFils < 0) {
    throw new PricingError(`spentFils must be a non-negative integer, got ${spentFils}`);
  }
  if (quote.paymentModel === "fee_first") return 0;
  return Math.max(0, quote.clothingBudgetFils - spentFils);
}
