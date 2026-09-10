import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const MOCK = process.env.MOCK_URL ?? "http://127.0.0.1:54321";
const stamp = Date.now();
const PASS = "correct-horse-8";

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail && !ok ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });

// ------------------------------------------------- Next app, confirmation on
const page = await browser.newPage();
page.on("pageerror", (e) => check("no page errors", false, String(e)));
const EMAIL = `confirm.${stamp}@example.com`;

await page.goto(`${BASE}/en/signup`);
await page.fill('input[name="name"]', "Noura Al-Sabah");
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASS);
await page.fill('input[name="passwordConfirm"]', PASS);
await page.click('form button:has-text("Create account")');
await page.waitForURL(`${BASE}/en/signup/check-email`);
check("signup lands on check-your-email when confirmation is on", true);

// Signing in before confirming must say so, not "wrong password".
await page.goto(`${BASE}/en/signin`);
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASS);
await page.click('form button:has-text("Sign in")');
await page.waitForSelector("text=Confirm your email first");
check("signin tells an unconfirmed customer to confirm", true);

// Signing up again with the same address must not reveal that it is taken.
await page.goto(`${BASE}/ar/signup`);
await page.fill('input[name="name"]', "Noura Al-Sabah");
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASS);
await page.fill('input[name="passwordConfirm"]', PASS);
await page.click('form button:has-text("إنشاء الحساب")');
await page.waitForURL(`${BASE}/ar/signup/check-email`);
check("a second signup does not disclose that the email is taken", true);

// ------------------------------------------------- prototype, confirmation on
const proto = await browser.newPage();
proto.on("pageerror", (e) => check("no prototype page errors", false, String(e)));
const PEMAIL = `proto.confirm.${stamp}@example.com`;

await proto.goto(`${BASE}/`);
await proto.waitForSelector("text=Sign in to your file");
await proto.click('button:has-text("No account yet")');
await proto.fill('#app input[type="text"]', "Dana Al-Fahad");
await proto.fill('#app input[type="email"]', PEMAIL);
await proto.fill('#app input[type="password"]', PASS);
await proto.click('#app button:has-text("Create my account")');
await proto.waitForSelector("#app .ok");
check("prototype shows the check-your-email note", true);
check(
  "prototype note is the confirmation wording",
  (await proto.textContent("#app .ok")).includes("Check your email"),
);

// An unconfirmed sign-in attempt.
await proto.click('button:has-text("Already have an account")');
await proto.fill('#app input[type="email"]', PEMAIL);
await proto.fill('#app input[type="password"]', PASS);
await proto.click('#app button:has-text("Sign in")');
await proto.waitForSelector("text=Confirm your email first");
check("prototype tells an unconfirmed customer to confirm", true);

// The confirmation link: Supabase sends the browser back with the tokens in
// the URL fragment. Stand in for that.
const session = await fetch(`${MOCK}/test/confirm`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ email: PEMAIL }),
}).then((r) => r.json());

const fragment = new URLSearchParams({
  access_token: session.access_token,
  refresh_token: session.refresh_token,
  expires_at: String(session.expires_at),
  token_type: "bearer",
  type: "signup",
});
await proto.goto(`${BASE}/#${fragment}`);
await proto.waitForSelector("#who.on");
check("prototype signs in from a confirmation link", true);
check("prototype greets the confirmed customer", (await proto.textContent("#who")).includes("Dana"));
check("prototype scrubbed the tokens out of the address bar", !proto.url().includes("access_token"),
  proto.url());
check(
  "prototype kept the session from the link",
  Boolean(await proto.evaluate(() => localStorage.getItem("ss.auth.v1"))),
);

// An expired link comes back as an error in the fragment.
await proto.evaluate(() => localStorage.clear());
await proto.goto(`${BASE}/#error=access_denied&error_description=Email+link+is+invalid+or+has+expired`);
await proto.waitForSelector("#app .err");
check("prototype reports an expired link", (await proto.textContent("#app .err")).includes("expired"));
check("prototype scrubbed the error out of the address bar", !proto.url().includes("error"), proto.url());

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
