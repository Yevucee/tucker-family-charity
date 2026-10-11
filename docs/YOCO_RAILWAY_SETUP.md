# Yoco card payments — Railway API setup

The website stays on **GitHub Pages** (https://www.tuckerfamilycharity.co.za). Card payments run on a
small **Railway** service from this same repo, because the Yoco secret key must never be in browser code.

```
Browser (GitHub Pages)                    Railway: yoco-api/server.ts                 Yoco
──────────────────────                    ───────────────────────────                 ────
/donate, /shop/wine, shop "Pay now"  →    POST /api/create-checkout  ── secret key →  POST /api/checkouts
                                          (prices from Sheet / winePricing.ts)        ← redirectUrl
browser ← redirect to Yoco hosted page
Yoco → /shop/payment/success/ etc. (UX only)
                                          POST /api/yoco-webhook ← signed event ────  payment.succeeded
                                          (wine → Apps Script email + Sheet log)
```

| What | Where it's sold | Price source |
|------|-----------------|--------------|
| Donations | `/donate` | Google Sheet **TFC Payment Catalog** → `Catalog` (kind `donation`) + `DonationSettings` |
| Shop products (future) | `/shop` card with `yocoCatalogItemId` | Same Sheet (kind `product`) |
| Wine | `/shop/wine` (cases + delivery) | `src/data/winePricing.ts` (code) |
| Caps | Cheyna Dot only | — never Yoco |

## 1. Railway service

1. Railway → your project → **New service → GitHub repo** → `Yevucee/tucker-family-charity`.
2. Service → **Settings → Config-as-code** → path `railway.yoco.toml`.
   (Start command `npm run start:yoco`, health check `/health`, no Vite build.)
3. **Variables** (service level — never `VITE_…`, never committed):

| Variable | Value |
|----------|-------|
| `YOCO_SECRET_KEY` | `sk_test_…` until Samuel approves live, then `sk_live_…` |
| `YOCO_WEBHOOK_SECRET` | `whsec_…` from step 3 below |
| `PUBLIC_SITE_URL` | `https://www.tuckerfamilycharity.co.za` |
| `PAYMENT_CATALOG_SHEET_ID` | `1O7gwTQrjQJUbZS2QbXd-k9FmNUoSL1uudK7K2_YXuxg` |
| `PAYMENT_CATALOG_SHEET_TAB` | `Catalog` |
| `PAYMENT_CATALOG_SHEET_SETTINGS_TAB` | `DonationSettings` |
| `WINE_ORDER_NOTIFY_URL` | optional — same Apps Script `/exec` URL as GitHub secret `VITE_WINE_ORDER_SUBMIT_URL` |
| `WINE_ORDER_NOTIFY_SECRET` | optional — same value as `VITE_WINE_ORDER_SECRET` |
| `CORS_EXTRA_ORIGINS` | optional — comma-separated extra site origins (e.g. a preview build) |

4. **Networking → Generate domain**, e.g. `https://tucker-yoco.up.railway.app`.
5. Check:
   - `GET https://<host>/health` → `{"ok":true,"service":"tucker-yoco-checkout"}`
   - `GET https://<host>/api/payment-catalog` → `"source":"sheet"` and the Sheet's active donation rows.
   - Deploy logs show `Yoco key mode: test`.

## 2. Local development

```bash
cp .env.example .env            # fill YOCO_SECRET_KEY=sk_test_… etc. (never commit .env)
npm run dev:yoco                # API on http://localhost:8787 (reads .env)
VITE_YOCO_CHECKOUT_ENABLED=true npm run dev   # site on :5173, /api proxied to :8787
npm run test:yoco               # offline tests (pricing, Sheet parsing, webhook signatures)
```

## 3. Register the Yoco webhook (once per key mode)

Run from any terminal (the key stays on your machine; do not paste it into chat or docs):

```bash
curl -s https://payments.yoco.com/api/webhooks \
  -H "Authorization: Bearer $YOCO_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"tucker-railway","url":"https://<RAILWAY_HOST>/api/yoco-webhook"}'
```

Copy the returned `secret` (`whsec_…`, shown once) into Railway `YOCO_WEBHOOK_SECRET` and redeploy.
Test and live keys each need their own registration. Keep only one active webhook per mode
(`GET /api/webhooks` lists them, `DELETE /api/webhooks/{id}` removes old ones).

## 4. Test mode end-to-end

Test card: `4111 1111 1111 1111`, expiry `09/27`, CVV `123`.

1. Donation: `/donate` → R100 → pay → lands on `/donate/thank-you/`.
2. Wine: `/shop/wine` → at least one case + delivery details → pay → `/shop/payment/success/`.
3. Railway logs show `[yoco-webhook] payment.succeeded donation …` and `… wine …`.
4. If `WINE_ORDER_NOTIFY_URL` is set: new row in the wine order Sheet with submission mode `yoco`
   and a staff email whose notes start with `PAID via Yoco`.

Test payments do not appear in Yoco Sales History — that's expected.

## 5. Switch the website on (GitHub Pages)

Only after steps 1–4 pass. Repo → Settings → Secrets and variables → Actions → **New repository secret**:

| Secret | Value |
|--------|-------|
| `VITE_YOCO_CHECKOUT_ENABLED` | `true` |
| `VITE_YOCO_CHECKOUT_API_URL` | `https://<RAILWAY_HOST>/api` |

Re-run the **Deploy to GitHub Pages** workflow. Until these exist, the site keeps the wine enquiry/email
flow and the legacy `VITE_DONATION_LINK` donate button. To switch off quickly, set
`VITE_YOCO_CHECKOUT_ENABLED` to `false` and redeploy.

## 6. Going live (Samuel approves first)

1. Yoco app → confirm `www.tuckerfamilycharity.co.za` is a **Verified Domain**.
2. Railway: `YOCO_SECRET_KEY=sk_live_…` (Railway only — never git, `.env`, chat or docs).
3. Register the webhook again with the live key; put the new `whsec_…` in `YOCO_WEBHOOK_SECRET`.
4. Make one small real donation and one real wine order; refund if needed from the Yoco app.

If a key is ever exposed (pasted somewhere, committed, shared in a document), regenerate it in the Yoco app.

## Files

- `yoco-api/app.ts`, `yoco-api/server.ts` — Express API
- `api/lib/paymentCatalog.ts` — Sheet (opensheet) loading, validation, 5-minute cache, JSON fallback
- `api/lib/checkoutPlans.ts` — trusted amounts for donation / product / wine
- `api/lib/yoco.ts` — Yoco checkout call + webhook signature verification
- `api/lib/webhookEvents.ts` — payment.succeeded handling, wine → Apps Script
- `src/data/winePricing.ts` — wine prices shared by site and API
- `src/lib/yocoCheckout.ts`, `src/hooks/usePaymentCatalog.ts` — browser side
- `public/data/payment-catalog.json` — fallback if the Sheet can't be read
- `scripts/verify-yoco-pricing.test.mjs` — `npm run test:yoco`
