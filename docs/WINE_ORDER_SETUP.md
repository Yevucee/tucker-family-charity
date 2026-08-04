# Wine shop order email setup

Wine orders on `/shop/wine` email **brett@tuckerfamilycharity.co.za** with a **CC to samuel.polley1@gmail.com** on every submission.

## Recommended: Apps Script + Sheet log

Deploy Google Apps Script so each order is **saved to a Google Sheet first**, then emailed. If mail fails, the Sheet row is still there.

**Full checklist:** [WINE_ORDER_SHEET_SETUP.md](./WINE_ORDER_SHEET_SETUP.md)

Summary:

1. Create a Google Sheet and copy its ID into `WINE_ORDER_SPREADSHEET_ID` in `scripts/wine-order-submit.gs`.
2. Deploy the script as a **Web app** (Execute as **Me**, access **Anyone**).
3. Add GitHub secret **`VITE_WINE_ORDER_SUBMIT_URL`** with the `/exec` URL.
4. Run **`testWineOrderNotify`** once to authorise MailApp.
5. Redeploy after any script change.

The site tries Apps Script first; if that fails, it **falls back to FormSubmit.co** (email only, no Sheet).

## Fallback (no Apps Script)

If `VITE_WINE_ORDER_SUBMIT_URL` is not set, submissions POST to FormSubmit.co, which emails Bret and CCs Samuel.

**First time only:** FormSubmit sends an activation link to **brett@tuckerfamilycharity.co.za** — click it once so future orders arrive automatically.

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
