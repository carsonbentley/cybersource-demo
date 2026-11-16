"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/products";

/**
 * Checkout stub.
 *
 * Next step (roadmap phase 3): replace the placeholder with Unified Checkout.
 *   1. Server route creates a capture context (POST /up/v1/capture-contexts) via the
 *      cybersource-rest-client Node SDK, with this site's origin in targetOrigins.
 *   2. Browser loads the Unified Checkout library from the capture context and renders
 *      card entry, Click to Pay and Google Pay.
 *   3. Browser posts the transient token to a server route that calls the Payments API
 *      (POST /pts/v2/payments) and returns the result.
 */
export default function CheckoutPage() {
  const { items, subtotalCents } = useCart();

  if (items.length === 0) {
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
        <div className="payment-placeholder">
          <p>
            <strong>Payment form coming soon.</strong>
          </p>
          <p className="muted">
            Cybersource Unified Checkout (card, Click to Pay, Google Pay) will load here.
          </p>
        </div>
        <button className="button" disabled>
          Pay {formatPrice(subtotalCents)}
        </button>
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
