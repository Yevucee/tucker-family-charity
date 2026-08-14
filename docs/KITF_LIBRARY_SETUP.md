# KITF Resource Library — "Learning from the best"

Public page: **`/keep-it-in-the-family/library`**

Curated podcasts, talks, documentaries, articles, and books. Data comes from the **`Website`** tab on the master Google Sheet, synced from Brett’s source tabs via Apps Script.

## Sheet

- **Master workbook:** [Learning from the best](https://docs.google.com/spreadsheets/d/1AqkA2uCcaASDimT8N7O8rndYzPRmE_kFPC5uDkiRFCI/edit)
- **Public feed tab:** `Website`
- **Default sheet ID (in code):** `1AqkA2uCcaASDimT8N7O8rndYzPRmE_kFPC5uDkiRFCI`
- **Sharing:** Anyone with the link → **Viewer** (required for opensheet.elk.sh)

## Website data flow

```
Brett adds row on Podcast / You Tube / etc.
        ↓
Apps Script (scripts/kitf-library-sync.gs) → Website tab
        ↓
Site fetches: https://opensheet.elk.sh/{SHEET_ID}/Website
        ↓
Page shows rows where show_on_site = Y
```

No redeploy needed when resources change — visitors refresh the page.

## Apps Script sync (in the spreadsheet)

1. **Extensions → Apps Script** on the master workbook
2. Paste `scripts/kitf-library-sync.gs`
3. Run **`installWebsiteSyncTriggers`** once (auto-sync on edit + every 6 hours)
4. Run **`syncWebsiteFromSourceTabs`** once (or menu **KITF Library → Sync Website tab now**)

Brett keeps editing source tabs; `Website` updates automatically.

### Auto descriptions (Open Graph / meta tags)

When a row has a link but **no description**, the sync script fetches the page and tries:

1. `og:description`
2. `twitter:description`
3. `meta name="description"`
4. YouTube `shortDescription` (embedded JSON)
5. `og:title` (only if different from the sheet title)

- **Up to 25 URLs per automatic sync** (keeps runs fast)
- **Menu → Fill missing descriptions (batch)** — up to 50 more per run for backfill
- Results are **cached for 7 days** per link
- Manual descriptions on `Website` are **never overwritten**

After updating the script in Apps Script, save and redeploy is **not** required (bound script, not a web app). Re-run **`installWebsiteSyncTriggers`** only if menu items changed.

First-time backfill: run **Fill missing descriptions (batch)** several times until descriptions stop appearing (~10 runs for ~500 rows). Descriptions appear in **`Website` column E** first (sheet row order). The live library sorts **A–Z by title**, so the first website page may still look empty until YouTube/TED rows are filled.

**If the first run looks like it did nothing:** check the toast — it now reports how many links were checked vs filled. Also open the **Website** tab (not Podcast/YouTube source tabs) and scroll column **E**. Spotify/Apple Podcast rows at the top often fill first; YouTube needs the updated script (meta tags appear late in the HTML).

## Website config

Optional GitHub secret **`VITE_KITF_LIBRARY_SHEET_ID`** to override the default ID.

Local `.env`:

```env
# VITE_KITF_LIBRARY_SHEET_ID=1AqkA2uCcaASDimT8N7O8rndYzPRmE_kFPC5uDkiRFCI
```

## Website tab columns

`title` | `type` | `topic` | `author` | `description` | `link` | `tags` | `duration` | `featured` | `show_on_site` | `source_tab`

Only rows with **`show_on_site = Y`** appear on the public page.

## Troubleshooting

- **Empty library on site** — Check sheet sharing (Viewer). Test opensheet URL in browser.
- **New item missing** — Run manual sync; confirm `show_on_site = Y` and a valid `https` link on `Website`.
- **Stale data** — Hard refresh; opensheet may cache briefly.
