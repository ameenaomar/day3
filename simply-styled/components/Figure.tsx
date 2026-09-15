import type { ReactNode } from "react";

type FigureProps = {
  /** Path under /public, e.g. "/images/look-01.jpg". */
  src: string;
  /** Describes the garment for screen readers; comes from translations. */
  alt: string;
  caption?: ReactNode;
  /** CSS aspect-ratio, as Tailwind writes it — "3/4" portrait, "4/3" landscape. */
  ratio?: string;
  /** Set false to show the photograph in its original colour. */
  duotone?: boolean;
};

/**
 * An editorial photograph.
 *
 * Square corners, no shadow, a hairline frame, and a two-colour duotone that
 * remaps the image between Espresso and Coconut Milk, so shots taken on five
 * different backgrounds read as one set. Until a file exists at `src` the slot
 * shows the Warm Sand ground underneath, so the layout stays legible.
 */
export function Figure({
  src,
  alt,
  caption,
  ratio = "3/4",
  duotone = true,
}: FigureProps) {
  return (
    <figure>
      <div
        className="relative w-full overflow-hidden border border-rule bg-sand"
        style={{ aspectRatio: ratio }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 size-full object-cover ${duotone ? "photo-duotone" : ""}`}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-label uppercase text-ink-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
