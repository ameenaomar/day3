import type { ReactNode } from "react";

/**
 * The optional exact-measurements panel. A native <details>, so it costs no
 * JavaScript, is keyboard-operable for free, and still works if the JS never
 * arrives on a bad connection.
 */
export function Collapsible({
  summary,
  note,
  children,
  defaultOpen = false,
}: {
  summary: string;
  note?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border border-rule bg-inset">
      <summary className="flex cursor-pointer items-baseline gap-2 p-3 text-sm marker:content-none">
        <span aria-hidden="true" className="font-mono text-green">
          <span className="group-open:hidden">[+]</span>
          <span className="hidden group-open:inline">[-]</span>
        </span>
        <span className="flex-1">{summary}</span>
      </summary>
      <div className="border-t border-rule p-3">
        {note ? <p className="mb-3 text-xs text-dim">{note}</p> : null}
        {children}
      </div>
    </details>
  );
}
