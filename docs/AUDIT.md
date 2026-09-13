# Phase 0 audit — Simply Styled

State audited: `d53a3b4` (the commit the live site is built from) plus the open
control-panel work on top of it. No source files changed for this audit; the
only additions are `docs/before/` and this file.

---

## 1. Stack and where things live

| | |
| --- | --- |
| Framework | Next.js **16.3.4**, App Router, React 19.2.8, TypeScript 7 |
| Styling | Tailwind v4 via `@tailwindcss/postcss` (used only by the scaffold pages) + hand-written CSS |
| Data | PostgreSQL on **Supabase** (project `simply-styled`, `djkpilwfcokgjjtbwker`, eu-central-1) via Prisma 7 + `@prisma/adapter-pg` |
| Auth | Passwordless magic link, hashed tokens, server sessions (`lib/session.ts`) |
| Email | Resend (`lib/email.ts`) |
| Tests | Vitest (4 unit specs); Playwright is a dependency but there are no specs |
| Build | `node scripts/build-fonts.mjs --if-missing && next build`; Node pinned to 22 |
| Deploy | Vercel, production built from branch `claude/html-update-vercel-deploy-xn441e` |

### The single most important structural fact

**The public website is not the Next.js app.** It is one static file —
`public/simply-styled.html`, ~2,100 lines, hand-written HTML + CSS + vanilla
JS — rewritten to `/` by `next.config.ts`. It renders every public screen
client-side from its own in-file state.

The Next.js app under `/en` and `/ar` is a **half-finished port** of it, still
wearing the *previous* visual identity (beige terminal / CRT, VT323 + IBM Plex
Mono). The live site wears the current one (Swiss / International
Typographic Style, Inter + red accent).

So there are two products in this repo that do not look like each other.

---

## 2. Every route that exists today

| Route | Rendered by | Purpose | Identity |
| --- | --- | --- | --- |
| `/` | `public/simply-styled.html` (rewrite) | **The whole public product**: sign-in gate, landing, 8-step questionnaire, measurements, generated style profile, order, mock payment, confirmation | Swiss |
| `/en`, `/ar` | `app/[locale]/page.tsx` | Scaffold front page. Proves tokens/RTL/fonts/pricing; not real copy | Beige/CRT |
| `/en/signup`, `/ar/signup` | `app/[locale]/signup/page.tsx` | Create an account. **Writes to the database** | Swiss (scoped `.swiss`) |
| `/en/signin`, `/ar/signin` | `app/[locale]/signin/page.tsx` | Request a magic link | Swiss (scoped) |
| `/en/signin/[token]` | route handler | Exchange link for a session, then redirect | — |
| `/en/design`, `/ar/design` | `app/[locale]/design/page.tsx` | Internal design-system specimen | Beige/CRT |
| `/api/me` | route handler | Is there a session? Used by the static prototype | — |
| `/api/signout` | route handler | Destroy the session | — |
| `/robots.txt`, `/sitemap.xml`, `/icon.svg` | generated | — | — |
| `/whatcaniwear.html` | redirect (301) → `/` | Old prototype filename | — |
| `/admin/*` | **does not exist** (404) | Already `noindex`-ed in `next.config.ts` and excluded from the locale proxy — the slot is reserved | — |

Verified by probing a production build: every route above returns the status
shown, `/en/nope` → 404, `/admin` → 404.

---

## 3. Where services, prices and delivery live today

### 3a. Prices — hard-coded in three places, and they disagree

| File | What it holds |
| --- | --- |
| `lib/pricing.ts` | `STYLING_FEE_PER_LOOK_FILS = 10_000`, `BUDGET_TIERS_FILS = [40k, 80k, 150k, 250k]`, `DELIVERY_FEE_FILS = 2_000`, `FREE_DELIVERY_OVER_FILS = 100_000`, `MIN/MAX_LOOKS`, `computeQuote()`, `computeRefund()` |
| `lib/pricing.test.ts` | Asserts all of the above |
| `public/simply-styled.html` | **Re-implements the same maths in JS** (`money()`, line ~1803: `styling=looks*10, ship=(styling+clothes)>=100?0:2`) and hard-codes `10.000 KD` in copy (line 1059) and in the price line (line 1486); budget tiers repeated as strings (lines 1064–1068) |
| `app/[locale]/page.tsx` | Renders a "pricing check" panel from `lib/pricing.ts` |

The prototype's `money()` and `lib/pricing.ts` are **two independent
implementations of the same rules**. Nothing keeps them in step.

There is **no admin-editable price anywhere**, and no settings table.

### 3b. The current service model (to be replaced)

Not "two services" at all today — it is one service with two dials:
*number of looks* (1–5) × *clothing budget tier* (40/80/150/250 KD per look),
plus a styling fee of 10 KD per look, plus delivery. Payment is modelled two
ways (`fee_first`, `prepaid_full`).

### 3c. Delivery, shipping, address — full search results

Searched: `delivery`, `Delivery`, `DELIVERY`, `shipping`, `ship`, `address`,
`Address`, `addr`, `توصيل`, `شحن`, `عنوان`.

**Real delivery/shipping, must be removed:**

| File | What |
| --- | --- |
| `lib/pricing.ts` | `DELIVERY_FEE_FILS`, `FREE_DELIVERY_OVER_FILS`, `deliveryFeeFils`, `freeDelivery` in `Quote`, the free-delivery branch in `computeQuote` (+ 2 open `TODO`s) |
| `lib/pricing.test.ts` | Every delivery assertion |
| `lib/kuwait.ts` | Whole file is "Kuwait-only **delivery**": `GOVERNORATES`, `isGovernorate` (phone validation also lives here and must survive) |
| `lib/kuwait.test.ts` | Governorate tests |
| `app/[locale]/page.tsx` | "Delivery" / "التوصيل" row in the pricing panel |
| `public/simply-styled.html` | `rShip` ("Delivery in Kuwait" / "التوصيل داخل الكويت"), `tShip`, `p3` ("Delivered in 3–5 days" / "التوصيل في ٣–٥ أيام"), `doneL` (delivery promise), `phoneH` ("before it ships" / "قبل الشحن"), `money().ship`, the `withShip` branch of `orderSummary()`, the delivery row in `pay()` |
| `lib/i18n/signup.ts` | line 33 — "before it ships" / "قبل الشحن" |
| `prisma/schema.prisma` | `model Address` (whole model, incl. `governorate`), `Order.deliveryFeeFils`, `Order.addressId` + 8 `address*` snapshot columns, `Customer.addresses` relation, the header comment |
| `prisma/migrations/00000000000000_init/` | The above as SQL |
| `prisma/migrations/00000000000001_row_level_security/` | RLS grants on `Address` |
| `PLAN.md` | Delivery throughout the written plan |

**False positives — these are *email* address / *email* delivery, leave alone:**

- `lib/email.ts:44` — "the address is enough to debug delivery" (email)
- `app/actions/signin.ts:15,17,49` — "an address with no account" (email)
- `components/ui/SignInForm.tsx:16` — "losing the address you just typed" (email)
- `app/[locale]/design/page.tsx:58` — `عنوان` here means **heading**, not address
- `scripts/build-fonts.mjs` — "shipping" refers to shipping font files
- `public/fonts/LICENSE-*.txt` — licence text

No images or icons are delivery-related: **the site uses no `<img>` at all**
(0 on every page).

---

## 4. Database reality

All 15 tables exist on Supabase, RLS enabled — and **every one has 0 rows**.
The site has no production data to preserve.

More importantly, **10 of the 15 tables have no writer in the codebase**:

| Written today | Never written (schema only) |
| --- | --- |
| `Customer`, `MagicLinkToken`, `Session` | `StyleProfile`, `Measurement`, `Order`, `Payment`, `Refund`, `OrderItem`, `LookApproval`, `OrderStatusEvent`, `Address`, `StylistUser` (+ its 2 session/token tables) |

Consequences for this brief:

- **Questionnaire answers are never submitted anywhere.** The prototype keeps
  them in `localStorage` under `simply-styled.v2` and that is the end of it.
  There is no submission endpoint, no row, nothing for an admin panel to show.
  "Submissions visible in the admin panel" means building that pipeline from
  scratch.
- Dropping the delivery columns is a clean migration — no data to migrate.
- `StylistUser` exists with an `admin`/`stylist` role enum but no auth, no
  routes, no rows. Phase 5's auth has a schema to build on but no code.

---

## 5. CSS: approach and problems

Three stylesheets, and **the Swiss palette is defined twice, independently**:

| | Lines | Identity | Tokens |
| --- | --- | --- | --- |
| `app/globals.css` | 277 | Beige/CRT (old) | `--paper --panel --brown --green --red …` |
| `app/[locale]/signup/signup.css` | 456 | Swiss | `--ss-bg --ss-ink --ss-accent …`, scoped under `.swiss` |
| `public/simply-styled.html` `<style>` | 568 | Swiss | `--bg --ink --accent …` |

Its own comment admits the duplication: *"When the port lands, these tokens
move into globals.css and the scope goes away."*

Problems found:

- **No single source of truth.** `#e1140a`, `#0b0b0b`, `#78787a` etc. are
  written out in both `signup.css` and the prototype. A brand change means
  editing two files that cannot import from each other (one is inside a static
  HTML file).
- **Dead identity.** All 277 lines of `globals.css` — plus five `@font-face`
  blocks and the VT323/Plex Mono woff2 files — serve only `/en`, `/ar` and
  `/en/design`, none of which is the real product.
- `!important`: 3 in `globals.css`, 3 in the prototype (all in
  reduced-motion blocks, which is legitimate).
- **No spacing scale, no type scale, no radius/shadow/z-index tokens.**
  Spacing is ad-hoc px and `clamp()` literals repeated inline.
- **Magic numbers**: `min-height:34px`, `padding:0 11px`, `max-width:1140px`,
  `top:22px` and similar appear once each with no shared meaning.
- Layout is already flexbox/grid — **no floats or absolute-positioning hacks
  found**. This part is in good shape.
- Logical properties (`margin-inline`, `padding-inline`) are already used
  correctly for RTL in the prototype and `signup.css`.

---

## 6. Accessibility

Measured with axe-core 4.10 on a production build, plus structural checks.

| Page | Violations | Detail |
| --- | --- | --- |
| `/` (prototype) | 1 type, 5 nodes | contrast |
| `/en` | 2 types | contrast (2 nodes), **no `<h1>`** |
| `/ar` | 1 type | **no `<h1>`** |
| `/en/signup` | 2 types, 13 nodes | contrast (11), content outside landmarks (2) |
| `/en/signin` | 2 types, 8 nodes | contrast (6), content outside landmarks (2) |

**Contrast — one root cause, 16 nodes.** `--ink-3` / `--ss-ink-3` is
`#78787a`, which on `#ffffff` measures **4.4:1 against a 4.5:1 requirement**.
It is used for every hint, note and footer line on the site. Changing that one
token value fixes all 16 failures in both codebases. Dark mode passes.

**Other findings:**

- `/en` and `/ar` have **no `<h1>`** and in fact no headings at all.
- `/en`, `/ar` have **no `<footer>`**; `nav` is absent on every page (there is
  no site navigation at all — the product is a linear flow).
- `/en/signup`, `/en/signin` have content outside any landmark.
- Skip link: present on `/` only, missing from every Next.js page.
- **Tap targets under 44×44px**: `/` masthead tools are 60×34 (theme, lang);
  `/en` has 5 controls, smallest 46×26.
- Images: none anywhere, so no alt-text debt — but also nothing to lazy-load.
- The prototype's form controls are labelled via `aria-labelledby` rather than
  `<label for>`; it works, but `<label for>` is what Phase 3 asks for.
- Focus styles: `--focus` / `--ss-focus` tokens exist and `:focus-visible` is
  styled in the prototype and `signup.css`; `globals.css` pages are weaker.

**Already good, worth not regressing:** `aria-pressed` on every option,
`aria-invalid` + inline errors on submit, an `aria-live` status region,
`dir`/`lang` set correctly per locale, `prefers-reduced-motion` honoured.

---

## 7. Responsive

No horizontal overflow at 360, 390, 768, 1024 or 1440px on any page. Layout
quality is genuinely good. The gaps are tap-target sizes (above) and the fact
that there is no navigation to be responsive about.

---

## 8. Performance notes

- **The prototype loads fonts from Google Fonts** via a render-blocking
  `<link rel="stylesheet">` — while the Next.js app self-hosts the same family
  in `/public/fonts`. The live site therefore has a third-party render-blocking
  request the rest of the repo already knows how to avoid.
- No images, so no image weight.
- The prototype is one ~68 KB HTML file with everything inline: one request,
  but no caching granularity.

---

## 9. What the brief asks for that already exists

Worth stating so it is not rebuilt:

- **Questionnaire progress indicator** — exists (8-segment bar + numbered step
  rail + "STEP n OF 8").
- **Partial answers surviving refresh** — exists (`save()`/`load()` to
  `localStorage` on every keystroke, restores the exact step).
- **Per-step validation with inline messages** — exists (`errs`, `aria-invalid`,
  error text under the field).
- **Confirmation screen** — exists (`done()`).
- **Logical steps** — exists (8 named groups).

What does **not** exist: the answers going anywhere server-side.
