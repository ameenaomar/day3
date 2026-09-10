# Deploying to Vercel

## Current deployment

Latest production deployment:

- **https://simply-styled-ej1vv2yqd-t054175-1826.vercel.app**
- aliases: `simply-styled-t054175-1826.vercel.app` and the project's
  production domain, `simply-styled.vercel.app` — both follow the newest
  successful production deployment
- inspector: <https://vercel.com/t054175-1826/simply-styled/CaycR8nFxBgqvk1PP4GJGfNrujbK>

It builds `0b9eab7`, the head of `claude/html-update-vercel-deploy-xn441e` —
the Swiss redesign, the measurements screen, the SIMPLY STYLED name, the
Supabase schema, and sign-up, sign-in and the account doors on the front
screen. That branch is eleven commits ahead of `claude/simply-styled-plan-8fumfc`, the
default branch, so merge it before any git-linked deploy replaces this one.

**The account pages need environment variables this deployment does not have**
(see below). Until they are set, `/` works as it always has — the guest path
is untouched — and sign-up and sign-in show their own error rather than a
broken page.

Node is pinned to 22 via `engines.node` and `.nvmrc`, so the build machine uses
the version everything here was verified on.

**The Vercel connection is no longer authorised for this scope.** As of
2026-09-10 every Vercel call — reads *and* `create_git_project` — returns:

```
403 forbidden: Not authorized: Trying to access resource under scope
"t054175-1826". You must re-authenticate to this scope or use a token with
access to this scope.
```

So a deployment cannot be made from a Claude session until that connection is
re-authorised. Deploy from GitHub instead — see "Import the repo" below, which
is the better setup anyway. Notes from the earlier upload follow.

**Unverified from that session.** The deployment was accepted, but nothing there
could confirm it built:

### How it is built

The Vercel connection available from this environment can create deployments
but cannot read anything back, so a git-linked project cannot be set up from
here (see below). What it can do is upload files — and an upload that carries
only a hand-written `package.json` would drift from the repo, which is what the
earlier uploads did.

So the upload is a two-line stub (`package.json`, `.nvmrc`) and the install step
fetches the repo itself, pinned to the commit:

```
installCommand: curl -fsSL https://codeload.github.com/ameenaomar/day3/tar.gz/<sha> \
                  -o /tmp/repo.tgz && tar -xzf /tmp/repo.tgz --strip-components=1 \
                  && npm ci --include=dev
buildCommand:   npm run build
```

The repository is public, so the fetch needs no credentials. Two consequences
worth knowing:

- The build uses `package-lock.json` and the committed font binaries — the two
  things the earlier uploads dropped. This upload no longer drifts from the
  repo.
- `--include=dev` is not optional. Vercel's build environment sets
  `NODE_ENV=production`, and without the flag `npm ci` omits the dev
  dependencies, so `scripts/build-fonts.mjs` fails on a missing `subset-font`
  before `next build` ever runs.

That whole sequence was run locally from an empty directory first: the tarball
fetch, the extraction (the fetched `public/simply-styled.html` hashes identically
to the committed one), `npm ci --include=dev` under `NODE_ENV=production` and
`NPM_CONFIG_PRODUCTION=true`, then `npm run build` — which compiled and listed
every route.

**Still unverified from this session: whether the build actually ran on
Vercel.** The deployment is accepted, and the build command is verified, but
nothing here can observe the result:

- `vercel.app` is blocked by this environment's egress policy — `curl` gets a
  403 from the proxy's CONNECT, and the web-fetch tools cannot reach it either.
- Every Vercel *read* API returns 403 for scope `t054175-1826`
  ("You must re-authenticate to this scope"): `get_deployment`,
  `get_deployment_build_logs`, `list_projects`, `web_fetch_vercel_url` and
  `create_git_project`, which needs a read to look up linked projects.
  Deployments can be *created* only because omitting the scope falls back to
  the same account implicitly.

Check the inspector link for the build result.

There is also a stray project called **`wciw-deploy-probe`** on the account —
a two-line static page used to find out whether deployments still worked at
all after every read failed. Nothing points at it; delete it whenever.

## Route check

Probed against a local production build:

| Path | Expected |
| --- | --- |
| `/` | 200, the prototype (`public/simply-styled.html`), byte-identical |
| `/whatcaniwear.html` | 308 to `/` — the page's name before the product had one |
| `/en`, `/ar` | 200, correct `lang`/`dir`, canonical + hreflang |
| `/en/signup`, `/ar/signup` | 200, both directions, canonical + hreflang |
| `/en/signin`, `/ar/signin` | 200; `?e=expired\|used\|invalid\|error\|signedout` each explains itself |
| `/en/signin/<token>` | 307 — to the saved path with a session cookie, or back to `/signin?e=…` |
| `/en/design`, `/ar/design` | 200, `noindex` |
| `/en/signin`, `/ar/signin` | 200; shows who is signed in instead of the form when there is a session |
| `/en/signup`, `/ar/signup` | 200 |
| `/auth/confirm` | 307 to `next` on a valid link, to `/<locale>/signin?e=expired\|invalid` otherwise |
| `/icon.svg` | 200 |
| `/robots.txt`, `/sitemap.xml` | 200, absolute URLs from `APP_URL` or Vercel's |
| anything else under a locale | 404, styled, correct language and direction |
| `/api/me` | 200 `{"signedIn":false}` with no session; `no-store, private` |
| `/api/signout` | 204 on POST, 405 on GET |
| `/admin` | 404 (not built yet; excluded from the locale proxy) |

## Environment variables

The prototype at `/` needs none. **The account pages do**, and until they have
them they render their own error rather than a broken page:

| Variable | Needed for |
| --- | --- |
| `SUPABASE_URL` | **Required** — sign-up and sign-in. Read server-side. |
| `SUPABASE_PUBLISHABLE_KEY` | **Required** — the same. `NEXT_PUBLIC_` spellings of both are accepted, for a deployment already configured that way. |
| `APP_URL` | Where the confirmation link comes back to. Set it once there is a custom domain. |
| `DATABASE_URL` | Supabase transaction pooler, port 6543. **Not needed to sign in** — that is Supabase Auth over HTTPS. It is for the style profile, the orders and the stylist's tool. Plain Postgres through `@prisma/adapter-pg`, so the pooler string is not optional: serverless functions exhaust direct connections. |
| `DIRECT_DATABASE_URL` | Supabase direct connection, port 5432 — migrations |
| `RESEND_API_KEY`, `EMAIL_FROM` | Order confirmations. Supabase sends the account emails itself. |


Copy the two database strings from the Supabase dashboard (Connect); they
carry the password, so they are not in the repo. **With none of them set the
account pages now say so** — "accounts are not switched on for this deployment
yet" — instead of reporting a generic failure. `siteUrl()` falls back to the
URL Vercel injects, so the sitemap and canonical links are correct without
`APP_URL`.

## Import the repo instead — the better setup

Importing the repository gives you a deploy on every push and a preview URL per
branch — neither of which a one-off upload gives you, and neither of which can
be set up from here while the Vercel reads return 403. The Vercel scope is
`t054175-1826`. Re-authenticating that connection would also let me do it from
here.

1. Go to <https://vercel.com/new>
2. Import `ameenaomar/day3`
3. Framework preset: **Next.js** (auto-detected). Root directory: `./`.
   Build command, install command and output directory all stay on their
   defaults — `prisma generate` runs from the `postinstall` script.
4. Set the production branch (Settings → Git → Production Branch). The repo's
   default is `claude/simply-styled-plan-8fumfc`, which does **not** carry the
   accounts work — `claude/signup-signin-supabase-puw7iq` does, and it now
   supersedes `claude/html-update-vercel-deploy-xn441e` as well. Either merge it
   into the default or name it the production branch.
5. Deploy.

**Set the two `NEXT_PUBLIC_SUPABASE_*` variables** (see "Accounts" below) for
all three environments. Nothing else is needed: `prisma generate` does not need
a connection, and the build succeeds without the rest.

Alternatively, create a Vercel team and I can do all of the above from here.

## What is actually on it right now

- `/` → the working prototype, `public/simply-styled.html`: the whole flow,
  both languages, both themes, Swiss typographic system. This is the site. Its
  first screen leads with the real account doors and asks `/api/me` who is
  signed in.
- `/en`, `/ar` — scaffold front page of the port, which is being built against
  the prototype's wording rather than presenting final copy yet.
- `/en/signup`, `/ar/signup` — the real sign-up: creates the `Customer` row in
  Supabase, records marketing consent, and issues a single-use sign-in link.
  Swiss-styled, so it is also the first page of the port.
- `/en/signin`, `/ar/signin` — asks for a link, or explains what happened to
  the last one. Shows who is signed in, with a log out.
- `/en/signin/<token>` — spends the link: opens a 60-day session, sets an
  httpOnly cookie, and lands the customer where the link said.
- `/en/design`, `/ar/design` — every UI primitive on one screen, for checking
  both themes, RTL and 375px on a real phone. `noindex`.
- `/en/signin`, `/en/signup` and their Arabic twins — accounts, on Supabase
  Auth. See "Accounts" below.

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
project `simply-styled` (`djkpilwfcokgjjtbwker`, eu-central-1). This replaced
the hand-rolled magic-link flow built on `claude/html-update-vercel-deploy-xn441e`:
its pages, its design and its bilingual copy were kept, and only the engine
underneath changed.

`auth.users` owns the credential and the session. `public."Customer"` stays the
app's customer record, and `Customer.authUserId` links the two. An
`on_auth_user_created` trigger creates the customer row inside the signup
transaction, taking the name, locale, WhatsApp number and marketing consent out
of the new user's metadata — so a customer can never exist without one, and the
page never has to make a second, failable write. The SQL is in
`supabase/migrations/`.

What this buys over the magic-link version: **no `DATABASE_URL` and no
`RESEND_API_KEY` are needed to sign in**. Supabase holds the credential and
sends the confirmation email itself. Those two variables now only matter for
what comes after sign-in — the style profile, the orders, the stylist's tool.

Row level security stays deny-by-default. The only policies in the schema say a
signed-in customer can read and update **their own** `Customer` row; `anon` is
granted nothing at all. Verified in SQL against the project: the owner sees one
row, another signed-in user sees zero, `anon` is refused outright. The
`rls_enabled_no_policy` notices the Supabase linter reports for the other
tables are that posture working as intended — nothing can read them yet.

### How the front door and the account pages fit together

`/` is `public/simply-styled.html`, a static file. It cannot read an `httpOnly`
session cookie, and it should not be able to, so it asks:

| Endpoint | Answers |
| --- | --- |
| `GET /api/me` | `{signedIn, name, email}` — a name and an email, nothing else. No user id, no phone number, no measurements. `no-store, private`, because a cached "signed in" on a shared device would be somebody else's name. |
| `POST /api/signout` | 204, after revoking the refresh token at Supabase. POST only: a link a browser can prefetch must never end somebody's session. |

Its login screen links out to `/<locale>/signup` and `/<locale>/signin` rather
than doing auth itself, and both of those redirect back to `/` on success —
where the flow picks up and greets the customer by name.

### What has to be set

In Vercel, for every environment:

```
SUPABASE_URL=https://djkpilwfcokgjjtbwker.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Unprefixed on purpose. Nothing in the browser creates a Supabase client, so
these never need to be inlined into a bundle — and a `NEXT_PUBLIC_` variable is
baked in at **build** time, which means a deployment built before the variable
existed keeps saying "not switched on" however many times you set it
afterwards. The `NEXT_PUBLIC_` spellings are still accepted, so a deployment
already configured that way keeps working.

In the Supabase dashboard, Authentication → URL Configuration:

- **Site URL** — the production origin.
- **Redirect URLs** — `<origin>/auth/confirm` for each origin you use
  (production, previews, `http://localhost:3000`). That is where the
  confirmation link lands; it verifies the token, which creates the session,
  and then sends the customer to `/`.

Authentication → Providers → Email: **Confirm email** decides which of two
paths a new customer takes, and both are built.

- **On** (Supabase's default): sign-up shows "Confirm your email" and names the
  address. Signing in before confirming says exactly that, rather than "wrong
  password".
- **Off**: sign-up returns a session and the customer lands on `/` already in.

An address that already has an account gets the same "confirm your email"
screen as a new one. That is deliberate: a sign-up form that says "this email
is taken" tells anyone who asks which of your customers is registered.

### What was verified, and how

`*.supabase.co` is blocked by this environment's egress policy, so the HTTP side
could not be exercised against the real project from here. It was split:

- **Against the project, in SQL** — the trigger (name whitespace collapsed,
  email lower-cased, locale and consent read from metadata, a non-Kuwaiti phone
  number rejected to null, an existing customer adopted rather than
  duplicated) and the RLS policies. Every test row was deleted afterwards;
  `auth.users` and `Customer` are both empty.
- **Against a stand-in auth server, in a real browser** — 36 checks: field
  validation on both forms, a wrong password, an unconfirmed sign-in, the
  second-signup enumeration case, `httpOnly` on every session cookie,
  `/api/me` before and after sign-out, `/api/signout` refusing GET, Arabic and
  RTL on both pages, a tampered confirmation link, refusing an off-site
  `next=`, and token refresh with the refresh-token reuse grace switched off.
  Plus 55 unit tests over the validators. See `e2e/README.md`.

Three bugs were found and fixed this way: a Server Action re-render emptied the
password fields; the proxy's refreshed token never reached the route, which
signed a customer out an hour after they signed in; and the trigger stored
`"Noura   Al-Sabah"` with the run of spaces intact.

What that leaves unverified: that Supabase's own email delivery works on this
project, and the exact wording of its templates. Sign up once on the deployed
site to confirm the mail arrives and the link comes back to the right origin.
