#!/usr/bin/env node
/**
 * Drives the Style Profile quiz in a real browser and asserts the behaviour the
 * brief calls for: answers persist across a refresh, survive a mid-quiz
 * language switch, and the conditional fields follow the audience answer.
 *
 * Usage:  npm run build && npm start &   then:  npm run verify:quiz
 * Env:    BASE_URL (default http://localhost:3000), CHROMIUM_PATH
 */

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};

const failures = [];
const check = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
};

const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1100, height: 1000 } });

const selected = () =>
  page.$$eval('[aria-checked="true"]', (els) => els.map((e) => e.textContent.trim().split("\n")[0]));
const stored = () =>
  page.evaluate(() => JSON.parse(localStorage.getItem("simply-styled:style-profile") ?? "null"));
const fieldLabels = () =>
  page.$$eval("fieldset .text-label, label .text-label", (els) =>
    els.map((e) => e.textContent.replace(/\s*\*$/, "").trim()));

await page.goto(`${BASE_URL}/quiz`, { waitUntil: "networkidle" });
await page.waitForSelector('[role="radio"]');

// --- step 1: the audience answer gates the next question -------------------
check("occasion hidden until audience is chosen",
  await page.$$eval('[role="radiogroup"]', (g) => g.length), 1);

await page.getByRole("radio", { name: "Women" }).click();
await page.waitForTimeout(150);
check("occasion appears after choosing an audience",
  await page.$$eval('[role="radiogroup"]', (g) => g.length), 2);

// --- advancing requires the required answers -------------------------------
await page.getByRole("button", { name: /Continue/i }).click();
await page.waitForTimeout(200);
check("blocked while a required answer is missing",
  await page.$$eval("h1", (h) => h[0].textContent.includes("Who are we styling")), true);

await page.getByRole("radio", { name: "Wedding or party" }).click();
await page.getByRole("button", { name: /Continue/i }).click();
await page.waitForTimeout(300);
check("advances once answered",
  await page.$eval("h1", (h) => h.textContent.trim()), "The sizes you buy today.");

// --- women-only fields are the ones asked ----------------------------------
const labels = await fieldLabels();
check("women's size fields asked", labels.includes("Bottom (EU)"), true);
check("men's size fields not asked", labels.includes("Waist (inches)"), false);

await page.getByRole("radio", { name: "M", exact: true }).first().click();
await page.waitForTimeout(150);
const before = await stored();
check("answers written to storage", before.answers.who, "women");
check("step index written to storage", before.step, 1);

// --- survives a refresh ----------------------------------------------------
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("h1");
check("step survives refresh",
  await page.$eval("h1", (h) => h.textContent.trim()), "The sizes you buy today.");
check("answers survive refresh", (await stored()).answers.who, "women");
check("selection still marked after refresh", (await selected()).includes("M"), true);

// --- survives a mid-quiz language switch -----------------------------------
await page.evaluate(() => {
  localStorage.setItem("simply-styled:locale", "ar");
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForFunction(() => document.documentElement.dir === "rtl");
await page.waitForTimeout(400);

check("still Arabic", await page.evaluate(() => document.documentElement.lang), "ar");
check("question is translated",
  await page.$eval("h1", (h) => h.textContent.trim()), "المقاسات التي تشترينها اليوم.");
const after = await stored();
check("answers unchanged by the language switch", after.answers, before.answers);
check("step unchanged by the language switch", after.step, before.step);
check("selection still marked in Arabic", (await selected()).includes("M"), true);

await browser.close();

if (failures.length > 0) {
  console.error("Quiz verification failed:\n");
  for (const f of failures) console.error("  ✗ " + f);
  process.exit(1);
}
console.log("OK — conditional fields, required answers, refresh and language switch all hold.");
