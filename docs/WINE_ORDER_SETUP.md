# Wine shop order email setup

Wine orders on `/shop/wine` use **two paths in parallel** — one for email, one for the Sheet backup. **Only one email** is sent per order.

## How it works

| Path | Service | What it does |
|------|---------|----------------|
| **Email** | FormSubmit.co | One email to **brett@tuckerfamilycharity.co.za**, CC **samuel.polley1@gmail.com** |
| **Sheet backup** | Google Apps Script | Appends a row to the Sheet — **no email** from the script |

The customer sees success when FormSubmit accepts the order (or if the Sheet save succeeds when email fails).

**First time only:** FormSubmit sends an activation link to **brett@tuckerfamilycharity.co.za** — click it once.

## Google Sheet backup

**Sheet:** https://docs.google.com/spreadsheets/d/1jVOruSkASiklk9Gktl3W8qy1tQwBLvm5AXgUs67tNBQ/edit  
**Setup checklist:** [WINE_ORDER_SHEET_SETUP.md](./WINE_ORDER_SHEET_SETUP.md)

In `scripts/wine-order-submit.gs`, keep **`WINE_ORDER_SEND_EMAIL = false`** so the script only logs to the Sheet.

Add GitHub secret **`VITE_WINE_ORDER_SUBMIT_URL`** with your Apps Script `/exec` URL after deploying the web app.

## What staff receive (one email per order)

- **To:** brett@tuckerfamilycharity.co.za  
- **CC:** samuel.polley1@gmail.com  
- **From:** FormSubmit  
- **Subject:** `New wine order enquiry — [Customer name]`  
- **Reply-To:** customer’s email  
- **Body:** HTML table with contact details, wines, delivery, totals, notes  

No second email from Google.

## GitHub Pages secrets

| Secret | Value |
|--------|--------|
| `VITE_WINE_ORDER_SUBMIT_URL` | Apps Script `/exec` URL (Sheet log only) |
| `VITE_WINE_ORDER_SECRET` | Same as `SCRIPT_SECRET` (optional) |

## Troubleshooting

- **Duplicate emails** — Redeploy Apps Script with `WINE_ORDER_SEND_EMAIL = false` and run **testSheetAppend** (not testWineOrderNotify).
- **No Sheet rows** — Confirm `WINE_ORDER_SPREADSHEET_ID` and redeploy; check `VITE_WINE_ORDER_SUBMIT_URL` in GitHub Actions.
- **No email** — FormSubmit activation for brett@; check spam.
- **Form error but Sheet has row** — FormSubmit failed; order is still in the Sheet.
