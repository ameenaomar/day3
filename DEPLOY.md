# Deploying to Vercel

## Why this is not already done

Two routes exist and neither is available from this session:

- **Git-linked project** (the one you want): the Vercel integration here requires a
  *team* scope, and this Vercel account has no teams — only a personal account.
  The API refuses to create a project without one.
- **Direct file upload**: this works without a team, but it sends the whole
  source tree inline, and the two Arabic font files (58KB of woff2) are larger
  than this environment allows in a single call. Deploying without them would
  put the Arabic pages up in a fallback system font, which is not worth doing.

## The 60-second fix, and it is the better setup anyway

Importing the repository gives you a deploy on every push plus a preview URL per
branch, which a one-off upload does not.

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
