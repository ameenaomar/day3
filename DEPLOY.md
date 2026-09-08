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
| `/icon.svg` | 200 |
| `/robots.txt`, `/sitemap.xml` | 200, absolute URLs from `APP_URL` or Vercel's |
| anything else under a locale | 404, styled, correct language and direction |
| `/admin`, `/api/*` | 404 (not built yet; excluded from the locale proxy) |

## Environment variables

None are required — nothing deployed touches the database yet, and
`siteUrl()` falls back to the URL Vercel injects, so the sitemap and canonical
links are correct without configuration.

Set `APP_URL` once there is a custom domain, so those URLs point at it rather
than at the `.vercel.app` host.

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
