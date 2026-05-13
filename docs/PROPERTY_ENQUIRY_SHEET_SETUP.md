# Property Partnerships → Google Sheet

Enquiries from **Property Partnerships** (`Register your interest`) POST JSON to a **Google Apps Script web app**, which appends one row per submission to your Sheet.

## What you need

1. A Google Sheet owned by (or editable from) the charity Google account.
2. Share that Sheet with the property partner if they should view responses (Drive sharing).
3. One Apps Script **deployment** bound to that spreadsheet or created at [script.google.com](https://script.google.com), using `scripts/property-enquiry-append-sheet.gs`.

## Sheet tab

1. Create a tab named **`Sheet1`** (or change `SHEET_NAME` in the script to match).
2. In **row 1**, add headers (recommended):

   `Timestamp` | `Property ID` | `Title` | `Type` | `Suburb` | `Name` | `Email` | `Phone` | `Preferred contact` | `Message` | `Agent email` | `Listing URL` | `Status` | `Notes`

## Apps Script checklist

| Step | Action |
|------|--------|
| Spreadsheet ID | Copy from URL: `…/spreadsheets/d/`**`THIS`**`/edit` → `PROPERTY_ENQUIRY_SPREADSHEET_ID` |
| Deploy | **Web app**, Execute as **Me**, Who has access **Anyone** |
| Site URL | Copy `/exec` URL → repo secret **`VITE_PROPERTY_ENQUIRY_SUBMIT_URL`** |
| Optional lock | Set `SCRIPT_SECRET` in script + **`VITE_PROPERTY_ENQUIRY_SECRET`** (same string) |

Never put the shared secret into the URL secret — same rule as KITF (`VITE_KITF_SUBMIT_URL` vs `VITE_KITF_SUBMIT_SECRET`).

## Website build

- **GitHub Actions:** add secrets `VITE_PROPERTY_ENQUIRY_SUBMIT_URL` and optionally `VITE_PROPERTY_ENQUIRY_SECRET`, then redeploy Pages (workflow already passes these into `npm run build`).
- **Local:** copy `.env.example` lines into `.env` and rebuild.

After deployment, submit a test enquiry and confirm a new row appears in the Sheet.

## Troubleshooting

### Sheet stays empty but the website says “Thank you”

That usually means the **browser never received `{ "ok": true }` JSON** from Apps Script (often because of deployment permissions).

1. Open your **`…/exec`** URL in an **Incognito / private** window **without** signing into Google.
   - **Good:** you see JSON like `{"ok":true,"message":"…endpoint is live…"}`.
   - **Bad:** Google asks you to **sign in**, or you see a Drive “could not open file” page → the Web App is **not** set to **Anyone**.

2. Fix it: Apps Script → **Deploy → Manage deployments** → edit the Web App deployment → **Who has access:** **Anyone** → Deploy again. Copy the **new `/exec` URL** if Google gives you one; update **`VITE_PROPERTY_ENQUIRY_SUBMIT_URL`** and redeploy the charity site build.

3. **Wrong tab name:** The script uses **`Sheet1`** unless you changed `SHEET_NAME`. If your tab has another name (e.g. “Responses”), either rename the tab or set `SHEET_NAME` to match exactly.

### Recommended Sheet headers (14 columns)

Match what `appendRow` writes (add **Suburb** and **Listing URL** if yours only has 12 columns):

`Timestamp` | `Property ID` | `Title` | `Type` | `Suburb` | `Name` | `Email` | `Phone` | `Preferred contact` | `Message` | `Agent email` | `Listing URL` | `Status` | `Notes`
