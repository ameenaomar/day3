import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet";

const base =
  "inline-flex items-center justify-center gap-2 border px-4 py-3 text-center " +
  "font-mono text-[15px] leading-none ui-caps " +
  "transition-transform duration-75 " +
  "active:translate-y-[2px] active:shadow-none " +
  "disabled:cursor-not-allowed disabled:opacity-45 disabled:translate-y-0 " +
  "disabled:shadow-[var(--shadow-hard)]";

const variants: Record<Variant, string> = {
  primary: "border-brown bg-brown text-paper shadow-[var(--shadow-hard-brown)]",
  secondary: "border-rule bg-well text-brown shadow-[var(--shadow-hard)]",
  quiet: "border-transparent bg-transparent text-brown-soft underline decoration-dotted underline-offset-4 shadow-none",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

/**
 * A real <button>. Presses translate down 2px and drop the hard shadow, so the
 * key looks like it went down.
 */
export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}
