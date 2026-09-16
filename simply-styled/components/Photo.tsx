"use client";

/**
 * One photograph in the strip.
 *
 * At rest it is duotoned into the palette so mixed stock sources read as one
 * set; on hover or keyboard focus the treatment lifts and the photograph shows
 * in its own colour, with its caption sliding up. The caption is real text, so
 * it is available to a screen reader whether or not the hover ever happens.
 */
export function Photo({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className="group relative aspect-[3/4] w-full overflow-hidden border border-rule bg-raised">
      <img
        src={src}
        alt={caption}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover photo-duotone transition-[filter] duration-700 group-hover:[filter:none] group-focus-within:[filter:none]"
      />
      <figcaption className="absolute bottom-0 start-0 end-0 translate-y-full bg-paper/85 px-4 py-3 text-label uppercase text-ink transition-transform duration-500 group-hover:translate-y-0 group-focus-within:translate-y-0">
        {caption}
      </figcaption>
    </figure>
  );
}
