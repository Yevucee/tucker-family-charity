/**
 * Payment catalog — donation presets + shop products with prices.
 *
 * Source of truth: Google Sheet "TFC Payment Catalog" (tabs `Catalog` + `DonationSettings`),
 * read through opensheet.elk.sh when PAYMENT_CATALOG_SHEET_ID is set. Staff edit prices in the
 * Sheet; nobody needs to touch code. When the Sheet is unset or unreachable we fall back to
 * public/data/payment-catalog.json so checkout keeps working.
 *
 * Wine is NOT in this catalog (case + delivery flow in wineCheckout.ts).
 * Caps are NOT sold through Yoco (Cheyna Dot only) — any cap-like row is ignored.
 */

import fs from "node:fs";
import path from "node:path";

export type CatalogKind = "donation" | "product";

export interface CatalogItem {
  id: string;
  kind: CatalogKind;
  name: string;
  priceZar: number;
  active: boolean;
  description: string;
}

export interface DonationSettings {
  allowCustomAmount: boolean;
  minAmountZar: number;
  maxAmountZar: number;
}

export interface PaymentCatalog {
  source: "sheet" | "fallback";
  items: CatalogItem[];
  settings: DonationSettings;
  /** Row-level problems found while parsing (shown in logs, never to visitors). */
  warnings: string[];
  loadedAt: string;
}

/** Public shape returned by GET /api/payment-catalog — active items only. */
export interface PublicPaymentCatalog {
  source: PaymentCatalog["source"];
  donations: Array<Pick<CatalogItem, "id" | "name" | "priceZar" | "description">>;
  products: Array<Pick<CatalogItem, "id" | "name" | "priceZar" | "description">>;
  settings: DonationSettings;
  loadedAt: string;
}

export const DEFAULT_DONATION_SETTINGS: DonationSettings = {
  allowCustomAmount: true,
  minAmountZar: 50,
  maxAmountZar: 500_000,
};

/** Yoco's minimum charge is R2; keep a sane floor even if the Sheet says lower. */
const ABSOLUTE_MIN_ZAR = 2;
/** Hard ceiling regardless of Sheet value (fat-finger protection). */
const ABSOLUTE_MAX_ZAR = 1_000_000;

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Caps are sold by Cheyna Dot only; wine has its own page/flow. */
const RESERVED_ID_PATTERN = /^(cap|caps|hat|wine)(-|$)/;

type SheetRow = Record<string, unknown>;

function cell(row: SheetRow, key: string): string {
  const value = row[key];
  return value == null ? "" : String(value).trim();
}

function parseYes(raw: string): boolean {
  return /^(y|yes|true|1)$/i.test(raw.trim());
}

/** Parses whole rands. Accepts "250", "R250", "1,000", "1 000". Rejects cents / negatives. */
export function parseWholeRands(raw: string): number | null {
  const cleaned = raw.replace(/^r\s*/i, "").replace(/[\s,]/g, "");
  if (!/^\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isSafeInteger(n) ? n : null;
}

export function parseCatalogRows(rows: unknown): { items: CatalogItem[]; warnings: string[] } {
  const items: CatalogItem[] = [];
  const warnings: string[] = [];
  if (!Array.isArray(rows)) return { items, warnings: ["Catalog tab did not return a list of rows"] };

  const seen = new Set<string>();
  rows.forEach((raw, index) => {
    const rowNumber = index + 2; // header is row 1
    if (!raw || typeof raw !== "object") return;
    const row = raw as SheetRow;
    const id = cell(row, "id").toLowerCase();
    if (!id) return; // blank line — ignore silently

    const kind = cell(row, "kind").toLowerCase();
    const name = cell(row, "name");
    const price = parseWholeRands(cell(row, "price_zar"));
    const active = parseYes(cell(row, "active"));

    if (!ID_PATTERN.test(id)) {
      warnings.push(`Row ${rowNumber}: id "${id}" must be lowercase letters, numbers and hyphens`);
      return;
    }
    if (RESERVED_ID_PATTERN.test(id)) {
      warnings.push(`Row ${rowNumber}: "${id}" ignored — caps sell via Cheyna Dot and wine via the wine page`);
      return;
    }
    if (seen.has(id)) {
      warnings.push(`Row ${rowNumber}: duplicate id "${id}" ignored`);
      return;
    }
    if (kind !== "donation" && kind !== "product") {
      warnings.push(`Row ${rowNumber}: kind must be "donation" or "product" (got "${kind}")`);
      return;
    }
    if (!name) {
      warnings.push(`Row ${rowNumber}: name is empty`);
      return;
    }
    if (price == null || price < ABSOLUTE_MIN_ZAR || price > ABSOLUTE_MAX_ZAR) {
      warnings.push(`Row ${rowNumber}: price_zar must be whole rands between ${ABSOLUTE_MIN_ZAR} and ${ABSOLUTE_MAX_ZAR}`);
      return;
    }

    seen.add(id);
    items.push({ id, kind, name, priceZar: price, active, description: cell(row, "description") });
  });

  return { items, warnings };
}

export function parseDonationSettings(rows: unknown): { settings: DonationSettings; warnings: string[] } {
  const settings: DonationSettings = { ...DEFAULT_DONATION_SETTINGS };
  const warnings: string[] = [];
  if (!Array.isArray(rows)) return { settings, warnings };

  for (const raw of rows) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as SheetRow;
    const key = cell(row, "setting").toLowerCase();
    const value = cell(row, "value");
    if (key === "allow_custom_amount") {
      settings.allowCustomAmount = parseYes(value);
    } else if (key === "min_amount_zar" || key === "max_amount_zar") {
      const n = parseWholeRands(value);
      if (n == null) {
        warnings.push(`DonationSettings: ${key} must be whole rands`);
        continue;
      }
      if (key === "min_amount_zar") settings.minAmountZar = n;
      else settings.maxAmountZar = n;
    }
  }

  settings.minAmountZar = Math.max(ABSOLUTE_MIN_ZAR, settings.minAmountZar);
  settings.maxAmountZar = Math.min(ABSOLUTE_MAX_ZAR, settings.maxAmountZar);
  if (settings.minAmountZar > settings.maxAmountZar) {
    warnings.push("DonationSettings: min_amount_zar is above max_amount_zar — using defaults");
    settings.minAmountZar = DEFAULT_DONATION_SETTINGS.minAmountZar;
    settings.maxAmountZar = DEFAULT_DONATION_SETTINGS.maxAmountZar;
  }
  return { settings, warnings };
}

export function toPublicCatalog(catalog: PaymentCatalog): PublicPaymentCatalog {
  const pick = ({ id, name, priceZar, description }: CatalogItem) => ({ id, name, priceZar, description });
  return {
    source: catalog.source,
    donations: catalog.items.filter((i) => i.active && i.kind === "donation").map(pick),
    products: catalog.items.filter((i) => i.active && i.kind === "product").map(pick),
    settings: catalog.settings,
    loadedAt: catalog.loadedAt,
  };
}

export function findActiveItem(catalog: PaymentCatalog, id: string, kind?: CatalogKind): CatalogItem | undefined {
  return catalog.items.find((i) => i.id === id && i.active && (!kind || i.kind === kind));
}

// ---------------------------------------------------------------------------
// Loading (Sheet via opensheet, with cache + JSON fallback)
// ---------------------------------------------------------------------------

export interface CatalogLoaderOptions {
  sheetId?: string;
  catalogTab?: string;
  settingsTab?: string;
  /** Cache lifetime. Staff changes show up within this window. */
  ttlMs?: number;
  fallbackPath?: string;
  fetchImpl?: typeof fetch;
  now?: () => number;
  log?: (msg: string) => void;
}

const DEFAULT_FALLBACK_PATH = path.resolve(process.cwd(), "public/data/payment-catalog.json");

export function loadFallbackCatalog(fallbackPath = DEFAULT_FALLBACK_PATH): PaymentCatalog {
  const raw = JSON.parse(fs.readFileSync(fallbackPath, "utf8")) as { catalog?: unknown; settings?: unknown };
  const { items, warnings } = parseCatalogRows(raw.catalog);
  const settingsResult = parseDonationSettings(raw.settings);
  return {
    source: "fallback",
    items,
    settings: settingsResult.settings,
    warnings: [...warnings, ...settingsResult.warnings],
    loadedAt: new Date().toISOString(),
  };
}

async function fetchJson(fetchImpl: typeof fetch, url: string): Promise<unknown> {
  const res = await fetchImpl(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const data = (await res.json()) as unknown;
  if (data && typeof data === "object" && !Array.isArray(data) && "error" in data) {
    throw new Error(`${url} → ${String((data as { error: unknown }).error)}`);
  }
  return data;
}

export function createCatalogLoader(options: CatalogLoaderOptions = {}) {
  const {
    sheetId = "",
    catalogTab = "Catalog",
    settingsTab = "DonationSettings",
    ttlMs = 5 * 60 * 1000,
    fallbackPath = DEFAULT_FALLBACK_PATH,
    fetchImpl = fetch,
    now = Date.now,
    log = (msg: string) => console.log(msg),
  } = options;

  let cached: { catalog: PaymentCatalog; expiresAt: number } | null = null;
  let inFlight: Promise<PaymentCatalog> | null = null;

  async function loadFromSheet(): Promise<PaymentCatalog> {
    const base = `https://opensheet.elk.sh/${encodeURIComponent(sheetId)}`;
    const [catalogRows, settingsRows] = await Promise.all([
      fetchJson(fetchImpl, `${base}/${encodeURIComponent(catalogTab)}`),
      fetchJson(fetchImpl, `${base}/${encodeURIComponent(settingsTab)}`).catch((err: unknown) => {
        log(`[payment-catalog] settings tab unavailable, using defaults: ${String(err)}`);
        return [];
      }),
    ]);
    const { items, warnings } = parseCatalogRows(catalogRows);
    const settingsResult = parseDonationSettings(settingsRows);
    return {
      source: "sheet",
      items,
      settings: settingsResult.settings,
      warnings: [...warnings, ...settingsResult.warnings],
      loadedAt: new Date(now()).toISOString(),
    };
  }

  async function refresh(): Promise<PaymentCatalog> {
    let catalog: PaymentCatalog;
    if (sheetId) {
      try {
        catalog = await loadFromSheet();
      } catch (err) {
        log(`[payment-catalog] Sheet load failed: ${String(err)}`);
        // Prefer the last good Sheet copy over the bundled fallback.
        if (cached) {
          cached.expiresAt = now() + Math.min(ttlMs, 60_000);
          return cached.catalog;
        }
        catalog = loadFallbackCatalog(fallbackPath);
      }
    } else {
      catalog = loadFallbackCatalog(fallbackPath);
    }
    for (const w of catalog.warnings) log(`[payment-catalog] ${w}`);
    cached = { catalog, expiresAt: now() + ttlMs };
    return catalog;
  }

  return {
    async get(): Promise<PaymentCatalog> {
      if (cached && cached.expiresAt > now()) return cached.catalog;
      if (!inFlight) inFlight = refresh().finally(() => (inFlight = null));
      return inFlight;
    },
    clear() {
      cached = null;
    },
  };
}
