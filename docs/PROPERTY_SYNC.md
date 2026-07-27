# Property listings sync

Byron Thomas Properties stock is imported automatically. Charity-direct listings are kept in a separate manual file.

## Files

| File | Purpose |
|------|---------|
| [`public/data/properties.manual.json`](../public/data/properties.manual.json) | TFC direct lets and hand-curated rows — **never removed** by sync |
| [`public/data/properties.json`](../public/data/properties.json) | Merged catalogue the website loads |
| [`public/data/properties-sync-report.json`](../public/data/properties-sync-report.json) | Last sync summary (added / removed / updated) |
| [`scripts/sync-byron-thomas-properties.mjs`](../scripts/sync-byron-thomas-properties.mjs) | Crawler + merge script |

## Commands

```bash
# Preview changes (no files written)
npm run sync:btp-properties -- --dry-run

# Test with first 5 listings only
npm run sync:btp-properties -- --limit 5

# Full sync (writes properties.json + report)
npm run sync:btp-properties
```

## Weekly automation

GitHub Actions workflow [`.github/workflows/sync-properties.yml`](../.github/workflows/sync-properties.yml):

- Runs every **Monday 06:00 UTC**
- Can be triggered manually: **Actions → Sync property listings → Run workflow**
- If listings changed, opens a **pull request** (does not merge to `main`)
- Merge the PR to deploy via the existing Pages workflow

## On the move (with Cursor agent)

1. **“Sync properties”** — agent runs `npm run sync:btp-properties` and shows the summary.
2. **“Deploy property sync”** — agent commits, pushes, or reminds you to merge the open sync PR.

Without Cursor: use the GitHub mobile app → Actions → run **Sync property listings** → review and merge the PR.

## Adding a manual listing

1. Add a row to `properties.manual.json` (copy an existing BTP row as a template).
2. Set `"syncSource": "manual"` and a unique `"id"`.
3. Run `npm run sync:btp-properties` — manual rows are prepended and preserved.

## Enquiries

Unchanged: each card still posts to Google Apps Script → Sheet. See [`PROPERTY_ENQUIRY_SHEET_SETUP.md`](PROPERTY_ENQUIRY_SHEET_SETUP.md).
