export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Price in cents to avoid floating point errors. */
  priceCents: number;
  /** Two colors for the product art backdrop. */
  colors: [string, string];
  emoji: string;
};

export const STORE_NAME = "Lunker Outfitters";

export const products: Product[] = [
  {
    id: "drift-5wt-fly-rod",
    name: "Drift 9' 5wt Fly Rod",
    tagline: "The all-around trout rod, from dry flies to nymph rigs.",
    description:
      "Four-piece medium-fast graphite rod with a cork grip, alignment dots and a cordura travel tube.",
    priceCents: 32900,
    colors: ["#3a4a1c", "#7d8a3a"],
    emoji: "🎣",
  },
  {
    id: "tailwater-sealed-reel",
    name: "Tailwater Sealed Drag Reel",
    tagline: "Smooth drag that stops a run, not your day.",
    description:
      "Machined aluminum large-arbor reel with a fully sealed carbon drag, sized for 4–6wt lines.",
    priceCents: 21900,
    colors: ["#4a3416", "#a07a34"],
    emoji: "🌀",
  },
  {
    id: "riverbend-breathable-waders",
    name: "Riverbend Breathable Waders",
    tagline: "Dry legs from first light to the evening hatch.",
    description:
      "Four-layer breathable stockingfoot waders with a fleece-lined hand-warmer pocket and gravel guards.",
    priceCents: 34900,
    colors: ["#1f3a30", "#5f7f5c"],
    emoji: "🥾",
  },
  {
    id: "trout-essentials-fly-box",
    name: "Trout Essentials Fly Box",
    tagline: "36 proven patterns, ready to fish.",
    description:
      "Elk hair caddis, parachute Adams, pheasant tails, hare's ears and woolly buggers in a waterproof box.",
    priceCents: 4900,
    colors: ["#6b4423", "#c8963a"],
    emoji: "🪰",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
}
