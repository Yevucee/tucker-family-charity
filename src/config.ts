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
 * GAS URL must be absolute (https://…). If the secret omits the scheme, fetch would POST to
 * GitHub Pages instead → 405 Method Not Allowed from the static host.
 */
function normalizeKitfSubmitUrl(raw: string | undefined): string {
  const t = String(raw ?? "").trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t.replace(/^\/+/, "")}`;
}

// Optional: Google Apps Script web app URL for “Add your service” form (POST, form-urlencoded).
// Set VITE_KITF_SUBMIT_URL in .env locally and as a GitHub Actions secret for Pages builds.
export const KITF_SUBMIT_URL = normalizeKitfSubmitUrl(import.meta.env.VITE_KITF_SUBMIT_URL);

// Optional shared secret checked by Apps Script (same value in script + VITE_KITF_SUBMIT_SECRET).
export const KITF_SUBMIT_SECRET = import.meta.env.VITE_KITF_SUBMIT_SECRET ?? "";

// Legacy networking sheet (no longer used on Keep It In The Family page; kept for reference / tooling)
// Columns: name, company, sectors, business_interests, phone, email, area, website
export const NETWORKING_SHEET_ID =
  import.meta.env.VITE_NETWORKING_SHEET_ID || "1z37lsb3N9VAqIxgRMdPYrqVOm61bt6KltjJpsD_FIrw";

// PAYMENT LINKS: Yoco, PayFast, or custom URLs
export const DONATION_LINK = import.meta.env.VITE_DONATION_LINK || "#";
