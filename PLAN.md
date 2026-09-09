# Simply Styled — implementation plan

Status: **awaiting approval.** Nothing has been built yet.

---

## 0. The prototype is in the repo

`public/simply-styled.html` is the working single-file app and the **source of
truth for exact wording, option lists, helper text and the already-written
Arabic**. It is what `/` serves in production, so the site is live and usable
while the port under `/en` and `/ar` is built out against it.

It has since been reworked in three ways, and the port should follow it:

- **International Typographic Style.** One neutral grotesque (Inter, with IBM
  Plex Sans Arabic for Arabic), a 2-column asymmetric grid with the screen
  number and index on the rail, hairline rules instead of boxes, and a single
  accent red that only ever marks something — required fields, progress,
  errors, the fit meter. No shadows, no rounded corners, no ornament. Both
  themes, both directions.
- **Measurements are their own screen.** Screen 04 of 8, open by default, with
  a fit-accuracy meter, a plausible range per field, one instruction per
  field, and a visible consequence: full measurements mean one size per piece
  instead of two, and that promise is what the payment screen prints.
- **Eight screens, not seven**, because of the above.

## 0.1 The database exists

Supabase project **`simply-styled`** (`djkpilwfcokgjjtbwker`, eu-central-1) holds
all fifteen tables, applied from `prisma/migrations`. Decision 2 below is
therefore settled: **Supabase, not Neon.**

What changed in the model when the measuring screen did:

- **`Measurement`** is its own versioned table, in integer millimetres, with
  `noTape`, `filledCount` and an `accuracy` enum (`estimated` / `better` /
  `good` / `tailor`). The tier is stored rather than recomputed, because
  `tailor` is what the payment screen promises the customer: one size per
  piece instead of two. `StyleProfile` points at the set it was built from.
- **`Address`** exists, shaped the way Kuwait writes addresses — governorate,
  area, block, street, building. `Order` keeps its own snapshot of it, so
  editing an address never rewrites where a past order went. **The flow still
  has no screen that asks for it**; that is the next gap to close.
- **`Customer.marketingOptIn`** backs the front page's "no marketing unless you
  ask for it".
- `answersSchemaVersion` defaults to **2**: the eight-screen shape.

Row-level security is on for every table with **no policies**, which denies the
anon and authenticated API keys outright — the app reaches Postgres as the owner
through Prisma and bypasses RLS. Measurements and phone numbers are never one
leaked publishable key away from being public.

Still to wire up: `lib/db.ts` uses the Neon serverless adapter and needs the
Postgres one, and nothing writes to these tables yet.

---

## 1. Decisions I need from you

| # | Decision | My recommendation |
|---|---|---|
| 1 | Payment gateway | **MyFatoorah**, with Tap as the fallback — see §2 |
| 2 | Database host | **Neon** — see §3 |
| 3 | Pricing model at launch | **Prepaid-full** as the brief has it, but see §4 — there is a refund-mechanics risk that may decide this for you |
| 4 | Tailwind v4 (CSS-first tokens) instead of `tailwind.config.ts` | **Yes, v4** — see §5 |
| 5 | Hand-rolled magic-link auth vs Auth.js | **Hand-rolled** — see §6 |

## 2. Payment gateway

I could not verify pricing at source. This container's egress proxy allows package
registries and blocks general web hosts, so `tap.company`, `myfatoorah.com` and
`kpay.com.kw` all returned `EGRESS_BLOCKED`. What follows is from search summaries, not
from the vendors' own pages, and the commercial terms need confirming in a merchant
agreement regardless — Kuwaiti gateways quote per-merchant on category, volume and risk,
so no published rate would have been binding anyway.

- **KNET direct (KPAY)** — cheapest per transaction, since you skip the gateway margin
  (KNET interchange is roughly 0.75–1.25%). Rejected: it needs a sponsoring bank
  relationship, onboarding is the slowest of the three, and it does **not** give you
  Visa/Mastercard, Apple Pay, Tabby or Tamara — you would integrate a second gateway
  anyway. Wrong shape for a service that has not tested its prices yet.
- **MyFatoorah** — KNET, Visa/Mastercard, Apple Pay, Google Pay and Tabby in one
  integration, out of the box, fastest to launch, no setup or monthly fee at the published
  tier. Reported KNET pricing in the 2.0–2.75% range.
- **Tap Payments** — Kuwait-founded, CBK-licensed EPSP, the better developer API by
  reputation, and the widest GCC coverage if you ever leave Kuwait. Slightly higher fees.
  Onboarding notes mention Kuwaiti-national ownership conditions for some licence types,
  which may or may not apply to you.

**Recommendation: MyFatoorah.** Every requirement in the brief lands inside one
integration, including Tabby, and it is the fastest path to taking real money from real
customers — which is what you need, because the brief itself says you may change your
prices after testing them. Tap's cleaner API is a real advantage but it buys developer
comfort, not customer reach, and behind the `PaymentProvider` interface the cost of
switching later is one adapter file.

Two things to confirm during onboarding, because they can invalidate the choice:

1. **Refund support on KNET, via API, partial amounts.** The whole prepaid model rests on
   refunding unused clothing budget. If partial KNET refunds are manual back-office
   operations rather than API calls, the refund path becomes an admin task with a
   gateway-portal step, and §4 gets more attractive.
2. **Tabby eligibility for a styling service** rather than a shipped-goods merchant, at the
   150/250 KD tiers.

I will build against the mock provider first, so this decision does not block anything.

## 3. Database host — Neon

Both work. Neon because:

- The brief wants short dependencies and hand-built primitives. Supabase's value is its
  bundled auth, storage and RLS, and we are using none of them — we would carry its client
  SDK to get a Postgres box. Neon is just Postgres, which is all Prisma wants.
- Database branching maps onto Vercel preview deploys, so migrations get tested on a real
  copy of the schema rather than on production.
- Built-in connection pooling, which Prisma on serverless needs.

If you later want Supabase Storage for stylist photos of the looks, that is an argument to
revisit — flag it and I will.

## 4. Pricing model, and why the refund path may decide it

Schema will support both from day one, so switching is a config change and no migration:

- `Order.paymentModel` — `prepaid_full` | `fee_first`
- money held as separate `stylingFeeFils`, `clothingBudgetFils`, `deliveryFeeFils`,
  `totalFils` columns rather than one amount
- a `Payment` table with `kind` = `styling_fee` | `clothing_budget` | `balance`, so an order
  can be paid in one charge or two
- `OrderStatus` gets `created` and `awaiting_clothing_payment` members now, unused under
  `prepaid_full`, so the fee-first flow needs no enum migration later

My view, unsolicited: **fee-first is probably the better model**, and not for pricing
reasons. Prepaid-full means you take 40–250 KD per look of someone's money for clothes
nobody has chosen yet, then refund the remainder within three working days through KNET —
which is the operationally hardest promise in the brief and the one most likely to generate
angry WhatsApp messages. Fee-first charges 10 KD for the styling, then charges the actual
clothing cost after the customer has approved the look, and the refund path becomes an
exception rather than the norm. It also lowers the commitment for a first-time customer of
an unproven service.

The counter-argument is real: fee-first means you float the cost of the clothes between
buying and charging, and a customer can ghost you after you have shopped. That is a
cash-flow question about your business, not a code question, so it is yours. Say the word
and the default flips.

**Money is stored as integer fils** (1 KD = 1000 fils), never floats — KWD's three decimal
places make float rounding a live bug, not a theoretical one.

## 5. Tailwind v4, CSS-first tokens

The brief says put tokens in `tailwind.config.ts`. That is Tailwind v3's shape; v4 is
current and moves tokens into CSS `@theme`. I want v4 because your own requirement — "both
themes must work from the same CSS variables" — is what v4 does natively: one `@theme`
block declares the palette, `:root` and a `[data-theme]` / `prefers-color-scheme` pair
redefine the same variables, and every utility follows without a config file in the loop.
Doing this on v3 means declaring the colours twice, once in CSS and once in the config.

The tokens, roles and every visual detail come from the brief exactly as written. Theme
preference goes in a **cookie**, not `localStorage`, so the server renders the right theme
and there is no flash of the wrong machine on load.

## 6. Auth — hand-rolled magic link

Auth.js with the Prisma adapter is the conventional answer and I am recommending against it
here. Magic link is the one auth flow where hand-rolling is genuinely small and genuinely
safe: no passwords to hash, no OAuth dance, no provider callbacks. The whole thing is

- 32 random bytes, SHA-256 hashed at rest, 15-minute expiry, single use
- exchange it for a session token in a `Session` table, `httpOnly` `Secure` `SameSite=Lax`
  cookie, 60-day sliding expiry so returning customers are not re-authenticating
- rate limit by email and by IP

Auth.js would add several packages, its own table naming, and a config surface, in exchange
for adapters we will never use. Email goes out through Resend's REST API called with
`fetch` — no SDK dependency.

If you would rather have a maintained library on the auth path, that is a legitimate
preference and I will use Auth.js instead. It is your risk to price.

## 7. Where I disagree with the brief

**`aria-pressed` on the option chips is wrong for the single-choice ones.** `aria-pressed`
describes a toggle button; on a mutually exclusive set it announces "pressed" without
telling a screen-reader user that picking one unpicks the others. Single-choice groups
should be a real `radiogroup` with `aria-checked`; multi-choice can stay
`aria-pressed` buttons, or checkboxes. Visually identical — `( )` `(•)` `[ ]` `[x]` exactly
as specified — correct semantically. I will build it that way unless you object.

**Auto-advance needs a keyboard exception.** Advancing on selection is right for a thumb on
a phone. On a keyboard, arrow-keying through a radio group changes the selection on every
key press, so pure auto-advance would fire navigation mid-browse and trap the user — and
WCAG 3.2.2 is unhappy about it. So: pointer tap advances immediately; keyboard advances on
`Enter`/`Space` activation, not on focus move. Plus a ~180ms confirmation state, honouring
`prefers-reduced-motion`, so the tap visibly registers before the screen changes, and a
persistent Back.

**"Server-render the question screens" and "auto-advance in two minutes" pull against each
other** on a bad connection — a full round trip per tap will feel broken. Resolution: each
screen is a real server-rendered route (`/en/style/basics` … `/order`), so it works without
JS, is indexable and the back button behaves; a small client island records the answer,
advances instantly, and POSTs the answer in the background with a retry. Answers persist
per screen, so a dropped connection or a closed tab resumes where they left off.

**"Free over 100 KD total" is ambiguous** — 100 KD of clothing budget, or of the grand
total including the styling fee? I will implement it as the pre-delivery subtotal (styling
fee + clothing budget) and the prototype will settle it when I can read it.

## 8. Architecture

```
app/
  [locale]/                     en | ar, both indexable, RTL via dir + logical properties
    page.tsx                    front page, blinking cursor
    sign-in/                    magic link request + sent + callback
    style/[screen]/             the seven files, server-rendered
    profile/                    free style profile
    order/ pay/ confirmation/
  admin/                        stylist tool, noindex, separate auth
lib/
  pricing.ts                    computeQuote(input) -> Quote   [pure, unit tested]
  profile/generate.ts           generateProfile(answers) -> GeneratedProfile [pure, tested]
  money.ts                      fils <-> display, en/ar formatting [tested]
  i18n/{en,ar}.ts               typed dictionaries, shared key union
  payments/                     PaymentProvider interface, MockProvider, MyFatoorahProvider
  auth/                         magic link, sessions
components/ui/                  Button, OptionChip, Panel, Progress, Prompt, Field, Collapsible
```

Two design notes worth stating up front:

- **The profile generator returns structured tokens, not sentences** — rule ids, palette
  ids, a silhouette key plus the numbers — and the view renders locale strings from the
  dictionaries. That is what keeps the Arabic verbatim from the prototype instead of
  generated, and it makes the generator unit-testable without asserting on prose.
- **`computeQuote` is the only thing that knows the prices.** The client renders the
  server's numbers; on submit the server recomputes from the stored answers and rejects any
  total that came from the browser.

**i18n needs no library.** Route segment plus typed dictionaries, where a missing Arabic key
is a compile error. The KWD formatter is hand-rolled and unit tested to produce exactly
`10.000 KD` and `١٠٫٠٠٠ د.ك`, because `Intl` output for `ar-KW` varies with the ICU build
and "varies" is not acceptable for a price.

**Fonts self-hosted** via the `@fontsource` packages for VT323, IBM Plex Mono and IBM Plex
Sans Arabic, loaded through `next/font/local` from `node_modules`. npm is reachable from
this container where Google Fonts is not, the files are OFL-licensed, and this keeps them
out of the git history.

## 9. Data model

```
Customer          name, email unique, phoneE164?, locale, createdAt, lastSeenAt
MagicLinkToken    customerId, tokenHash, expiresAt, usedAt
Session           customerId, tokenHash, expiresAt, lastUsedAt
StylistUser       email, role                            -- admin auth, separate from customers

StyleProfile      customerId, version, isCurrent, answersSchemaVersion,
                  gender, occasion, sizeTop, sizeBottom, sizeShoe, budgetTierFils,
                  answers Json, generated Json
Order             customerId, styleProfileId, paymentModel, lookCount, budgetTierFils,
                  stylingFeeFils, clothingBudgetFils, deliveryFeeFils, totalFils,
                  currency, status, whatsappE164, address, timestamps
Payment           orderId, kind, provider, providerRef, amountFils, status, raw Json
Refund            orderId, paymentId, amountFils, reason, providerRef, status, settledAt
OrderItem         orderId, name, shopName, sizePrimary, sizeAlternate?, sentTwoSizes,
                  costFils, keptSize?, outcome, returnedAt
LookApproval      orderId, sentAt, channel, response, respondedAt, note
StatusEvent       orderId, from, to, actor, at, note     -- audit trail
```

`StyleProfile` is deliberately hybrid: explicit columns for the fields the business will
filter and aggregate on, `answers Json` validated by a Zod schema for the long tail. All 40+
answers as columns would mean a migration every time you reword a question; all of it as
JSON would make "which occasions actually sell" an unqueryable mess. The Zod schema is the
contract either way, and `answersSchemaVersion` lets old profiles keep parsing.

Versioning is what makes the repeat order work: a new order pins the profile version it
used, and a returning customer's current version pre-fills every screen — the 30-second
repeat order the brief calls the most commercially important thing in the build.

`OrderItem.sentTwoSizes` + `keptSize` is how the two-sizes promise becomes data you can
audit rather than a sentence on a page, and how the margin numbers get computed.

## 10. Privacy

Measurements are body data about real people. Concretely: no answers in URLs or query
strings, no analytics payloads containing answers, structured logs redact the answer and
measurement fields, `/admin` is `noindex` and behind stylist auth, every profile read is
authorised against the session's customer id or a stylist role, and the printable sheet is
generated inside an authenticated request.

## 11. Commit sequence

Small and working at each step:

1. scaffold — Next.js App Router, TS, Tailwind v4, no boilerplate
2. design system — tokens, both themes from one set of CSS variables, cookie + toggle, fonts
3. UI primitives — Button, OptionChip (radiogroup/checkbox), Panel, Progress, Prompt, Field, Collapsible
4. i18n — locale routes, typed dictionaries, RTL, KWD formatter **+ tests**
5. Prisma schema and first migration
6. auth — magic link, sessions, rate limiting
7. quiz screens 1–7 — server-rendered, client island, autosave, resume, **prefill from saved profile**
8. profile generator **+ tests**, profile page
9. `computeQuote` **+ tests**, order draft, live total bar
10. `PaymentProvider` + `MockProvider`, order creation, callback handling
11. real gateway adapter — after decision §1
12. confirmation, status flow, WhatsApp approval record, refund path
13. `/admin` — queue, printable profile, item entry, status transitions, numbers
14. Playwright e2e — seven screens to mock payment, in both locales; prefill test
15. deploy config, security headers, log redaction

## 12. Testing

- **Vitest** for `computeQuote`, `generateProfile`, the KWD formatter and the Kuwaiti phone
  validator — every business rule that will get edited later
- **Playwright** for one end-to-end walk of all seven screens to a mock payment, run in
  both `/en` and `/ar`, at 375px
- a test that signs in as a returning customer and asserts every screen is pre-filled

## 13. Not building unless you ask

Stylist photo uploads, WhatsApp Business API automation (the brief says the stylist sends
the look; I am recording the send and the response, not automating it), email templating
beyond the magic link and the order confirmation, and any analytics beyond the admin
numbers listed.
