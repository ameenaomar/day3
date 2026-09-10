import { chromium } from "@playwright/test";

/**
 * The paths that only exist when Supabase's "Confirm email" is on, which is
 * its default. Start the mock with CONFIRM_EMAIL=1.
 */
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const MOCK = process.env.MOCK_URL ?? "http://127.0.0.1:54321";
const stamp = Date.now();
const EMAIL = `confirm.${stamp}@example.com`;
const PASS = "correct-horse-8";
const NAME = "Noura Al-Sabah";

let failures = 0;
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail && !ok ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
};

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const page = await browser.newPage();
page.on("pageerror", (e) => check("no page errors", false, String(e)));

async function fillSignUp(email) {
  await page.goto(`${BASE}/en/signup`);
  await page.fill("#signup-name", NAME);
  await page.fill("#signup-email", email);
  await page.fill("#signup-password", PASS);
  await page.fill("#signup-password-confirm", PASS);
  await page.click('form button:has-text("Create my file")');
}

await fillSignUp(EMAIL);
await page.waitForSelector("text=Confirm your email");
check("signup asks the customer to confirm", true);
check("it names the address it wrote to", (await page.textContent(".swiss-mail")).includes(EMAIL));

// Signing in before confirming must say so, not "wrong password".
await page.goto(`${BASE}/en/signin`);
await page.fill("#signin-email", EMAIL);
await page.fill("#signin-password", PASS);
await page.click('form button:has-text("Sign in")');
await page.waitForSelector("text=Confirm your email first");
check("signin tells an unconfirmed customer to confirm", true);

// A second sign-up with the same address must not reveal that it is taken.
await fillSignUp(EMAIL);
await page.waitForSelector("text=Confirm your email");
check("a second signup does not disclose that the email is taken", true);

// Opening the link: Supabase verifies the token and the session exists from
// then on. Stand in for the click.
const session = await fetch(`${MOCK}/test/confirm`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ email: EMAIL }),
}).then((r) => r.json());
check("the mock confirmed the account", Boolean(session.access_token));

await page.goto(`${BASE}/en/signin`);
await page.fill("#signin-email", EMAIL);
await page.fill("#signin-password", PASS);
await page.click('form button:has-text("Sign in")');
await page.waitForURL(`${BASE}/`);
check("a confirmed customer can sign in", true);

const me = await page.evaluate(() => fetch("/api/me").then((r) => r.json()));
check("the front door sees them", me.signedIn === true && me.name === NAME, JSON.stringify(me));

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
