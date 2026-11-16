import { NextResponse } from "next/server";
import { createCaptureContext, CybersourceError } from "@/lib/cybersource";
import { priceOrder } from "@/lib/order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Step 1 of Unified Checkout: the server asks Cybersource for a one-time capture context (a signed
 * JWT) for this cart's total. The browser uses it to load and render the Unified Checkout UI.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const order = priceOrder(body?.lines);
  if (!order) return NextResponse.json({ error: "Cart is empty or invalid" }, { status: 400 });

  try {
    const captureContext = await createCaptureContext(order.totalCents);
    return NextResponse.json({ captureContext, totalCents: order.totalCents });
  } catch (err) {
    const e = err as CybersourceError;
    console.error("capture context failed", e.status, e.details ?? e.message);
    return NextResponse.json(
      { error: "Could not start checkout", status: e.status, details: e.details ?? e.message },
      { status: 502 },
    );
  }
}
