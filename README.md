# Cybersource demo store

A small Next.js storefront for a fictional outdoor gear brand, **Ridgeline Outfitters**, running on the
[Cybersource](https://developer.cybersource.com) (Visa Acceptance Solutions) **sandbox**. It backs a short
sales-engineering style demo: one Cybersource setup that tackles checkout friction, fraud losses and
repeat customers re-typing their cards.

> Sandbox only. No real orders are placed and no real cards are charged.

## Status

| Phase | What | State |
|---|---|---|
| 1 | Store scaffold: catalog, cart, checkout stub | ✅ Done |
| 2 | Unified Checkout + Payments API via the Node SDK (card, Click to Pay, Google Pay) | Next |
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

## Sandbox smoke test

`scripts/test_auth.py` signs requests by hand (no SDK) and runs a read-only reporting call plus a $1.00
test authorization. Useful to confirm the keys and the sandbox processor are working:

```bash
python3 scripts/test_auth.py
```

## Project layout

```
app/
  page.tsx            product grid
  cart/page.tsx       cart with quantity edits
  checkout/page.tsx   checkout stub (Unified Checkout goes here)
  api/health/         env var check
components/           cart context, header, product image, add-to-cart button
lib/products.ts       catalog (prices in cents)
scripts/test_auth.py  HTTP Signature smoke test
```

## Built with AI

This project is being built with Claude Code as part of an AI-assisted demo workflow.
