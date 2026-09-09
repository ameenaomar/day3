import { describe, expect, it } from "vitest";
import {
  formatKuwaitMobile,
  kuwaitMobileDigits,
  parseSignUp,
  signUpFromFormData,
  toE164,
} from "@/lib/signup";

describe("kuwaitMobileDigits", () => {
  it("accepts the shapes people actually type", () => {
    for (const raw of ["99887766", "9988 7766", "+965 9988 7766", "+96599887766", "0096599887766", "965-99887766"]) {
      expect(kuwaitMobileDigits(raw)).toBe("99887766");
    }
  });

  it("accepts every valid Kuwaiti mobile prefix", () => {
    expect(kuwaitMobileDigits("50001234")).toBe("50001234");
    expect(kuwaitMobileDigits("60001234")).toBe("60001234");
    expect(kuwaitMobileDigits("90001234")).toBe("90001234");
  });

  it("rejects landlines, wrong lengths and other countries", () => {
    for (const raw of ["22334455", "1234567", "999887766", "", "abc", "+971501234567"]) {
      expect(kuwaitMobileDigits(raw)).toBeNull();
    }
  });

  it("keeps 965 when it is the number itself, not a country code", () => {
    // Eight digits starting 9 — a real mobile that happens to begin 965.
    expect(kuwaitMobileDigits("96512345")).toBe("96512345");
  });
});

describe("formatKuwaitMobile", () => {
  it("groups four and four, and never exceeds eight digits", () => {
    expect(formatKuwaitMobile("9988")).toBe("9988");
    expect(formatKuwaitMobile("99887766")).toBe("9988 7766");
    expect(formatKuwaitMobile("9988776612345")).toBe("9988 7766");
    expect(formatKuwaitMobile("abc9988x7766")).toBe("9988 7766");
  });
});

describe("parseSignUp", () => {
  const valid = { name: "Ameena Omar", email: "Ameena@Example.com", phone: "9988 7766", marketingOptIn: true, locale: "ar" };

  it("normalises what it accepts", () => {
    const result = parseSignUp(valid);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values.name).toBe("Ameena Omar");
    expect(result.values.email).toBe("ameena@example.com");
    expect(result.values.phone).toBe(toE164("99887766"));
    expect(result.values.marketingOptIn).toBe(true);
    expect(result.values.locale).toBe("ar");
  });

  it("treats the phone as optional", () => {
    const result = parseSignUp({ ...valid, phone: "" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values.phone).toBeNull();
  });

  it("defaults marketing consent to off", () => {
    const result = parseSignUp({ name: "Ameena Omar", email: "a@b.com" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values.marketingOptIn).toBe(false);
    expect(result.values.locale).toBe("en");
  });

  it("reports a missing name and a bad email by code", () => {
    const result = parseSignUp({ name: "", email: "not-an-email" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.name).toBe("name_required");
    expect(result.errors.email).toBe("email_invalid");
  });

  it("rejects a one-letter name and a non-Kuwaiti phone", () => {
    const result = parseSignUp({ name: "A", email: "a@b.com", phone: "22334455" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.name).toBe("name_short");
    expect(result.errors.phone).toBe("phone_invalid");
  });

  it("gives one error per field", () => {
    const result = parseSignUp({ name: "", email: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual(["email", "name"]);
  });
});

describe("signUpFromFormData", () => {
  it("reads a plain form post, unchecked checkbox and all", () => {
    const form = new FormData();
    form.set("name", "  Yousef Al Ali  ");
    form.set("email", " YOUSEF@example.com ");
    form.set("locale", "en");
    const result = signUpFromFormData(form);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values.name).toBe("Yousef Al Ali");
    expect(result.values.email).toBe("yousef@example.com");
    expect(result.values.marketingOptIn).toBe(false);
    expect(result.values.phone).toBeNull();
  });

  it("reads a ticked consent box", () => {
    const form = new FormData();
    form.set("name", "Ameena Omar");
    form.set("email", "a@b.com");
    form.set("marketingOptIn", "on");
    const result = signUpFromFormData(form);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values.marketingOptIn).toBe(true);
  });
});
