import { describe, expect, it } from "vitest";
import { BUDGET_TIERS_FILS, PricingError, computeQuote, computeRefund } from "@/lib/pricing";

describe("computeQuote", () => {
  it("charges 10.000 KD styling per look plus the tier per look", () => {
    const q = computeQuote({ lookCount: 1, budgetTierFils: 40_000, paymentModel: "prepaid_full" });
    expect(q.stylingFeeFils).toBe(10_000);
    expect(q.clothingBudgetFils).toBe(40_000);
    expect(q.totalFils).toBe(50_000);
  });

  it("scales both the fee and the budget with the number of looks", () => {
    const q = computeQuote({ lookCount: 3, budgetTierFils: 80_000, paymentModel: "prepaid_full" });
    expect(q.stylingFeeFils).toBe(30_000);
    expect(q.clothingBudgetFils).toBe(240_000);
    expect(q.totalFils).toBe(270_000);
  });

  it("adds nothing to the fee and the budget — there is no delivery to charge", () => {
    for (const tier of BUDGET_TIERS_FILS) {
      for (let looks = 1; looks <= 5; looks++) {
        const q = computeQuote({ lookCount: looks, budgetTierFils: tier, paymentModel: "prepaid_full" });
        expect(q.totalFils).toBe(q.stylingFeeFils + q.clothingBudgetFils);
      }
    }
  });

  it("under fee_first takes only the styling fee at checkout", () => {
    const q = computeQuote({ lookCount: 2, budgetTierFils: 150_000, paymentModel: "fee_first" });
    expect(q.dueNowFils).toBe(20_000);
    expect(q.dueOnApprovalFils).toBe(q.totalFils - 20_000);
    expect(q.dueNowFils + q.dueOnApprovalFils).toBe(q.totalFils);
  });

  it("under prepaid_full takes everything at checkout", () => {
    const q = computeQuote({ lookCount: 2, budgetTierFils: 150_000, paymentModel: "prepaid_full" });
    expect(q.dueNowFils).toBe(q.totalFils);
    expect(q.dueOnApprovalFils).toBe(0);
  });

  it("always splits the total exactly, for every tier and look count", () => {
    for (const tier of BUDGET_TIERS_FILS) {
      for (let looks = 1; looks <= 5; looks++) {
        for (const model of ["prepaid_full", "fee_first"] as const) {
          const q = computeQuote({ lookCount: looks, budgetTierFils: tier, paymentModel: model });
          expect(q.dueNowFils + q.dueOnApprovalFils).toBe(q.totalFils);
          expect(Number.isInteger(q.totalFils)).toBe(true);
        }
      }
    }
  });

  it("rejects anything the browser might have tampered with", () => {
    expect(() => computeQuote({ lookCount: 0, budgetTierFils: 40_000 })).toThrow(PricingError);
    expect(() => computeQuote({ lookCount: 6, budgetTierFils: 40_000 })).toThrow(PricingError);
    expect(() => computeQuote({ lookCount: 1.5, budgetTierFils: 40_000 })).toThrow(PricingError);
    expect(() => computeQuote({ lookCount: 1, budgetTierFils: 41_000 })).toThrow(PricingError);
    expect(() => computeQuote({ lookCount: 1, budgetTierFils: 0 })).toThrow(PricingError);
  });
});

describe("computeRefund", () => {
  it("returns the unspent clothing budget under prepaid_full", () => {
    const q = computeQuote({ lookCount: 1, budgetTierFils: 80_000, paymentModel: "prepaid_full" });
    expect(computeRefund(q, 62_500)).toBe(17_500);
    expect(computeRefund(q, 80_000)).toBe(0);
  });

  it("never refunds more than was held, even if the stylist overspends", () => {
    const q = computeQuote({ lookCount: 1, budgetTierFils: 80_000, paymentModel: "prepaid_full" });
    expect(computeRefund(q, 95_000)).toBe(0);
  });

  it("has nothing to refund under fee_first", () => {
    const q = computeQuote({ lookCount: 1, budgetTierFils: 80_000, paymentModel: "fee_first" });
    expect(computeRefund(q, 10_000)).toBe(0);
  });
});
