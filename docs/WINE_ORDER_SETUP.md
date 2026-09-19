# Wine shop order email setup

Wine orders on `/shop/wine` post to **Google Apps Script** first: **Sheet row + staff email** (MailApp). **FormSubmit** is only used if the script POST fails.

## How it works

| Path | Service | What it does |
|------|---------|----------------|
| **Primary** | Google Apps Script | Appends a row to the Sheet and emails **brett@tuckerfamilycharity.co.za** plus CC addresses in the script |
| **Fallback** | FormSubmit.co | Same staff inboxes if the script is unreachable |

Redeploy `scripts/wine-order-submit.gs` after changes (`WINE_ORDER_SEND_EMAIL = true`, CC list, catalog prices).

**First time only:** FormSubmit sends an activation link to **brett@tuckerfamilycharity.co.za** — click it once.

## Google Sheet backup

**Sheet:** https://docs.google.com/spreadsheets/d/1jVOruSkASiklk9Gktl3W8qy1tQwBLvm5AXgUs67tNBQ/edit  
**Setup checklist:** [WINE_ORDER_SHEET_SETUP.md](./WINE_ORDER_SHEET_SETUP.md)

In `scripts/wine-order-submit.gs`, keep **`WINE_ORDER_SEND_EMAIL = true`** so each order emails staff after the Sheet row is saved.

Add GitHub secret **`VITE_WINE_ORDER_SUBMIT_URL`** with your Apps Script `/exec` URL after deploying the web app.

## What staff receive (one email per order)

- **To:** brett@tuckerfamilycharity.co.za  
- **CC:** samuel.polley1@gmail.com, tuckerfamilycharity@gmail.com  
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
