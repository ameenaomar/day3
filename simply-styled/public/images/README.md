# Lookbook photography

Drop the files here using these exact names. Nothing else needs changing — the
slots, alt text and layout are already wired in `lib/site.config.ts` and
`lib/translations.ts`.

| File | Framing | Shot |
|------|---------|------|
| `look-01-hanger.jpg` | portrait 2:3 | empty wooden hanger |
| `look-02-jeans.jpg`  | portrait 2:3 | straight-leg jeans |
| `look-03-jacket.jpg` | portrait 2:3 | denim jacket, corduroy collar |
| `look-04-shirts.jpg` | portrait 2:3 | rail of linen shirts |
| `look-05-outfit.jpg` | landscape 3:2 | suede jacket with denim |

Any shot can be swapped for another — keep the filename and the framing and the
layout holds.

## Before you add a file

**Check the licence.** One of the images supplied so far was an Unsplash+
*preview*, with "Unsplash+" watermarked across the whole frame. Preview files
are not licensed for use and the watermark is visible on the page. Download the
licensed original, or choose a different shot.

Unsplash's free tier and Envato Elements (which you already subscribe to for
Palmore) both permit commercial use. Keep a record of where each file came from.

## Preparation

- Export at roughly **1600px on the long edge** — enough for a 2× display at the
  sizes used, without making the page heavy.
- Save as JPEG, quality ~80. Aim to keep each file under ~300KB.
- Crop to the framing in the table. The slot crops with `object-fit: cover`, so
  an off-ratio file will lose its edges.

## The duotone

Photographs are remapped to a single duotone in the palette's range. This is
what makes five shots taken on five different backgrounds read as one set, and
it matches the two-colour printing of the 60s editorial work Palmore comes from.

It is an SVG filter (`#ss-duotone`, defined in `app/layout.tsx`) applied through
the `photo-duotone` utility in `app/globals.css`. It desaturates the image and
stretches its luminance ramp between Espresso and Coconut Milk, so a shot taken
on black lands on Espresso rather than staying a black rectangle.

To show a photograph in its original colour, pass `duotone={false}` to
`<Figure>`.
