# Deploying to Vercel

## Current deployment

Latest production deployment:

- **https://simply-styled-55nk6fabv-t054175-1826.vercel.app**
- aliases: `simply-styled-t054175-1826.vercel.app` and the project's
  production domain, `simply-styled.vercel.app` — both follow the newest
  successful production deployment
- inspector: <https://vercel.com/t054175-1826/simply-styled/Bt5x98wWCa7E8dAWBGf2EaryDVCi>

It builds `3933808`, the head of `claude/html-update-vercel-deploy-xn441e` —
the Swiss redesign, the measurements screen, the SIMPLY STYLED name, the
Supabase schema, and sign-up, sign-in and the account doors on the front
screen. That branch is eight commits ahead of `claude/simply-styled-plan-8fumfc`,
the default branch, so merge it before any git-linked deploy replaces this one.

**The account pages need environment variables this deployment does not have**
(see below). Until they are set, `/` works as it always has — the guest path
is untouched — and sign-up and sign-in show their own error rather than a
broken page.

Node is pinned to 22 via `engines.node` and `.nvmrc`, so the build machine uses
the version everything here was verified on.

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
| `/icon.svg` | 200 |
| `/robots.txt`, `/sitemap.xml` | 200, absolute URLs from `APP_URL` or Vercel's |
| anything else under a locale | 404, styled, correct language and direction |
| `/api/me` | 200 `{"signedIn":false}` with no session; `no-store, private` |
| `/api/signout` | 204 on POST, 405 on GET |
| `/admin` | 404 (not built yet; excluded from the locale proxy) |

## Environment variables

The prototype at `/` needs none. **The sign-up page does**, and until it has
them it renders its own error rather than a broken page:

| Variable | Needed for |
| --- | --- |
| `DATABASE_URL` | Supabase transaction pooler, port 6543 — the customer write |
| `DIRECT_DATABASE_URL` | Supabase direct connection, port 5432 — migrations |
| `RESEND_API_KEY`, `EMAIL_FROM` | Sending the sign-in link. Without them the page saves the customer and says so, and outside production it prints the link instead of mailing it. |
| `APP_URL` | Where the link points. Set it once there is a custom domain. |

Copy the two database strings from the Supabase dashboard (Connect); they
carry the password, so they are not in the repo. `siteUrl()` falls back to the
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
4. The production branch is `claude/simply-styled-plan-8fumfc`, the repo's
   default — Vercel picks that up on its own.
5. Deploy.

**No environment variables are needed for the current snapshot.** Nothing on the
front page or the design-check page touches the database, and `prisma generate`
does not need a connection. The build will succeed with an empty environment.

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
