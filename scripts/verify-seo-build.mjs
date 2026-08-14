#!/usr/bin/env node
/**
 * Post-build checks for SEO artifacts in dist/.
 * Run via: node scripts/verify-seo-build.mjs
 */
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const siteUrl = "https://www.tuckerfamilycharity.co.za";
const errors = [];

function read(file) {
  const p = path.join(dist, file);
  if (!fs.existsSync(p)) {
    errors.push(`Missing file: dist/${file}`);
    return null;
  }
  return fs.readFileSync(p, "utf8");
}

const robots = read("robots.txt");
if (robots) {
  for (const line of ["User-agent: OAI-SearchBot", "User-agent: ChatGPT-User", "User-agent: GPTBot", "Sitemap:"]) {
    if (!robots.includes(line)) errors.push(`robots.txt missing: ${line}`);
  }
  if (!robots.includes("Disallow: /") || !robots.includes("User-agent: GPTBot")) {
    errors.push("robots.txt should disallow GPTBot");
  }
}

const sitemap = read("sitemap.xml");
if (sitemap) {
  const urlCount = (sitemap.match(/<loc>/g) || []).length;
  if (urlCount !== 15) errors.push(`sitemap.xml expected 15 URLs, found ${urlCount}`);
  if (!sitemap.startsWith("<?xml")) errors.push("sitemap.xml invalid XML header");
}

read("llms.txt");
read("og-image.png");

const indexHtml = read("index.html");
if (indexHtml) {
  for (const needle of [
    'name="robots"',
    'rel="canonical"',
    'property="og:title"',
    'name="twitter:card"',
    "application/ld+json",
    "NonprofitOrganization",
    "<noscript>",
  ]) {
    if (!indexHtml.includes(needle)) errors.push(`index.html missing: ${needle}`);
  }
  if (indexHtml.includes("noindex")) errors.push("index.html contains noindex");
}

const html404 = read("404.html");
if (html404 && !html404.includes("application/ld+json")) {
  errors.push("404.html should include default JSON-LD (copied from index.html)");
}

if (errors.length) {
  console.error("SEO build verification failed:\n");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log("SEO build verification passed.");
console.log(`  Site URL: ${siteUrl}`);
console.log("  Verified: robots.txt, sitemap.xml, llms.txt, og-image.png, index.html metadata");
