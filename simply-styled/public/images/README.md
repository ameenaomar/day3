# Photography

The site runs one strip of four photographs across the page, below the rates.
Drop the files here using these names; nothing else needs changing.

| File | Framing |
|------|---------|
| `strip-01.jpg` | portrait 3:4 |
| `strip-02.jpg` | portrait 3:4 |
| `strip-03.jpg` | portrait 3:4 |
| `strip-04.jpg` | portrait 3:4 |

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

No type sits over these, so the subject can fill the frame. They are portrait
tiles in a row, so a single garment, a rail, or a close detail all work; wide
scenes will lose their edges to the crop.

## Preparation

- Export at roughly **1200px on the long edge** — each tile is a quarter of the
  page width.
- JPEG, quality ~80. Aim to keep each under ~250KB.

## Why the images look darker on the page

One treatment is applied, and it is load-bearing:

1. **Duotone.** An SVG filter (`#ss-duotone`, defined in `app/layout.tsx`)
   desaturates the photograph and stretches its luminance between the page
   ground and Warm Sand. A shot taken on white lands on Warm Sand instead of
   punching a bright hole in a dark page, and any two photographs read as one
   set. It is also the period treatment — two-colour editorial printing, which
   is where Palmore comes from.

Both live in `components/Wallpaper.tsx` and `app/globals.css`.
