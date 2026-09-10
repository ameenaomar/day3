"use client";

import { useActionState, useState } from "react";
import { signIn, type SignInState } from "@/app/actions/auth";
import type { Locale } from "@/lib/i18n/config";
import { AUTH_FAILURES, SIGNIN, SIGNUP_ERRORS, t } from "@/lib/i18n/signup";

/**
 * Email and password, against Supabase Auth.
 *
 * A wrong password and an address with no account give the same answer, on
 * purpose: this page must not become a way to find out who has a file here.
 */
export function SignInForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, { status: "idle" });

  // Controlled, for the same reason as sign-up: React empties uncontrolled
  // fields once the action settles, and losing the address you just typed
  // because of a typo in it is a small insult.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [answered, setAnswered] = useState<SignInState>(state);
  if (answered !== state) {
    setAnswered(state);
    setDismissed(false);
  }

  const fieldErrors = state.status === "invalid" ? state.errors : {};
  const errorFor = (field: "email" | "password") => {
    if (dismissed) return null;
    const code = fieldErrors[field];
    return code ? t(SIGNUP_ERRORS[code], locale) : null;
  };

  return (
    <>
      <h1 className="swiss-display">{t(SIGNIN.title, locale)}</h1>
      <p className="swiss-lede">{t(SIGNIN.lede, locale)}</p>

      <form action={action} noValidate>
        <input type="hidden" name="locale" value={locale} />

        <div className="swiss-block">
          <label className="swiss-lab" htmlFor="signin-email">
            {t(SIGNIN.email, locale)}
            <u aria-hidden="true">*</u>
          </label>
          <input
            id="signin-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            required
            maxLength={200}
            placeholder="you@example.com"
            value={email}
            aria-invalid={errorFor("email") ? true : undefined}
            aria-describedby={errorFor("email") ? "signin-email-error" : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              setDismissed(true);
            }}
          />
          {errorFor("email") ? (
            <p className="swiss-err" id="signin-email-error">
              {errorFor("email")}
            </p>
          ) : (
            <p className="swiss-hint">{t(SIGNIN.emailHint, locale)}</p>
          )}
        </div>

        <div className="swiss-block">
          <label className="swiss-lab" htmlFor="signin-password">
            {t(SIGNIN.password, locale)}
            <u aria-hidden="true">*</u>
          </label>
          <input
            id="signin-password"
            name="password"
            type={revealed ? "text" : "password"}
            autoComplete="current-password"
            dir="ltr"
            required
            value={password}
            aria-invalid={errorFor("password") ? true : undefined}
            aria-describedby={errorFor("password") ? "signin-password-error" : undefined}
            onChange={(event) => {
              setPassword(event.target.value);
              setDismissed(true);
            }}
          />
          {errorFor("password") ? (
            <p className="swiss-err" id="signin-password-error">
              {errorFor("password")}
            </p>
          ) : null}
          <label className="swiss-check" style={{ marginTop: 10 }}>
            <input
              type="checkbox"
              checked={revealed}
              onChange={(event) => setRevealed(event.target.checked)}
            />
            <span>{t(SIGNIN.showPassword, locale)}</span>
          </label>
        </div>

        {state.status === "failed" ? (
          <p className="swiss-err" role="alert">
            {t(AUTH_FAILURES[state.reason], locale)}
          </p>
        ) : null}

        <div className="swiss-actions">
          <button className="swiss-btn swiss-btn-wide" type="submit" disabled={pending}>
            {pending ? t(SIGNIN.submitting, locale) : t(SIGNIN.submit, locale)}
          </button>
        </div>

        <p className="swiss-note">
          <a className="swiss-link" href={`/${locale}/signup`}>
            {t(SIGNIN.noAccount, locale)}
          </a>
        </p>
      </form>
    </>
  );
}
