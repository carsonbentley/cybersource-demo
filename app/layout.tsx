import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { STORE_NAME } from "@/lib/products";
import "./globals.css";

export const metadata: Metadata = {
  title: STORE_NAME,
  description: "Demo fly fishing outfitter running on the Cybersource sandbox.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="demo-banner">Sandbox demo store. No real orders or charges.</div>
          <Header />
          <main className="container">{children}</main>
          <footer className="footer container">
            Payments by Cybersource (Visa Acceptance Solutions) sandbox.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
