import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const stamp = Date.now();
const EMAIL = `noura.${stamp}@example.com`;
const PASS = "correct-horse-8";
const NAME = "Noura Al-Sabah";

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail && !ok ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const page = await browser.newPage();
page.on("pageerror", (e) => check("no page errors", false, String(e)));

// ---------------------------------------------------------------- Next app
await page.goto(`${BASE}/en/signin`);
check("signin renders", (await page.textContent("h1")).includes("Sign in"));

// The header's language switch is also a submit button, so target the form's
// own button by its label.
const submitSignIn = () => page.click('form button:has-text("Sign in")');
const submitSignUp = () => page.click('form button:has-text("Create account")');

// A bad email is caught before the network.
await page.fill('input[name="email"]', "not-an-email");
await page.fill('input[name="password"]', "whatever1");
await submitSignIn();
await page.waitForSelector("text=does not look like an email address");
check("signin rejects a malformed email", true);

// Wrong credentials come back as our message, not the auth server's.
await page.fill('input[name="email"]', "nobody@example.com");
await page.fill('input[name="password"]', "whatever12");
await submitSignIn();
await page.waitForSelector("text=do not match an account");
check("signin reports unknown credentials", true);

// Sign up.
await page.goto(`${BASE}/en/signup`);
await page.fill('input[name="name"]', "Noura");
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASS);
await page.fill('input[name="passwordConfirm"]', PASS);
await submitSignUp();
await page.waitForSelector("text=first and last name");
check("signup requires a full name", true);

await page.fill('input[name="name"]', NAME);
await page.fill('input[name="password"]', "short1");
await page.fill('input[name="passwordConfirm"]', "short1");
await submitSignUp();
await page.waitForSelector("text=at least 8 characters");
check("signup enforces the password length", true);

await page.fill('input[name="password"]', PASS);
await page.fill('input[name="passwordConfirm"]', `${PASS}x`);
await submitSignUp();
await page.waitForSelector("text=two passwords do not match");
check("signup catches a mistyped confirmation", true);

await page.fill('input[name="passwordConfirm"]', PASS);
// The password fields still hold what was typed: the failed submits above were
// stopped in the browser, so nothing was re-rendered.
check("password survived the rejected submits",
  (await page.inputValue('input[name="password"]')) === PASS);
await submitSignUp();
await page.waitForURL(`${BASE}/en/account`);
check("signup lands on the account page", true);
check("account shows the signed-in email", (await page.textContent("body")).includes(EMAIL));
check("account greets by first name", (await page.textContent("h1")).includes("Noura"));

// The session survives a reload, i.e. it is in a cookie and not in memory.
await page.reload();
check("session survives a reload", page.url() === `${BASE}/en/account`);

// The session cookie is not readable by script.
const scriptCookies = await page.evaluate(() => document.cookie);
check("no supabase cookie is readable by script", !scriptCookies.includes("sb-"), scriptCookies);
const jar = await page.context().cookies();
const authCookies = jar.filter((c) => c.name.startsWith("sb-"));
check("supabase cookies exist", authCookies.length > 0);
check(
  "every supabase cookie is httpOnly",
  authCookies.every((c) => c.httpOnly),
  authCookies.filter((c) => !c.httpOnly).map((c) => c.name).join(", "),
);

// Signed in, the sign-in page is a dead end and redirects.
await page.goto(`${BASE}/en/signin`);
await page.waitForURL(`${BASE}/en/account`);
check("signin redirects when already signed in", true);

// Sign out, then back in.
await page.click('form button:has-text("Sign out")');
await page.waitForURL(`${BASE}/en/signin`);
check("sign out returns to signin", true);

await page.goto(`${BASE}/en/account`);
await page.waitForURL(/\/en\/signin\?error=required/);
check("account is protected once signed out", true);

await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASS);
await submitSignIn();
await page.waitForURL(`${BASE}/en/account`);
check("signin works with the account just created", true);

// Signed in, the Arabic sign-up page is a dead end too.
await page.goto(`${BASE}/ar/signup`);
await page.waitForURL(`${BASE}/ar/account`);
check("arabic signup redirects when already signed in", true);
check("arabic account is in arabic", (await page.textContent("h1")).includes("ملفك"));

// Arabic, signed out.
await page.click('form button:has-text("تسجيل الخروج")');
await page.waitForURL(`${BASE}/ar/signin`);
await page.goto(`${BASE}/ar/signup`);
const dir = await page.getAttribute("html", "dir");
check("arabic signup is right-to-left", dir === "rtl", String(dir));
check("arabic signup is in arabic", (await page.textContent("h1")).includes("إنشاء حساب"));

// A tampered confirmation link fails closed.
await page.goto(`${BASE}/auth/confirm?token_hash=nope&type=signup&next=%2Far%2Faccount`);
await page.waitForURL(/\/ar\/signin\?error=link/);
check("a bad confirmation link lands on an arabic error", true);

// An off-site `next` must not be honoured.
await page.goto(`${BASE}/auth/confirm?next=https%3A%2F%2Fevil.example.com`);
const landed = new URL(page.url());
check(
  "confirm refuses an off-site redirect",
  !landed.host.includes("evil.example.com") && landed.pathname.endsWith("/signin"),
  page.url(),
);

// ---------------------------------------------------------------- prototype
const proto = await browser.newPage();
proto.on("pageerror", (e) => check("no prototype page errors", false, String(e)));
const PEMAIL = `dana.${stamp}@example.com`;

await proto.goto(`${BASE}/`);
await proto.waitForSelector("text=Sign in to your file");
check("prototype opens on sign in", true);

await proto.click('button:has-text("No account yet")');
await proto.waitForSelector("text=Open a file");
check("prototype switches to sign up", true);

await proto.fill('#app input[type="text"]', "Dana Al-Fahad");
await proto.fill('#app input[type="email"]', PEMAIL);
await proto.fill('#app input[type="password"]', "short");
await proto.click('#app button:has-text("Create my account")');
await proto.waitForSelector("text=at least 8 characters");
check("prototype enforces the password length", true);

await proto.fill('#app input[type="password"]', PASS);
await proto.click('#app button:has-text("Create my account")');
await proto.waitForSelector("#who.on");
check("prototype signs up and lands on the landing screen", true);
check("prototype greets by first name", (await proto.textContent("#who")).includes("Dana"));

const stored = await proto.evaluate(() => localStorage.getItem("ss.auth.v1"));
check("prototype stored the session", Boolean(stored && JSON.parse(stored).access_token));

await proto.reload();
await proto.waitForSelector("#who.on");
check("prototype restores the session on reload", true);

await proto.click('#who button');
await proto.waitForSelector("text=Sign in to your file");
check("prototype signs out", true);
check("prototype cleared the stored session",
  (await proto.evaluate(() => localStorage.getItem("ss.auth.v1"))) === null);

await proto.fill('#app input[type="email"]', PEMAIL);
await proto.fill('#app input[type="password"]', "wrong-password-1");
await proto.click('#app button:has-text("Sign in")');
await proto.waitForSelector("text=do not match an account");
check("prototype reports a wrong password", true);

await proto.fill('#app input[type="password"]', PASS);
await proto.click('#app button:has-text("Sign in")');
await proto.waitForSelector("#who.on");
check("prototype signs back in", true);

// Arabic on the prototype.
await proto.click("#lang");
await proto.waitForSelector('body[dir="rtl"]');
check("prototype switches to arabic", true);

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
