import { NextResponse } from "next/server";

/** Reports whether the Cybersource env vars are set, without exposing their values. */
export function GET() {
  const vars = ["CYBS_RUN_ENVIRONMENT", "CYBS_MERCHANT_ID", "CYBS_KEY_ID", "CYBS_SHARED_SECRET"];
  const configured = Object.fromEntries(vars.map((v) => [v, Boolean(process.env[v])]));
  return NextResponse.json({ ok: true, configured });
}
