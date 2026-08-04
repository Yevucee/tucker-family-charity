# Wine shop order email setup

Wine orders on `/shop/wine` email **brett@tuckerfamilycharity.co.za** and **samuel.polley1@gmail.com** on every submission. A **Google Sheet backup** is available once Apps Script is deployed.

## How it works today (no Apps Script required)

Each submit sends email via **FormSubmit.co**:

- **To:** brett@tuckerfamilycharity.co.za
- **CC:** samuel.polley1@gmail.com

**First time only:** FormSubmit sends an activation link to **brett@tuckerfamilycharity.co.za** — click it once so future orders arrive automatically.

The form shows success when FormSubmit accepts the order. You do **not** need `VITE_WINE_ORDER_SUBMIT_URL` for email to work.

## Optional: Google Sheet backup (Apps Script)

When ready, deploy Apps Script so each order is **logged to a Sheet** as well as emailed. The site POSTs to FormSubmit and Apps Script **in parallel** — email is not blocked if the Sheet endpoint is slow or misconfigured.

**Sheet:** https://docs.google.com/spreadsheets/d/1jVOruSkASiklk9Gktl3W8qy1tQwBLvm5AXgUs67tNBQ/edit  
**Full checklist:** [WINE_ORDER_SHEET_SETUP.md](./WINE_ORDER_SHEET_SETUP.md)

Only add GitHub secret **`VITE_WINE_ORDER_SUBMIT_URL`** after the web app is deployed and tested (Incognito GET returns `"live":true`).

## Apps Script configuration

Edit the top of `scripts/wine-order-submit.gs`:

| Setting | Purpose |
|---------|---------|
| `WINE_ORDER_SPREADSHEET_ID` | Sheet ID for the audit log (**required for logging**) |
| `WINE_ORDER_RECIPIENT_EMAIL` | Bret’s inbox (default: `brett@tuckerfamilycharity.co.za`) |
| `WINE_ORDER_CC_EMAILS` | CC list (default: `samuel.polley1@gmail.com`) |
| `SCRIPT_SECRET` | Optional shared password (same as `VITE_WINE_ORDER_SECRET`) |
| `WINE_CATALOG` | Bottle prices — must match slugs in `src/data/charityWine.ts` |

## GitHub Pages secrets

| Secret | Value |
|--------|--------|
| `VITE_WINE_ORDER_SUBMIT_URL` | Apps Script `/exec` URL |
| `VITE_WINE_ORDER_SECRET` | Same as `SCRIPT_SECRET` (optional) |

## Local development

```env
VITE_WINE_ORDER_SUBMIT_URL=https://script.google.com/macros/s/…/exec
VITE_WINE_ORDER_SECRET=
```

Run `npm run dev` and submit a test order on `/shop/wine`.

## What the customer sees

- Choose case quantities for one or more wines.
- Enter name, email, phone, delivery area, and address.
- On success: *“Thank you. Your wine order enquiry has been sent…”*
- Form clears only after confirmed success.

## What staff receive

Email subject: **`New wine order enquiry — [Customer name]`**

**To:** brett@tuckerfamilycharity.co.za  
**CC:** samuel.polley1@gmail.com  
**Reply-To:** customer’s email

Body includes date/time, contact details, delivery zone (Johannesburg R50 / elsewhere R200), address, order table, subtotals, delivery fee, grand total, and notes.

## Troubleshooting

- **No Sheet rows** — Set `WINE_ORDER_SPREADSHEET_ID` and redeploy; confirm `VITE_WINE_ORDER_SUBMIT_URL` in GitHub Actions.
- **401 / HTML login page** — Web app must be **Who has access: Anyone**.
- **No email** — Run `testWineOrderNotify`; check spam; confirm recipient/CC addresses in the deployed script.
- **Prices wrong** — Update `pricePerBottleZar` in `src/data/charityWine.ts` and `WINE_CATALOG` in Apps Script, then redeploy both.
