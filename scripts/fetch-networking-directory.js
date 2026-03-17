/**
 * Fetches the Networking directory from Google Sheets at build time.
 * Sheet ID is read from VITE_NETWORKING_SHEET_ID env var (GitHub Secret).
 * The Sheet ID never appears in the built site—only the fetched JSON does.
 *
 * Run before `vite build`. Writes to public/networking-directory.json.
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "networking-directory.json");

const sheetId = process.env.VITE_NETWORKING_SHEET_ID;

/** Normalize sheet row to consistent keys (handles "Name", "Business Interest", etc.) */
function normalizeRow(row) {
  if (!row || typeof row !== "object") return null;
  const get = (...keys) => {
    const key = keys.find((k) => row[k] != null && String(row[k]).trim() !== "");
    return key != null ? String(row[key]).trim() : "";
  };
  return {
    name: get("name", "Name"),
    company: get("company", "Company"),
    sectors: get("sectors", "Sectors"),
    business_interests: get("business_interests", "Business Interest"),
    phone: get("phone", "Phone"),
    email: get("email", "Email"),
    area: get("area", "Area"),
    website: get("website", "Website"),
  };
}

async function run() {
  let data = [];

  if (sheetId && sheetId !== "YOUR_SHEET_ID") {
    try {
      const url = `https://opensheet.elk.sh/${sheetId}/Sheet1`;
      const res = await fetch(url);
      if (res.ok) {
        const raw = await res.json();
        const rows = Array.isArray(raw) ? raw : [];
        data = rows.map(normalizeRow).filter((r) => r && (r.name || r.company));
      }
    } catch (err) {
      console.warn("fetch-networking-directory: fetch failed, using empty array:", err.message);
    }
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(data), "utf8");
}

run();
