"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  dirFor,
  isLocale,
  otherLocale,
  type Locale,
} from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  /** True once the stored preference has been read, so nothing flashes. */
  ready: boolean;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Reads the persisted choice before paint. Rendered into <head> so the very
 * first frame is already in the right direction and the right font — without
 * it the page would render LTR English and snap to RTL Arabic on hydration.
 */
export function LanguageScript() {
  const script = `(function(){try{var l=localStorage.getItem(${JSON.stringify(
    LOCALE_STORAGE_KEY,
  )});if(l!=="en"&&l!=="ar")l=${JSON.stringify(
    DEFAULT_LOCALE,
  )};var e=document.documentElement;e.lang=l;e.dir=l==="ar"?"rtl":"ltr";}catch(_){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  // Adopt the persisted choice on mount. The inline script has already put the
  // document in the right direction; this syncs React's copy of that state.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      // Private mode or storage disabled — fall through to the default.
    }
    if (isLocale(stored)) setLocaleState(stored);
    setReady(true);
  }, []);

  // Keep <html lang>/<html dir> in step with state, and persist the choice.
  useEffect(() => {
    if (!ready) return;
    const el = document.documentElement;
    el.lang = locale;
    el.dir = dirFor(locale);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Not fatal: the language still switches for this session.
    }
  }, [locale, ready]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const toggleLocale = useCallback(
    () => setLocaleState((current) => otherLocale(current)),
    [],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, dir: dirFor(locale), ready, setLocale, toggleLocale }),
    [locale, ready, setLocale, toggleLocale],
  );

  return <LanguageContext value={value}>{children}</LanguageContext>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context === null) {
    throw new Error("useLanguage must be used inside <LanguageProvider>.");
  }
  return context;
}
