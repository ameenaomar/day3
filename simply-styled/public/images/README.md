# Wallpapers

The site uses photographs as full-bleed wallpaper behind display type — one
image, one headline, nothing else. Drop the files here using these names;
nothing else needs changing.

| File | Framing | Where |
|------|---------|-------|
| `wallpaper-hero.jpg` | landscape, 16:9 or wider | the opening screen, behind the wordmark |
| `wallpaper-services.jpg` | landscape, 16:9 or wider | the rates band |

Any photograph can be swapped for another — keep the filename and the layout
holds.

## Before you add a file

**Check the licence.** One of the images supplied so far was an Unsplash+
*preview*, with "Unsplash+" watermarked across the whole frame. Preview files
are not licensed for use and the watermark is visible on the page. Download the
licensed original, or choose a different shot.

Unsplash's free tier and Envato Elements (which you already subscribe to for
Palmore) both permit commercial use. Keep a record of where each file came from.

## Choosing a shot

Because the type sits over the image, wallpapers want **space** — a plain wall,
a rail seen at a distance, a flat lay with room around it. A photograph with
its subject dead centre will fight the headline.

Portrait-shaped photographs will be cropped hard: the slot fills its band with
`object-fit: cover`, so a tall image loses its top and bottom. Prefer landscape.

## Preparation

- Export at roughly **2400px wide** — these run the full width of the screen.
- JPEG, quality ~80. Aim to keep each under ~400KB.

## Why the images look darker on the page

Two treatments are applied, and both are load-bearing:

1. **Duotone.** An SVG filter (`#ss-duotone`, defined in `app/layout.tsx`)
   desaturates the photograph and stretches its luminance between Espresso and
   Coconut Milk. A shot taken on black lands on Espresso instead of punching a
   black hole in a warm page, and any two photographs read as one set. It is
   also the period treatment — two-colour editorial printing, which is where
   Palmore comes from.

2. **Scrim.** A flat Espresso layer at 75% sits over the photograph. This is
   what keeps the headline readable: after the duotone the brightest pixel a
   photograph can produce is Coconut Milk, and under the scrim even that sits
   at `#675D54` — 5.32:1 against Coconut Milk text, clear of the 4.5:1 that
   WCAG AA requires. Without it, legibility would depend on which photograph
   happened to be in the slot.

Headlines over a wallpaper must be **Coconut Milk**. Warm Sand reaches only
2.83:1 over the same scrim and fails.

Both live in `components/Wallpaper.tsx` and `app/globals.css`.
