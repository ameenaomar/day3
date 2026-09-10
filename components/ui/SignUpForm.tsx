"use client";

import { useActionState, useState } from "react";
import { signUp, type SignUpState } from "@/app/actions/auth";
import type { Locale } from "@/lib/i18n/config";
import { AUTH_FAILURES, SIGNUP, SIGNUP_ERRORS, t } from "@/lib/i18n/signup";
import { PASSWORD_MIN, formatKuwaitMobile } from "@/lib/signup";

/**
 * The form is a server action with `useActionState`, so it still works with
 * JavaScript off: the browser posts, the action answers, the page renders the
 * result. What JavaScript adds is the phone formatting, the pending state and
 * clearing an error as soon as the field it belongs to changes.
 */
export function SignUpForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState<SignUpState, FormData>(signUp, { status: "idle" });

  // Every field is controlled, deliberately. React resets an uncontrolled
  // input once a form action settles, which would empty the name and email a
  // customer just typed every time the server found a problem with one of
  // them — the worst possible moment to lose someone's work.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // The passwords are held here and nowhere else: the action never echoes them
  // back, so this state is the only reason a rejected submit does not empty
  // both boxes.
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [revealed, setRevealed] = useState(false);

  // Editing a field hides the error it earned, so the form stops nagging
  // mid-correction. That has to forget itself the moment the server answers
  // again, or a second submit would render its errors invisible — which is
  // exactly what it did before this reset existed.
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [answered, setAnswered] = useState<SignUpState>(state);
  if (answered !== state) {
    setAnswered(state);
    setDismissed(new Set());
  }

  const serverErrors = state.status === "invalid" ? state.errors : {};
  const errorFor = (field: "name" | "email" | "phone" | "password" | "passwordConfirm") => {
    if (dismissed.has(field)) return null;
    const code = serverErrors[field];
    return code ? t(SIGNUP_ERRORS[code], locale) : null;
  };
  const clear = (field: string) =>
    setDismissed((previous) => (previous.has(field) ? previous : new Set(previous).add(field)));

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

        <div className="swiss-actions">
          <a className="swiss-link" href={`/${locale}/signup`}>
            {t(SIGNUP.sentAgain, locale)}
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="swiss-display">{t(SIGNUP.title, locale)}</h1>
      <p className="swiss-lede">{t(SIGNUP.lede, locale)}</p>

      <form action={action} noValidate>
        <input type="hidden" name="locale" value={locale} />

        <div className="swiss-block">
          <label className="swiss-lab" htmlFor="signup-name">
            {t(SIGNUP.name, locale)}
            <u aria-hidden="true">*</u>
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            placeholder={t(SIGNUP.namePlaceholder, locale)}
            value={name}
            aria-invalid={errorFor("name") ? true : undefined}
            aria-describedby={errorFor("name") ? "signup-name-error" : undefined}
            onChange={(event) => {
              setName(event.target.value);
              clear("name");
            }}
          />
          {errorFor("name") ? (
            <p className="swiss-err" id="signup-name-error">
              {errorFor("name")}
            </p>
          ) : (
            <p className="swiss-hint">{t(SIGNUP.nameHint, locale)}</p>
          )}
        </div>

        <div className="swiss-block">
          <label className="swiss-lab" htmlFor="signup-email">
            {t(SIGNUP.email, locale)}
            <u aria-hidden="true">*</u>
          </label>
          <input
            id="signup-email"
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
            aria-describedby={errorFor("email") ? "signup-email-error" : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              clear("email");
            }}
          />
          {errorFor("email") ? (
            <p className="swiss-err" id="signup-email-error">
              {errorFor("email")}
            </p>
          ) : (
            <p className="swiss-hint">{t(SIGNUP.emailHint, locale)}</p>
          )}
        </div>

        <div className="swiss-block">
          <label className="swiss-lab" htmlFor="signup-password">
            {t(SIGNUP.password, locale)}
            <u aria-hidden="true">*</u>
          </label>
          <input
            id="signup-password"
            name="password"
            type={revealed ? "text" : "password"}
            autoComplete="new-password"
            dir="ltr"
            required
            minLength={PASSWORD_MIN}
            value={password}
            aria-invalid={errorFor("password") ? true : undefined}
            aria-describedby={errorFor("password") ? "signup-password-error" : undefined}
            onChange={(event) => {
              setPassword(event.target.value);
              clear("password");
            }}
          />
          {errorFor("password") ? (
            <p className="swiss-err" id="signup-password-error">
              {errorFor("password")}
            </p>
          ) : (
            <p className="swiss-hint">{t(SIGNUP.passwordHint, locale)}</p>
          )}
        </div>

        <div className="swiss-block">
          <label className="swiss-lab" htmlFor="signup-password-confirm">
            {t(SIGNUP.passwordConfirm, locale)}
            <u aria-hidden="true">*</u>
          </label>
          <input
            id="signup-password-confirm"
            name="passwordConfirm"
            type={revealed ? "text" : "password"}
            autoComplete="new-password"
            dir="ltr"
            required
            value={passwordConfirm}
            aria-invalid={errorFor("passwordConfirm") ? true : undefined}
            aria-describedby={
              errorFor("passwordConfirm") ? "signup-password-confirm-error" : undefined
            }
            onChange={(event) => {
              setPasswordConfirm(event.target.value);
              clear("passwordConfirm");
            }}
          />
          {errorFor("passwordConfirm") ? (
            <p className="swiss-err" id="signup-password-confirm-error">
              {errorFor("passwordConfirm")}
            </p>
          ) : (
            <p className="swiss-hint">{t(SIGNUP.passwordConfirmHint, locale)}</p>
          )}
          <label className="swiss-check" style={{ marginTop: 10 }}>
            <input
              type="checkbox"
              checked={revealed}
              onChange={(event) => setRevealed(event.target.checked)}
            />
            <span>{t(SIGNUP.showPassword, locale)}</span>
          </label>
        </div>

        <div className="swiss-block">
          <label className="swiss-lab" htmlFor="signup-phone">
            {t(SIGNUP.phone, locale)}
            <i>{t(SIGNUP.optional, locale)}</i>
          </label>
          <div className="swiss-tel">
            <span aria-hidden="true">+965</span>
            <input
              id="signup-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              dir="ltr"
              placeholder="9XXX XXXX"
              value={phone}
              aria-invalid={errorFor("phone") ? true : undefined}
              aria-describedby={errorFor("phone") ? "signup-phone-error" : undefined}
              onChange={(event) => {
                setPhone(formatKuwaitMobile(event.target.value));
                clear("phone");
              }}
            />
          </div>
          {errorFor("phone") ? (
            <p className="swiss-err" id="signup-phone-error">
              {errorFor("phone")}
            </p>
          ) : (
            <p className="swiss-hint">{t(SIGNUP.phoneHint, locale)}</p>
          )}
        </div>

        <div className="swiss-block">
          <label className="swiss-check">
            <input type="checkbox" name="marketingOptIn" />
            <span>
              {t(SIGNUP.consent, locale)}
              <span className="swiss-hint" style={{ marginTop: 4, display: "block" }}>
                {t(SIGNUP.consentNote, locale)}
              </span>
            </span>
          </label>
        </div>

        {state.status === "failed" ? (
          <p className="swiss-err" role="alert">
            {t(AUTH_FAILURES[state.reason], locale)}
          </p>
        ) : null}

        <div className="swiss-actions">
          <button className="swiss-btn swiss-btn-wide" type="submit" disabled={pending}>
            {pending ? t(SIGNUP.submitting, locale) : t(SIGNUP.submit, locale)}
          </button>
        </div>

        <p className="swiss-note">{t(SIGNUP.returning, locale)}</p>
        <p className="swiss-note">{t(SIGNUP.privacy, locale)}</p>
      </form>
    </>
  );
}
