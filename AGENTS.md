# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Static single-page charity website (React 18 + Vite 6 + Tailwind CSS 4) on GitHub Pages. The only backend is the optional **Yoco checkout API** (`yoco-api/`, deployed separately on Railway). All external integrations (Google Sheets, payments, Instagram widget) are optional and degrade gracefully.

### Development commands

See `README.md` for canonical instructions. Quick reference:

- **Install deps:** `npm install`
- **Dev server:** `npm run dev` — typically `http://localhost:5173/`
- **Build:** `npm run build`
- **Pam Golding property images:** `npm run sync:pamgolding-images` — sets each card `image` to Pam Golding’s listing **featured / main** image (`og:image`, same as their on-page hero in practice). See `scripts/sync-pamgolding-listing-images.mjs`.
- **Byron Thomas property sync:** `npm run sync:btp-properties` — imports sale + rent portfolio into `public/data/properties.json`. See `docs/PROPERTY_SYNC.md`.
- **Property enquiry → Sheet:** configure `VITE_PROPERTY_ENQUIRY_SUBMIT_URL` (+ optional `VITE_PROPERTY_ENQUIRY_SECRET`) and deploy Apps Script from `scripts/property-enquiry-append-sheet.gs`. See `docs/PROPERTY_ENQUIRY_SHEET_SETUP.md`.
- **Wine shop order → email + Sheet log:** configure `VITE_WINE_ORDER_SUBMIT_URL` (+ optional `VITE_WINE_ORDER_SECRET`) and deploy Apps Script from `scripts/wine-order-submit.gs`. See `docs/WINE_ORDER_SHEET_SETUP.md`.
- **Yoco card payments (Railway API):** `npm run dev:yoco` (API on :8787, reads `.env`), `npm run start:yoco` (Railway), `npm run test:yoco` (offline tests). Site switch: `VITE_YOCO_CHECKOUT_ENABLED=true` + `VITE_YOCO_CHECKOUT_API_URL`. Donation/product prices come from the **TFC Payment Catalog** Google Sheet; wine prices from `src/data/winePricing.ts`; caps are Cheyna Dot only. See `docs/YOCO_RAILWAY_SETUP.md` and `docs/PAYMENT_CATALOG.md`. Never commit `sk_…`/`whsec_…` keys or put them in `VITE_*` vars.
- **KITF resource library:** `/keep-it-in-the-family/library` reads the `Website` tab via opensheet; optional `VITE_KITF_LIBRARY_SHEET_ID`. Sync script: `scripts/kitf-library-sync.gs`. See `docs/KITF_LIBRARY_SETUP.md`.

### Notes

- The Vite `base` is `/` (custom domain at site root). `public/CNAME` keeps the GitHub Pages custom domain on deploy.
- **Production:** https://www.tuckerfamilycharity.co.za
- No linter is configured. The only tests are `npm run test:yoco` (Node's built-in test runner, payments only).
- Node 22 is used in CI (GitHub Actions). The environment ships with Node v22 which matches.
- The `package-lock.json` lockfile is present — always use **npm** (not pnpm/yarn).
