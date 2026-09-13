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
    const indented = h1.parentElement;
    const styles = getComputedStyle(indented);
    return {
      lang: root.lang,
      dir: root.dir,
      displayFont: getComputedStyle(h1).fontFamily.split(",")[0].replace(/["']/g, ""),
      borderLeft: styles.borderLeftWidth,
      borderRight: styles.borderRightWidth,
    };
  });

await page.goto(BASE_URL, { waitUntil: "networkidle" });

const en = await snapshot();
check("initial lang", en.lang, "en");
check("initial dir", en.dir, "ltr");
check("English display face", en.displayFont, "Cormorant Garamond");
check("LTR hairline on inline-start (left)", `${en.borderLeft}/${en.borderRight}`, "1px/0px");

await page.getByRole("button", { name: /switch language|تغيير اللغة/i }).click();
await page.waitForFunction(() => document.documentElement.dir === "rtl", null, { timeout: 5000 });

const ar = await snapshot();
check("toggled lang", ar.lang, "ar");
check("toggled dir", ar.dir, "rtl");
check("Arabic display face", ar.displayFont, "Amiri");
check("RTL hairline on inline-start (right)", `${ar.borderLeft}/${ar.borderRight}`, "0px/1px");

await page.reload({ waitUntil: "networkidle" });
const persisted = await snapshot();
check("lang survives refresh", persisted.lang, "ar");
check("dir survives refresh", persisted.dir, "rtl");
check("face survives refresh", persisted.displayFont, "Amiri");

await browser.close();

if (failures.length > 0) {
  console.error("RTL verification failed:\n");
  for (const f of failures) console.error("  ✗ " + f);
  process.exit(1);
}

console.log("OK — direction, typeface and logical borders all flip, and persist across a refresh.");
