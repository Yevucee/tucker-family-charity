#!/usr/bin/env node
/**
 * Sync Byron Thomas Properties portfolio into public/data/properties.json.
 *
 * Manual / charity-direct listings live in properties.manual.json and are never removed.
 *
 * Usage:
 *   node scripts/sync-byron-thomas-properties.mjs
 *   node scripts/sync-byron-thomas-properties.mjs --dry-run
 *   node scripts/sync-byron-thomas-properties.mjs --limit 5
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MANUAL_JSON = join(ROOT, "public", "data", "properties.manual.json");
const OUT_JSON = join(ROOT, "public", "data", "properties.json");
const REPORT_JSON = join(ROOT, "public", "data", "properties-sync-report.json");

const BASE = "https://byronthomasproperties.co.za";
const UA = "Mozilla/5.0 (compatible; TuckerCharityPropertySync/1.0; +https://www.tuckerfamilycharity.co.za)";
const AGENT_EMAIL = "admin@btproperties.co.za";
const DETAIL_DELAY_MS = 250;

const PARTNERSHIP_FEATURES = [
  "Headline price as shown on Byron Thomas Properties",
  "Partnership listing: register interest via Tucker Family Charity first",
  "Full Byron Thomas listing shared after you enquire",
];

const PARTNERSHIP_REFERRAL =
  "Register your interest through Tucker Family Charity. We will connect you with the property partner and share the full listing details.";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseArgs(argv) {
  const dryRun = argv.includes("--dry-run");
  let limit = Infinity;
  const li = argv.indexOf("--limit");
  if (li !== -1 && argv[li + 1]) {
    const n = Number(argv[li + 1]);
    if (Number.isFinite(n) && n > 0) limit = n;
  }
  return { dryRun, limit };
}

function readJsonArray(path) {
  const raw = readFileSync(path, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error(`Expected JSON array in ${path}`);
  return data;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.text();
}

function parseMetaContent(html, property) {
  const re = new RegExp(
    `property=["']${property}["'][^>]*content=["']([^"']+)["']|property=${property}[^>]*content="([^"]+)"|${property}" content="([^"]+)"`,
    "i"
  );
  const m = html.match(re);
  return (m?.[1] ?? m?.[2] ?? m?.[3] ?? "").trim();
}

function parseCardIcons(block) {
  const out = {};
  for (const m of block.matchAll(/name="(hotel|shower|car|ruler)"[\s\S]*?<span[^>]*>\s*([^<]+)\s*<\/span>/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

function parseCardsFromIndexHtml(html, listingType) {
  const blocks = html.split("<shared-listing-card").slice(1);
  const rows = [];
  for (const block of blocks) {
    if (block.includes("listing-card-sold-banner")) continue;

    const href = block.match(/href="(\/listings\/[^"]+)"/)?.[1];
    if (!href) continue;

    const price = block.match(/price-label[^>]*>\s*([^<]+)/)?.[1]?.trim() ?? "";
    const subtitle = block.match(/class="text-sm">\s*([^<]+)/)?.[1]?.trim() ?? "";
    const img = block.match(/background-image:\s*url\(([^)]+)\)/)?.[1]?.trim() ?? "";
    const icons = parseCardIcons(block);
    const underOffer = block.includes("listing-card-under-offer-banner");

    const pathMatch = href.match(/^\/listings\/([^/]+)\/([^/?#]+)/);
    if (!pathMatch) continue;
    const [, areaSlug, webRef] = pathMatch;

    rows.push({
      href,
      areaSlug,
      webRef,
      price,
      subtitle,
      image: img,
      icons,
      listingType,
      underOffer,
    });
  }
  return rows;
}

function suburbFromSubtitle(subtitle, areaSlug) {
  const inMatch = subtitle.match(/\s+in\s+(.+)$/i);
  if (inMatch) {
    const raw = inMatch[1].trim();
    return raw.includes(",") ? raw : `${raw}, Johannesburg`;
  }
  const fromSlug = areaSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `${fromSlug}, Johannesburg`;
}

function titleFromSubtitle(subtitle) {
  const t = subtitle.trim();
  if (!t) return "Property listing";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function listingTypeFromSubtitle(subtitle, fallback) {
  if (/to rent|for rent|rent in/i.test(subtitle)) return "rent";
  if (/for sale|sale in/i.test(subtitle)) return "sale";
  return fallback;
}

function parseNumericStat(value) {
  if (!value) return 0;
  const n = parseFloat(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function priceSortValue(price) {
  const digits = String(price).replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number(digits);
}

function formatPriceForRent(price) {
  const t = price.trim();
  if (/\/\s*month/i.test(t)) return t;
  if (/^R[\d,.\s]+$/i.test(t)) return `${t.replace(/\s+/g, " ")} / month`;
  return t;
}

function buildCardFeatures(bedrooms, bathrooms, parking, erf) {
  const chips = [];
  if (bedrooms > 0) chips.push(`${bedrooms} bed`);
  if (bathrooms > 0) chips.push(`${bathrooms} bath`);
  if (parking > 0) chips.push(`${parking} parking`);
  if (erf) chips.push(erf);
  return chips.slice(0, 5);
}

function stableBtpId(webRef) {
  return `property-btp-${webRef.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function mapIndexRowToListing(row, detail) {
  const type = listingTypeFromSubtitle(row.subtitle, row.listingType === "rent" ? "rent" : "sale");
  const bedrooms = parseNumericStat(row.icons.hotel);
  const bathrooms = parseNumericStat(row.icons.shower);
  const parkingCount = parseNumericStat(row.icons.car);
  const erf = row.icons.ruler ?? "";
  const suburb = suburbFromSubtitle(row.subtitle, row.areaSlug);
  const title = titleFromSubtitle(row.subtitle);
  const webRef = row.webRef.toUpperCase();
  const originalListingUrl = `${BASE}${row.href}`;
  const price = type === "rent" ? formatPriceForRent(row.price) : row.price;

  const ogDesc = detail?.ogDescription ?? "";
  const cardSummary = ogDesc || title;
  const description =
    ogDesc.length > 0
      ? `${ogDesc} Listed with Byron Thomas Properties (${webRef}). Pricing and status may change; register interest via Tucker Family Charity.`
      : `${title}. Partnership listing through Byron Thomas Properties (${webRef}). Register interest via Tucker Family Charity for the full listing link.`;

  const listing = {
    id: stableBtpId(webRef),
    title,
    type,
    suburb,
    price,
    bedrooms,
    bathrooms,
    image: row.image,
    description,
    cardSummary,
    originalListingUrl,
    agentEmail: AGENT_EMAIL,
    webRef,
    syncSource: "byron-thomas",
    features: [...PARTNERSHIP_FEATURES],
    referralNote: PARTNERSHIP_REFERRAL,
  };

  if (parkingCount > 0) {
    listing.parking = `${parkingCount} parking bays (per listing)`;
  }

  const chips = buildCardFeatures(bedrooms, bathrooms, parkingCount, erf);
  if (chips.length > 0) listing.cardFeatures = chips;

  if (bedrooms === 0 && bathrooms === 0) {
    const parts = [title.replace(/\s+in\s+.+$/i, "").trim()];
    if (erf) parts.push(erf);
    listing.listingSummary = parts.filter(Boolean).join(" · ");
  }

  if (row.underOffer) {
    listing.cardSummary = `${cardSummary} (Under offer on partner site — confirm availability when you enquire.)`;
  }

  return listing;
}

async function discoverIndexRows(listingType) {
  const status = listingType === "rent" ? "rent" : "buy";
  const byHref = new Map();
  let page = 1;

  while (page <= 50) {
    const url = `${BASE}/listings?status=${status}&page=${page}`;
    console.log(`  Index ${status} page ${page}…`);
    const html = await fetchHtml(url);
    const cards = parseCardsFromIndexHtml(html, listingType === "rent" ? "rent" : "sale");
    if (cards.length === 0) break;
    for (const c of cards) byHref.set(c.href, c);
    page++;
    await sleep(150);
  }

  return [...byHref.values()];
}

async function fetchListingDetail(href) {
  const url = `${BASE}${href}`;
  try {
    const html = await fetchHtml(url);
    return {
      ogDescription: parseMetaContent(html, "og:description"),
      ogTitle: parseMetaContent(html, "og:title"),
    };
  } catch (e) {
    console.warn(`  ⚠ Detail fetch failed for ${url}: ${e.message}`);
    return null;
  }
}

function sortMerged(manual, btp) {
  const sales = btp.filter((l) => l.type === "sale").sort((a, b) => priceSortValue(b.price) - priceSortValue(a.price));
  const rents = btp.filter((l) => l.type === "rent").sort((a, b) => priceSortValue(b.price) - priceSortValue(a.price));
  return [...manual, ...sales, ...rents];
}

function listingSignature(l) {
  return `${l.id}|${l.price}|${l.title}|${l.image}`;
}

function diffReports(prev, next) {
  const prevIds = new Set(prev.map((l) => l.id));
  const nextIds = new Set(next.map((l) => l.id));
  const added = next.filter((l) => !prevIds.has(l.id)).map((l) => l.id);
  const removed = prev.filter((l) => !nextIds.has(l.id)).map((l) => l.id);

  const prevById = new Map(prev.map((l) => [l.id, l]));
  let updated = 0;
  for (const l of next) {
    const old = prevById.get(l.id);
    if (old && listingSignature(old) !== listingSignature(l)) updated++;
  }

  return { added, removed, updated };
}

async function main() {
  const { dryRun, limit } = parseArgs(process.argv.slice(2));

  const manual = readJsonArray(MANUAL_JSON).map((row) => ({
    ...row,
    syncSource: row.syncSource ?? "manual",
  }));

  let prev = [];
  try {
    prev = readJsonArray(OUT_JSON);
  } catch {
    prev = [];
  }

  console.log("Discovering Byron Thomas listings (sale)…");
  const saleRows = await discoverIndexRows("sale");
  console.log(`  Found ${saleRows.length} sale listings on index.`);

  console.log("Discovering Byron Thomas listings (rent)…");
  const rentRows = await discoverIndexRows("rent");
  console.log(`  Found ${rentRows.length} rent listings on index.`);

  const indexRows = [...saleRows, ...rentRows];
  const uniqueByHref = new Map();
  for (const r of indexRows) uniqueByHref.set(r.href, r);
  let toProcess = [...uniqueByHref.values()];
  if (Number.isFinite(limit)) toProcess = toProcess.slice(0, limit);

  console.log(`Fetching details for ${toProcess.length} listings…`);
  const btpListings = [];
  for (let i = 0; i < toProcess.length; i++) {
    const row = toProcess[i];
    if (i > 0) await sleep(DETAIL_DELAY_MS);
    const detail = await fetchListingDetail(row.href);
    if (!detail) {
      console.warn(`  ⚠ Skipping ${row.href} (detail unavailable)`);
      continue;
    }
    btpListings.push(mapIndexRowToListing(row, detail));
    if ((i + 1) % 25 === 0) console.log(`  …${i + 1}/${toProcess.length}`);
  }

  const merged = sortMerged(manual, btpListings);
  const { added, removed, updated } = diffReports(prev, merged);
  const report = {
    syncedAt: new Date().toISOString(),
    added,
    removed,
    updated,
    total: merged.length,
    manualCount: manual.length,
    btpCount: btpListings.length,
  };

  console.log("\nSync summary:");
  console.log(`  Total listings: ${report.total} (${report.manualCount} manual + ${report.btpCount} Byron Thomas)`);
  console.log(`  Added:   ${added.length}`);
  console.log(`  Removed: ${removed.length}`);
  console.log(`  Updated: ${updated}`);
  if (added.length) console.log(`  + ${added.slice(0, 8).join(", ")}${added.length > 8 ? "…" : ""}`);
  if (removed.length) console.log(`  - ${removed.slice(0, 8).join(", ")}${removed.length > 8 ? "…" : ""}`);

  if (dryRun) {
    console.log("\nDry run — no files written.");
    return;
  }

  writeFileSync(OUT_JSON, JSON.stringify(merged, null, 2) + "\n", "utf8");
  writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log(`\nWrote ${OUT_JSON}`);
  console.log(`Wrote ${REPORT_JSON}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
