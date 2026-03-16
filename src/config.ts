/**
 * Instagram feed embed.
 * Elfsight (script+div): use VITE_INSTAGRAM_ELFSIGHT_APP_ID
 * Other (iframe): use VITE_INSTAGRAM_WIDGET_URL
 * For GitHub Pages: add matching repo secrets.
 */
export const INSTAGRAM_ELFSIGHT_APP_ID =
  import.meta.env.VITE_INSTAGRAM_ELFSIGHT_APP_ID || "e05226db-b1eb-4e28-a8a8-95389431627a";
export const INSTAGRAM_WIDGET_URL = import.meta.env.VITE_INSTAGRAM_WIDGET_URL ?? "";

// GOOGLE SHEETS: Keep It In The Family directory
// Sheet must be shared as "Anyone with the link can view"
// Override with VITE_DIRECTORY_SHEET_ID env var if needed
export const DIRECTORY_SHEET_ID =
  import.meta.env.VITE_DIRECTORY_SHEET_ID || "1tC3IcX81_tdA2_UHTjT2JEIG-i9hr_ovgCQS5fJV7tw";

// PAYMENT LINKS: Yoco, PayFast, or custom URLs
export const DONATION_LINK = import.meta.env.VITE_DONATION_LINK || "#";
