# Wine shop orders → Google Sheet log

The Apps Script **only logs orders to a Google Sheet**. Email is handled separately by **FormSubmit** on the website (one email to Brett, CC Samuel — no duplicates from Google).

## Sheet

- **URL:** https://docs.google.com/spreadsheets/d/1jVOruSkASiklk9Gktl3W8qy1tQwBLvm5AXgUs67tNBQ/edit
- **ID:** `1jVOruSkASiklk9Gktl3W8qy1tQwBLvm5AXgUs67tNBQ`
- **Tab:** `Wine orders`

## Apps Script checklist

| Step | Action |
|------|--------|
| Paste script | `scripts/wine-order-submit.gs` as Code.gs |
| Sheet ID | `WINE_ORDER_SPREADSHEET_ID = "1jVOruSkASiklk9Gktl3W8qy1tQwBLvm5AXgUs67tNBQ"` |
| **No email from script** | **`WINE_ORDER_SEND_EMAIL = false`** (default in repo) |
| Deploy | Web app, Execute as **Me**, access **Anyone** |
| GitHub secret | `VITE_WINE_ORDER_SUBMIT_URL` = `/exec` URL |
| Test | Run **`testSheetAppend`** in the editor → new row in Sheet (no email) |

**Redeploy** after any script change: Deploy → Manage deployments → Edit → New version → Deploy.

## What gets logged

Each order adds one row: timestamp, customer details, delivery zone/address, wines (JSON), case/bottle counts, subtotals, delivery fee, grand total, notes, status `new`.

## Verify end-to-end

1. Incognito GET on `/exec` → `{"ok":true,"live":true}`
2. Submit test order on `/shop/wine`
3. **One** email to Brett (+ CC Samuel) from FormSubmit
4. **One** new row in the Sheet
5. **No** email from the Google account that owns the script

See also: [WINE_ORDER_SETUP.md](./WINE_ORDER_SETUP.md)
