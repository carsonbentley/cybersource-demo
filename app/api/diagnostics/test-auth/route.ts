import { NextResponse } from "next/server";
import { authorizeTestCard, CybersourceError } from "@/lib/cybersource";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sandbox smoke test: a $1.00 authorization with the 4111 test card, run from the server.
 * Same check as scripts/test_auth.py, for when you can only reach the deployed site.
 * Refuses to run against anything but the sandbox host.
 */
export async function GET() {
  if (process.env.CYBS_RUN_ENVIRONMENT !== "apitest.cybersource.com") {
    return NextResponse.json({ error: "Only runs against the sandbox" }, { status: 403 });
  }
  try {
    const r = await authorizeTestCard();
    return NextResponse.json({
      ok: r.approved,
      httpStatus: 201,
      status: r.status,
      id: r.id,
      reason: r.reason ?? null,
      message: r.message ?? null,
    });
  } catch (err) {
    const e = err as CybersourceError;
    return NextResponse.json(
      { ok: false, httpStatus: e.status, details: e.details ?? e.message },
      { status: 200 },
    );
  }
}
