import type { ReactNode } from "react";

/**
 * Isolates a left-to-right string inside right-to-left text.
 *
 * Without this, the Unicode bidirectional algorithm reorders the neutral
 * characters at the edges of a Latin/technical string when the paragraph runs
 * RTL: "#F0E9DD" comes out as "F0E9DD#", "+965 5000 0000" loses its plus, and
 * "ameena@gmail.com" can break around the dot.
 *
 * Use it for anything that is not prose: hex codes, emails, phone numbers,
 * URLs, handles, Latin brand names and version numbers.
 */
export function LtrText({ children }: { children: ReactNode }) {
  return (
    <span dir="ltr" className="inline-block unicode-bidi-isolate">
      {children}
    </span>
  );
}
