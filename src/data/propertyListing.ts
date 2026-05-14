/**
 * Property Partnerships listings — shape matches public/data/properties.json for CMS migration.
 */

export type PropertyListingType = "rent" | "sale";

export interface PropertyListing {
  id: string;
  title: string;
  type: PropertyListingType;
  suburb: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  /** e.g. "2 covered bays" — omit if unknown */
  parking?: string;
  /** Absolute https URL or site-relative path under public/ (see resolvePropertyImageUrl) */
  image: string;
  description: string;
  originalListingUrl: string;
  agentEmail: string;
  /** Optional bullet points for the card (e.g. pool, study) */
  features?: string[];
  /** When set, shown instead of "X bed · Y bath" (e.g. commercial floor area). */
  listingSummary?: string;
  /** Charity-managed direct let — different copy from Pam Golding partnership listings. */
  directFromCharity?: boolean;
}

export function resolvePropertyImageUrl(image: string): string {
  const t = image.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${t.replace(/^\//, "")}`;
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function isValidListing(x: unknown): x is PropertyListing {
  if (!isRecord(x)) return false;
  const type = x.type;
  if (type !== "rent" && type !== "sale") return false;
  if (typeof x.id !== "string" || !x.id.trim()) return false;
  if (typeof x.title !== "string" || !x.title.trim()) return false;
  if (typeof x.suburb !== "string" || !x.suburb.trim()) return false;
  if (typeof x.price !== "string" || !x.price.trim()) return false;
  if (typeof x.image !== "string" || !x.image.trim()) return false;
  if (typeof x.description !== "string") return false;
  if (typeof x.originalListingUrl !== "string") return false;
  if (typeof x.agentEmail !== "string" || !x.agentEmail.includes("@")) return false;
  if (typeof x.bedrooms !== "number" || !Number.isFinite(x.bedrooms)) return false;
  if (typeof x.bathrooms !== "number" || !Number.isFinite(x.bathrooms)) return false;
  if (x.parking !== undefined && typeof x.parking !== "string") return false;
  if (x.listingSummary !== undefined && typeof x.listingSummary !== "string") return false;
  if (x.directFromCharity !== undefined && typeof x.directFromCharity !== "boolean") return false;
  if (x.features !== undefined) {
    if (!Array.isArray(x.features)) return false;
    if (!x.features.every((f) => typeof f === "string")) return false;
  }
  return true;
}

/** Filters out invalid rows silently (production); use dev logging elsewhere if needed. */
export function parsePropertyListings(raw: unknown): PropertyListing[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isValidListing);
}
