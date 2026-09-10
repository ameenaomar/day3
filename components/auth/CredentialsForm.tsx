"use client";

import { useActionState, useId, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { MIN_PASSWORD, checkSignIn, checkSignUp, hasErrors, type AuthField } from "@/lib/auth/rules";
import { authCopy } from "@/lib/i18n/auth";
import type { Locale } from "@/lib/i18n/config";
import type { AuthFormState } from "@/app/actions/auth";

type Mode = "signin" | "signup";

type Action = (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;

/**
 * The sign-in and sign-up form. One component for both, because they differ by
 * two fields and a verb — two copies would drift.
 *
 * The action is passed in rather than imported so this file stays a client
 * component with no server import of its own.
 */
export function CredentialsForm({
  mode,
  locale,
  action,
  next,
}: {
  mode: Mode;
  locale: Locale;
  action: Action;
  next?: string;
}) {
  const t = authCopy(locale);
  const [state, formAction] = useActionState<AuthFormState, FormData>(action, {});
  const [clientErrors, setClientErrors] = useState<Partial<Record<AuthField, string>>>({});
  const [revealed, setRevealed] = useState(false);
  const ids = useId();

  const isSignUp = mode === "signup";

  /**
   * Check what was typed before handing it to the action.
   *
   * Not for security — the action applies the same rules again and it is the
   * one that counts. It is for the password fields: a Server Action re-render
   * replaces the form and they come back empty, so a customer who submitted a
   * mismatched confirmation would have to retype both. Stopping the submit here
   * leaves everything they typed exactly where it was.
   */
  function validate(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const value = (field: string) => String(data.get(field) ?? "");

    const problems = isSignUp
      ? checkSignUp({
          name: value("name"),
          email: value("email"),
          password: value("password"),
          passwordConfirm: value("passwordConfirm"),
        })
      : checkSignIn({ email: value("email"), password: value("password") });

    if (hasErrors(problems)) {
      event.preventDefault();
      setClientErrors(
        Object.fromEntries(Object.entries(problems).map(([field, key]) => [field, t(key)])),
      );
      return;
    }
    setClientErrors({});
  }

  /** What the browser just found, else what the server said last time. */
  const errorFor = (field: AuthField) => clientErrors[field] ?? state.fieldErrors?.[field];
  const nameId = `${ids}-name`;
  const emailId = `${ids}-email`;
  const passwordId = `${ids}-password`;
  const confirmId = `${ids}-confirm`;

  return (
    <form action={formAction} onSubmit={validate} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {isSignUp ? (
        <Field
          id={nameId}
          label={t("name")}
          required
          error={errorFor("name")}
        >
          <TextInput
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            defaultValue={state.values?.name ?? ""}
            hasError={Boolean(errorFor("name"))}
            required
          />
        </Field>
      ) : null}

      <Field
        id={emailId}
        label={t("email")}
        required
        hint={isSignUp ? t("emailHint") : undefined}
        error={errorFor("email")}
      >
        <TextInput
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          // The address is Latin script whichever way the page reads.
          dir="ltr"
          placeholder="you@example.com"
          defaultValue={state.values?.email ?? ""}
          hasError={Boolean(errorFor("email"))}
          required
        />
      </Field>

      <Field
        id={passwordId}
        label={t("password")}
        required
        hint={isSignUp ? t("passwordHint") : undefined}
        error={errorFor("password")}
      >
        <TextInput
          id={passwordId}
          name="password"
          type={revealed ? "text" : "password"}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          dir="ltr"
          minLength={isSignUp ? MIN_PASSWORD : undefined}
          hasError={Boolean(errorFor("password"))}
          required
        />
      </Field>

      {isSignUp ? (
        <Field
          id={confirmId}
          label={t("passwordConfirm")}
          required
          error={errorFor("passwordConfirm")}
        >
          <TextInput
            id={confirmId}
            name="passwordConfirm"
            type={revealed ? "text" : "password"}
            autoComplete="new-password"
            dir="ltr"
            hasError={Boolean(errorFor("passwordConfirm"))}
            required
          />
        </Field>
      ) : null}

      <label className="flex items-center gap-2 text-xs text-dim">
        <input
          type="checkbox"
          checked={revealed}
          onChange={(event) => setRevealed(event.target.checked)}
          className="size-4 border border-rule bg-well"
        />
        {t("showPassword")}
      </label>

      {state.error ? (
        <p role="alert" className="border border-red bg-well px-3 py-2 text-sm text-red">
          ! {state.error}
        </p>
      ) : null}

      <Submit label={isSignUp ? t("signUpSubmit") : t("signInSubmit")} working={t("working")} />
    </form>
  );
}

/**
 * Separate component so `useFormStatus` reads this form's state — it only
 * reports pending from inside the form it belongs to.
 */
function Submit({ label, working }: { label: string; working: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" className="w-full" disabled={pending}>
      {pending ? working : label}
    </Button>
  );
}
