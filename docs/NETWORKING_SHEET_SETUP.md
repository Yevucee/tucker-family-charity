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
5. **Sharing:** Set to **"Anyone with the link can view"** so the site can fetch the data at runtime. Updates to the sheet appear on the next page refresh.

---

## Optional: Import from CSV

Use `docs/networking-sheet-template.csv` as a starting point:

1. In Google Sheets: **File → Import → Upload** → select the CSV.
2. Choose "Replace spreadsheet" or "Insert new sheet(s)" as needed.
3. Adjust the data as required.

---

## After creating the sheet

The default Sheet ID is already configured. To use a different sheet, add `VITE_NETWORKING_SHEET_ID` as a GitHub secret and set it to your Sheet ID.
