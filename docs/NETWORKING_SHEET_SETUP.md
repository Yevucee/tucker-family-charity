# Networking Directory – Google Sheet Setup

## Sheet name

**Tucker Family Charity – Networking Directory**

(or: `TFC - Keep It In The Family - Networking`)

---

## How to create the sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it: **Tucker Family Charity – Networking Directory**
3. In the first row, add these column headers (exactly):

   | name | company | sectors | business_interests | phone | email | area | website |
   |------|---------|---------|-------------------|-------|-------|------|---------|

4. Add your data starting in row 2. Use semicolons (`;`) to separate multiple values in `sectors` and `business_interests` (e.g. `Accounting; Consulting`).
5. **Sharing:** Set to **"Anyone with the link can view"** so the build can fetch the data.  
   The Sheet ID itself is never exposed: it lives only in GitHub Secrets. The build fetches the data server-side and bakes it into the site. Visitors never see the sheet link or ID.

---

## Optional: Import from CSV

Use `docs/networking-sheet-template.csv` as a starting point:

1. In Google Sheets: **File → Import → Upload** → select the CSV.
2. Choose "Replace spreadsheet" or "Insert new sheet(s)" as needed.
3. Adjust the data as required.

---

## After creating the sheet

1. Copy the Sheet ID from the URL:  
   `https://docs.google.com/spreadsheets/d/`**`YOUR_SHEET_ID`**`/edit`
2. Add it as a GitHub secret: **Settings → Secrets and variables → Actions**
3. Create a secret named: `VITE_NETWORKING_SHEET_ID`
4. Paste the Sheet ID as the value.
5. Re-run the deploy workflow (or push a commit) to rebuild with the new data.
