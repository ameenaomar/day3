import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Signing out from the front door. POST only: a link a browser can prefetch
 * must never be able to end somebody's session.
 *
 * `signOut` revokes the refresh token at Supabase and clears the session
 * cookies here, so the tab and the auth server agree.
 */
export async function POST() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  return new NextResponse(null, { status: 204, headers: { "cache-control": "no-store" } });
}
