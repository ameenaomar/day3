"use server";

import { cookies } from "next/headers";
import { THEME_COOKIE, isTheme } from "@/lib/theme";

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function setTheme(value: string): Promise<void> {
  if (!isTheme(value)) return;
  const store = await cookies();
  store.set(THEME_COOKIE, value, {
    maxAge: ONE_YEAR,
    sameSite: "lax",
    path: "/",
    httpOnly: false,
  });
}
