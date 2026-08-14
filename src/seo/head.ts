import pagesManifest from "./pages.json" with { type: "json" };
import { buildStaticHtmlForPath } from "./pageContent.ts";
import {
  CONTACT_EMAIL,
  OG_IMAGE_URL,
  ROBOTS_META,
  SITE_AREA_SERVED,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  SOCIAL_PROFILES,
  THEME_COLOR,
} from "./site.ts";

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  schemaType?: string;
};

export type PageDef = PageMeta & {
  staticHtml: string;
};

export const PAGE_DEFINITIONS: PageDef[] = pagesManifest.routes.map((route) => ({
  ...route,
  staticHtml: buildStaticHtmlForPath(route.path),
}));

const VALID_WEBPAGE_TYPES = new Set([
  "WebPage",
  "AboutPage",
  "CollectionPage",
  "ContactPage",
]);

export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function canonicalUrl(path: string): string {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.replace(/\/$/, "")}/`;
}

export function sitemapUrl(path: string): string {
  return canonicalUrl(path);
}

export function getPageDef(pathname: string): PageDef {
  const normalized = normalizePath(pathname);
  return PAGE_DEFINITIONS.find((page) => page.path === normalized) ?? PAGE_DEFINITIONS[0];
}

function webpageSchemaType(schemaType?: string): string {
  if (schemaType && VALID_WEBPAGE_TYPES.has(schemaType)) return schemaType;
  return "WebPage";
}

export function buildJsonLd(page: PageMeta): object {
  const url = canonicalUrl(page.path);
  const organization = {
    "@type": "NonprofitOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: OG_IMAGE_URL,
    description: SITE_TAGLINE,
    email: CONTACT_EMAIL,
    areaServed: SITE_AREA_SERVED,
    sameAs: [...SOCIAL_PROFILES],
  };

  const webpage: Record<string, unknown> = {
    "@type": webpageSchemaType(page.schemaType),
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-ZA",
  };

  if (page.path === "/donate") {
    webpage.potentialAction = {
      "@type": "DonateAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `mailto:${CONTACT_EMAIL}`,
      },
      recipient: { "@id": `${SITE_URL}/#organization` },
    };
  }

  const graph: object[] = [
    organization,
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: page.description,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-ZA",
    },
    webpage,
  ];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildHeadBlock(page: PageDef): string {
  const url = canonicalUrl(page.path);
  const jsonLd = JSON.stringify(buildJsonLd(page), null, 2).replace(/</g, "\\u003c");

  return [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<meta name="robots" content="${ROBOTS_META}" />`,
    `<meta name="theme-color" content="${THEME_COLOR}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:image" content="${OG_IMAGE_URL}" />`,
    `<meta property="og:locale" content="en_ZA" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE_URL}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join("\n    ");
}

export function buildRootMarkup(page: PageDef): string {
  return page.staticHtml;
}

export function renderPrerenderedHtml(template: string, page: PageDef): string {
  const headBlock = buildHeadBlock(page);
  let html = template;

  html = html.replace(
    /<title>[\s\S]*?<\/title>\s*<meta name="description"[\s\S]*?<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    headBlock,
  );

  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${buildRootMarkup(page)}</div>`,
  );

  html = html.replace(/<noscript>[\s\S]*?<\/noscript>\s*/i, "");

  return html;
}

export function routeToDistRelativePath(path: string): string {
  if (path === "/") return "index.html";
  return `${path.replace(/^\//, "")}/index.html`;
}

export function sitemapLocToDistRelativePath(loc: string): string {
  const url = new URL(loc);
  const pathname = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  if (pathname === "/") return "index.html";
  return `${pathname.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
}
