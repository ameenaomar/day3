# SIMPLY STYLED

A personal stylist for Kuwait. Answer eight short screens about your body, your
measurements, your colours and the occasion; a stylist shops Kuwait boutiques
for you and the look arrives at your door.

**Live: <https://simply-styled.vercel.app>**

Bilingual (English and Arabic, both first-class, both directions), light and
dark, and designed in the International Typographic Style — one grotesque, an
asymmetric grid, hairline rules, and a single red that only ever marks
something.

## What is on it

| Path | What it is |
| --- | --- |
| `/` | The working prototype — the whole eight-screen flow, in `public/simply-styled.html` |
| `/en/signup`, `/ar/signup` | Create a file: the real customer record, and a sign-in link |
| `/en/signin`, `/ar/signin` | Ask for a link, or read why the last one did not work |
| `/en`, `/ar` | The Next.js port of the flow, still a scaffold |
| `/en/design`, `/ar/design` | Every UI primitive on one screen, for checking both themes and RTL |

Screen 04 of the flow is the measuring tape, and it is the one that decides the
fit: full measurements mean one size per piece instead of two, and the payment
screen says so.

## Stack

- **Next.js 16** with the App Router, TypeScript, Tailwind 4
- **Prisma 7** over **Supabase** Postgres, through `@prisma/adapter-pg`
- Passwordless accounts: single-use magic links, stored only as SHA-256 hashes
- Money is integer fils throughout — 1 KD = 1000 fils, no floats anywhere
- Deployed on Vercel

## Running it

```sh
npm install
npm run dev
```

`/` works with no configuration. The account pages need a database, and say so
plainly when they do not have one:

```sh
cp .env.example .env.local   # then fill in the Supabase strings
npx prisma migrate deploy    # applies prisma/migrations
```

| Variable | Needed for |
| --- | --- |
| `DATABASE_URL` | Supabase transaction pooler, port 6543 — everything the app reads and writes |
| `DIRECT_DATABASE_URL` | Direct connection, port 5432 — migrations only |
| `RESEND_API_KEY`, `EMAIL_FROM` | Sending sign-in links. Without them, sign-up saves the customer and says the link could not be sent; outside production it shows the link instead. |
| `APP_URL` | Where links point, once there is a custom domain |

```sh
npm test        # unit tests
npm run typecheck
npm run build
```

## The rest of the documentation

- [`PLAN.md`](PLAN.md) — the implementation plan, the decisions still open, and
  what is deliberately not built yet
- [`DEPLOY.md`](DEPLOY.md) — the current deployment, how it is built, the route
  check, and every environment variable
- [`prisma/schema.prisma`](prisma/schema.prisma) — the data model, with the
  reasoning for each shape in comments

## Status

A prototype under active build. The flow, the sign-up and the sign-in are real;
payment is mocked and takes no money, and a signed-in customer's answers are
not yet saved to their file at the end of the flow.
