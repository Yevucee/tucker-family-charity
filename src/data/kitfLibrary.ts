/**
 * Keep It In The Family — "Learning from the best" resource library (Website tab).
 */

import { KITF_LIBRARY_SHEET_ID, KITF_LIBRARY_SHEET_TAB } from "@/config";
import { kitfLibraryPageCopy as kitfLibraryPageCopyBase } from "./copy/kitfLibraryPageCopy.ts";

export const KITF_LIBRARY_PATH = "/keep-it-in-the-family/library";

export interface KitfLibraryResource {
  title: string;
  type: string;
  topic: string;
  author: string;
  description: string;
  link: string;
  tags: string;
  duration: string;
  featured: boolean;
  sourceTab: string;
}

function cell(row: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const v = row[key];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

function isTruthyPublish(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === "y" || v === "yes" || v === "true" || v === "1";
}

function isFeatured(value: string): boolean {
  return isTruthyPublish(value);
}

/** Decode HTML entities from sheet / Open Graph text (e.g. Spotify summaries). */
export function decodeLibraryText(text: string): string {
  if (!text) return "";
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeKitfLibraryRow(row: Record<string, unknown>): KitfLibraryResource | null {
  const showOnSite = cell(row, "show_on_site", "Show on site", "show on site");
  if (showOnSite && !isTruthyPublish(showOnSite)) return null;

  const title = cell(row, "title", "Title");
  const link = cell(row, "link", "Link", "url", "URL");
  if (!title && !link) return null;

  return {
    title: decodeLibraryText(title) || "Resource",
    type: cell(row, "type", "Type") || "Other",
    topic: decodeLibraryText(cell(row, "topic", "Topic")),
    author: decodeLibraryText(cell(row, "author", "Author")),
    description: decodeLibraryText(cell(row, "description", "Description")),
    link,
    tags: cell(row, "tags", "Tags"),
    duration: cell(row, "duration", "Duration"),
    featured: isFeatured(cell(row, "featured", "Featured")),
    sourceTab: cell(row, "source_tab", "Source tab", "source tab"),
  };
}

export function kitfLibraryOpensheetUrl(
  sheetId: string = KITF_LIBRARY_SHEET_ID,
  tabName: string = KITF_LIBRARY_SHEET_TAB,
): string {
  return `https://opensheet.elk.sh/${encodeURIComponent(sheetId)}/${encodeURIComponent(tabName)}`;
}

export function resourceSearchHaystack(resource: KitfLibraryResource): string {
  return [
    resource.title,
    resource.type,
    resource.topic,
    resource.author,
    resource.description,
    resource.tags,
    resource.sourceTab,
  ]
    .join(" ")
    .toLowerCase();
}

export function sortLibraryResources(resources: KitfLibraryResource[]): KitfLibraryResource[] {
  return [...resources].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  });
}

/** Collapse messy sheet type labels into consistent badges and filters. */
export function normalizeDisplayType(type: string): string {
  const t = type.trim().toLowerCase();
  if (!t) return "Other";
  if (/youtube|you\s*tube|youtuber|^you$/.test(t)) return "YouTube";
  if (/ted/.test(t)) return "TED Talk";
  if (/netflix|netlix/.test(t)) return "Netflix";
  if (/podcast/.test(t)) return "Podcast";
  if (/linkedin|linkdin/.test(t)) return "LinkedIn";
  if (/instagram|facebook|twitter|instragram|social|ig_fb/.test(t)) return "Social";
  if (/book|blinkist|audio\s*book/.test(t)) return "Book";
  if (/article/.test(t)) return "Article";
  if (/wildlife/.test(t)) return "Wildlife";
  if (/motivation/.test(t)) return "Motivation";
  if (/health/.test(t)) return "Health";
  if (/video|goalcast|goldcast|vimeo|dailymotion/.test(t)) return "Video";
  if (/google|talks at google/.test(t)) return "Talk";
  return type.trim().replace(/\s+/g, " ");
}

export function resourceCardDescription(resource: KitfLibraryResource): string {
  const cleaned = decodeLibraryText(resource.description);
  if (cleaned.length >= 20) return cleaned;

  const type = normalizeDisplayType(resource.type);
  const fallbacks: Record<string, string> = {
    Podcast: "Podcast episode — open the link to listen.",
    Netflix: "Documentary or series on Netflix — open the link to watch.",
    YouTube: "Video — open the link to watch.",
    "TED Talk": "TED talk — open the link to watch.",
    Book: "Recommended reading from the library.",
    Article: "Article — open the link to read.",
    LinkedIn: "LinkedIn post or article — open the link to read.",
    Social: "Social post — open the link to view.",
    Video: "Video — open the link to watch.",
  };
  return fallbacks[type] ?? "Curated pick — open the link to explore.";
}

export function resourceHasExternalLink(link: string): boolean {
  return /^https?:\/\//i.test(link.trim());
}

export const kitfLibraryPageCopy = {
  ...kitfLibraryPageCopyBase,
  searchPlaceholder: "Search by title, author, topic, or type…",
  typeFilterAll: "All formats",
  topicFilterAll: "All topics",
  featuredHeading: "Featured picks",
  resultsEmpty: "No resources match your search. Try different keywords or filters.",
  loading: "Loading library…",
  loadError:
    "We could not load the resource library. Please try again later or contact the charity if the problem persists.",
  openResource: "Open resource",
  noLink: "Title-only entry (no link)",
  backToKitf: "Back to Keep It In The Family",
  showing: (from: number, to: number, total: number) =>
    `Showing ${from}–${to} of ${total} resources`,
};
