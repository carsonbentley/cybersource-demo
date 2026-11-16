import { getProduct } from "@/lib/products";

export type OrderLineInput = { productId: string; quantity: number };

/**
 * Prices an order on the server from the catalog, so the browser can never set its own total.
 * Returns null if the cart is empty or holds an unknown product.
 */
export function priceOrder(lines: unknown): { totalCents: number; lines: OrderLineInput[] } | null {
  if (!Array.isArray(lines) || lines.length === 0) return null;
  let totalCents = 0;
  const clean: OrderLineInput[] = [];
  for (const line of lines) {
    const productId = (line as OrderLineInput)?.productId;
    const quantity = Number((line as OrderLineInput)?.quantity);
    const product = typeof productId === "string" ? getProduct(productId) : undefined;
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return null;
    totalCents += product.priceCents * quantity;
    clean.push({ productId, quantity });
  }
  return { totalCents, lines: clean };
}

/** Short human-readable order number, e.g. LO-7K3Q9X. */
export function newOrderId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return `LO-${id}`;
}
