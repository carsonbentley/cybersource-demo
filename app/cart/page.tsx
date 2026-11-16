"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { items, subtotalCents, setQuantity, remove } = useCart();

  if (items.length === 0) {
    return (
      <section className="panel">
        <h1>Your cart is empty</h1>
        <Link href="/" className="button">
          Keep shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="panel">
      <h1>Cart</h1>
      <ul className="lines">
        {items.map((item) => (
          <li key={item.productId} className="line">
            <ProductImage product={item.product} size="small" />
            <div className="line-info">
              <strong>{item.product.name}</strong>
              <span className="muted">{formatPrice(item.product.priceCents)} each</span>
            </div>
            <input
              type="number"
              min={0}
              value={item.quantity}
              aria-label={`Quantity of ${item.product.name}`}
              onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
              className="qty"
            />
            <span className="line-total">{formatPrice(item.lineTotalCents)}</span>
            <button className="link-button" onClick={() => remove(item.productId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="summary">
        <span>Subtotal</span>
        <strong>{formatPrice(subtotalCents)}</strong>
      </div>
      <div className="actions">
        <Link href="/" className="button secondary">
          Keep shopping
        </Link>
        <Link href="/checkout" className="button">
          Checkout
        </Link>
      </div>
    </section>
  );
}
