import type { InputHTMLAttributes, ReactNode } from "react";

/**
 * Label always tied to the input by id. Required fields carry a red `*`,
 * optional ones say so in words — guessing from the absence of a marker is not
 * a thing a customer should have to do.
 */
export function Field({
  id,
  label,
  required = false,
  optionalLabel,
  hint,
  error,
  children,
}: {
  id: string;
  label: ReactNode;
  required?: boolean;
  optionalLabel?: string;
  hint?: ReactNode;
  error?: string;
  children?: ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex items-baseline gap-1 text-sm">
        <span>{label}</span>
        {required ? (
          <span className="text-red" aria-hidden="true">
            *
          </span>
        ) : optionalLabel ? (
          <span className="text-xs text-dim">{optionalLabel}</span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-xs text-dim">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  hasError = false,
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      {...rest}
      aria-invalid={hasError || undefined}
      className={`border bg-well px-3 py-2 text-brown shadow-[var(--shadow-hard)] placeholder:text-dim ${
        hasError ? "border-red" : "border-rule"
      } ${className}`}
    />
  );
}
