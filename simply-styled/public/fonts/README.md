# Palmore — the display face

The brand's display typeface is **PALMORE – Vintage Rounded Serif** (by kaligra,
4 styles, 2022), licensed through Envato Elements. Licensed fonts cannot be
committed by a build agent or fetched from a CDN, so the repository ships a free
stand-in and leaves Palmore as a drop-in.

Until the files below exist, headlines render in **Yeseva One** — a vintage,
flared, high-contrast face with the weight to carry a headline. It is wider than
Palmore, so headlines will tighten when the real face lands.

## Adding it

1. Download Palmore from Envato Elements with your subscription, choosing the
   **web font** package. Envato's licence covers web embedding, but it is issued
   per registered project — register this site against the download so the
   licence is on record.
2. Convert or export the weights you want to `.woff2` and put them here:

   ```
   public/fonts/palmore-regular.woff2
   ```

3. Uncomment the `@font-face` block at the top of `app/globals.css`.

Nothing else needs changing: `--font-serif` already lists `"Palmore"` ahead of
the stand-in, so the whole site switches over as soon as the face resolves.

## Why it is display-only

Palmore is a condensed titling face — the foundry describes it as "perfectly fit
for headline and titles". It is bound to `--font-serif` and used for `h1`/`h2`
only. Body text stays on Inter (Latin) and IBM Plex Sans Arabic.
