/**
 * Instagram feed embed.
 * Elfsight (script+div): use VITE_INSTAGRAM_ELFSIGHT_APP_ID
 * Other (iframe): use VITE_INSTAGRAM_WIDGET_URL
 * For GitHub Pages: add matching repo secrets.
 */
export const INSTAGRAM_ELFSIGHT_APP_ID =
  import.meta.env.VITE_INSTAGRAM_ELFSIGHT_APP_ID || "e05226db-b1eb-4e28-a8a8-95389431627a";
export const INSTAGRAM_WIDGET_URL = import.meta.env.VITE_INSTAGRAM_WIDGET_URL ?? "";

// GOOGLE SHEETS: Keep It In The Family
// Both sheets must be shared as "Anyone with the link can view"

// SERVICES tab: trusted professionals (plumbers, electricians, etc.)
// Columns: name, profession, area, phone, endorsed_by (legacy header: trusted_by), notes, website
// Override with VITE_DIRECTORY_SHEET_ID (or VITE_SERVICES_SHEET_ID) env var
export const DIRECTORY_SHEET_ID =
  import.meta.env.VITE_DIRECTORY_SHEET_ID ||
  import.meta.env.VITE_SERVICES_SHEET_ID ||
  "1tC3IcX81_tdA2_UHTjT2JEIG-i9hr_ovgCQS5fJV7tw";

/**
 * Web app URL from Apps Script Deploy (https://script.google.com/macros/s/…/exec).
 * Rejects values that cannot be real hosts (e.g. the shared secret pasted into the URL secret →
 * ERR_NAME_NOT_RESOLVED for https://kitf-dir-…/).
 */
function normalizeKitfSubmitUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return "";

  let candidate = t;
  if (!/^https?:\/\//i.test(candidate)) {
    const rest = candidate.replace(/^\/+/, "");
    // Bare token like the KITF shared secret — not a hostname
    if (/^[a-z0-9-]+$/i.test(rest)) return "";
    candidate = `https://${rest}`;
  }

  try {
    const u = new URL(candidate);
    const host = u.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") return candidate;
    if (!host.includes(".")) return "";
    return candidate;
  } catch {
    return "";
  }
}

const RAW_KITF_SUBMIT_URL = String(import.meta.env.VITE_KITF_SUBMIT_URL ?? "").trim();

// Optional: Google Apps Script web app URL for “Add your service” form (POST, form-urlencoded).
// Set VITE_KITF_SUBMIT_URL in .env locally and as a GitHub Actions secret for Pages builds.
export const KITF_SUBMIT_URL = normalizeKitfSubmitUrl(RAW_KITF_SUBMIT_URL);

/** Env was set but is not a valid URL (common mistake: putting the shared secret in the URL secret). */
export const KITF_SUBMIT_URL_REJECTED =
  RAW_KITF_SUBMIT_URL.length > 0 && KITF_SUBMIT_URL.length === 0;

// Optional shared secret checked by Apps Script (same value in script + VITE_KITF_SUBMIT_SECRET).
export const KITF_SUBMIT_SECRET = import.meta.env.VITE_KITF_SUBMIT_SECRET ?? "";

// Legacy networking sheet (no longer used on Keep It In The Family page; kept for reference / tooling)
// Columns: name, company, sectors, business_interests, phone, email, area, website
export const NETWORKING_SHEET_ID =
  import.meta.env.VITE_NETWORKING_SHEET_ID || "1z37lsb3N9VAqIxgRMdPYrqVOm61bt6KltjJpsD_FIrw";

// PAYMENT LINKS: Yoco, PayFast, or custom URLs
export const DONATION_LINK = import.meta.env.VITE_DONATION_LINK || "#";
