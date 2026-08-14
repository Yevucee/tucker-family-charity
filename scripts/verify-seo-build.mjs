#!/usr/bin/env node
/**
 * Post-build SEO validation for prerendered static routes.
 */
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const siteUrl = "https://www.tuckerfamilycharity.co.za";
const errors = [];
const warnings = [];

function readDist(relativePath) {
  const full = path.join(dist, relativePath);
  if (!fs.existsSync(full)) {
    errors.push(`Missing file: dist/${relativePath}`);
    return null;
  }
  return fs.readFileSync(full, "utf8");
}

function extractTag(html, pattern) {
  const match = html.match(pattern);
  return match?.[1]?.trim() ?? null;
}

function parseSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function locToDistPath(loc) {
  const url = new URL(loc);
  const pathname = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  if (pathname === "/") return "index.html";
  return `${pathname.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function rootHasStaticContent(html) {
  const rootMatch = html.match(/<div id="root">([\s\S]*?)<\/div>/);
  if (!rootMatch) return false;
  const rootInner = rootMatch[1];
  if (!rootInner.includes('id="static-prerender"')) return false;
  const text = stripTags(rootInner);
  return text.length >= 80;
}

// --- robots.txt ---
const robots = readDist("robots.txt");
if (robots) {
  const requiredSearchBots = [
    "User-agent: OAI-SearchBot",
    "User-agent: Claude-SearchBot",
    "User-agent: PerplexityBot",
    "User-agent: Googlebot",
    "User-agent: bingbot",
  ];
  for (const token of requiredSearchBots) {
    if (!robots.includes(token)) errors.push(`robots.txt missing search crawler block: ${token}`);
  }
  if (!robots.includes("User-agent: GPTBot") || !robots.match(/User-agent: GPTBot[\s\S]*?Disallow: \//)) {
    errors.push("robots.txt must disallow GPTBot");
  }
  if (!robots.includes("Sitemap:")) errors.push("robots.txt missing Sitemap directive");
}

readDist("llms.txt");
readDist("og-image.png");

// --- sitemap + prerendered HTML ---
const sitemap = readDist("sitemap.xml");
if (sitemap) {
  const locs = parseSitemapLocs(sitemap);
  if (locs.length !== 15) errors.push(`sitemap.xml expected 15 URLs, found ${locs.length}`);

  for (const loc of locs) {
    const relative = locToDistPath(loc);
    const html = readDist(relative);
    if (!html) continue;

    const title = extractTag(html, /<title>([^<]*)<\/title>/);
    const description = extractTag(html, /<meta name="description" content="([^"]*)"/);
    const canonical = extractTag(html, /<link rel="canonical" href="([^"]*)"/);
    const ogTitle = extractTag(html, /<meta property="og:title" content="([^"]*)"/);
    const ogUrl = extractTag(html, /<meta property="og:url" content="([^"]*)"/);
    const robotsMeta = extractTag(html, /<meta name="robots" content="([^"]*)"/);

    if (!title) errors.push(`${relative}: missing <title>`);
    if (!description) errors.push(`${relative}: missing meta description`);
    if (!canonical) errors.push(`${relative}: missing canonical link`);
    if (!ogTitle) errors.push(`${relative}: missing og:title`);
    if (!ogUrl) errors.push(`${relative}: missing og:url`);
    if (robotsMeta?.includes("noindex")) errors.push(`${relative}: contains noindex`);

    if (canonical !== loc) {
      errors.push(`${relative}: canonical "${canonical}" does not match sitemap URL "${loc}"`);
    }
    if (ogUrl && ogUrl !== loc) {
      errors.push(`${relative}: og:url "${ogUrl}" does not match sitemap URL "${loc}"`);
    }

    if (!rootHasStaticContent(html)) {
      errors.push(`${relative}: #root lacks meaningful prerendered static content`);
    }

    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!jsonLdMatch) {
      errors.push(`${relative}: missing JSON-LD`);
    } else {
      try {
        const parsed = JSON.parse(jsonLdMatch[1]);
        const graph = parsed["@graph"];
        if (!Array.isArray(graph)) errors.push(`${relative}: JSON-LD missing @graph array`);
        const webpage = graph?.find((node) => String(node["@type"] || "").includes("Page"));
        if (webpage && webpage.url !== loc) {
          errors.push(`${relative}: JSON-LD webpage.url "${webpage.url}" does not match sitemap URL "${loc}"`);
        }
      } catch (error) {
        errors.push(`${relative}: invalid JSON-LD (${error.message})`);
      }
    }

    if (title && description && title === description) {
      warnings.push(`${relative}: title equals description`);
    }
  }
}

if (warnings.length) {
  console.warn("SEO build warnings:");
  for (const warning of warnings) console.warn(`  - ${warning}`);
}

if (errors.length) {
  console.error("SEO build verification failed:\n");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log("SEO build verification passed.");
console.log(`  Site URL: ${siteUrl}`);
console.log(`  Verified ${parseSitemapLocs(sitemap || "").length} prerendered routes`);
