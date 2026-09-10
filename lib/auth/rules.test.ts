import { describe, expect, it } from "vitest";
import { checkSignIn, checkSignUp, isEmail, normaliseName } from "./rules";

describe("isEmail", () => {
  it("accepts an ordinary address", () => {
    expect(isEmail("noura@example.com")).toBe(true);
    expect(isEmail("  noura.al-sabah+orders@mail.example.co.uk  ")).toBe(true);
  });

  it("rejects the mistakes people actually make", () => {
    for (const bad of ["", "noura", "noura@", "@example.com", "noura@example", "a b@example.com"]) {
      expect(isEmail(bad), bad).toBe(false);
    }
  });
});

describe("normaliseName", () => {
  it("collapses whitespace", () => {
    expect(normaliseName("  Noura   Al-Sabah ")).toBe("Noura Al-Sabah");
  });
});

describe("checkSignIn", () => {
  it("passes a valid pair", () => {
    expect(checkSignIn({ email: "noura@example.com", password: "x" })).toEqual({});
  });

  it("flags a malformed email", () => {
    expect(checkSignIn({ email: "noura", password: "x" })).toEqual({ email: "errEmailInvalid" });
  });

  it("does not judge the length of an existing password", () => {
    // An account older than the current minimum must still be able to sign in.
    expect(checkSignIn({ email: "noura@example.com", password: "abc" })).toEqual({});
  });

  it("flags an empty password", () => {
    expect(checkSignIn({ email: "noura@example.com", password: "" })).toEqual({
      password: "errPasswordShort",
    });
  });
});

describe("checkSignUp", () => {
  const valid = {
    name: "Noura Al-Sabah",
    email: "noura@example.com",
    password: "correct-horse-8",
    passwordConfirm: "correct-horse-8",
  };

  it("passes a complete form", () => {
    expect(checkSignUp(valid)).toEqual({});
  });

  it("requires two names", () => {
    expect(checkSignUp({ ...valid, name: "Noura" }).name).toBe("errNameShort");
    expect(checkSignUp({ ...valid, name: "  N  " }).name).toBe("errNameShort");
  });

  it("requires eight characters", () => {
    expect(checkSignUp({ ...valid, password: "short7!", passwordConfirm: "short7!" }).password).toBe(
      "errPasswordShort",
    );
  });

  it("requires the confirmation to match", () => {
    expect(checkSignUp({ ...valid, passwordConfirm: "correct-horse-9" }).passwordConfirm).toBe(
      "errPasswordMismatch",
    );
  });

  it("reports the length before the mismatch, so one message shows at a time", () => {
    const errors = checkSignUp({ ...valid, password: "short", passwordConfirm: "different" });
    expect(errors.password).toBe("errPasswordShort");
    expect(errors.passwordConfirm).toBeUndefined();
  });
});
