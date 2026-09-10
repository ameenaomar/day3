import { chromium } from "@playwright/test";

/**
 * Sign-up, sign-in, sign-out and the front door's view of the session, with
 * email confirmation switched off in the mock.
 */
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const stamp = Date.now();
const EMAIL = `noura.${stamp}@example.com`;
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

const submitSignUp = () => page.click('form button:has-text("Create my file")');
const submitSignIn = () => page.click('form button:has-text("Sign in")');

// ------------------------------------------------------------------ sign-up
await page.goto(`${BASE}/en/signup`);
check("signup renders", (await page.textContent("h1")).includes("Create your file"));

await page.fill("#signup-name", "A");
await page.fill("#signup-email", "not-an-email");
await page.fill("#signup-password", PASS);
await page.fill("#signup-password-confirm", PASS);
await submitSignUp();
await page.waitForSelector("#signup-name-error");
check("signup rejects a one-letter name", true);
check("signup rejects a malformed email", await page.isVisible("#signup-email-error"));
check(
  "the password survived a rejected submit",
  (await page.inputValue("#signup-password")) === PASS,
);

await page.fill("#signup-name", NAME);
await page.fill("#signup-email", EMAIL);
await page.fill("#signup-phone", "2233 4455");
await submitSignUp();
await page.waitForSelector("#signup-phone-error");
check("signup rejects a landline as a WhatsApp number", true);

await page.fill("#signup-phone", "9988 7766");
await page.fill("#signup-password", "short7!");
await page.fill("#signup-password-confirm", "short7!");
await submitSignUp();
await page.waitForSelector("#signup-password-error");
check("signup enforces the password length", true);

await page.fill("#signup-password", PASS);
await page.fill("#signup-password-confirm", `${PASS}x`);
await submitSignUp();
await page.waitForSelector("#signup-password-confirm-error");
check("signup catches a mistyped confirmation", true);

// The reveal toggle turns both boxes into text.
await page.check('input[type="checkbox"]:right-of(:text("Show password"))').catch(() => {});
await page.fill("#signup-password-confirm", PASS);
await submitSignUp();
// Confirmation off in the mock: signUp returns a session and lands on `/`.
await page.waitForURL(`${BASE}/`);
check("signup lands on the front door, signed in", true);

// ------------------------------------------------- the front door's session
const me = await page.evaluate(() => fetch("/api/me").then((r) => r.json()));
check("api/me reports the signed-in customer", me.signedIn === true, JSON.stringify(me));
check("api/me returns the name from sign-up", me.name === NAME, JSON.stringify(me));
check("api/me returns the email", me.email === EMAIL, JSON.stringify(me));

const scriptCookies = await page.evaluate(() => document.cookie);
check("no supabase cookie is readable by script", !scriptCookies.includes("sb-"), scriptCookies);
const jar = (await page.context().cookies()).filter((c) => c.name.startsWith("sb-"));
check("supabase cookies exist", jar.length > 0);
check(
  "every supabase cookie is httpOnly",
  jar.every((c) => c.httpOnly),
  jar.filter((c) => !c.httpOnly).map((c) => c.name).join(", "),
);

// Already signed in: the sign-in page says so instead of asking again.
await page.goto(`${BASE}/en/signin`);
await page.waitForSelector("text=Signed in as");
check("signin recognises an existing session", (await page.textContent("h1")).includes(NAME));

// ----------------------------------------------------------------- sign-out
await page.click('form button:has-text("Log out")');
await page.waitForURL(/\/en\/signin\?e=signedout/);
check("sign out returns to signin and says so", await page.isVisible("text=You are signed out"));
const after = await page.evaluate(() => fetch("/api/me").then((r) => r.json()));
check("api/me reports nobody after sign-out", after.signedIn === false);

// ------------------------------------------------------------------ sign-in
await page.fill("#signin-email", EMAIL);
await page.fill("#signin-password", "wrong-password-1");
await submitSignIn();
await page.waitForSelector("text=do not match an account");
check("signin reports a wrong password", true);
check("the email survived the failed attempt", (await page.inputValue("#signin-email")) === EMAIL);

await page.fill("#signin-password", PASS);
await submitSignIn();
await page.waitForURL(`${BASE}/`);
check("signin lands on the front door", true);

// ------------------------------------------------------------------- arabic
await page.goto(`${BASE}/ar/signin`);
await page.waitForSelector("text=مسجّلة الدخول باسم");
check("arabic signin is in arabic and right-to-left",
  (await page.getAttribute(".swiss", "dir")) === "rtl");

await page.click('form button:has-text("خروج")');
await page.waitForURL(/\/ar\/signin/);
await page.goto(`${BASE}/ar/signup`);
check("arabic signup is in arabic", (await page.textContent("h1")).includes("أنشئي ملفك"));

// -------------------------------------------------------- confirmation links
await page.goto(`${BASE}/auth/confirm?token_hash=nope&type=signup&locale=ar`);
await page.waitForURL(/\/ar\/signin\?e=/);
check("a bad confirmation link lands on an arabic reason", true);

await page.goto(`${BASE}/auth/confirm?next=https%3A%2F%2Fevil.example.com&locale=en`);
const landed = new URL(page.url());
check(
  "confirm refuses an off-site redirect",
  !landed.host.includes("evil.example.com") && landed.pathname.endsWith("/signin"),
  page.url(),
);

// GET must never end a session.
await page.goto(`${BASE}/en/signin`);
const getSignout = await page.evaluate(() =>
  fetch("/api/signout", { method: "GET" }).then((r) => r.status),
);
check("api/signout refuses GET", getSignout === 405, String(getSignout));

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
