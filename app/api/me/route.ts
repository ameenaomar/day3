import { NextResponse } from "next/server";
import { currentUser } from "@/lib/supabase/server";

/**
 * Who is signed in, for the front door at `/`.
 *
 * That page is static HTML in public/, so it cannot read an httpOnly session
 * cookie — and it should not be able to. This endpoint is the seam: the
 * browser asks, the server answers from the cookie, and the page learns a name
 * and an email and nothing else. No user id, no phone number, no measurements.
 */
export async function GET() {
  const user = await currentUser();

  const body = user
    ? {
        signedIn: true as const,
        // The name comes from the metadata written at sign-up, so this answers
        // without a database round trip.
        name: (user.user_metadata?.name as string | undefined) ?? "",
        email: user.email ?? "",
      }
    : { signedIn: false as const };

  return NextResponse.json(body, {
    // A cached "signed in" on a shared device would be somebody else's name.
    headers: { "cache-control": "no-store, private" },
  });
}
