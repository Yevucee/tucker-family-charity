/**
 * Home “About the Charity” carousel — landscape Oliver's Village photos only.
 * Add files to `src/assets/OV photo_s for Website/` using the exact names below.
 */

import soupKitchenFallback from "@/assets/OV photo_s for Website/Extra photo 4 (Soup Kitchen).jpg";

export interface HomeGallerySlide {
  src: string;
  alt: string;
}

/** Landscape set from OV / soup kitchen batch (portraits OV-123, OV-129, OVMD-193 excluded). */
const HOME_CAROUSEL_FILES: { name: string; alt: string }[] = [
  {
    name: "OV-122.jpg",
    alt: "Volunteer serving children at Oliver's Village soup kitchen",
  },
  {
    name: "OV-144.jpg",
    alt: "Community members walking together at Oliver's Village",
  },
  {
    name: "OV-145.jpg",
    alt: "Conversation at Oliver's Village soup kitchen",
  },
  {
    name: "OVMD-182.jpg",
    alt: "Women receiving meals at Oliver's Village",
  },
  {
    name: "Soup Kitchen 3.jpg",
    alt: "Children dining at Oliver's Village soup kitchen",
  },
  {
    name: "Soup Kitchen 4.jpg",
    alt: "Community queue at Oliver's Village soup kitchen",
  },
];

const assetUrls = import.meta.glob<string>("@/assets/OV photo_s for Website/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function fileNameFromPath(importPath: string): string {
  const parts = importPath.split("/");
  return parts[parts.length - 1] ?? importPath;
}

function resolveHomeCarouselSlides(): HomeGallerySlide[] {
  return HOME_CAROUSEL_FILES.flatMap(({ name, alt }) => {
    const entry = Object.entries(assetUrls).find(([path]) => fileNameFromPath(path) === name);
    if (!entry) return [];
    return [{ src: entry[1], alt }];
  });
}

const resolved = resolveHomeCarouselSlides();

export const homeOliversVillageGallery: HomeGallerySlide[] =
  resolved.length > 0
    ? resolved
    : [
        {
          src: soupKitchenFallback,
          alt: "Soup kitchen and feeding programme at Oliver's Village",
        },
      ];
