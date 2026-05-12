#!/usr/bin/env node
/**
 * Sync property card images in public/data/properties.json with Pam Golding listing photos.
 *
 * For each Pam Golding URL we:
 * 1. Read og:image — establishes the canonical CDN folder (property id + date path).
 * 2. Collect every .../PID_H_N.jpg reference in that same folder from the HTML.
 * 3. Use the *lowest* N as the on-site primary / first-gallery image for that listing set.
 *
 * This avoids stale duplicate folders (e.g. old year-month) and avoids mistaking og:image
 * for the same photo users see as the lead gallery image.
 *
 * Usage:
 *   node scripts/sync-pamgolding-listing-images.mjs
 *   node scripts/sync-pamgolding-listing-images.mjs --dry-run
 *   node scripts/sync-pamgolding-listing-images.mjs --json path/to/properties.json
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_JSON = join(__dirname, "..", "public", "data", "properties.json");

const UA = "Mozilla/5.0 (compatible; TuckerCharityListingSync/1.0; +https://www.tuckerfamilycharity.co.za)";

/**
 * @param {string} html
 * @returns {{ url: string, width?: string } | null}
 */
function primaryImageFromListingHtml(html) {
  const og = html.match(
    /og:image" content="(https:\/\/resources\.pamgolding\.co\.za\/content\/properties\/(\d+)\/(\d+)\/h\/\3_H_)(\d+)(\.jpg[^"']*)"/i,
  );
  if (!og) return null;
  const base = og[1];
  const re = new RegExp(base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\d+)\\.jpg", "gi");
  const indices = new Set();
  let m;
  while ((m = re.exec(html))) indices.add(+m[1]);
  if (indices.size === 0) {
    const fallback = `${base}${og[4]}${og[5].split("?")[0]}`;
    return { url: fallback.split("?")[0] };
  }
  const min = Math.min(...indices);
  const raw = `${base}${min}.jpg`;
  return { url: raw, width: "1200" };
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.text();
}

function withWidth(url, width) {
  if (!width) return url;
  const u = new URL(url);
  u.searchParams.set("w", width);
  return u.toString();
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry-run");
  let jsonPath = DEFAULT_JSON;
  const ji = args.indexOf("--json");
  if (ji !== -1 && args[ji + 1]) jsonPath = args[ji + 1];

  const raw = readFileSync(jsonPath, "utf8");
  /** @type {unknown} */
  let data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    console.error("Expected top-level JSON array");
    process.exit(1);
  }

  let changed = 0;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || typeof row !== "object") continue;
    const o = /** @type {Record<string, unknown>} */ (row);
    const listingUrl = typeof o.originalListingUrl === "string" ? o.originalListingUrl.trim() : "";
    if (!/^https?:\/\//i.test(listingUrl) || !listingUrl.includes("pamgolding.co.za")) continue;

    console.log(`Fetching ${listingUrl} …`);
    const html = await fetchHtml(listingUrl);
    const prim = primaryImageFromListingHtml(html);
    if (!prim) {
      console.warn(`  ⚠ Could not derive primary image (missing og:image / resources URL). Skipping.`);
      continue;
    }
    const next = withWidth(prim.url, prim.width ?? "1200");
    const prev = o.image;
    if (prev === next) {
      console.log(`  OK (unchanged) ${next}`);
      continue;
    }
    console.log(`  ${dry ? "Would set" : "Set"} image → ${next}`);
    if (!dry) o.image = next;
    changed++;
  }

  if (!dry && changed > 0) {
    writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log(`\nUpdated ${changed} image(s) in ${jsonPath}`);
  } else if (dry) {
    console.log(`\nDry run: ${changed} row(s) would change.`);
  } else {
    console.log("\nNo image updates needed.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
