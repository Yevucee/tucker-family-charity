# Wine shop order email setup

Wine orders on `/shop/wine` email **info@tuckerfamilycharity.com** automatically when a customer submits the form. No extra setup is required for the default path (FormSubmit.co).

Optional: deploy Google Apps Script (`scripts/wine-order-submit.gs`) and set `VITE_WINE_ORDER_SUBMIT_URL` if you prefer MailApp instead of FormSubmit.

## Default (no setup)

Submissions POST to FormSubmit.co, which emails the full order to **info@tuckerfamilycharity.com**.

**First time only:** FormSubmit sends an activation link to that inbox — click it once so future orders arrive automatically.

## Optional: Google Apps Script

1. Open [Google Apps Script](https://script.google.com) → **New project**.
2. Replace `Code.gs` with the contents of `scripts/wine-order-submit.gs`.
3. Edit the top of the script:
   - **`WINE_ORDER_RECIPIENT_EMAIL`** — Bret’s order inbox (default: `brett@tuckerfamilycharity.co.za`).
   - **`WINE_ORDER_SPREADSHEET_ID`** — optional Sheet ID for an audit log (leave empty to skip).
   - **`SCRIPT_SECRET`** — optional shared password (same as `VITE_WINE_ORDER_SECRET` on the site).
   - **`WINE_CATALOG`** — update `priceZar` when bottle prices are confirmed (must match slugs in `src/data/charityWine.ts`).
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the URL ending in `/exec`.

Optional: run **`testWineOrderNotify`** once in the editor to authorise MailApp.

## 2. GitHub Pages secrets

In the repo → **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
|--------|--------|
| `VITE_WINE_ORDER_SUBMIT_URL` | Apps Script `/exec` URL |
| `VITE_WINE_ORDER_SECRET` | Same as `SCRIPT_SECRET` in Apps Script (optional) |

Push to `main` (or merge a PR) to rebuild the site.

## 3. Local development

Copy `.env.example` to `.env` and set:

```env
VITE_WINE_ORDER_SUBMIT_URL=https://script.google.com/macros/s/…/exec
VITE_WINE_ORDER_SECRET=
```

Run `npm run dev` and submit a test order.

## What the customer sees

- Choose quantities for one or more wines.
- Enter name, email, phone, delivery area, optional notes.
- On success: *“Thank you. Your wine order enquiry has been sent to Bret…”*
- Form clears only after confirmed success; duplicate clicks are blocked while sending.

## What Bret receives

Email subject: **`New wine order enquiry — [Customer name]`**

Body includes date/time, customer contact details, delivery zone (Johannesburg R50 / elsewhere in SA R200), delivery address, a readable order table (wine, qty, price, line total), wine subtotal, delivery fee, grand total, and notes. **Reply-To** is the customer’s email.

## Future Yoco checkout

Orders submit with `submissionMode: "enquiry"`. The payload shape is ready for a later `"yoco"` mode without changing the wine catalog slugs.

## Troubleshooting

- **Form says “not connected”** — `VITE_WINE_ORDER_SUBMIT_URL` missing from the production build secrets.
- **401 / HTML login page** — Web app must be deployed with **Who has access: Anyone**.
- **No email** — Run `testWineOrderNotify` in Apps Script; check spam; confirm `WINE_ORDER_RECIPIENT_EMAIL`.
- **Prices show “on enquiry”** — Set `priceZar` in both `src/data/charityWine.ts` and `WINE_CATALOG` in Apps Script, then redeploy both.
