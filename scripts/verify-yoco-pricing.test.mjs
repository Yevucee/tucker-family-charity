/**
 * Yoco checkout + payment catalog checks — `npm run test:yoco`.
 * No network, no real keys: opensheet, Yoco and the wine Apps Script are mocked.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  createCatalogLoader,
  loadFallbackCatalog,
  parseCatalogRows,
  parseDonationSettings,
  parseWholeRands,
  toPublicCatalog,
} from "../api/lib/paymentCatalog.ts";
import {
  CheckoutRequestError,
  buildCheckoutPlan,
  decodeWineLines,
  encodeWineLines,
} from "../api/lib/checkoutPlans.ts";
import { signYocoWebhook, verifyYocoWebhook, yocoKeyMode } from "../api/lib/yoco.ts";
import { buildWineNotifyPayload } from "../api/lib/webhookEvents.ts";
import { winePriceList, WINE_BOTTLES_PER_CASE } from "../src/data/winePricing.ts";
import { createApp, configFromEnv } from "../yoco-api/app.ts";

const FALLBACK_PATH = path.resolve("public/data/payment-catalog.json");
const SHEET_ID = "1O7gwTQrjQJUbZS2QbXd-k9FmNUoSL1uudK7K2_YXuxg";
const fallbackRaw = JSON.parse(fs.readFileSync(FALLBACK_PATH, "utf8"));

const catalog = () => loadFallbackCatalog(FALLBACK_PATH);

function expectCheckoutError(fn, pattern) {
  assert.throws(fn, (err) => err instanceof CheckoutRequestError && pattern.test(err.message));
}

// ---------------------------------------------------------------- catalog parsing

test("whole-rand parsing accepts staff-friendly formats, rejects cents", () => {
  assert.equal(parseWholeRands("250"), 250);
  assert.equal(parseWholeRands("R1,000"), 1000);
  assert.equal(parseWholeRands("1 000"), 1000);
  assert.equal(parseWholeRands("99.50"), null);
  assert.equal(parseWholeRands("-5"), null);
  assert.equal(parseWholeRands(""), null);
});

test("fallback JSON matches the seed rows in the Google Sheet", () => {
  const c = catalog();
  assert.equal(c.source, "fallback");
  assert.deepEqual(
    c.items.map((i) => [i.id, i.kind, i.priceZar, i.active]),
    [
      ["donation-100", "donation", 100, true],
      ["donation-250", "donation", 250, true],
      ["donation-500", "donation", 500, true],
      ["donation-1000", "donation", 1000, true],
      ["example-hoodie", "product", 450, false],
    ],
  );
  assert.deepEqual(c.settings, { allowCustomAmount: true, minAmountZar: 50, maxAmountZar: 500000 });
  assert.deepEqual(c.warnings, []);
});

test("public catalog only exposes active rows", () => {
  const pub = toPublicCatalog(catalog());
  assert.deepEqual(pub.donations.map((d) => d.priceZar), [100, 250, 500, 1000]);
  assert.deepEqual(pub.products, []);
});

test("invalid, duplicate, cap and wine rows are ignored with warnings", () => {
  const { items, warnings } = parseCatalogRows([
    { id: "donation-50", kind: "donation", name: "R50", price_zar: "50", active: "Y" },
    { id: "donation-50", kind: "donation", name: "dup", price_zar: "60", active: "Y" },
    { id: "cap-blue", kind: "product", name: "Blue cap", price_zar: "250", active: "Y" },
    { id: "wine-chloe", kind: "product", name: "Chloe", price_zar: "159", active: "Y" },
    { id: "Bad Id", kind: "product", name: "x", price_zar: "10", active: "Y" },
    { id: "mug", kind: "merch", name: "Mug", price_zar: "100", active: "Y" },
    { id: "pen", kind: "product", name: "Pen", price_zar: "12.50", active: "Y" },
    { id: "", kind: "", name: "", price_zar: "", active: "" },
  ]);
  assert.deepEqual(items.map((i) => i.id), ["donation-50"]);
  assert.equal(warnings.length, 6);
  assert.ok(warnings.some((w) => /Cheyna Dot/.test(w)));
});

test("donation settings fall back safely", () => {
  assert.deepEqual(
    parseDonationSettings([
      { setting: "allow_custom_amount", value: "FALSE" },
      { setting: "min_amount_zar", value: "100" },
      { setting: "max_amount_zar", value: "20000" },
    ]).settings,
    { allowCustomAmount: false, minAmountZar: 100, maxAmountZar: 20000 },
  );
  const inverted = parseDonationSettings([
    { setting: "min_amount_zar", value: "900" },
    { setting: "max_amount_zar", value: "100" },
  ]);
  assert.deepEqual(inverted.settings, { allowCustomAmount: true, minAmountZar: 50, maxAmountZar: 500000 });
  assert.equal(inverted.warnings.length, 1);
});

// ---------------------------------------------------------------- checkout plans

test("donation preset charges the Sheet price, never a browser price", () => {
  const plan = buildCheckoutPlan(catalog(), { type: "donation", itemId: "donation-250", amountZar: 1 });
  assert.equal(plan.amountCents, 25000);
  assert.equal(plan.metadata.orderType, "donation");
  assert.equal(plan.resultPaths.success, "/donate/thank-you/");
});

test("custom donation is bounded by DonationSettings", () => {
  assert.equal(buildCheckoutPlan(catalog(), { type: "donation", amountZar: 777 }).amountCents, 77700);
  expectCheckoutError(() => buildCheckoutPlan(catalog(), { type: "donation", amountZar: 49 }), /between R50/);
  expectCheckoutError(() => buildCheckoutPlan(catalog(), { type: "donation", amountZar: 500001 }), /between/);
  expectCheckoutError(() => buildCheckoutPlan(catalog(), { type: "donation", amountZar: 75.5 }), /whole rands/);

  const noCustom = { ...catalog(), settings: { allowCustomAmount: false, minAmountZar: 50, maxAmountZar: 100 } };
  expectCheckoutError(() => buildCheckoutPlan(noCustom, { type: "donation", amountZar: 75 }), /choose one/);
});

test("inactive or unknown products cannot be bought; caps never go through Yoco", () => {
  expectCheckoutError(() => buildCheckoutPlan(catalog(), { type: "product", itemId: "example-hoodie" }), /not available/);
  expectCheckoutError(() => buildCheckoutPlan(catalog(), { type: "product", itemId: "caps" }), /not available/);
  expectCheckoutError(() => buildCheckoutPlan(catalog(), { type: "cap", itemId: "caps" }), /type must be/);

  const live = parseCatalogRows([{ id: "hoodie", kind: "product", name: "Hoodie", price_zar: "450", active: "Y" }]);
  const withHoodie = { ...catalog(), items: live.items };
  const plan = buildCheckoutPlan(withHoodie, { type: "product", itemId: "hoodie", quantity: 2 });
  assert.equal(plan.amountCents, 90000);
  assert.equal(plan.resultPaths.success, "/shop/payment/success/");
});

const wineOrder = {
  type: "wine",
  lines: [
    { wineSlug: "chloe", caseQuantity: 2 },
    { wineSlug: "ella", caseQuantity: 1 },
    { wineSlug: "madison", caseQuantity: 0 },
  ],
  deliveryZone: "elsewhere_sa",
  deliveryAddress: "1 Main Road, Cape Town",
  notes: "Gift for Mum",
  customer: { name: "Test Buyer", email: "Buyer@Example.com", phone: "0821234567" },
};

test("wine = cases × (bottle price × 6) + delivery, recalculated server-side", () => {
  const plan = buildCheckoutPlan(catalog(), { ...wineOrder, amountCents: 1 });
  // Chloe 159×6×2 = 1908, Ella 205×6×1 = 1230, delivery elsewhere = 200 → R3,338
  assert.equal(plan.amountCents, 333800);
  assert.equal(plan.lineItems.length, 3);
  assert.equal(plan.metadata.wineLines, "chloe:2,ella:1");
  assert.equal(plan.metadata.customerEmail, "buyer@example.com");

  const jhb = buildCheckoutPlan(catalog(), { ...wineOrder, deliveryZone: "johannesburg" });
  assert.equal(jhb.amountCents, 333800 - 20000 + 5000);
});

test("wine order validation", () => {
  expectCheckoutError(() => buildCheckoutPlan(catalog(), { ...wineOrder, lines: [] }), /at least one case/);
  expectCheckoutError(
    () => buildCheckoutPlan(catalog(), { ...wineOrder, lines: [{ wineSlug: "rose", caseQuantity: 1 }] }),
    /Unknown wine/,
  );
  expectCheckoutError(() => buildCheckoutPlan(catalog(), { ...wineOrder, deliveryZone: "london" }), /delivery area/);
  expectCheckoutError(
    () => buildCheckoutPlan(catalog(), { ...wineOrder, customer: { ...wineOrder.customer, email: "nope" } }),
    /valid email/,
  );
  expectCheckoutError(
    () => buildCheckoutPlan(catalog(), { ...wineOrder, lines: [{ wineSlug: "chloe", caseQuantity: 100 }] }),
    /Maximum 99/,
  );
});

test("wine line encoding round-trips and drops junk", () => {
  const lines = [{ wineSlug: "chloe", caseQuantity: 3 }, { wineSlug: "madison", caseQuantity: 1 }];
  assert.deepEqual(decodeWineLines(encodeWineLines(lines)), lines);
  assert.deepEqual(decodeWineLines("chloe:2,rose:1,ella:x"), [{ wineSlug: "chloe", caseQuantity: 2 }]);
});

test("wine prices match the Apps Script trusted catalog (scripts/wine-order-submit.gs)", () => {
  const gs = fs.readFileSync("scripts/wine-order-submit.gs", "utf8");
  for (const wine of winePriceList) {
    const m = gs.match(new RegExp(`${wine.slug}:\\s*\\{[^}]*priceZar:\\s*(\\d+)`));
    assert.ok(m, `${wine.slug} missing from wine-order-submit.gs`);
    assert.equal(Number(m[1]), wine.pricePerBottleZar, `${wine.slug} price differs between site and Apps Script`);
  }
  assert.match(gs, new RegExp(`WINE_BOTTLES_PER_CASE = ${WINE_BOTTLES_PER_CASE};`));
  assert.match(gs, /DELIVERY_FEE_JOHANNESBURG_ZAR = 50;/);
  assert.match(gs, /DELIVERY_FEE_ELSEWHERE_SA_ZAR = 200;/);
});

// ---------------------------------------------------------------- webhook

const WEBHOOK_SECRET = `whsec_${Buffer.from("test-webhook-secret-32-bytes-long!").toString("base64")}`;

function signedHeaders(body, { id = "msg_1", tsSeconds = Math.floor(Date.now() / 1000) } = {}) {
  const ts = String(tsSeconds);
  return {
    "webhook-id": id,
    "webhook-timestamp": ts,
    "webhook-signature": `v1,${signYocoWebhook(WEBHOOK_SECRET, id, ts, body)}`,
  };
}

test("webhook signature: valid passes, tampered / stale / unsigned fail", () => {
  const body = JSON.stringify({ type: "payment.succeeded" });
  assert.deepEqual(verifyYocoWebhook({ secret: WEBHOOK_SECRET, rawBody: body, headers: signedHeaders(body) }), { ok: true });
  assert.equal(
    verifyYocoWebhook({ secret: WEBHOOK_SECRET, rawBody: body + " ", headers: signedHeaders(body) }).ok,
    false,
  );
  const stale = signedHeaders(body, { tsSeconds: Math.floor(Date.now() / 1000) - 600 });
  assert.equal(verifyYocoWebhook({ secret: WEBHOOK_SECRET, rawBody: body, headers: stale }).ok, false);
  assert.equal(verifyYocoWebhook({ secret: WEBHOOK_SECRET, rawBody: body, headers: {} }).ok, false);
  assert.equal(verifyYocoWebhook({ secret: "", rawBody: body, headers: signedHeaders(body) }).ok, false);
});

test("key mode detection", () => {
  assert.equal(yocoKeyMode("sk_test_abc"), "test");
  assert.equal(yocoKeyMode("sk_live_abc"), "live");
  assert.equal(yocoKeyMode(""), "invalid");
  assert.equal(yocoKeyMode("pk_test_abc"), "invalid");
});

test("paid wine order is forwarded in the Apps Script format", () => {
  const plan = buildCheckoutPlan(catalog(), wineOrder);
  const payload = buildWineNotifyPayload(
    { type: "payment.succeeded", payload: { id: "p_1", amount: plan.amountCents, mode: "test", metadata: { ...plan.metadata, checkoutId: "ch_1" } } },
    "s3cret",
  );
  assert.equal(payload.submissionMode, "yoco");
  assert.equal(payload.secret, "s3cret");
  assert.equal(payload.deliveryZone, "elsewhere_sa");
  assert.deepEqual(payload.lines, [{ wineSlug: "chloe", caseQuantity: 2 }, { wineSlug: "ella", caseQuantity: 1 }]);
  assert.match(payload.notes, /PAID via Yoco R3338\.00/);
  assert.match(payload.notes, /Gift for Mum/);
});

// ---------------------------------------------------------------- HTTP (mocked fetch)

function mockFetch(calls, { sheetRows } = {}) {
  return async (url, init = {}) => {
    const u = String(url);
    calls.push({ url: u, init });
    const json = (status, data) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
    if (u.startsWith(`https://opensheet.elk.sh/${SHEET_ID}/Catalog`)) return json(200, sheetRows ?? fallbackRaw.catalog);
    if (u.startsWith(`https://opensheet.elk.sh/${SHEET_ID}/DonationSettings`)) return json(200, fallbackRaw.settings);
    if (u === "https://payments.yoco.com/api/checkouts") {
      return json(200, { id: "ch_test_1", redirectUrl: "https://c.yoco.com/checkout/ch_test_1", status: "created", processingMode: "test" });
    }
    if (u === "https://script.google.com/macros/s/TEST/exec") return json(200, { ok: true, saved: true, emailSent: true });
    return json(404, { error: "unexpected url in test" });
  };
}

async function withServer(env, fetchCalls, fn, mockOptions) {
  const config = configFromEnv(env);
  const { app } = createApp(config, { fetchImpl: mockFetch(fetchCalls, mockOptions), log: () => {}, catalogFallbackPath: FALLBACK_PATH });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

const baseEnv = {
  YOCO_SECRET_KEY: "sk_test_unit_only",
  YOCO_WEBHOOK_SECRET: WEBHOOK_SECRET,
  PUBLIC_SITE_URL: "https://www.tuckerfamilycharity.co.za",
  PAYMENT_CATALOG_SHEET_ID: SHEET_ID,
  PAYMENT_CATALOG_SHEET_TAB: "Catalog",
  PAYMENT_CATALOG_SHEET_SETTINGS_TAB: "DonationSettings",
  WINE_ORDER_NOTIFY_URL: "https://script.google.com/macros/s/TEST/exec",
  WINE_ORDER_NOTIFY_SECRET: "wine-secret",
};

test("HTTP: /health, catalog from Sheet, CORS for the live site only", async () => {
  const calls = [];
  const sheetRows = [...fallbackRaw.catalog, { id: "donation-2000", kind: "donation", name: "R2,000", price_zar: "2000", active: "Y" }];
  await withServer(baseEnv, calls, async (base) => {
    const health = await fetch(`${base}/health`).then((r) => r.json());
    assert.deepEqual(health, { ok: true, service: "tucker-yoco-checkout" });

    const res = await fetch(`${base}/api/payment-catalog`, { headers: { Origin: "https://www.tuckerfamilycharity.co.za" } });
    assert.equal(res.headers.get("access-control-allow-origin"), "https://www.tuckerfamilycharity.co.za");
    const body = await res.json();
    assert.equal(body.source, "sheet");
    assert.deepEqual(body.donations.map((d) => d.id), ["donation-100", "donation-250", "donation-500", "donation-1000", "donation-2000"]);

    const evil = await fetch(`${base}/api/payment-catalog`, { headers: { Origin: "https://evil.example" } });
    assert.equal(evil.headers.get("access-control-allow-origin"), null);

    // Cached: second request does not hit opensheet again
    await fetch(`${base}/api/payment-catalog`);
    assert.equal(calls.filter((c) => c.url.includes("opensheet")).length, 2);
  }, { sheetRows });
});

test("HTTP: create-checkout sends trusted amount + secret key to Yoco", async () => {
  const calls = [];
  await withServer(baseEnv, calls, async (base) => {
    const res = await fetch(`${base}/api/create-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "donation", itemId: "donation-500", amountZar: 1 }),
    });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { redirectUrl: "https://c.yoco.com/checkout/ch_test_1", checkoutId: "ch_test_1" });

    const yoco = calls.find((c) => c.url.includes("payments.yoco.com"));
    const sent = JSON.parse(yoco.init.body);
    assert.equal(sent.amount, 50000);
    assert.equal(sent.currency, "ZAR");
    assert.equal(sent.successUrl, "https://www.tuckerfamilycharity.co.za/donate/thank-you/");
    assert.equal(yoco.init.headers.Authorization, "Bearer sk_test_unit_only");
    assert.ok(yoco.init.headers["Idempotency-Key"]);

    const bad = await fetch(`${base}/api/create-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "donation", amountZar: 10 }),
    });
    assert.equal(bad.status, 400);
    assert.match((await bad.json()).error, /between R50/);
  });
});

test("HTTP: create-checkout refuses to run without a Yoco key", async () => {
  await withServer({ ...baseEnv, YOCO_SECRET_KEY: "" }, [], async (base) => {
    const res = await fetch(`${base}/api/create-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "donation", itemId: "donation-100" }),
    });
    assert.equal(res.status, 503);
  });
});

test("HTTP: signed wine webhook is accepted once and forwarded; unsigned is rejected", async () => {
  const calls = [];
  const plan = buildCheckoutPlan(catalog(), wineOrder);
  const body = JSON.stringify({
    id: "evt_1",
    type: "payment.succeeded",
    createdDate: new Date().toISOString(),
    payload: { id: "p_1", amount: plan.amountCents, currency: "ZAR", status: "succeeded", mode: "test", metadata: { ...plan.metadata, checkoutId: "ch_test_1" } },
  });

  await withServer(baseEnv, calls, async (base) => {
    const unsigned = await fetch(`${base}/api/yoco-webhook`, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    assert.equal(unsigned.status, 401);

    const headers = { "Content-Type": "application/json", ...signedHeaders(body, { id: "msg_wine" }) };
    const ok = await fetch(`${base}/api/yoco-webhook`, { method: "POST", headers, body });
    assert.equal(ok.status, 200);
    const dup = await fetch(`${base}/api/yoco-webhook`, { method: "POST", headers, body });
    assert.deepEqual(await dup.json(), { ok: true, duplicate: true });

    await new Promise((r) => setTimeout(r, 50));
    const notify = calls.filter((c) => c.url.includes("script.google.com"));
    assert.equal(notify.length, 1);
    const forwarded = JSON.parse(new URLSearchParams(notify[0].init.body).get("json"));
    assert.equal(forwarded.submissionMode, "yoco");
    assert.equal(forwarded.secret, "wine-secret");
    assert.equal(forwarded.customerEmail, "buyer@example.com");
  });
});
