"use client";

import { useActionState, useState } from "react";
import { requestSignIn, type SignInState } from "@/app/actions/signin";
import type { Locale } from "@/lib/i18n/config";
import { SIGNIN, SIGNUP, SIGNUP_ERRORS, t } from "@/lib/i18n/signup";

/**
 * Ask for a link. One field, and the same reply whatever the answer — the
 * page must not become a way to find out who has an account here.
 */
export function SignInForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(requestSignIn, { status: "idle" });

  // Controlled, for the same reason as sign-up: React empties uncontrolled
  // fields once the action settles, and losing the address you just typed
  // because of a typo in it is a small insult.
  const [email, setEmail] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [answered, setAnswered] = useState<SignInState>(state);
  if (answered !== state) {
    setAnswered(state);
    setDismissed(false);
  }

  const error = !dismissed && state.status === "invalid" ? t(SIGNUP_ERRORS[state.error], locale) : null;

  if (state.status === "sent") {
    return (
      <div>
        <p className="swiss-stamp">
          <i aria-hidden="true">✓</i>
          {t(SIGNUP.sentTag, locale)}
        </p>
        <h1 className="swiss-display">{t(SIGNUP.sentTitle, locale)}</h1>
        <p className="swiss-lede">{t(SIGNUP.sentBody, locale)}</p>
        <p className="swiss-mail">{state.email}</p>
        <p className="swiss-note">{t(SIGNUP.sentTtl, locale)}</p>

        {state.devLink ? (
          <div className="swiss-dev">
            {t(SIGNUP.devLink, locale)}
            <a href={state.devLink}>{state.devLink}</a>
          </div>
        ) : null}

        <div className="swiss-actions">
          <a className="swiss-link" href={`/${locale}/signin`}>
            {t(SIGNUP.sentAgain, locale)}
          </a>
        </div>
      </div>
    );
  }

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
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "signin-email-error" : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              setDismissed(true);
            }}
          />
          {error ? (
            <p className="swiss-err" id="signin-email-error">
              {error}
            </p>
          ) : (
            <p className="swiss-hint">{t(SIGNIN.emailHint, locale)}</p>
          )}
        </div>

        {state.status === "failed" ? (
          <p className="swiss-err" role="alert">
            {state.reason === "not_configured"
              ? t(SIGNUP.failedConfig, locale)
              : state.reason === "no_database"
                ? t(SIGNUP.failedNoDatabase, locale)
                : t(SIGNUP.failedUnavailable, locale)}
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
