import { describe, expect, it } from "vitest";
import { magicLinkState, safeRedirect, sessionExpiry, sessionIsLive } from "@/lib/magic-link";

const now = new Date("2026-09-09T12:00:00.000Z");

describe("magicLinkState", () => {
  it("is valid while unused and unexpired", () => {
    expect(magicLinkState({ expiresAt: new Date("2026-09-09T12:29:00Z"), usedAt: null }, now)).toBe("valid");
  });

  it("reports used before expired, because that is the more useful answer", () => {
    const used = { expiresAt: new Date("2026-09-09T11:00:00Z"), usedAt: new Date("2026-09-09T11:30:00Z") };
    expect(magicLinkState(used, now)).toBe("used");
  });

  it("counts a link used even inside its window", () => {
    const used = { expiresAt: new Date("2026-09-09T12:30:00Z"), usedAt: new Date("2026-09-09T11:59:00Z") };
    expect(magicLinkState(used, now)).toBe("used");
  });

  it("expires on the boundary second, not after it", () => {
    expect(magicLinkState({ expiresAt: now, usedAt: null }, now)).toBe("expired");
    expect(magicLinkState({ expiresAt: new Date(now.getTime() + 1), usedAt: null }, now)).toBe("valid");
  });
});

describe("sessions", () => {
  it("lasts sixty days from issue", () => {
    const expiry = sessionExpiry(now);
    expect(expiry.toISOString()).toBe("2026-11-08T12:00:00.000Z");
  });

  it("is live until its expiry passes", () => {
    expect(sessionIsLive(new Date(now.getTime() + 1000), now)).toBe(true);
    expect(sessionIsLive(now, now)).toBe(false);
    expect(sessionIsLive(new Date(now.getTime() - 1000), now)).toBe(false);
  });
});

describe("safeRedirect", () => {
  it("keeps the app's own paths", () => {
    expect(safeRedirect("/ar", "en")).toBe("/ar");
    expect(safeRedirect("/en/signup", "en")).toBe("/en/signup");
  });

  it("refuses to send anyone off-site", () => {
    for (const hostile of ["//evil.example.com", "https://evil.example.com", "javascript:alert(1)", "", null]) {
      expect(safeRedirect(hostile, "ar")).toBe("/ar");
    }
  });
});
