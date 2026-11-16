"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { STORE_NAME } from "@/lib/products";

export function Header() {
  const { count } = useCart();
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          ⛰️ {STORE_NAME}
        </Link>
        <nav>
          <Link href="/cart" className="cart-link">
            Cart{count > 0 ? ` (${count})` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}
