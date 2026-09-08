import { describe, expect, it } from "vitest";
import {
  GOVERNORATES,
  formatKuwaitiPhone,
  isGovernorate,
  normaliseKuwaitiPhone,
} from "@/lib/kuwait";

describe("normaliseKuwaitiPhone", () => {
  it("accepts the three valid prefixes", () => {
    expect(normaliseKuwaitiPhone("50012345")).toBe("+96550012345");
    expect(normaliseKuwaitiPhone("60012345")).toBe("+96560012345");
    expect(normaliseKuwaitiPhone("90012345")).toBe("+96590012345");
  });

  it("accepts what people actually type", () => {
    expect(normaliseKuwaitiPhone("+965 5001 2345")).toBe("+96550012345");
    expect(normaliseKuwaitiPhone("00965-50012345")).toBe("+96550012345");
    expect(normaliseKuwaitiPhone("96550012345")).toBe("+96550012345");
    expect(normaliseKuwaitiPhone(" 5001-2345 ")).toBe("+96550012345");
    expect(normaliseKuwaitiPhone("٥٠٠١٢٣٤٥")).toBe("+96550012345");
  });

  it("rejects prefixes Kuwait does not issue to mobiles", () => {
    expect(normaliseKuwaitiPhone("10012345")).toBeNull();
    expect(normaliseKuwaitiPhone("20012345")).toBeNull();
    expect(normaliseKuwaitiPhone("40012345")).toBeNull();
    expect(normaliseKuwaitiPhone("70012345")).toBeNull();
    expect(normaliseKuwaitiPhone("80012345")).toBeNull();
  });

  it("rejects the wrong number of digits", () => {
    expect(normaliseKuwaitiPhone("5001234")).toBeNull();
    expect(normaliseKuwaitiPhone("500123456")).toBeNull();
    expect(normaliseKuwaitiPhone("")).toBeNull();
  });

  it("rejects other countries rather than guessing", () => {
    expect(normaliseKuwaitiPhone("+971501234567")).toBeNull();
    expect(normaliseKuwaitiPhone("+966501234567")).toBeNull();
    expect(normaliseKuwaitiPhone("+44 7700 900123")).toBeNull();
  });

  it("rejects letters", () => {
    expect(normaliseKuwaitiPhone("5001234a")).toBeNull();
    expect(normaliseKuwaitiPhone("call me")).toBeNull();
  });
});

describe("formatKuwaitiPhone", () => {
  it("groups as 5XXX XXXX", () => {
    expect(formatKuwaitiPhone("+96550012345")).toBe("5001 2345");
  });

  it("passes anything unexpected through untouched", () => {
    expect(formatKuwaitiPhone("+4477009001")).toBe("+4477009001");
  });
});

describe("isGovernorate", () => {
  it("accepts the six governorates", () => {
    expect(GOVERNORATES).toHaveLength(6);
    for (const g of GOVERNORATES) expect(isGovernorate(g)).toBe(true);
  });

  it("rejects anywhere else", () => {
    expect(isGovernorate("dubai")).toBe(false);
    expect(isGovernorate("")).toBe(false);
  });
});
