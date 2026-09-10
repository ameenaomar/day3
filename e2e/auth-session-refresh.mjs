import { chromium } from "@playwright/test";

/**
 * Token refresh through the proxy.
 *
 * Run the mock with TOKEN_TTL=100 and REFRESH_REUSE_MS=0. supabase-js refreshes
 * when a token has under 90 seconds left, so a short wait puts the session
 * inside that window; the zero reuse grace is what catches a proxy handing the
 * route a refresh token it has already spent.
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
  body: JSON.stringify({
    email: EMAIL,
    password: PASS,
    data: { name: "Noura Al-Sabah", locale: "en" },
  }),
});

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const page = await browser.newPage();
page.on("pageerror", (e) => check("no page errors", false, String(e)));

await page.goto(`${BASE}/en/signin`);
await page.fill("#signin-email", EMAIL);
await page.fill("#signin-password", PASS);
await page.click('form button:has-text("Sign in")');
await page.waitForURL(`${BASE}/`);

const token = async () =>
  (await page.context().cookies()).find(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"),
  )?.value ?? "";
const before = await token();
check("signed in", before.length > 0);

// Inside the expiry margin now.
await page.waitForTimeout(15_000);
await page.goto(`${BASE}/en/signin`);
await page.waitForSelector("text=Signed in as");
check("still signed in after the token entered its expiry margin", true);
const after = await token();
check("the proxy rotated the session cookie", after.length > 0 && after !== before);

// And the rotated token is itself usable.
const me = await page.evaluate(() => fetch("/api/me").then((r) => r.json()));
check("the rotated session still answers api/me", me.signedIn === true, JSON.stringify(me));

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
