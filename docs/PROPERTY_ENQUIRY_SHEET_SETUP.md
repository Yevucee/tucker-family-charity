# Property Partnerships → Google Sheet

Enquiries from **Property Partnerships** (`Register your interest`) POST JSON to a **Google Apps Script web app**, which appends one row per submission to your Sheet.

## What you need

1. A Google Sheet owned by (or editable from) the charity Google account.
2. Share that Sheet with the property partner if they should view responses (Drive sharing).
3. One Apps Script **deployment** bound to that spreadsheet or created at [script.google.com](https://script.google.com), using `scripts/property-enquiry-append-sheet.gs`.

## Sheet tab

1. Create a tab named **`Sheet1`** (or change `SHEET_NAME` in the script to match).
2. In **row 1**, add headers (recommended):

   `Timestamp` | `Property ID` | `Title` | `Type` | `Suburb` | `Name` | `Email` | `Phone` | `Preferred contact` | `Message` | `Agent email` | `Listing URL` | `Status` | `Notes` | `Owner`

## Apps Script checklist

| Step | Action |
|------|--------|
| Spreadsheet ID | Copy from URL: `…/spreadsheets/d/`**`THIS`**`/edit` → `PROPERTY_ENQUIRY_SPREADSHEET_ID` |
| Deploy | **Web app**, Execute as **Me**, Who has access **Anyone** |
| Site URL | Copy `/exec` URL → repo secret **`VITE_PROPERTY_ENQUIRY_SUBMIT_URL`** |
| Optional lock | Set `SCRIPT_SECRET` in script + **`VITE_PROPERTY_ENQUIRY_SECRET`** (same string) |
| Email alerts | Set **`NOTIFY_EMAILS`** (Pam Golding enquiries) and optional **`NOTIFY_EMAILS_TFC`** (charity-owned ids). **`PROPERTY_IDS_OWNER_TFC_CSV`** in script = those listing ids → Owner **TFC** column + TFC inbox list. Run **`testNotify`**, **`installPropertyEnquiryChangeTrigger`**, redeploy |

Never put the shared secret into the URL secret — same rule as KITF (`VITE_KITF_SUBMIT_URL` vs `VITE_KITF_SUBMIT_SECRET`).

### Email notifications (optional)

After each successful Sheet append (or when a **new bottom row** is completed on the enquiries tab), the script can email a plain-text summary using **`MailApp`**.

1. In **`scripts/property-enquiry-append-sheet.gs`** (your deployed Code.gs), set for example:
   - `NOTIFY_EMAILS = "…"` — recipients when **Owner** is **Pam Golding** (default partnership listings)
   - `NOTIFY_EMAILS_TFC = "…"` — recipients when **Owner** is **TFC** (charity-owned listing ids listed in **`PROPERTY_IDS_OWNER_TFC_CSV`**). Leave empty to use **`NOTIFY_EMAILS`** temporarily.
2. In Apps Script: choose **`testNotify`** in the function dropdown → **Run**. Approve **Send mail as you** when prompted.
3. Check your inbox for the test message.
4. **Sheet-driven alerts (recommended):** Run **`installPropertyEnquiryChangeTrigger`** once. That installs an **`onChange`** trigger on the spreadsheet so **manual or imported rows** at the bottom of `SHEET_NAME` trigger the same email path as the website (deduped — you won’t get two emails for one web submission). The installer also runs **`primeEnquiryNotifyDedupe_`** so existing bottom-row data isn’t treated as a “new” enquiry on the next edit.
5. **Deploy → Manage deployments → Edit** (pencil) → **New version** → **Deploy** so the live web app includes the updated script.

If Mail fails (quota, typo), the enquiry row is **still saved** and the website still receives **`saved: true`**; failures are logged in Apps Script **Executions** (look for **`doPost`** or **`propertyEnquirySheetOnChange_`**).

### No email after an enquiry?

Mail is sent **only from Apps Script**, not from the website — and only **after** `appendRow` succeeds.

1. **Redeploy required:** Saving Code.gs does **not** update the live **`/exec`** web app until **Deploy → Manage deployments → ✏️ Edit → New version → Deploy**.
2. **Authorize Mail:** Run **`testNotify`** in the editor once; approve sending mail. Confirm **both** inboxes receive the test (including **Spam / Promotions**).
3. **Executions:** Apps Script → **Executions** → latest **`doPost`** or **`propertyEnquirySheetOnChange_`** → **Logs**. Look for `notifyNewEnquiry_ failed for …`. If you never ran **`installPropertyEnquiryChangeTrigger`**, only **`doPost`** can send mail after form submits (manual Sheet rows won’t alert until you install that trigger).
4. **Workspace:** IT may block scripted outbound mail.

## Website build

- **GitHub Actions:** add secrets `VITE_PROPERTY_ENQUIRY_SUBMIT_URL` and optionally `VITE_PROPERTY_ENQUIRY_SECRET`, then redeploy Pages (workflow already passes these into `npm run build`).
- **Local:** copy `.env.example` lines into `.env` and rebuild.

After deployment, submit a test enquiry and confirm a new row appears in the Sheet.

### Production readiness (quick check)

1. **GitHub secret** `VITE_PROPERTY_ENQUIRY_SUBMIT_URL` is set and equals your **Manage deployments → Web app** `/exec` URL (see `.env.example` for the canonical link used in this repo).
2. **GET** that URL (open in browser or curl with redirects): JSON must include **`"ok":true,"live":true`**. Anything else usually means deploy access or wrong URL.
3. **Paste + deploy** the latest `scripts/property-enquiry-append-sheet.gs`; row **15** = **Owner** (`Pam Golding` / `TFC`).
4. **Mail:** `testNotify` once (authorize MailApp); **`installPropertyEnquiryChangeTrigger`** once; set **`PROPERTY_IDS_OWNER_TFC_CSV`** and **`NOTIFY_EMAILS_TFC`** when you need TFC-only inboxes.
5. **Smoke test:** From the live Property Partnerships page, submit a test enquiry → new Sheet row **and** sensible email recipients for that **Owner**.

## Troubleshooting

### Sheet stays empty but the website says “Thank you”

Older setups could show success while **no row was saved**: Google answers POST with **HTTP 302**, browsers repeat the request as **GET**, so only **`doGet`** ran (health check), not **`doPost`** (Sheet append).

The charity site now **POSTs twice** (manual redirect) and treats success only when JSON includes **`"saved": true`**. Your Apps Script **must** match the latest `scripts/property-enquiry-append-sheet.gs` (**`live`** on GET, **`saved`** on POST).

1. Open your **`…/exec`** URL in an **Incognito / private** window **without** signing into Google.
   - **Good:** JSON includes **`"live":true`** (and **`"ok":true`**).
   - **Bad:** Google asks you to **sign in**, or you see a Drive “could not open file” page → the Web App is **not** set to **Anyone**.

2. Fix access: Apps Script → **Deploy → Manage deployments** → **Who has access:** **Anyone** → Deploy again.

3. **Wrong tab name:** The script uses **`Sheet1`** unless you changed `SHEET_NAME`.

### Recommended Sheet headers (15 columns)

Match what `appendRow` writes. **Owner** is **`Pam Golding`** or **`TFC`** (written by Apps Script from id whitelist; editable for manual rows).

`Timestamp` | `Property ID` | `Title` | `Type` | `Suburb` | `Name` | `Email` | `Phone` | `Preferred contact` | `Message` | `Agent email` | `Listing URL` | `Status` | `Notes` | `Owner`
