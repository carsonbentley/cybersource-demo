import Link from "next/link";
import { BrownTrout, DryFly } from "./BrownTrout";

/**
 * River hero. All motion is CSS (water drift, light rays, the trout's swim, the cast),
 * with scroll-driven parallax where the browser supports animation-timeline.
 * Everything holds still under prefers-reduced-motion.
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-sky" aria-hidden>
        <span className="ray ray-1" />
        <span className="ray ray-2" />
        <span className="ray ray-3" />
      </div>

      <svg className="hero-cast" viewBox="0 0 1200 420" preserveAspectRatio="none" aria-hidden>
        <path
          className="cast-line"
          pathLength="1"
          d="M-20 400 C 100 120, 300 0, 560 20 S 900 190, 1000 120 S 1110 40, 1176 84"
        />
      </svg>
      <DryFly className="hero-fly" />

      <div className="container hero-content">
        <p className="eyebrow eyebrow-light">Lunker Outfitters · Est. on the Madison</p>
        <h1 id="hero-title">
          Gear for the one that <em>didn’t</em> get away.
        </h1>
        <p className="hero-lede">
          Rods, reels, waders and flies, tested on cold tailwaters and spotted browns. Checkout in
          seconds with Click to Pay, so you can get back to the river.
        </p>
        <div className="hero-actions">
          <Link href="#gear" className="button button-gold">
            Shop the gear
          </Link>
          <Link href="/cart" className="button button-ghost">
            View cart
          </Link>
        </div>
      </div>

      <div className="hero-river" aria-hidden>
        <div className="trout-swim">
          <BrownTrout className="hero-trout" />
        </div>
        <svg className="wave wave-back" viewBox="0 0 2400 120" preserveAspectRatio="none">
          <path d="M0 60 C200 20 400 100 600 60 S1000 20 1200 60 S1600 100 1800 60 S2200 20 2400 60 V120 H0 Z" />
        </svg>
        <svg className="wave wave-mid" viewBox="0 0 2400 120" preserveAspectRatio="none">
          <path d="M0 70 C150 40 450 100 600 70 S1050 40 1200 70 S1650 100 1800 70 S2250 40 2400 70 V120 H0 Z" />
        </svg>
        <svg className="wave wave-front" viewBox="0 0 2400 120" preserveAspectRatio="none">
          <path d="M0 80 C250 56 350 104 600 80 S950 56 1200 80 S1550 104 1800 80 S2150 56 2400 80 V120 H0 Z" />
        </svg>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="bubble" style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
    </section>
  );
}

const PATTERNS = [
  "Elk Hair Caddis",
  "Parachute Adams",
  "Pheasant Tail",
  "Woolly Bugger",
  "Hare’s Ear",
  "Blue Winged Olive",
  "Stimulator",
  "Zebra Midge",
];

/** Scrolling band of fly patterns between sections. */
export function HatchTicker() {
  const run = [...PATTERNS, ...PATTERNS];
  return (
    <div className="ticker" aria-label="Today’s hatch: popular fly patterns">
      <div className="ticker-track">
        {run.map((name, i) => (
          <span key={i} className="ticker-item" aria-hidden={i >= PATTERNS.length}>
            {name}
            <span className="ticker-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
