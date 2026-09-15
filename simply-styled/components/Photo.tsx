/**
 * One photograph in the strip. Square corners, hairline frame, duotoned into
 * the palette so mixed stock sources read as one set. Until a file exists the
 * raised panel shows through, so the strip still reads as a row of frames.
 */
export function Photo({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden border border-rule bg-raised">
      <img
        src={src}
        alt={alt}
        aria-hidden={alt === "" ? "true" : undefined}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover photo-duotone"
      />
    </div>
  );
}
