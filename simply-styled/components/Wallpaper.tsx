import type { ReactNode } from "react";

type WallpaperProps = {
  /** Path under /public, e.g. "/images/wallpaper-hero.jpg". */
  src: string;
  /** Content laid over the photograph — headline, standfirst, rules. */
  children: ReactNode;
  /** Height of the band. Defaults to the full viewport. */
  className?: string;
};

/**
 * A full-bleed photographic wallpaper with display type over it — the Palmore
 * treatment: one large image, one large headline, nothing else.
 *
 * Three things make the type readable whatever photograph is dropped in:
 *
 *   1. the duotone maps the image between Espresso and Coconut Milk, so its
 *      brightest possible pixel is known in advance;
 *   2. a flat Espresso scrim at 75% sits over it, which puts even that
 *      brightest pixel at #675D54 — 5.32:1 against Coconut Milk text, clear of
 *      the 4.5:1 WCAG AA needs;
 *   3. `isolate` keeps the scrim compositing against the photograph rather
 *      than the page.
 *
 * Warm Sand cannot be used for type here — it reaches only 2.83:1 over the
 * same scrim. Headlines on a wallpaper are Coconut Milk.
 *
 * The photograph is decorative: the headline carries the meaning, so the image
 * takes an empty alt rather than making a screen reader announce scenery.
 */
export function Wallpaper({ src, children, className = "" }: WallpaperProps) {
  return (
    <section className={`relative isolate overflow-hidden ${className}`}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover photo-duotone"
      />
      <div aria-hidden="true" className="absolute inset-0 wallpaper-scrim" />
      <div className="relative">{children}</div>
    </section>
  );
}
