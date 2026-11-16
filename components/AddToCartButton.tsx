"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export function AddToCartButton({ productId }: { productId: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      className="button"
      onClick={() => {
        add(productId);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
