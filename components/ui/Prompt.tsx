import type { ReactNode } from "react";

/**
 * Question heading, with the `>` prompt. The prompt is decoration, so it is
 * hidden from assistive technology — a screen reader should hear the question,
 * not "greater than".
 */
export function Prompt({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="font-display text-2xl leading-tight">
      <span aria-hidden="true" className="text-green">
        {">"}{" "}
      </span>
      {children}
    </h2>
  );
}
