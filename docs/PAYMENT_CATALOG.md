# Payment catalog (donations + shop product prices)

Staff change donation amounts and product prices in a **Google Sheet** — no code, no website admin page.

- Sheet: **TFC Payment Catalog** — Drive: Charity › Shop › Payments
- ID: `1O7gwTQrjQJUbZS2QbXd-k9FmNUoSL1uudK7K2_YXuxg` (Railway `PAYMENT_CATALOG_SHEET_ID`)
- Who can change prices: only people with **Editor** access to the Sheet. Website visitors can't edit it.
- Changes reach the website within about **5 minutes** (Railway cache).

## Tab `Catalog`

| id | kind | name | price_zar | active | description |
|----|------|------|-----------|--------|-------------|
| donation-100 | donation | Donation — R100 | 100 | Y | General support… |
| example-hoodie | product | Charity hoodie (example) | 450 | N | … |

- **id** — unique, lowercase letters/numbers/hyphens. Don't rename the id of something already on sale.
- **kind** — `donation` (shows as an amount button on /donate) or `product` (shop "Pay now").
- **price_zar** — whole rands, numbers only (`250` = R250).
- **active** — `Y` shows it, `N` hides it.
- Rows with ids starting `cap`, `caps`, `hat` or `wine` are ignored on purpose:
  caps are sold via **Cheyna Dot**, wine has its own page (`/shop/wine`, prices in `src/data/winePricing.ts`).

## Tab `DonationSettings`

| setting | value |
|---------|-------|
| allow_custom_amount | TRUE |
| min_amount_zar | 50 |
| max_amount_zar | 500000 |

## How it's used

- `GET /api/payment-catalog` (Railway) returns active rows + settings for the website.
- `POST /api/create-checkout` re-reads the price server-side — the browser never sets the price
  (a custom donation is only accepted within min/max).
- Invalid rows are skipped and logged in Railway; run **TFC payments → Validate catalog rows** in the Sheet to find them.
- If the Sheet is unreachable the API keeps the last good copy, or falls back to `public/data/payment-catalog.json`.

## Selling a new shop product (one-time code step)

1. Add a row in the Sheet: `kind = product`, a new `id` (e.g. `charity-hoodie`), price, `active = N`.
2. In `src/data/shopCatalog.ts`, set `yocoCatalogItemId: "charity-hoodie"` on the product card (needs a deploy).
3. Set `active = Y` when ready — the card's **Pay now — R…** button appears; `N` hides it again.

Setup steps for the Sheet itself: `docs/PAYMENT_CATALOG_SHEET_SETUP.md`.
