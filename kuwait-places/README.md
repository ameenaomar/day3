# Yalla, where to? ☕

A small bilingual site that answers one question: **where should we hang out
tonight?**

Kuwait doesn't need another 500-entry directory. When friends are deciding, they
are picking between three things — coffee somewhere, a proper meal, or just
going out and chilling. So that's the first thing the site asks, and everything
else narrows from there.

## What it does

- **Pick a plan first** — Coffee, Eat, Chill, or Something else. One tap.
- **Filters that match how people actually decide** — type of place, area,
  price, quiet enough to talk, good with kids, shisha, outdoor seating, fits a
  big group, still open late. The type-of-place row only offers what the chosen
  plan contains, so Coffee never offers you a museum.
- **"Surprise us"** — picks one spot at random from whatever is on screen, so
  the filters still count. It never repeats the same place twice in a row.
- **Near me** — share your location and the list reorders nearest-first, with
  a distance on every card. Places with several branches can't be measured, so
  they sort to the bottom and say so. Every card also has a **Directions** link
  that opens Google Maps.
- **Spin the wheel** — for when the group can't agree. Everyone adds the spots
  they'd accept to the shared list; once there are two or more, a
  *Spin the wheel* button appears and one spin settles it. Past 14 spots the
  wheel switches to numbers with a legend underneath, so it stays readable
  however long the list gets.
- **Picky eater banner** — pick Coffee or Eat and the site asks before it
  shows anything: vegetarian options, no seafood, familiar food only, or a
  full meal rather than just coffee. One tap on *No restrictions* clears it.
  The other two plans skip the question, and choosing a new plan asks again,
  since the answer belongs to the plan.
- **Accounts, for real** (`login.html`) — sign up with a name, email and
  password, or sign in. Backed by Supabase Auth, so the password is verified
  server-side and a wrong one is actually rejected. See *Accounts* below.
- **Our list / Been there** — save spots and tick off the ones you've done.
  Stored in the browser, no account, no server.
- **English and Arabic**, with proper RTL. Every place name, note and tip is
  written in both.
- **A nameplate, not a navbar** — the one bold colour is spent all at once on
  a solid red masthead, and everything below it is paper. Bodoni Moda sets the
  names, Archivo runs the controls, and both fall back to real stacks if the
  fonts never load. Choosing a plan fills it solid red, so the decision feels
  made. Line icons rather than emoji, so they take the theme's colour.
- **Dark mode**, following the system setting until you override it.
- Mobile-first, because this gets opened in a car.

## Running it

There is no build step and no dependencies. Open `index.html` in a browser.

To serve it locally:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

Two files, no build step, no dependencies — any static host serves it as-is.

### Vercel

This site lives in a subdirectory of a repo whose root is a different
(Next.js) project, so the **Root Directory** setting is the one thing that
matters:

1. Vercel → **Add New → Project** → import this repository.
2. Set **Root Directory** to `kuwait-places`.
3. **Framework Preset: Other.** Leave the build and output commands empty —
   there is nothing to build.
4. Deploy.

Every push to the branch then redeploys on its own. If a `kuwait-places`
project already exists, connect it instead under its
**Settings → Git → Connect Git Repository**, and set the same root directory —
that keeps the project's existing URL.

### GitHub Pages

Push to `main`, then Settings → Pages → Source: *Deploy from a branch* →
`main` / `/ (root)`. Pages serves from the repository root, so this only
works if `index.html` is at the top level — move the files up, or use a
`kuwait-places` repo of its own.

## Adding or fixing a place

Everything lives in `places.js`. Copy an existing entry and edit it:

```js
{
  id: "some-slug",
  name: { en: "The Place", ar: "المكان" },
  area: { en: "Salmiya", ar: "السالمية" },
  vibe: "coffee", cat: "cafe", price: 2,
  outdoor: true, group: false, late: true,
  note: { en: "One line on what it is.", ar: "سطر واحد عن المكان." },
  tip:  { en: "What to order.", ar: "شنو تطلب." }
}
```

| Field | Meaning |
|---|---|
| `id` | Unique slug. Saved lists key off this, so **never reuse one** for a different place. |
| `vibe` | The plan it answers: `coffee`, `eat`, `chill`, `different`. This is the site's main filter. |
| `cat` | Finer label on the card: `cafe` `food` `breakfast` `dessert` `museum` `outdoors` `souq` `landmark` `activity`. |
| `price` | `0` free, `1` cheap, `2` mid-range, `3` splurge. |
| `outdoor` | Real outdoor seating, or the place is outdoors. |
| `group` | A big group fits without a fight over tables. |
| `late` | Usually still going past midnight. |
| `quiet` | You can hold a conversation without raising your voice. |
| `kids` | A child is welcome and won't be bored or in the way. |
| `shisha` | Shisha is served here. |
| `picky` | Feeds the picky-eater banner. Required for `eat` and `coffee`, `null` otherwise: `veg` (a real vegetarian main), `seafood` (seafood is central, so "no seafood" rules it out), `familiar` (a menu a fussy eater recognises), `meal` (a full meal, not just coffee). |
| `coords` | `[lat, lng]`, approximate — used **only** to order the list for "Near me". Use `null` for anything with several branches or no single point; those sort last. |
| `note` | One line on what the place is. |
| `tip` | What to order, or what to actually do there. |

Both languages are required — a missing `ar` falls back to English and looks
broken next to everything else.

### What `quiet`, `kids` and `shisha` are not

Like `picky`, these three are judgements about each place rather than facts
checked with the venue. They are the ones most worth correcting as you actually
visit places.

### What `picky` is not

These are judgements from each menu's style, not dietary guarantees, and the
banner says so on its face. **Don't add allergy fields here** — an unverified
"gluten-free" flag can put someone in hospital, and no amount of small print
fixes that. Allergies belong in a phone call to the venue.

### A note on `coords`

These are **area-level coordinates**, not surveyed pins — accurate enough to
sort by distance, not to navigate by. That's why the Directions link searches
Maps by name and area instead of dropping our own pin. If you replace an
entry's coordinates with real ones, the distance just gets more precise;
nothing else changes.

## About the data

The 69 entries here are **seed data**. Hours, prices and whether a place is even
still open change fast in Kuwait, and none of it is verified against the venues
themselves. Check an entry before you trust it, and correct it here when it's
wrong — that's the whole maintenance model.

Some entries were added from [2:48AM's restaurant coverage](https://248am.com/category/food/)
and published Kuwait café, dessert and breakfast guides — names and areas only,
with the notes and tips written for this site. Where a place came recommended
but its area couldn't be pinned down, it was left out rather than guessed at. Nothing on this list is sponsored or paid for.

---

## Accounts

Sign-up and sign-in run through **Supabase Auth**. The schema is in
`supabase/migrations/`.

**Where things live.** Email and password live in `auth.users`, managed by
Supabase and hashed with bcrypt — this app never sees the password and has no
column for it. `public.profiles` holds the display name and nothing else,
created inside the signup transaction by an `on_auth_user_created` trigger
reading the name out of the signup metadata, so a client that dies halfway
can't leave a nameless user.

**Row-level security** is on, with every policy scoped to
`(select auth.uid()) = id`. That matters because the publishable key in
`supabase-config.js` is public by design — it identifies the project and
grants only what the policies allow. The key that must never appear in
client code is `service_role`, which bypasses RLS entirely.

**Two things worth knowing if you extend this:**

- Postgres grants `EXECUTE` on new functions to `PUBLIC`, so a
  `SECURITY DEFINER` trigger function is reachable over the REST API as
  `/rest/v1/rpc/<name>` until you revoke it. Revoking from `anon` and
  `authenticated` does *not* help — they inherit the `PUBLIC` grant. Migration
  `0002` revokes the right one.
- If the project requires email confirmation, `signUp` returns a user with no
  session. The page treats that as "check your inbox" rather than pretending
  the person is signed in.

`index.html` deliberately has no Supabase client. It greets by name from a
cached display name and sends "Sign out" to `login.html?signout=1`, where the
real `signOut()` happens — so the main page carries no auth dependency and no
network call of its own.

## Deployment notes

A Vercel project `kuwait-places` exists and a production deployment was
created from commit `a80c6d0`:

- https://kuwait-places-t054175-1826.vercel.app
- /login.html — sign up or sign in
- inspector: <https://vercel.com/t054175-1826/kuwait-places/5NzY2dq9dTeR9MTmRFxCVpyAsPqD>

It was deployed through `vercel-bridge/`, which fetches the site's files from
a pinned commit at build time and verifies every sha256 hash before writing
them. See the comment at the top of `vercel-bridge/build.mjs`
for why, and for how to point it at a newer commit.

**Unverified from the session that deployed it.** The deployment was accepted,
but nothing there could read it back:

- Every Vercel API call that names the team scope returns 403
  (`You must re-authenticate to this scope`) — `list_projects`,
  `get_deployment`, `get_deployment_build_logs` and `create_git_project` all
  require a `teamId` and so all fail. `deploy_to_vercel` is the only call
  where `teamId` is optional, and it succeeds when omitted, which is how the
  deployment was made at all.
- `web_fetch_vercel_url` checks the deployment first, so it fails the same way.
- `vercel.app` is blocked by that environment's egress proxy, for both `curl`
  and the web-fetch tool.

What *was* verified: `vercel-bridge/build.mjs` was run locally, reproduced both
files byte-for-byte, and all three browser suites passed against the resulting
`dist/` — so the exact bytes the build serves are known good. Whether Vercel's
build machine ran it is the only open question, and the page itself answers it.

**The real fix** is to reconnect the Vercel authorization so the token carries
team scope, then link the project to git (Settings → Git, root directory
`kuwait-places`). Every push deploys itself after that and `vercel-bridge/`
becomes dead weight.
