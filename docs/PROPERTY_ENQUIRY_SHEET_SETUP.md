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
| Email alerts | Set **`NOTIFY_EMAILS`** in `property-enquiry-append-sheet.gs` (comma-separated addresses). Run **`testNotify`** once from the Apps Script editor to grant Mail permission and verify mail arrives; then redeploy the web app |

Never put the shared secret into the URL secret — same rule as KITF (`VITE_KITF_SUBMIT_URL` vs `VITE_KITF_SUBMIT_SECRET`).

### Email notifications (optional)

After each successful Sheet append, the script can email a plain-text summary using **`MailApp`**.

1. In **`scripts/property-enquiry-append-sheet.gs`** (your deployed Code.gs), set for example:
   - `NOTIFY_EMAILS = "you@yourdomain.org, colleague@yourdomain.org"`
2. In Apps Script: choose **`testNotify`** in the function dropdown → **Run**. Approve **Send mail as you** when prompted.
3. Check your inbox for the test message.
4. **Deploy → Manage deployments → Edit** (pencil) → **New version** → **Deploy** so the live web app includes the updated script.

If Mail fails (quota, typo), the enquiry row is **still saved** and the website still receives **`saved: true`**; failures are logged in Apps Script **Executions**.

## Website build

- **GitHub Actions:** add secrets `VITE_PROPERTY_ENQUIRY_SUBMIT_URL` and optionally `VITE_PROPERTY_ENQUIRY_SECRET`, then redeploy Pages (workflow already passes these into `npm run build`).
- **Local:** copy `.env.example` lines into `.env` and rebuild.

After deployment, submit a test enquiry and confirm a new row appears in the Sheet.

## Troubleshooting

### Sheet stays empty but the website says “Thank you”

Older setups could show success while **no row was saved**: Google answers POST with **HTTP 302**, browsers repeat the request as **GET**, so only **`doGet`** ran (health check), not **`doPost`** (Sheet append).

The charity site now **POSTs twice** (manual redirect) and treats success only when JSON includes **`"saved": true`**. Your Apps Script **must** match the latest `scripts/property-enquiry-append-sheet.gs` (**`live`** on GET, **`saved`** on POST).

1. Open your **`…/exec`** URL in an **Incognito / private** window **without** signing into Google.
   - **Good:** JSON includes **`"live":true`** (and **`"ok":true`**).
   - **Bad:** Google asks you to **sign in**, or you see a Drive “could not open file” page → the Web App is **not** set to **Anyone**.

2. Fix access: Apps Script → **Deploy → Manage deployments** → **Who has access:** **Anyone** → Deploy again.

3. **Wrong tab name:** The script uses **`Sheet1`** unless you changed `SHEET_NAME`.

### Recommended Sheet headers (14 columns)

Match what `appendRow` writes (add **Suburb** and **Listing URL** if yours only has 12 columns):

`Timestamp` | `Property ID` | `Title` | `Type` | `Suburb` | `Name` | `Email` | `Phone` | `Preferred contact` | `Message` | `Agent email` | `Listing URL` | `Status` | `Notes`
