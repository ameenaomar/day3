# Deploying to Vercel

## Current deployment

Latest production deployment, by direct file upload:

- **https://simply-styled-pov9wjm5o-t054175-1826.vercel.app**
- alias: `simply-styled-t054175-1826.vercel.app` (points at the newest
  successful production deployment)
- inspector: <https://vercel.com/t054175-1826/simply-styled/gY7yW1KP5SsTBL5GWoytSCDPw3Sf>

Earlier attempts, same project:
[1](https://vercel.com/t054175-1826/simply-styled/DJ5GsJhgGGNLQG8a5GuxP3AKpDn4),
[2](https://vercel.com/t054175-1826/simply-styled/GvDzB4x3Wi5gqERaKaz2eCEb4t4f),
[3](https://vercel.com/t054175-1826/simply-styled/2ooCT1ab4CvxofXTHUaAZ3o18pqt)

Node is pinned to 22 via `engines.node`, so the build machine uses the version
everything here was verified on.

**Unverified from this session.** The deployment is accepted, but nothing here
can confirm it built:

- `vercel.app` is blocked by this environment's egress policy, for both `curl`
  and the web-fetch tool.
- Every Vercel *read* API returns 403 for this scope — `get_deployment`,
  `get_deployment_build_logs`, `web_fetch_vercel_url` and
  `create_git_project` (which needs a read to look up linked projects) all
  fail with "You must re-authenticate to this scope". The connection can
  create a deployment but not read one back, which is also why the git-linked
  project below has to be set up by hand.

Check the inspector link for the build result. The whole path a build machine
takes was verified locally from an empty `node_modules` first: install (which
runs `prisma generate`), then the font build, then `next build`, plus the tests
and a typecheck. Every route was then probed on the built app — see the table
in "Route check" below.

## Route check

Probed against a local production build:

| Path | Expected |
| --- | --- |
| `/` | 307 to `/en` or `/ar`, by cookie then `Accept-Language` |
| `/en`, `/ar` | 200, correct `lang`/`dir`, canonical + hreflang |
| `/en/design`, `/ar/design` | 200, `noindex` |
| `/en/signin`, `/ar/signin` | 200, `noindex`; redirects to `/account` when signed in |
| `/en/signup`, `/ar/signup` | 200, `noindex` |
| `/en/signup/check-email` | 200, `noindex` |
| `/en/account`, `/ar/account` | 200 signed in; redirect to `/signin?error=required` otherwise |
| `/auth/confirm` | 302 to `next` on a valid link, to `/<locale>/signin?error=link` otherwise |
| `/icon.svg` | 200 |
| `/robots.txt`, `/sitemap.xml` | 200, absolute URLs from `APP_URL` or Vercel's |
| anything else under a locale | 404, styled, correct language and direction |
| `/admin`, `/api/*` | 404 (not built yet; excluded from the locale proxy) |

## Environment variables

Two are now required, because the sign-in and sign-up screens talk to Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Without them the app still builds and every other page still works — the two
account screens say accounts are not configured rather than returning a 500.

Everything else is still optional. `siteUrl()` falls back to the URL Vercel
injects, so the sitemap and canonical links are correct without configuration.
Set `APP_URL` once there is a custom domain, so those URLs — and the
confirmation links in the emails — point at it rather than at the `.vercel.app`
host.

### How that upload differs from the repo

The upload carried source only, so two things differ from a git-linked build
and are worth closing by importing the repo:

- **No `package-lock.json`** — Vercel resolved the dependency ranges fresh.
- **No test tooling** — `vitest` and `@playwright/test`, and the `test` and
  `db:*` scripts, were left out of the uploaded `package.json`. The font
  binaries were left out too, and the build regenerated them.

## Import the repo instead — the better setup

Importing the repository gives you a deploy on every push, a preview URL per
branch, and the lockfile — none of which a one-off upload gives you. The Vercel
scope here is `t054175-1826`.

1. Go to <https://vercel.com/new>
2. Import `ameenaomar/day3`
3. Framework preset: **Next.js** (auto-detected). Root directory: `./`.
   Build command, install command and output directory all stay on their
   defaults — `prisma generate` runs from the `postinstall` script.
4. Set the production branch to `claude/simply-styled-plan-8fumfc`
   (Settings → Git → Production Branch) until this work merges.
5. Deploy.

**Set the two `NEXT_PUBLIC_SUPABASE_*` variables** (see "Accounts" below) for
all three environments. Nothing else is needed: `prisma generate` does not need
a connection, and the build succeeds without the rest.

Alternatively, create a Vercel team and I can do all of the above from here.

## What is actually on it right now

- `/` → redirects to `/en` or `/ar` by cookie, then `Accept-Language`
- `/en`, `/ar` — scaffold front page. Not final copy: the real wording comes
  verbatim from `simply-styled.html`, which is not in the repo yet.
- `/en/design`, `/ar/design` — every UI primitive on one screen, for checking
  both themes, RTL and 375px on a real phone. `noindex`.
- `/en/signin`, `/en/signup`, `/en/account` and their Arabic twins — accounts,
  on Supabase Auth. See "Accounts" below.

The seven question screens, payment and `/admin` are not built yet.

## Environment variables, for when they are needed

Copy `.env.example`. The ones that will matter, in the order they become
relevant:

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Required now** — sign-up and sign-in |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **Required now** — sign-up and sign-in |
| `APP_URL` | Where confirmation links come back to. No trailing slash. |
| `DATABASE_URL` | Pooled connection — the app's Prisma queries |
| `DIRECT_DATABASE_URL` | Direct connection — migrations only |
| `AUTH_SECRET` | Anything this app signs itself. Nothing needs it yet. |
| `RESEND_API_KEY`, `EMAIL_FROM` | Order confirmations. Supabase sends the auth emails. |
| `PAYMENT_PROVIDER` | `mock` locally; the gateway in production |

Set `DATABASE_URL` and `DIRECT_DATABASE_URL` in Vercel for all three
environments, then run the initial migration against the branch database:

```sh
DIRECT_DATABASE_URL="…" npx prisma migrate deploy
```

Neon's database branching pairs with Vercel preview deploys, so give previews
their own branch database rather than pointing them at production.

## Accounts

Sign-up and sign-in run through **Supabase Auth**, email and password, against
project `simply-styled` (`djkpilwfcokgjjtbwker`, eu-central-1).

`auth.users` owns the credential and the session. `public."Customer"` stays the
app's customer record, and `Customer.authUserId` links the two. An
`on_auth_user_created` trigger creates the customer row inside the signup
transaction, taking the name and locale out of the user's metadata, so a
customer can never exist without one and the client never has to make a second,
failable write. The SQL is in
`supabase/migrations/20260910135127_customer_linked_to_supabase_auth.sql`.

Row level security stays deny-by-default. The only policies in the schema say a
signed-in customer can read and update **their own** `Customer` row; `anon` is
granted nothing at all. Verified in SQL against the project: the owner sees one
row, another signed-in user sees zero, `anon` is refused outright. The
`rls_enabled_no_policy` notices the Supabase linter reports for the other 14
tables are that posture working as intended — nothing can read them yet.

### Two front ends, one set of accounts

| | Sign-in lives at | Session kept in |
| --- | --- | --- |
| The prototype at `/` | its own first screen | `localStorage`, from the Auth REST API |
| The Next app | `/en/signin`, `/ar/signin` | `httpOnly` cookies, via Server Actions |

Same Supabase project, same accounts, same `Customer` rows — separate sessions.
Signing in on one does not sign you in on the other. The prototype is a static
file with no server of its own, so `localStorage` is what it can do; the Next
app never puts a token anywhere a script can read it, and its password only ever
travels in a POST to our own origin.

### What has to be set in the Supabase dashboard

Authentication → URL Configuration:

- **Site URL** — the production origin, e.g.
  `https://simply-styled-t054175-1826.vercel.app`.
- **Redirect URLs** — add both, for each origin you use (production, previews,
  `http://localhost:3000`):
  - `<origin>/auth/confirm` — where the Next app's confirmation links land.
  - `<origin>/` — where the prototype's do; it reads the tokens out of the URL
    fragment and then scrubs them from the address bar and from history.

Authentication → Providers → Email: **Confirm email** decides which of two
paths a new customer takes, and both are built.

- **On** (Supabase's default): sign-up sends a link and lands on
  `/<locale>/signup/check-email`, or shows the same note on the prototype.
  Signing in before confirming says exactly that, rather than "wrong password".
- **Off**: sign-up returns a session and the customer is straight in.

An address that already has an account gets the same "check your email" screen
as a new one when confirmations are on. That is deliberate: a sign-up form that
says "this email is taken" tells anyone who asks which of your customers is
registered.

### What was verified, and how

`*.supabase.co` is blocked by this environment's egress policy, so the HTTP side
could not be exercised against the real project from here. It was split:

- **Against the project, in SQL** — the trigger (name trimmed, email
  lower-cased, locale read from metadata, an existing customer adopted rather
  than duplicated) and the RLS policies. The test rows were deleted afterwards;
  `auth.users` and `Customer` are both empty.
- **Against a stand-in auth server, in a real browser** — 55 checks over both
  front ends: field validation, wrong credentials, unconfirmed sign-in,
  confirmation links (valid, expired, and tampered), `httpOnly` on every session
  cookie, protected routes, sign-out, Arabic and RTL, refusing an off-site
  `next=`, and token refresh with the refresh-token reuse grace switched off.
  See `e2e/README.md` for how to run them.

Two bugs were found and fixed this way: a Server Action re-render emptied the
password fields, and the proxy's refreshed token never reached the route — which
signed a customer out an hour after they signed in.

What that leaves unverified: that Supabase's own email delivery works on this
project, and the exact wording of the templates. Sign up once on the deployed
site to confirm the mail arrives and the link comes back to the right origin.
