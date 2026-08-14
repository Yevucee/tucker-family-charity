#!/usr/bin/env node
/**
 * Pre-publication QA for prerendered SEO routes.
 * Tests raw HTML (no JS) and rendered DOM (with JS) for all sitemap URLs.
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const dist = path.resolve("dist");
const host = "127.0.0.1";
const port = 9878;
const baseUrl = `http://${host}:${port}`;

function parseSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function locToDistPath(loc) {
  const url = new URL(loc);
  const pathname = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  if (pathname === "/") return "index.html";
  return `${pathname.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
}

function extract(html, re) {
  return html.match(re)?.[1] ?? null;
}

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractH1(html) {
  return extract(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)?.replace(/<[^>]+>/g, "").trim() ?? null;
}

function normalizeInternalPath(href) {
  if (!href || !href.startsWith("/") || href.startsWith("//")) return null;
  const pathPart = href.split("#")[0].split("?")[0];
  if (pathPart === "/") return "/";
  return pathPart.endsWith("/") ? pathPart : `${pathPart}/`;
}

function isPageLikeInternalHref(href) {
  const pathPart = href.split("#")[0].split("?")[0];
  if (pathPart === "/") return true;
  const lastSegment = pathPart.split("/").filter(Boolean).pop() ?? "";
  return !lastSegment.includes(".");
}

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Server did not start at ${url}`);
}

const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
const locs = parseSitemapLocs(sitemap);
const validPathnames = new Set(locs.map((loc) => new URL(loc).pathname));

const server = spawn("npx", ["--yes", "serve", "-l", String(port), dist], {
  stdio: "ignore",
});

const results = [];

let directWorkOpportunitiesStatus = null;
let rawWorkOpportunitiesLinks = [];

try {
  await waitForServer(`${baseUrl}/`);

  for (const loc of locs) {
    const url = new URL(loc);
    const pathname = url.pathname;
    const distPath = locToDistPath(loc);
    const rawPath = path.join(dist, distPath);
    const row = {
      route: pathname,
      productionUrl: loc,
      distFile: distPath,
      httpStatus: null,
      uses404Shell: null,
      rawTitle: null,
      rawCanonical: null,
      rawH1: null,
      renderedH1: null,
      consoleErrors: [],
      warnings: [],
      pass: true,
    };

    // Raw HTML checks (simulates JS disabled — file content + HTTP)
    const rawHtml = fs.readFileSync(rawPath, "utf8");
    row.rawTitle = extract(rawHtml, /<title>([^<]*)<\/title>/);
    row.rawCanonical = extract(rawHtml, /<link rel="canonical" href="([^"]*)"/);
    row.rawH1 = extractH1(rawHtml);
    row.uses404Shell = distPath !== "404.html" && rawHtml.includes('id="static-prerender"') === false;

    const res = await fetch(`${baseUrl}${pathname}`);
    row.httpStatus = res.status;
    if (row.httpStatus !== 200) {
      row.pass = false;
      row.warnings.push(`HTTP ${row.httpStatus}`);
    }

    if (row.rawCanonical !== loc) {
      row.pass = false;
      row.warnings.push(`canonical mismatch: ${row.rawCanonical}`);
    }

    if (!row.rawTitle || !extract(rawHtml, /<meta name="description" content="([^"]*)"/)) {
      row.pass = false;
      row.warnings.push("missing title or description in raw HTML");
    }

    if (!extract(rawHtml, /<meta property="og:url" content="([^"]*)"/)) {
      row.pass = false;
      row.warnings.push("missing og:url");
    }

    if (!extract(rawHtml, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/)) {
      row.pass = false;
      row.warnings.push("missing JSON-LD");
    }

    const rawText = stripTags(rawHtml);
    if (rawText.length < 120) {
      row.pass = false;
      row.warnings.push("raw HTML text too short");
    }

    results.push(row);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ javaScriptEnabled: true });
  const page = await context.newPage();

  for (const row of results) {
    const errors = [];
    const failedResponses = [];
    page.removeAllListeners("console");
    page.removeAllListeners("response");
    page.on("response", (res) => {
      const url = res.url();
      if (!url.startsWith(baseUrl) && res.status() >= 400) {
        failedResponses.push(`${res.status()} ${url}`);
      }
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (text.includes("Failed to load resource")) return;
        errors.push(text);
      }
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(`${baseUrl}${row.route}`, { waitUntil: "networkidle" });
    row.renderedH1 = await page.locator("#main-content h1").first().textContent().then((t) => t?.trim() ?? null);
    row.consoleErrors = [...new Set(errors)];

    if (row.consoleErrors.length) {
      row.pass = false;
      row.warnings.push(`console errors: ${row.consoleErrors.join("; ")}`);
    }

    if (failedResponses.length) {
      row.warnings.push(`external failed resources: ${failedResponses.slice(0, 3).join("; ")}`);
    }

    if (row.rawH1 && row.renderedH1) {
      const norm = (s) => s.replace(/\s+/g, " ").trim();
      if (norm(row.rawH1) !== norm(row.renderedH1)) {
        row.warnings.push(`H1 differs raw vs rendered: "${row.rawH1}" vs "${row.renderedH1}"`);
      }
    }

    if (!row.renderedH1) {
      row.pass = false;
      row.warnings.push("rendered page missing #main-content h1");
    }

    const renderedHrefs = await page.locator('a[href^="/"]').evaluateAll((anchors) =>
      anchors.map((a) => a.getAttribute("href")).filter(Boolean),
    );
    row.renderedInternalLinks = [...new Set(renderedHrefs)];

    for (const href of row.renderedInternalLinks) {
      if (!isPageLikeInternalHref(href)) continue;

      const pathname = normalizeInternalPath(href);
      if (!pathname) continue;

      if (pathname === "/work-opportunities/") {
        row.pass = false;
        row.warnings.push(`rendered internal link targets /work-opportunities/: ${href}`);
        continue;
      }

      if (!validPathnames.has(pathname)) {
        row.pass = false;
        row.warnings.push(`rendered internal link has no static route: ${href}`);
        continue;
      }

      const linkStatus = (await fetch(`${baseUrl}${pathname}`)).status;
      if (linkStatus !== 200) {
        row.pass = false;
        row.warnings.push(`rendered internal link ${href} returned HTTP ${linkStatus}`);
      }
    }

    const prerenderStillVisible = await page.locator("#static-prerender").count();
    if (prerenderStillVisible > 0) {
      row.warnings.push("static-prerender still in DOM after JS (createRoot should replace #root)");
    }
  }

  await browser.close();

  directWorkOpportunitiesStatus = (await fetch(`${baseUrl}/work-opportunities/`)).status;
  rawWorkOpportunitiesLinks = results.flatMap((row) => {
    const rawHtml = fs.readFileSync(path.join(dist, row.distFile), "utf8");
    return [...rawHtml.matchAll(/\shref="(\/[^"]*)"/g)].map((m) => m[1]);
  }).filter((href) => normalizeInternalPath(href) === "/work-opportunities/");
} finally {
  server.kill("SIGTERM");
}

const linkAudit = {
  directWorkOpportunitiesStatus,
  rawLinksToWorkOpportunitiesIndex: rawWorkOpportunitiesLinks,
  renderedLinksToWorkOpportunitiesIndex: results.flatMap((row) =>
    (row.renderedInternalLinks ?? []).filter((href) => normalizeInternalPath(href) === "/work-opportunities/"),
  ),
};

const reportPath = path.join(process.cwd(), "scripts/qa-seo-report.json");
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

const failed = results.filter((r) => !r.pass);
const warned = results.filter((r) => r.warnings.length);

console.log(
  JSON.stringify(
    {
      summary: { total: results.length, failed: failed.length, warned: warned.length },
      linkAudit,
      results,
    },
    null,
    2,
  ),
);
process.exit(failed.length ? 1 : 0);
