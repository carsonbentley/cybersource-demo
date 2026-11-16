"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { STORE_NAME } from "@/lib/products";

export function Header() {
  const { count } = useCart();
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${STORE_NAME} home`}>
          <LogoMark />
          <span className="brand-name">
            Lunker <span>Outfitters</span>
          </span>
        </Link>
        <nav className="nav">
          <Link href="/#gear" className="nav-link">
            Shop
          </Link>
          <Link href="/cart" className="cart-link">
            <CreelIcon />
            <span>Cart</span>
            {count > 0 && (
              <span key={count} className="cart-count">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

/** Round badge with a jumping trout. */
function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#1f3a2b" stroke="#e5b83b" strokeWidth="2" />
      <path d="M8 32 C14 29 18 35 24 32 S34 29 40 32" stroke="#7fa88f" strokeWidth="2" fill="none" />
      <path
        d="M12 26 C16 16 28 12 36 16 C38 17 38 19 36 20 C30 24 20 26 12 26 Z"
        fill="#c08f2e"
      />
      <path d="M12 26 L7 21 L8 29 Z" fill="#8a6a2a" />
      <circle cx="20" cy="21" r="1.2" fill="#1b1608" />
      <circle cx="25" cy="18.5" r="1.2" fill="#1b1608" />
      <circle cx="28" cy="21.5" r="1.3" fill="#c2372a" />
      <circle cx="33" cy="17.5" r="1" fill="#111" />
    </svg>
  );
}

function CreelIcon() {
  return (
    <svg className="creel" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M4 9 H20 L18.5 19 A2 2 0 0 1 16.5 21 H7.5 A2 2 0 0 1 5.5 19 Z M8 9 C8 5 16 5 16 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M7 13 H17 M7.5 16.5 H16.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
