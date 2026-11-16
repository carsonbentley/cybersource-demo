import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { STORE_NAME } from "@/lib/products";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", axes: ["SOFT", "opsz"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: STORE_NAME,
  description: "Demo fly fishing outfitter running on the Cybersource sandbox.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>
          <div className="demo-banner">Sandbox demo store. No real orders or charges.</div>
          <Header />
          <main>{children}</main>
          <footer className="footer">
            <svg className="footer-wave" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden>
              <path d="M0 20 C150 0 300 40 450 20 S750 0 900 20 S1100 40 1200 20 V40 H0 Z" />
            </svg>
            <div className="container footer-inner">
              <span className="footer-brand">Lunker Outfitters</span>
              <span>Payments by Cybersource (Visa Acceptance Solutions) sandbox.</span>
              <span>Catch and release. Tight lines.</span>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
