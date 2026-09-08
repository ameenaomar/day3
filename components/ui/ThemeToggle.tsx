"use client";

import { useEffect, useState } from "react";
import { setTheme } from "@/app/actions/preferences";
import type { Theme } from "@/lib/theme";

/**
 * Follows the OS until the viewer chooses, then their choice wins. The
 * indicator only renders after mount, because the server cannot know what the
 * OS preference is and a guess would be a hydration mismatch.
 */
export function ThemeToggle({ label }: { label: string }) {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    const attribute = document.documentElement.dataset.theme;
    if (attribute === "light" || attribute === "dark") {
      setThemeState(attribute);
      return;
    }
    setThemeState(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setThemeState(next);
    void setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === null ? undefined : theme === "dark"}
      className="border border-rule bg-well px-2 py-1 text-xs text-brown shadow-[var(--shadow-hard)] active:translate-y-[2px] active:shadow-none"
    >
      <span aria-hidden="true">{theme === null ? "( )" : theme === "dark" ? "(•)" : "( )"}</span>{" "}
      {label}
    </button>
  );
}
