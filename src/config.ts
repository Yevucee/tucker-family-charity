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
/** Normalizes Google Apps Script web app deploy URLs (shared by KITF and property enquiry POST). */
export function normalizeGasWebAppUrl(raw: string): string {
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
export const KITF_SUBMIT_URL = normalizeGasWebAppUrl(RAW_KITF_SUBMIT_URL);

/** Env was set but is not a valid URL (common mistake: putting the shared secret in the URL secret). */
export const KITF_SUBMIT_URL_REJECTED =
  RAW_KITF_SUBMIT_URL.length > 0 && KITF_SUBMIT_URL.length === 0;

// Optional shared secret checked by Apps Script (same value in script + VITE_KITF_SUBMIT_SECRET).
export const KITF_SUBMIT_SECRET = import.meta.env.VITE_KITF_SUBMIT_SECRET ?? "";

/** "Learning from the best" resource library — Website tab via opensheet.elk.sh */
export const KITF_LIBRARY_SHEET_ID =
  import.meta.env.VITE_KITF_LIBRARY_SHEET_ID || "1AqkA2uCcaASDimT8N7O8rndYzPRmE_kFPC5uDkiRFCI";

export const KITF_LIBRARY_SHEET_TAB = "Website";

// Legacy networking sheet (no longer used on Keep It In The Family page; kept for reference / tooling)
// Columns: name, company, sectors, business_interests, phone, email, area, website
export const NETWORKING_SHEET_ID =
  import.meta.env.VITE_NETWORKING_SHEET_ID || "1z37lsb3N9VAqIxgRMdPYrqVOm61bt6KltjJpsD_FIrw";

/**
 * Hosted donation / payment URL (Yoco, PayFast, etc.).
 * Set VITE_DONATION_LINK in .env or GitHub Actions secret for production.
 */
export const DONATION_LINK = import.meta.env.VITE_DONATION_LINK || "#";

/**
 * Volunteer sign-up (e.g. Google Form). When empty, Support Us page falls back to email.
 * TODO: set VITE_VOLUNTEER_SIGNUP_URL when the form URL is ready.
 */
export const VOLUNTEER_SIGNUP_URL = String(import.meta.env.VITE_VOLUNTEER_SIGNUP_URL ?? "").trim();

/**
 * PROPERTY PARTNERSHIPS — enquiry form POST to Google Apps Script (same pattern as VITE_KITF_SUBMIT_URL).
 * Deploy script as Web App; set VITE_PROPERTY_ENQUIRY_SUBMIT_URL in .env / GitHub Actions.
 *
 * Expected POST: application/x-www-form-urlencoded body with field `json` (stringified object):
 *   timestamp (ISO), propertyId, propertyTitle, propertyType, suburb, visitorName, visitorEmail,
 *   visitorPhone, contactMethod, message, agentEmail, originalListingUrl, status ("new"), notes ("")
 * Apps Script appends a Sheet row (+ **Owner**: Pam Golding vs TFC from server-side property id whitelist) and emails the route’s recipient list.
 *
 * Optional: VITE_PROPERTY_ENQUIRY_SECRET — include in payload as `secret` if script validates it.
 */
const RAW_PROPERTY_ENQUIRY_SUBMIT_URL = String(
  import.meta.env.VITE_PROPERTY_ENQUIRY_SUBMIT_URL ?? ""
).trim();

export const PROPERTY_ENQUIRY_SUBMIT_URL = normalizeGasWebAppUrl(RAW_PROPERTY_ENQUIRY_SUBMIT_URL);

export const PROPERTY_ENQUIRY_SUBMIT_URL_REJECTED =
  RAW_PROPERTY_ENQUIRY_SUBMIT_URL.length > 0 && PROPERTY_ENQUIRY_SUBMIT_URL.length === 0;

export const PROPERTY_ENQUIRY_SECRET = import.meta.env.VITE_PROPERTY_ENQUIRY_SECRET ?? "";

/**
 * WINE SHOP — order enquiry POST to Google Apps Script (same pattern as property enquiry).
 * Deploy scripts/wine-order-submit.gs as Web App; set VITE_WINE_ORDER_SUBMIT_URL in .env / GitHub Actions.
 *
 * Expected POST: application/x-www-form-urlencoded with field `json` (stringified WineOrderPayload).
 * Includes deliveryZone (`johannesburg` | `elsewhere_sa`) — server applies R50 / R200 delivery fees.
 * Apps Script emails Bret (WINE_ORDER_RECIPIENT_EMAIL), logs optional Sheet row, recalculates totals server-side.
 *
 * Optional: VITE_WINE_ORDER_SECRET — include in payload as `secret` if script validates it.
 */
const RAW_WINE_ORDER_SUBMIT_URL = String(import.meta.env.VITE_WINE_ORDER_SUBMIT_URL ?? "").trim();

export const WINE_ORDER_SUBMIT_URL = normalizeGasWebAppUrl(RAW_WINE_ORDER_SUBMIT_URL);

export const WINE_ORDER_SUBMIT_URL_REJECTED =
  RAW_WINE_ORDER_SUBMIT_URL.length > 0 && WINE_ORDER_SUBMIT_URL.length === 0;

export const WINE_ORDER_SECRET = import.meta.env.VITE_WINE_ORDER_SECRET ?? "";
