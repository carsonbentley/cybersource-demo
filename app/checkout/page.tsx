"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/products";
import { runUnifiedCheckout } from "@/lib/unified-checkout";

type Phase =
  | { kind: "loading" }
  | { kind: "ready"; notice?: string }
  | { kind: "paying" }
  | { kind: "error"; message: string; details?: unknown };

/**
 * Checkout with Cybersource Unified Checkout.
 *   1. POST /api/checkout/capture-context: the server creates a capture context for the cart total.
 *   2. The browser loads Unified Checkout from it and renders card entry, Click to Pay and Google Pay.
 *   3. The shopper pays; Unified Checkout returns a transient token (no card data touches our server).
 *   4. POST /api/checkout/pay: the server authorizes the transient token with the Payments API.
 */
export default function CheckoutPage() {
  const { items, loaded, subtotalCents, clear } = useCart();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);
  const started = useRef(-1);
  const linesRef = useRef<{ productId: string; quantity: number }[]>([]);
  linesRef.current = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));

  useEffect(() => {
    if (!loaded || items.length === 0 || started.current === attempt) return;
    started.current = attempt; // run once per attempt, even under React strict mode
    let cancelled = false;

    (async () => {
      setPhase({ kind: "loading" });
      const lines = linesRef.current;
      const ccRes = await fetch("/api/checkout/capture-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const cc = await ccRes.json();
      if (!ccRes.ok) {
        setPhase({ kind: "error", message: "Could not start checkout.", details: cc.details });
        return;
      }
      if (cancelled) return;

      const tokenPromise = runUnifiedCheckout(cc.captureContext, {
        paymentSelection: "#buttonPaymentListContainer",
        paymentScreen: "#embeddedPaymentContainer",
      });
      setPhase({
        kind: "ready",
        notice: cc.fallbackReason
          ? "Wallets are unavailable on this sandbox account right now, so only card entry is shown."
          : undefined,
      });
      const transientToken = await tokenPromise;

      setPhase({ kind: "paying" });
      const payRes = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, transientToken }),
      });
      const pay = await payRes.json();
      if (!payRes.ok) {
        setPhase({ kind: "error", message: "The payment request failed.", details: pay.details });
        return;
      }
      if (!pay.payment.approved) {
        setPhase({
          kind: "error",
          message: `Payment ${pay.payment.status.toLowerCase().replace(/_/g, " ")}${
            pay.payment.message ? `: ${pay.payment.message}` : "."
          }`,
          details: pay.payment,
        });
        return;
      }

      try {
        sessionStorage.setItem(`lunker-order-${pay.orderId}`, JSON.stringify(pay));
      } catch {
        // The confirmation page falls back to the order number alone.
      }
      router.push(`/order/${pay.orderId}`);
      clear();
    })().catch((err: Error) => {
      if (!cancelled) setPhase({ kind: "error", message: err.message || "Checkout failed." });
    });

    return () => {
      cancelled = true;
    };
  }, [loaded, items.length, attempt, router, clear]);

  if (loaded && items.length === 0 && phase.kind !== "paying") {
    return (
      <section className="panel">
        <h1>Nothing to check out</h1>
        <Link href="/" className="button">
          Back to the store
        </Link>
      </section>
    );
  }

  return (
    <section className="checkout">
      <div className="panel">
        <h1>Checkout</h1>
        {phase.kind === "loading" && <p className="muted">Loading secure checkout…</p>}
        {phase.kind === "ready" && phase.notice && <p className="muted small">{phase.notice}</p>}
        {phase.kind === "paying" && <p className="muted">Authorizing your payment…</p>}
        {phase.kind === "error" && (
          <div className="checkout-error" role="alert">
            <p>
              <strong>{phase.message}</strong>
            </p>
            {phase.details !== undefined && phase.details !== null && (
              <details>
                <summary>Details</summary>
                <pre>{JSON.stringify(phase.details, null, 2)}</pre>
              </details>
            )}
            <button className="button" onClick={() => setAttempt((n) => n + 1)}>
              Try again
            </button>
          </div>
        )}
        <div
          id="buttonPaymentListContainer"
          className="uc-container"
          hidden={phase.kind !== "ready"}
        />
        <div id="embeddedPaymentContainer" className="uc-container" hidden={phase.kind !== "ready"} />
        <p className="muted small">
          Payments run on the Cybersource sandbox through Unified Checkout. Card details go straight
          to Cybersource; this store only sees a one-time token. Test card: 4111 1111 1111 1111, any
          future date, any CVV.
        </p>
      </div>
      <aside className="panel">
        <h2>Order summary</h2>
        <ul className="summary-lines">
          {items.map((item) => (
            <li key={item.productId}>
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.lineTotalCents)}</span>
            </li>
          ))}
        </ul>
        <div className="summary">
          <span>Total</span>
          <strong>{formatPrice(subtotalCents)}</strong>
        </div>
      </aside>
    </section>
  );
}
