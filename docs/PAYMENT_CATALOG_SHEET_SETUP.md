# TFC Payment Catalog — Google Sheet setup

**Status: done (October 2026).** This page records how it was set up, so it can be rebuilt if needed.

| | |
|---|---|
| Sheet | **TFC Payment Catalog** |
| Location | Tucker Family Charity Drive → Charity › Shop › Payments |
| Sheet ID | `1O7gwTQrjQJUbZS2QbXd-k9FmNUoSL1uudK7K2_YXuxg` |
| Link | https://docs.google.com/spreadsheets/d/1O7gwTQrjQJUbZS2QbXd-k9FmNUoSL1uudK7K2_YXuxg/edit |
| Tabs | `Catalog`, `DonationSettings`, `ReadMe` |

Never put Yoco keys, passwords or card details in this Sheet — anyone with the link can view it.

## 1. Sharing (security model)

- **General access:** Anyone with the link → **Viewer**. Required so Railway can read it via opensheet.
- **Editors:** only trusted Tucker Family Charity staff Google accounts. Editors inherit from the
  Charity folder; review the list in **Share** and remove anyone who shouldn't change prices.
- Website visitors cannot edit prices. There is deliberately no `/admin` page on the website.

> Note: the Charity folder's link access was changed from Editor → Viewer while setting this up
> (Google applies the Sheet's link setting to the parent folder).

## 2. Tabs

`Catalog` — row 1 headers, lowercase, exactly: `id | kind | name | price_zar | active | description`

| id | kind | name | price_zar | active | description |
|----|------|------|-----------|--------|-------------|
| donation-100 | donation | Donation — R100 | 100 | Y | General support for Tucker Family Charity programmes |
| donation-250 | donation | Donation — R250 | 250 | Y | |
| donation-500 | donation | Donation — R500 | 500 | Y | |
| donation-1000 | donation | Donation — R1,000 | 1000 | Y | |
| example-hoodie | product | Charity hoodie (example) | 450 | N | Set active to Y when ready to sell; link shop card in code |

`DonationSettings` — headers `setting | value`:

| setting | value |
|---------|-------|
| allow_custom_amount | TRUE |
| min_amount_zar | 50 |
| max_amount_zar | 500000 |

`ReadMe` — plain-English staff rules (see `docs/PAYMENT_CATALOG.md`).

## 3. Optional: validation menu (Apps Script — no public URL)

1. In the Sheet: **Extensions → Apps Script**.
2. Replace the contents of `Code.gs` with `scripts/payment-catalog-sheet-helpers.gs` → Save.
3. Reload the Sheet → menu **TFC payments**:
   - **Validate catalog rows** — highlights problems in red and lists them.
   - **Add dropdowns (kind / active)** — prevents most typos.
4. First run asks for permission (only this spreadsheet). The script is not deployed as a web app.

## 4. Verify the public read

```
https://opensheet.elk.sh/1O7gwTQrjQJUbZS2QbXd-k9FmNUoSL1uudK7K2_YXuxg/Catalog
https://opensheet.elk.sh/1O7gwTQrjQJUbZS2QbXd-k9FmNUoSL1uudK7K2_YXuxg/DonationSettings
```

Both should return JSON arrays matching the tabs. Then set Railway `PAYMENT_CATALOG_SHEET_ID`
(see `docs/YOCO_RAILWAY_SETUP.md`) and check `GET /api/payment-catalog` shows `"source":"sheet"`.
