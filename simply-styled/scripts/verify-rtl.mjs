#!/usr/bin/env node
/**
 * Drives a real browser against a running server and asserts that switching
 * language flips direction, swaps both typefaces, moves logical borders to the
 * other side, and survives a refresh.
 *
 * Usage:  npm run build && npm start &   then:  npm run verify:rtl
 * Env:    BASE_URL (default http://localhost:3000)
 *         CHROMIUM_PATH to use a Chromium already on the machine.
 */

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const launchOptions = process.env.CHROMIUM_PATH
  ? { executablePath: process.env.CHROMIUM_PATH }
  : {};

const failures = [];
const check = (label, actual, expected) => {
  if (actual !== expected) failures.push(`${label}: expected ${expected}, got ${actual}`);
};

const browser = await chromium.launch(launchOptions);
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const snapshot = () =>
  page.evaluate(() => {
    const root = document.documentElement;
    const h1 = document.querySelector("h1");
    // Anchored to an explicit marker rather than to h1's parent: the layout
    // moves, and a border assertion that silently starts measuring an
    // unbordered element passes for the wrong reason.
    const bordered = document.querySelector("[data-logical-border]");
    if (!bordered) throw new Error("no [data-logical-border] element on the page");
    const styles = getComputedStyle(bordered);

    // getComputedStyle returns the DECLARED stack, not the face actually drawn.
    // document.fonts.check() is no help either — it answers "can this render?",
    // which is true even for an unknown family, via fallback. So measure: a
    // family is really available only if setting it changes the text width
    // against a deliberately distinct base.
    const declared = getComputedStyle(h1)
      .fontFamily.split(",")
      .map((f) => f.trim().replace(/["']/g, ""));

    const width = (font) => {
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.font = `72px ${font}`;
      return ctx.measureText("ORANGE SOMMAR Simply Styled").width;
    };
    const base = width("monospace");
    const isAvailable = (family) => width(`"${family}", monospace`) !== base;
    const rendered = declared.find(isAvailable) ?? null;

    return {
      lang: root.lang,
      dir: root.dir,
      declaredFirst: declared[0],
      renderedFont: rendered,
      palmoreAvailable: isAvailable("Palmore"),
      borderLeft: styles.borderLeftWidth,
      borderRight: styles.borderRightWidth,
    };
  });

await page.goto(BASE_URL, { waitUntil: "networkidle" });

const en = await snapshot();
check("initial lang", en.lang, "en");
check("initial dir", en.dir, "ltr");
// Palmore is licensed and not in the repository, so it must head the declared
// stack while the free stand-in is what actually renders.
// Palmore is licensed and not in the repository: it must head the declared
// stack so it activates the moment the files land, while the free stand-in is
// what actually renders until then.
check("display stack starts with Palmore", en.declaredFirst, "Palmore");
check("Palmore absent (licensed, not committed)", en.palmoreAvailable, false);
check("English display face renders", en.renderedFont, "Yeseva One");
check("LTR hairline on inline-start (left)", `${en.borderLeft}/${en.borderRight}`, "1px/0px");

await page.getByRole("button", { name: /switch language|تغيير اللغة/i }).click();
await page.waitForFunction(() => document.documentElement.dir === "rtl", null, { timeout: 5000 });

const ar = await snapshot();
check("toggled lang", ar.lang, "ar");
check("toggled dir", ar.dir, "rtl");
check("Arabic display face renders", ar.renderedFont, "Amiri");
check("RTL hairline on inline-start (right)", `${ar.borderLeft}/${ar.borderRight}`, "0px/1px");

// Bidi: LTR technical strings (hex codes, emails, phone numbers, URLs) must be
// isolated, or the bidirectional algorithm reorders their neutral characters in
// Arabic — "#F0E9DD" renders as "F0E9DD#".
const unisolated = await page.evaluate(() => {
  const TECHNICAL = /^\s*(#[0-9A-Fa-f]{3,8}|[\w.+-]+@[\w.-]+\.\w+|https?:\/\/\S+|\+?\d[\d\s()-]{6,})\s*$/;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const bad = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.textContent ?? "";
    if (!TECHNICAL.test(text)) continue;
    if (!n.parentElement?.closest('[dir="ltr"]')) bad.push(text.trim());
  }
  return bad;
});
check("LTR technical strings isolated in RTL", unisolated.join(",") || "none", "none");

await page.reload({ waitUntil: "networkidle" });
const persisted = await snapshot();
check("lang survives refresh", persisted.lang, "ar");
check("dir survives refresh", persisted.dir, "rtl");
check("face survives refresh", persisted.renderedFont, "Amiri");

await browser.close();

if (failures.length > 0) {
  console.error("RTL verification failed:\n");
  for (const f of failures) console.error("  ✗ " + f);
  process.exit(1);
}

console.log("OK — direction, typeface and logical borders all flip, and persist across a refresh.");
