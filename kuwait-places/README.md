# Yalla, where to? ☕

A small bilingual site that answers one question: **where should we hang out
tonight?**

Kuwait doesn't need another 500-entry directory. When friends are deciding, they
are picking between three things — coffee somewhere, a proper meal, or just
going out and chilling. So that's the first thing the site asks, and everything
else narrows from there.

## What it does

- **Pick a plan first** — Coffee, Eat, Chill, or Something else. One tap.
- **Filters that match how people actually decide** — area, price, outdoor
  seating, fits a big group, still open late.
- **"Surprise us"** — picks one spot at random from whatever is on screen, so
  the filters still count. It never repeats the same place twice in a row.
- **Our list / Been there** — save spots and tick off the ones you've done.
  Stored in the browser, no account, no server.
- **English and Arabic**, with proper RTL. Every place name, note and tip is
  written in both.
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

Any static host works. For **GitHub Pages**: push to `main`, then
Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.

The site is two files and no build, so a Pages deploy takes about a minute.

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
| `note` | One line on what the place is. |
| `tip` | What to order, or what to actually do there. |

Both languages are required — a missing `ar` falls back to English and looks
broken next to everything else.

## About the data

The 45 entries here are **seed data**. Hours, prices and whether a place is even
still open change fast in Kuwait, and none of it is verified against the venues
themselves. Check an entry before you trust it, and correct it here when it's
wrong — that's the whole maintenance model.

Nothing on this list is sponsored or paid for.
