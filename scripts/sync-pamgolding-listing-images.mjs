#!/usr/bin/env node
/**
 * Sync property card images in public/data/properties.json with Pam Golding listing photos.
 *
 * Pam Golding’s **main / hero** image for a listing matches:
 * - the **`og:image`** URL (featured image they set for the property), and
 * - the **first** property image reference in their server-rendered HTML (same URL in tests).
 *
 * We use **`og:image`** from the listing page so the charity site shows the same lead photo
 * as their listing (not an arbitrary gallery index such as minimum `_H_N`).
 *
 * Fallback (if `og:image` is missing): first `resources.pamgolding.co.za/.../properties/...`
 * image URL in document order.
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

const RESOURCES_RE = /https:\/\/resources\.pamgolding\.co\.za\/content\/properties\/\d+\/\d+\/h\/\d+_H_\d+\.jpg/;

/**
 * @param {string} html
 * @returns {{ url: string, width?: string } | null}
 */
function primaryImageFromListingHtml(html) {
  const ogMatch =
    html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/property=og:image[^>]*content="([^"]+)"/i) ||
    html.match(/og:image" content="([^"]+)"/i);
  if (ogMatch) {
    const raw = ogMatch[1].trim();
    if (RESOURCES_RE.test(raw)) {
      return { url: raw.replace(/\?.*$/, ""), width: "1200" };
    }
  }
  let m;
  const iter = html.matchAll(new RegExp(RESOURCES_RE, "g"));
  for (m of iter) {
    return { url: m[0], width: "1200" };
  }
  return null;
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.text();
}

function withWidth(url, width) {
  if (!width) return url;
  const u = new URL(url.includes("://") ? url : `https://${url}`);
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
