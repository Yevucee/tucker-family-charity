import type { PageDef } from "./head";
import { getPageDef, canonicalUrl, PAGE_DEFINITIONS, sitemapUrl } from "./head";

export type PageMeta = Pick<PageDef, "path" | "title" | "description" | "schemaType">;

/** Indexable public routes (excludes redirects and catch-all). */
export const INDEXABLE_ROUTES: PageMeta[] = PAGE_DEFINITIONS.map(
  ({ path, title, description, schemaType }) => ({
    path,
    title,
    description,
    schemaType,
  }),
);

export { canonicalUrl, getPageDef, sitemapUrl };

export function getPageMeta(pathname: string): PageMeta {
  const page = getPageDef(pathname);
  return {
    path: page.path,
    title: page.title,
    description: page.description,
    schemaType: page.schemaType,
  };
}
