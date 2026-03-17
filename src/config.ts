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
// Columns: name, profession, area, phone, trusted_by, notes, website
// Override with VITE_DIRECTORY_SHEET_ID (or VITE_SERVICES_SHEET_ID) env var
export const DIRECTORY_SHEET_ID =
  import.meta.env.VITE_DIRECTORY_SHEET_ID ||
  import.meta.env.VITE_SERVICES_SHEET_ID ||
  "1tC3IcX81_tdA2_UHTjT2JEIG-i9hr_ovgCQS5fJV7tw";

// NETWORKING tab: business networking directory (runtime fetch, updates on refresh)
// Columns: name, company, sectors, business_interests, phone, email, area, website
// Override with VITE_NETWORKING_SHEET_ID env var
export const NETWORKING_SHEET_ID =
  import.meta.env.VITE_NETWORKING_SHEET_ID || "1z37lsb3N9VAqIxgRMdPYrqVOm61bt6KltjJpsD_FIrw";

// PAYMENT LINKS: Yoco, PayFast, or custom URLs
export const DONATION_LINK = import.meta.env.VITE_DONATION_LINK || "#";
