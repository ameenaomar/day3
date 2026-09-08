export const THEME_COOKIE = "ss_theme";

export const themes = ["light", "dark"] as const;

export type Theme = (typeof themes)[number];

export function isTheme(value: string): value is Theme {
  return (themes as readonly string[]).includes(value);
}

/**
 * Theme lives in a cookie rather than localStorage so the server renders the
 * right machine first time and there is no flash of the wrong one. Absent
 * cookie means "follow the OS", which the CSS handles via prefers-color-scheme.
 */
export function themeAttribute(theme: Theme | undefined): Theme | undefined {
  return theme;
}
