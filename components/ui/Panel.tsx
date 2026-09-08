import type { ReactNode } from "react";

/** A panel on the machine's fascia: 1px rule, square corners, hard shadow. */
export function Panel({
  children,
  tone = "panel",
  className = "",
}: {
  children: ReactNode;
  tone?: "panel" | "well" | "inset";
  className?: string;
}) {
  const tones = {
    panel: "bg-panel",
    well: "bg-well",
    inset: "bg-inset",
  } as const;

  return (
    <section className={`border border-rule ${tones[tone]} p-4 shadow-[var(--shadow-hard)] ${className}`}>
      {children}
    </section>
  );
}
