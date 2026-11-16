export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Price in cents to avoid floating point errors. */
  priceCents: number;
  /** Two colors used to draw a simple placeholder image. */
  colors: [string, string];
  emoji: string;
};

export const STORE_NAME = "Ridgeline Outfitters";

export const products: Product[] = [
  {
    id: "summit-35-pack",
    name: "Summit 35L Daypack",
    tagline: "Light enough for a day, tough enough for a week.",
    description:
      "Ripstop nylon pack with a ventilated back panel, hydration sleeve and hip-belt pockets.",
    priceCents: 14900,
    colors: ["#2f5d50", "#9cc5a1"],
    emoji: "🎒",
  },
  {
    id: "alpine-down-jacket",
    name: "Alpine Down Jacket",
    tagline: "800-fill warmth that packs into its own pocket.",
    description:
      "Responsibly sourced 800-fill down with a water-resistant shell for cold, dry days on the trail.",
    priceCents: 22900,
    colors: ["#b5532c", "#f2c49b"],
    emoji: "🧥",
  },
  {
    id: "trailhead-2p-tent",
    name: "Trailhead 2P Tent",
    tagline: "Two people, one pound per person.",
    description:
      "Freestanding three-season tent with two doors, two vestibules and color-coded poles.",
    priceCents: 38900,
    colors: ["#33506e", "#a8c3de"],
    emoji: "⛺",
  },
  {
    id: "basecamp-insulated-bottle",
    name: "Basecamp Insulated Bottle",
    tagline: "Cold for 24 hours, hot for 12.",
    description:
      "Double-wall stainless steel bottle, 32 oz, with a leakproof cap and a powder-coated finish.",
    priceCents: 3900,
    colors: ["#6b5b3e", "#e0d2a8"],
    emoji: "🥤",
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
