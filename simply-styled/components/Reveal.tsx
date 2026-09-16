"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fades its children up as they enter the viewport.
 *
 * Starts visible and only hides once the observer is attached, so the content
 * is never invisible to a reader without JavaScript, and never hidden if the
 * observer fails to fire.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(true);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el === null) return;
    if (!("IntersectionObserver" in window)) return;

    // Respect the OS setting: no hiding, no animation, nothing to reveal.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setShown(false);
    setArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${armed && shown ? "rise" : ""}`}
      style={armed ? { opacity: shown ? undefined : 0, animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
