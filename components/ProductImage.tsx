import type { Product } from "@/lib/products";

/** Placeholder art so the repo ships without third-party product photos. */
export function ProductImage({ product, size = "large" }: { product: Product; size?: "large" | "small" }) {
  const [from, to] = product.colors;
  return (
    <div
      className={`product-image product-image-${size}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden
    >
      <span>{product.emoji}</span>
    </div>
  );
}
