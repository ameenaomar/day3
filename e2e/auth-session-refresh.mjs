import { chromium } from "@playwright/test";

/**
 * The session-refresh paths.
 *
 * The mock issues 100-second access tokens for this run. supabase-js refreshes
 * when a token has under 90 seconds left (EXPIRY_MARGIN_MS), so a short wait
 * puts the session inside that window and the next request has to rotate it —
 * once, not once per server client, which is the part worth checking.
 */
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const MOCK = process.env.MOCK_URL ?? "http://127.0.0.1:54321";
const PASS = "correct-horse-8";
const EMAIL = `refresh.${Date.now()}@example.com`;

let failures = 0;
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail && !ok ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
};

await fetch(`${MOCK}/auth/v1/signup`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ email: EMAIL, password: PASS, data: { name: "Noura Al-Sabah", locale: "en" } }),
});

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });

// ------------------------------------------------------------------ Next app
const page = await browser.newPage();
page.on("pageerror", (e) => check("no page errors", false, String(e)));

await page.goto(`${BASE}/en/signin`);
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASS);
await page.click('form button:has-text("Sign in")');
await page.waitForURL(`${BASE}/en/account`);

const tokenCookie = async () =>
  (await page.context().cookies()).find((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"))?.value ?? "";
const before = await tokenCookie();
check("signed in", before.length > 0);

// Inside the expiry margin now.
await page.waitForTimeout(15_000);
await page.goto(`${BASE}/en/account`);
check("still signed in after the token entered its expiry margin", page.url() === `${BASE}/en/account`, page.url());
const after = await tokenCookie();
check("the proxy rotated the session cookie", after.length > 0 && after !== before);

// And again, to be sure the rotated token is itself usable.
await page.goto(`${BASE}/en/account`);
check("still signed in on the next request", page.url() === `${BASE}/en/account`, page.url());

// ----------------------------------------------------------------- prototype
const proto = await browser.newPage();
proto.on("pageerror", (e) => check("no prototype page errors", false, String(e)));
await proto.goto(`${BASE}/`);
await proto.fill('#app input[type="email"]', EMAIL);
await proto.fill('#app input[type="password"]', PASS);
await proto.click('#app button:has-text("Sign in")');
await proto.waitForSelector("#who.on");
const storedBefore = await proto.evaluate(() => localStorage.getItem("ss.auth.v1"));

// Age the stored session past its expiry, keeping the refresh token.
await proto.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("ss.auth.v1"));
  s.expires_at = Math.floor(Date.now() / 1000) - 60;
  localStorage.setItem("ss.auth.v1", JSON.stringify(s));
});
await proto.reload();
await proto.waitForSelector("#who.on");
check("prototype refreshed an expired session on reload", true);
const storedAfter = await proto.evaluate(() => localStorage.getItem("ss.auth.v1"));
check("prototype stored the refreshed token", Boolean(storedAfter) && storedAfter !== storedBefore);

// A session the auth server has rejected must not keep the customer "signed in".
await proto.evaluate(() =>
  localStorage.setItem(
    "ss.auth.v1",
    JSON.stringify({ access_token: "stale", refresh_token: "stale", expires_at: 1, name: "", email: "" }),
  ),
);
await proto.reload();
await proto.waitForSelector("text=Sign in to your file");
check("prototype falls back to sign in when the stored session is dead", true);
check(
  "prototype discarded the dead session",
  (await proto.evaluate(() => localStorage.getItem("ss.auth.v1"))) === null,
);

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
