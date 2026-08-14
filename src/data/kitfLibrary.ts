/**
 * Keep It In The Family — "Learning from the best" resource library (Website tab).
 */

import { KITF_LIBRARY_SHEET_ID, KITF_LIBRARY_SHEET_TAB } from "@/config";

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

export function normalizeKitfLibraryRow(row: Record<string, unknown>): KitfLibraryResource | null {
  const showOnSite = cell(row, "show_on_site", "Show on site", "show on site");
  if (showOnSite && !isTruthyPublish(showOnSite)) return null;

  const title = cell(row, "title", "Title");
  const link = cell(row, "link", "Link", "url", "URL");
  if (!title && !link) return null;

  return {
    title: title || "Resource",
    type: cell(row, "type", "Type") || "Other",
    topic: cell(row, "topic", "Topic"),
    author: cell(row, "author", "Author"),
    description: cell(row, "description", "Description"),
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

export const kitfLibraryPageCopy = {
  title: "Learning from the Best",
  subtitle: "Keep It In The Family resource library",
  intro:
    "Explore our curated library of podcasts, talks, documentaries, articles, and books on leadership, high performance, and personal growth — hand-picked for anyone chasing a better version of themselves, on the field or off it.",
  searchPlaceholder: "Search by title, author, topic, or type…",
  typeFilterAll: "All formats",
  topicFilterAll: "All topics",
  featuredHeading: "Featured picks",
  resultsEmpty: "No resources match your search. Try different keywords or filters.",
  loading: "Loading library…",
  loadError:
    "We could not load the resource library. Please try again later or contact the charity if the problem persists.",
  openResource: "Open resource",
  backToKitf: "Back to Keep It In The Family",
  showing: (from: number, to: number, total: number) =>
    `Showing ${from}–${to} of ${total} resources`,
};
