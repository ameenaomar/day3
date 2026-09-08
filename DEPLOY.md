# Deploying to Vercel

## Current deployment

A production deployment was created by direct file upload:

- **https://simply-styled-5aplnclop-t054175-1826.vercel.app**
- alias: `simply-styled-t054175-1826.vercel.app`
- inspector: <https://vercel.com/t054175-1826/simply-styled/DJ5GsJhgGGNLQG8a5GuxP3AKpDn4>

**Unverified.** The deployment was accepted, but nothing here could confirm it
built:

- `vercel.app` is blocked by this environment's egress policy, so the URL
  cannot be fetched from the session (`CONNECT tunnel failed, response 403`).
- Every Vercel *read* API returns 403 for this scope — `get_deployment`,
  `get_deployment_build_logs` and `web_fetch_vercel_url` all fail with
  "You must re-authenticate to this scope". The connection can create a
  deployment but not read one back.

Check the inspector link for the build result. Both risky build steps were
verified locally first: `prisma generate` runs without a database, and
`node scripts/build-fonts.mjs --if-missing` regenerates all five font files
byte-identically from a clean tree.

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

**No environment variables are needed for the current snapshot.** Nothing on the
front page or the design-check page touches the database, and `prisma generate`
does not need a connection. The build will succeed with an empty environment.

Alternatively, create a Vercel team and I can do all of the above from here.

## What is actually on it right now

- `/` → redirects to `/en` or `/ar` by cookie, then `Accept-Language`
- `/en`, `/ar` — scaffold front page. Not final copy: the real wording comes
  verbatim from `simply-styled.html`, which is not in the repo yet.
- `/en/design`, `/ar/design` — every UI primitive on one screen, for checking
  both themes, RTL and 375px on a real phone. `noindex`.

The seven question screens, auth, payment and `/admin` are not built yet.

## Environment variables, for when they are needed

Copy `.env.example`. The ones that will matter, in the order they become
relevant:

| Variable | Needed for |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** connection — the app's runtime queries |
| `DIRECT_DATABASE_URL` | Neon **direct** connection — migrations only |
| `APP_URL` | Where magic links point. No trailing slash. |
| `AUTH_SECRET` | Signing sessions and magic-link tokens |
| `RESEND_API_KEY`, `EMAIL_FROM` | Sending magic links and order confirmations |
| `PAYMENT_PROVIDER` | `mock` locally; the gateway in production |

Set `DATABASE_URL` and `DIRECT_DATABASE_URL` in Vercel for all three
environments, then run the initial migration against the branch database:

```sh
DIRECT_DATABASE_URL="…" npx prisma migrate deploy
```

Neon's database branching pairs with Vercel preview deploys, so give previews
their own branch database rather than pointing them at production.
