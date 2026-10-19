#!/usr/bin/env node
/**
 * Generates prerendered HTML files for every indexable route (plus noindex Yoco return pages)
 * and refreshes sitemap.xml.
 * Requires dist/index.html from vite build.
 */
import fs from "node:fs";
import path from "node:path";
import {
  PAGE_DEFINITIONS,
  renderPrerenderedHtml,
  routeToDistRelativePath,
  sitemapUrl,
} from "../src/seo/head.ts";
import { CHECKOUT_LANDING_PAGES } from "../src/seo/checkoutLandingPages.ts";

const dist = path.resolve("dist");
const viteTemplate = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const lastmod = new Date().toISOString().slice(0, 10);

// Indexable routes + noindex Yoco return pages (the latter are never listed in the sitemap).
for (const page of [...PAGE_DEFINITIONS, ...CHECKOUT_LANDING_PAGES]) {
  const html = renderPrerenderedHtml(viteTemplate, page);
  const relative = routeToDistRelativePath(page.path);
  const outPath = path.join(dist, relative);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
}

const sitemapEntries = PAGE_DEFINITIONS.map(
  (page) => `  <url>\n    <loc>${sitemapUrl(page.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap, "utf8");
fs.writeFileSync(path.join(process.cwd(), "public/sitemap.xml"), sitemap, "utf8");

fs.copyFileSync(path.join(dist, "index.html"), path.join(dist, "404.html"));

console.log(
  `Prerendered ${PAGE_DEFINITIONS.length} routes + ${CHECKOUT_LANDING_PAGES.length} checkout return pages into dist/`,
);
console.log(`Updated dist/sitemap.xml and public/sitemap.xml`);
