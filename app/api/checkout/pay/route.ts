import { NextResponse } from "next/server";
import { authorizeTransientToken, CybersourceError, decodeJwtPayload } from "@/lib/cybersource";
import { newOrderId, priceOrder } from "@/lib/order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Finds the first value for a key anywhere in a nested object (token payload shapes vary by wallet). */
function findKey(obj: unknown, key: string): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  for (const [k, v] of Object.entries(obj)) {
    if (k === key) return v;
    const found = findKey(v, key);
    if (found !== undefined) return found;
  }
  return undefined;
}

/**
 * Step 2 of Unified Checkout: the browser sends the transient token it got from Unified Checkout;
 * the server re-prices the cart and authorizes the payment through the Payments API.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const order = priceOrder(body?.lines);
  const transientToken = typeof body?.transientToken === "string" ? body.transientToken : "";
  if (!order || !transientToken) {
    return NextResponse.json({ error: "Missing cart or payment token" }, { status: 400 });
  }

  const orderId = newOrderId();
  const tokenPayload = decodeJwtPayload(transientToken);
  const paymentMethod = {
    maskedCard: findKey(tokenPayload, "maskedValue") ?? null,
    type: findKey(findKey(tokenPayload, "metadata"), "paymentType") ?? null,
    email: findKey(findKey(tokenPayload, "billTo"), "email") ?? null,
  };

  try {
    const result = await authorizeTransientToken({
      transientToken,
      totalCents: order.totalCents,
      orderId,
    });
    return NextResponse.json({
      orderId,
      totalCents: order.totalCents,
      lines: order.lines,
      paymentMethod,
      payment: {
        id: result.id,
        status: result.status,
        approved: result.approved,
        reason: result.reason ?? null,
        message: result.message ?? null,
      },
    });
  } catch (err) {
    const e = err as CybersourceError;
    console.error("payment failed", e.status, e.details ?? e.message);
    return NextResponse.json(
      { error: "Payment request failed", status: e.status, details: e.details ?? e.message },
      { status: 502 },
    );
  }
}
