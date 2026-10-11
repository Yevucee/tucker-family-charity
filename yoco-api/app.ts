/**
 * Express app for the Yoco checkout API (deployed on Railway; site stays on GitHub Pages).
 *
 *   GET  /health                → liveness check
 *   GET  /api/payment-catalog   → donation presets + products from the Google Sheet (cached ~5 min)
 *   POST /api/create-checkout   → creates a Yoco checkout, returns { redirectUrl }
 *   POST /api/yoco-webhook      → Yoco payment events (signature-verified)
 *
 * All secrets come from Railway service variables — never VITE_*, never committed.
 */

import crypto from "node:crypto";
import express, { type NextFunction, type Request, type Response } from "express";
import { createCatalogLoader, toPublicCatalog } from "../api/lib/paymentCatalog.ts";
import { CheckoutRequestError, buildCheckoutPlan } from "../api/lib/checkoutPlans.ts";
import { createYocoCheckout, verifyYocoWebhook, yocoKeyMode } from "../api/lib/yoco.ts";
import { handleYocoEvent, type YocoWebhookEvent } from "../api/lib/webhookEvents.ts";

export interface AppConfig {
  yocoSecretKey: string;
  yocoWebhookSecret: string;
  publicSiteUrl: string;
  sheetId: string;
  sheetTab: string;
  settingsTab: string;
  wineNotifyUrl: string;
  wineNotifySecret: string;
  /** Extra CORS origins (comma-separated env), e.g. a preview build. */
  extraOrigins: string[];
}

export function configFromEnv(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    yocoSecretKey: (env.YOCO_SECRET_KEY ?? "").trim(),
    yocoWebhookSecret: (env.YOCO_WEBHOOK_SECRET ?? "").trim(),
    publicSiteUrl: (env.PUBLIC_SITE_URL ?? "https://www.tuckerfamilycharity.co.za").trim().replace(/\/+$/, ""),
    sheetId: (env.PAYMENT_CATALOG_SHEET_ID ?? "").trim(),
    sheetTab: (env.PAYMENT_CATALOG_SHEET_TAB ?? "Catalog").trim() || "Catalog",
    settingsTab: (env.PAYMENT_CATALOG_SHEET_SETTINGS_TAB ?? "DonationSettings").trim() || "DonationSettings",
    wineNotifyUrl: (env.WINE_ORDER_NOTIFY_URL ?? "").trim(),
    wineNotifySecret: (env.WINE_ORDER_NOTIFY_SECRET ?? "").trim(),
    extraOrigins: (env.CORS_EXTRA_ORIGINS ?? "")
      .split(",")
      .map((o) => o.trim().replace(/\/+$/, ""))
      .filter(Boolean),
  };
}

export interface AppDeps {
  fetchImpl?: typeof fetch;
  log?: (msg: string) => void;
  catalogFallbackPath?: string;
}

function allowedOrigins(config: AppConfig): Set<string> {
  const origins = new Set<string>([config.publicSiteUrl, ...config.extraOrigins]);
  // www + apex both work for the live site
  try {
    const u = new URL(config.publicSiteUrl);
    const alt = u.hostname.startsWith("www.") ? u.hostname.slice(4) : `www.${u.hostname}`;
    origins.add(`${u.protocol}//${alt}`);
  } catch {
    /* ignore */
  }
  return origins;
}

function isLocalOrigin(origin: string): boolean {
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

export function createApp(config: AppConfig, deps: AppDeps = {}) {
  const { fetchImpl = fetch, log = (m: string) => console.log(m) } = deps;
  const catalogLoader = createCatalogLoader({
    sheetId: config.sheetId,
    catalogTab: config.sheetTab,
    settingsTab: config.settingsTab,
    fetchImpl,
    log,
    ...(deps.catalogFallbackPath ? { fallbackPath: deps.catalogFallbackPath } : {}),
  });
  const origins = allowedOrigins(config);
  const keyMode = yocoKeyMode(config.yocoSecretKey);
  const seenWebhookIds = new Set<string>();

  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", true);

  // CORS — only the charity site (and localhost for dev) may call the API from a browser.
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin && (origins.has(origin) || isLocalOrigin(origin))) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Max-Age", "600");
    }
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  });

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "tucker-yoco-checkout" });
  });

  app.get("/api/payment-catalog", async (_req, res) => {
    try {
      const catalog = await catalogLoader.get();
      res.setHeader("Cache-Control", "public, max-age=60");
      res.json(toPublicCatalog(catalog));
    } catch (err) {
      log(`[payment-catalog] ${String(err)}`);
      res.status(503).json({ error: "Payment catalog unavailable" });
    }
  });

  // Simple per-IP throttle for checkout creation (protects against scripted abuse).
  const hits = new Map<string, { count: number; resetAt: number }>();
  function rateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || entry.resetAt < now) {
      hits.set(ip, { count: 1, resetAt: now + 60_000 });
      if (hits.size > 5000) hits.clear();
      return false;
    }
    entry.count += 1;
    return entry.count > 20;
  }

  app.post("/api/create-checkout", express.json({ limit: "20kb" }), async (req, res) => {
    if (keyMode === "invalid") {
      res.status(503).json({ error: "Online payments are not configured yet." });
      return;
    }
    if (rateLimited(req.ip ?? "unknown")) {
      res.status(429).json({ error: "Too many attempts — please wait a minute and try again." });
      return;
    }
    try {
      const catalog = await catalogLoader.get();
      const plan = buildCheckoutPlan(catalog, req.body);
      const checkout = await createYocoCheckout({
        secretKey: config.yocoSecretKey,
        plan,
        siteUrl: config.publicSiteUrl,
        idempotencyKey: crypto.randomUUID(),
        fetchImpl,
      });
      log(`[create-checkout] ${plan.type} ${plan.amountCents}c → ${checkout.id} (${checkout.processingMode ?? keyMode})`);
      res.json({ redirectUrl: checkout.redirectUrl, checkoutId: checkout.id });
    } catch (err) {
      if (err instanceof CheckoutRequestError) {
        res.status(err.status).json({ error: err.message });
        return;
      }
      log(`[create-checkout] ${String(err)}`);
      res.status(502).json({ error: "We could not start the payment. Please try again shortly." });
    }
  });

  // Raw body is required — the signature covers the exact bytes Yoco sent.
  app.post("/api/yoco-webhook", express.raw({ type: "*/*", limit: "256kb" }), async (req, res) => {
    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from("");
    const verdict = verifyYocoWebhook({
      secret: config.yocoWebhookSecret,
      rawBody,
      headers: req.headers,
    });
    if (!verdict.ok) {
      log(`[yoco-webhook] rejected: ${verdict.reason}`);
      res.status(verdict.reason.includes("not configured") ? 503 : 401).json({ error: "invalid webhook" });
      return;
    }

    const webhookId = String(req.headers["webhook-id"] ?? "");
    if (seenWebhookIds.has(webhookId)) {
      res.json({ ok: true, duplicate: true });
      return;
    }

    let event: YocoWebhookEvent;
    try {
      event = JSON.parse(rawBody.toString("utf8")) as YocoWebhookEvent;
    } catch {
      res.status(400).json({ error: "invalid JSON" });
      return;
    }

    seenWebhookIds.add(webhookId);
    if (seenWebhookIds.size > 2000) seenWebhookIds.clear();

    // Respond fast (Yoco wants 2xx within 15s); fulfilment runs after.
    res.json({ ok: true });
    handleYocoEvent(event, {
      wineNotifyUrl: config.wineNotifyUrl,
      wineNotifySecret: config.wineNotifySecret,
      fetchImpl,
      log,
    }).catch((err: unknown) => log(`[yoco-webhook] handler error: ${String(err)}`));
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return { app, keyMode };
}
