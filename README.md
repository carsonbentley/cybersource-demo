# Cybersource demo store

A small Next.js storefront for a fictional fly fishing outfitter, **Lunker Outfitters**, running on the
[Cybersource](https://developer.cybersource.com) (Visa Acceptance Solutions) **sandbox**. It backs a short
sales-engineering style demo: one Cybersource setup that tackles checkout friction, fraud losses and
repeat customers re-typing their cards.

> Sandbox only. No real orders are placed and no real cards are charged.

## Status

| Phase | What | State |
|---|---|---|
| 1 | Store scaffold: catalog, cart, checkout stub | ✅ Done |
| 2 | Unified Checkout + Payments API via the Node SDK (card, Click to Pay, Google Pay), order confirmation | ✅ Built, pending sandbox test |
| 3 | Token Management one-click reorder, Payer Authentication (3DS), Decision Manager decline | Planned |
| 4 | Admin page: capture, refund, void, plus a webhook event log | Planned |
| 5 | Postman collection and architecture diagram | Planned |

## Run it locally

Requires Node 20 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in your sandbox keys
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

`GET /api/health` reports which Cybersource variables are set (true/false only, never the values).

## Environment variables

See [`.env.example`](.env.example). Auth type is **HTTP Signature** (shared secret).

| Variable | Meaning |
|---|---|
| `CYBS_RUN_ENVIRONMENT` | API host, `apitest.cybersource.com` for the sandbox |
| `CYBS_MERCHANT_ID` | Sandbox merchant ID |
| `CYBS_KEY_ID` | REST shared-secret key ID |
| `CYBS_SHARED_SECRET` | REST shared secret (base64) |

`.env.local` and every other `.env*` file except `.env.example` is gitignored. On Vercel, set the same
variables under Project Settings → Environment Variables.

## How checkout works

```
browser                         our server (Next.js API routes)        Cybersource
  │  POST /api/checkout/capture-context ─▶ prices cart from catalog
  │                                      POST /up/v1/capture-contexts ─▶ capture context (JWT)
  │ ◀──────────────────── capture context
  │  loads Unified Checkout library named in the JWT,
  │  shopper pays by card, Click to Pay or Google Pay ───────────────▶ (card data goes here only)
  │ ◀──────────────────────────────────────────────────── transient token
  │  POST /api/checkout/pay (token) ──▶ re-prices cart
  │                                      POST /pts/v2/payments ─────────▶ AUTHORIZED / DECLINED
  │ ◀──────────────────── result ─▶ /order/[id] confirmation
```

- `lib/cybersource.ts` wraps the `cybersource-rest-client` SDK (capture context, authorization).
- `lib/unified-checkout.ts` loads the UC library from the capture context and returns the transient token.
- Payments are **authorization only** (`capture: false`); capture, void and refund come with the admin page.
- `targetOrigins` covers the production domain, `http://localhost:3000` and the Vercel preview URL.
  Add more with `UC_EXTRA_ORIGINS` (comma-separated).

## Sandbox smoke test

`scripts/test_auth.py` signs requests by hand (no SDK) and runs a read-only reporting call plus a $1.00
test authorization. Useful to confirm the keys and the sandbox processor are working:

```bash
python3 scripts/test_auth.py
```

The same $1.00 test authorization runs through the SDK from the server at `GET /api/diagnostics/test-auth`
(sandbox host only), handy when you can only reach the deployed site.

## Project layout

```
app/
  page.tsx            product grid
  cart/page.tsx       cart with quantity edits
  checkout/page.tsx   Unified Checkout
  order/[id]/         order confirmation
  api/checkout/       capture-context and pay routes
  api/diagnostics/    $1 sandbox test authorization
  api/health/         env var check
components/           cart context, header, product image, add-to-cart button
lib/products.ts       catalog (prices in cents)
lib/order.ts          server-side cart pricing
lib/cybersource.ts    SDK wrapper (server only)
lib/unified-checkout.ts  browser UC loader
scripts/test_auth.py  HTTP Signature smoke test
```

## Built with AI

This project is being built with Claude Code as part of an AI-assisted demo workflow.
