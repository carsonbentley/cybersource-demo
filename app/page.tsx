import { AddToCartButton } from "@/components/AddToCartButton";
import { BrownTrout } from "@/components/BrownTrout";
import { HatchTicker, Hero } from "@/components/Hero";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice, products } from "@/lib/products";

const PROMISES = [
  {
    title: "Checkout in one tap",
    body: "Click to Pay and Google Pay fill in everything, so a new rod takes seconds, not a form.",
  },
  {
    title: "Your card stays with Visa",
    body: "Card details go straight to Cybersource. We only ever see a one-time token.",
  },
  {
    title: "Guide-tested gear",
    body: "Every rod, reel and fly is fished hard on cold water before it lands in the shop.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <HatchTicker />

      <section id="gear" className="section container">
        <header className="section-head reveal">
          <p className="eyebrow">The fly shop</p>
          <h2 className="section-title">Everything for the evening hatch</h2>
        </header>
        <div className="grid">
          {products.map((product, i) => (
            <article
              key={product.id}
              className="card reveal"
              style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}
            >
              <ProductImage product={product} />
              <div className="card-body">
                <h3>{product.name}</h3>
                <p className="card-tagline">{product.tagline}</p>
                <p className="card-desc">{product.description}</p>
                <div className="card-footer">
                  <span className="price">{formatPrice(product.priceCents)}</span>
                  <AddToCartButton productId={product.id} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="promise">
        <div className="container promise-inner">
          <div className="promise-copy reveal">
            <p className="eyebrow eyebrow-light">Why anglers shop here</p>
            <h2 className="section-title">Less time at the till, more time on the water.</h2>
            <ul className="promise-list">
              {PROMISES.map((p) => (
                <li key={p.title}>
                  <strong>{p.title}</strong>
                  <span>{p.body}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="promise-art reveal" aria-hidden>
            <div className="ripple" />
            <div className="ripple ripple-2" />
            <BrownTrout className="promise-trout" />
          </div>
        </div>
      </section>
    </>
  );
}
