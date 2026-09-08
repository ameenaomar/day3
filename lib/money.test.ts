import { describe, expect, it } from "vitest";
import { dinars, formatKwd, parseKwdToFils } from "@/lib/money";

describe("formatKwd", () => {
  it("renders three decimal places in English", () => {
    expect(formatKwd(10_000, "en")).toBe("10.000 KD");
    expect(formatKwd(2_000, "en")).toBe("2.000 KD");
    expect(formatKwd(0, "en")).toBe("0.000 KD");
    expect(formatKwd(500, "en")).toBe("0.500 KD");
    expect(formatKwd(5, "en")).toBe("0.005 KD");
  });

  it("renders Arabic-Indic digits with the Arabic decimal separator", () => {
    expect(formatKwd(10_000, "ar")).toBe("١٠٫٠٠٠ د.ك");
    expect(formatKwd(250_000, "ar")).toBe("٢٥٠٫٠٠٠ د.ك");
    expect(formatKwd(0, "ar")).toBe("٠٫٠٠٠ د.ك");
  });

  it("groups thousands in both locales", () => {
    expect(formatKwd(1_250_000, "en")).toBe("1,250.000 KD");
    expect(formatKwd(1_250_000, "ar")).toBe("١٬٢٥٠٫٠٠٠ د.ك");
  });

  it("signs negative amounts, for refunds", () => {
    expect(formatKwd(-40_000, "en")).toBe("-40.000 KD");
    expect(formatKwd(-40_000, "ar")).toBe("-٤٠٫٠٠٠ د.ك");
  });

  it("never accepts a non-integer, which would mean someone used dinars", () => {
    expect(() => formatKwd(10.5, "en")).toThrow(TypeError);
  });
});

describe("dinars", () => {
  it("converts dinar literals to fils", () => {
    expect(dinars(10)).toBe(10_000);
    expect(dinars(2)).toBe(2_000);
    expect(dinars(0.005)).toBe(5);
  });
});

describe("parseKwdToFils", () => {
  it("parses stylist input without float rounding", () => {
    expect(parseKwdToFils("12")).toBe(12_000);
    expect(parseKwdToFils("12.5")).toBe(12_500);
    expect(parseKwdToFils("12.500")).toBe(12_500);
    expect(parseKwdToFils(" 8.750 ")).toBe(8_750);
    expect(parseKwdToFils("1,250.000")).toBe(1_250_000);
  });

  it("parses Arabic-Indic input", () => {
    expect(parseKwdToFils("١٢٫٥٠٠")).toBe(12_500);
  });

  it("rejects anything else rather than guessing", () => {
    expect(parseKwdToFils("")).toBeNull();
    expect(parseKwdToFils("abc")).toBeNull();
    expect(parseKwdToFils("12.5000")).toBeNull();
    expect(parseKwdToFils("12,5.5")).toBeNull();
  });

  it("round-trips through formatKwd", () => {
    for (const fils of [0, 5, 500, 12_500, 250_000, 1_250_000]) {
      const formatted = formatKwd(fils, "en").replace(" KD", "");
      expect(parseKwdToFils(formatted)).toBe(fils);
    }
  });
});

describe("parseKwdToFils grouping", () => {
  it("accepts correct thousands grouping", () => {
    expect(parseKwdToFils("1,250")).toBe(1_250_000);
    expect(parseKwdToFils("1,250,500.750")).toBe(1_250_500_750);
  });

  it("rejects mistyped grouping rather than reading it tenfold wrong", () => {
    expect(parseKwdToFils("12,5")).toBeNull();
    expect(parseKwdToFils("12,5.5")).toBeNull();
    expect(parseKwdToFils("1,25,000")).toBeNull();
    expect(parseKwdToFils(",250")).toBeNull();
  });
});
