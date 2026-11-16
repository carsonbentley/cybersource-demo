"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { formatPrice, getProduct } from "@/lib/products";

type StoredOrder = {
  orderId: string;
  totalCents: number;
  lines: { productId: string; quantity: number }[];
  paymentMethod: { maskedCard: string | null; type: string | null; email: string | null };
  payment: { id: string; status: string };
};

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  PANENTRY: "Card",
  CLICKTOPAY: "Click to Pay",
  GOOGLEPAY: "Google Pay",
};

/** Order confirmation. The order details come from this browser session (there is no order DB yet). */
export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<StoredOrder | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`lunker-order-${id}`);
      setOrder(raw ? (JSON.parse(raw) as StoredOrder) : null);
    } catch {
      setOrder(null);
    }
  }, [id]);

  const type = order?.paymentMethod.type;
  const method = [type ? (PAYMENT_TYPE_LABELS[type] ?? type) : null, order?.paymentMethod.maskedCard]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="panel confirmation">
      <p className="eyebrow">Order confirmed</p>
      <h1>Tight lines! Your gear is on the way.</h1>
      <p>
        Order number <strong>{id}</strong>
        {order?.paymentMethod.email ? (
          <>
            {" "}
            · a receipt would go to <strong>{order.paymentMethod.email}</strong>
          </>
        ) : null}
      </p>

      {order && (
        <>
          <ul className="summary-lines">
            {order.lines.map((line) => {
              const product = getProduct(line.productId);
              if (!product) return null;
              return (
                <li key={line.productId}>
                  <span>
                    {product.name} × {line.quantity}
                  </span>
                  <span>{formatPrice(product.priceCents * line.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <div className="summary">
            <span>Total authorized</span>
            <strong>{formatPrice(order.totalCents)}</strong>
          </div>
          <dl className="payment-facts">
            {method && (
              <>
                <dt>Paid with</dt>
                <dd>{method}</dd>
              </>
            )}
            <dt>Status</dt>
            <dd>{order.payment.status}</dd>
            <dt>Cybersource transaction ID</dt>
            <dd>
              <code>{order.payment.id}</code>
            </dd>
          </dl>
        </>
      )}
      {order === null && (
        <p className="muted">Order details are only kept in the browser session that placed it.</p>
      )}

      <Link href="/" className="button">
        Keep shopping
      </Link>
    </section>
  );
}
