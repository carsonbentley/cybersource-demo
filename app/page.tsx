import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice, products } from "@/lib/products";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Gear for the one that didn’t get away.</h1>
        <p>Rods, reels, waders and flies for anglers who fish hard.</p>
      </section>
      <section className="grid">
        {products.map((product) => (
          <article key={product.id} className="card">
            <ProductImage product={product} />
            <div className="card-body">
              <h2>{product.name}</h2>
              <p className="muted">{product.tagline}</p>
              <p>{product.description}</p>
              <div className="card-footer">
                <span className="price">{formatPrice(product.priceCents)}</span>
                <AddToCartButton productId={product.id} />
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
