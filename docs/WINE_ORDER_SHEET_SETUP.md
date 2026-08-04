# Wine shop orders → Google Sheet log

Every wine order can be **appended to a Google Sheet** before email is sent, so you still have a record if mail fails or goes to the wrong inbox.

The website uses **Google Apps Script** (`scripts/wine-order-submit.gs`) when `VITE_WINE_ORDER_SUBMIT_URL` is set. If that endpoint is unavailable, it **falls back to FormSubmit.co** (email only — no Sheet row).

## What you need

1. A Google Sheet (new tab or new workbook) owned by the charity Google account.
2. Apps Script deployed as a **Web app** using `scripts/wine-order-submit.gs`.
3. GitHub secret **`VITE_WINE_ORDER_SUBMIT_URL`** = the `/exec` URL from that deployment.

## Sheet tab

1. Create a tab named **`Wine orders`** (or change `SHEET_NAME` in the script).
2. Row 1 headers are created automatically on first submission. Expected columns:

   `Timestamp` | `Mode` | `Name` | `Email` | `Phone` | `Delivery zone` | `Delivery address` | `Wines JSON` | `Total cases` | `Total bottles` | `Wine subtotal ZAR` | `Delivery fee ZAR` | `Est. grand total ZAR` | `Notes` | `Status`

## Apps Script checklist

| Step | Action |
|------|--------|
| Spreadsheet ID | Copy from URL: `…/spreadsheets/d/`**`THIS`**`/edit` → `WINE_ORDER_SPREADSHEET_ID` in the script |
| CC inbox | `WINE_ORDER_CC_EMAILS` — default **`samuel.polley1@gmail.com`** (change in script if needed) |
| Primary inbox | `WINE_ORDER_RECIPIENT_EMAIL` — default **`brett@tuckerfamilycharity.co.za`** |
| Deploy | **Web app**, Execute as **Me**, Who has access **Anyone** |
| Site URL | Copy `/exec` URL → repo secret **`VITE_WINE_ORDER_SUBMIT_URL`** |
| Optional lock | Set `SCRIPT_SECRET` in script + **`VITE_WINE_ORDER_SECRET`** (same string) |
| Authorise mail | Run **`testWineOrderNotify`** once in the editor; approve **Send mail as you** |

**Important:** Saving Code.gs does **not** update the live web app until **Deploy → Manage deployments → Edit → New version → Deploy**.

## Email recipients

Each order emails:

- **To:** `brett@tuckerfamilycharity.co.za`
- **CC:** `samuel.polley1@gmail.com`
- **Reply-To:** the customer’s email

The FormSubmit fallback (when Apps Script is down) also CCs Samuel via `_cc`.

## Order of operations (Apps Script path)

1. Validate the submission.
2. **Append a row to the Sheet** (if `WINE_ORDER_SPREADSHEET_ID` is set).
3. Send staff email (+ customer acknowledgement if enabled).
4. Return `{ "ok": true, "saved": true }` to the website.

If step 3 fails, the Sheet row from step 2 is **still kept** and the website still shows success.

## GitHub Pages

Add secrets under **Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|--------|
| `VITE_WINE_ORDER_SUBMIT_URL` | Apps Script `/exec` URL |
| `VITE_WINE_ORDER_SECRET` | Same as `SCRIPT_SECRET` (optional) |

Push to `main` or merge a PR to rebuild the site.

## Smoke test

1. Open your `/exec` URL in an **Incognito** window (not signed into Google). JSON should include `"ok":true,"live":true`.
2. Submit a test order on `/shop/wine`.
3. Confirm a new Sheet row **and** email to Bret + Samuel.

## Troubleshooting

- **Sheet empty but form says thank you** — `WINE_ORDER_SPREADSHEET_ID` blank in the **deployed** script version, or wrong Sheet ID.
- **No email** — Run `testWineOrderNotify`; check spam; redeploy web app.
- **Only FormSubmit emails, no Sheet** — `VITE_WINE_ORDER_SUBMIT_URL` missing from GitHub Actions secrets (site uses email-only fallback).

See also: [WINE_ORDER_SETUP.md](./WINE_ORDER_SETUP.md)
