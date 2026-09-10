import { NextResponse } from "next/server";
import { endSession } from "@/lib/session";

/**
 * Signing out from the prototype. POST only: a link a browser can prefetch
 * must never be able to end somebody's session.
 */
export async function POST() {
  await endSession();
  return new NextResponse(null, { status: 204, headers: { "cache-control": "no-store" } });
}
