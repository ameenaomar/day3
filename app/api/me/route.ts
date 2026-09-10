import { NextResponse } from "next/server";
import { currentCustomer } from "@/lib/session";

/**
 * Who is signed in, for the prototype at `/`.
 *
 * That page is static HTML in public/, so it cannot read an httpOnly session
 * cookie — and it should not be able to. This endpoint is the seam: the
 * browser asks, the server answers from the cookie, and the page learns a
 * name and an email and nothing else. No customer id, no phone number, no
 * measurements.
 */
export async function GET() {
  const customer = await currentCustomer();

  const body = customer
    ? { signedIn: true as const, name: customer.name, email: customer.email }
    : { signedIn: false as const };

  return NextResponse.json(body, {
    // A cached "signed in" on a shared device would be somebody else's name.
    headers: { "cache-control": "no-store, private" },
  });
}
