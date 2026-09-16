"use client";

import { useEffect, useState } from "react";

/**
 * Cycles a single word in the headline. The words are the quiz's own occasion
 * options, so the promise on the front page is literally the thing the quiz
 * asks about — one source of copy, not two.
 *
 * The full list is rendered once, invisibly, to reserve the widest word's
 * width; otherwise the line would reflow on every change. Under reduced motion
 * the CSS animation is dropped and the word simply swaps.
 */
export function CyclingWord({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      2600,
    );
    return () => window.clearInterval(id);
  }, [words.length]);

  const word = words[index] ?? "";

  return (
    <span className="relative inline-grid align-baseline">
      {/* Width reservation: every word stacked in the same grid cell. */}
      {words.map((w) => (
        <span
          key={w}
          aria-hidden="true"
          className="invisible col-start-1 row-start-1 whitespace-nowrap"
        >
          {w}
        </span>
      ))}
      <span key={word} className="word-in col-start-1 row-start-1 text-sand">
        {word}
      </span>
    </span>
  );
}
