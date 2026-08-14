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

When a row has a link but **no description** (or a **generic** one like `Show Name · Episode`), the sync script fetches the page and picks the best line from:

1. `meta name="description"` (often best for Spotify — episode summary after stripping the “Listen on Spotify…” prefix)
2. YouTube `shortDescription`
3. `og:description` / `twitter:description` (skipped when generic)
4. `og:title` / `twitter:title` (useful for podcasts when meta description is missing)

Generic platform boilerplate (`· Episode`, `18K likes, 345 comments - …`, Instagram login text, etc.) is **rejected**. **Skipped hosts** (left blank on purpose): Instagram, YouTube, Facebook, LinkedIn, X/Twitter, **podcastgo.pl** — blocked, too slow, or useless for auto-fill. The batch tries **TED, Spotify, Apple Podcasts, Netflix, articles**, etc. (20 URLs per run, ~4.5 min max).

- **Up to 25 URLs per automatic sync** (keeps runs fast)
- **Menu → Fill / improve descriptions (batch)** — up to 20 fetches per run (empty + generic rows; known-bad cached links are skipped without counting toward the limit)
- Results are **cached for 7 days** per link
- Manual descriptions on `Website` are **never overwritten**

After updating the script in Apps Script, save and redeploy is **not** required (bound script, not a web app). Re-run **`installWebsiteSyncTriggers`** only if menu items changed.

First-time backfill: run **Fill / improve descriptions (batch)** several times until the toast stops reporting new fills (~10 runs for ~500 rows). Descriptions appear in **`Website` column E** first (sheet row order). The live library sorts **A–Z by title**, so the first website page may still look sparse until more rows are processed.

**Replacing bad auto-fills:** After updating the script, run **Fill / improve descriptions (batch)** again — it will upgrade generic lines like `The High Performance Podcast · Episode` to the real episode summary where the platform provides one.

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
