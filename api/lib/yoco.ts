/**
 * Minimal Yoco Checkout API client + webhook signature verification.
 * Docs: https://developer.yoco.com/docs/checkout-api
 *       https://developer.yoco.com/guides/online-payments/webhooks/verifying-the-events
 */

import crypto from "node:crypto";
import type { CheckoutPlan } from "./checkoutPlans.ts";

export const YOCO_API_BASE = "https://payments.yoco.com/api";

export interface YocoCheckoutResponse {
  id: string;
  redirectUrl: string;
  status?: string;
  processingMode?: "test" | "live";
}

export function yocoKeyMode(secretKey: string): "test" | "live" | "invalid" {
  if (/^sk_test_/.test(secretKey)) return "test";
  if (/^sk_live_/.test(secretKey)) return "live";
  return "invalid";
}

export async function createYocoCheckout(input: {
  secretKey: string;
  plan: CheckoutPlan;
  siteUrl: string;
  idempotencyKey: string;
  fetchImpl?: typeof fetch;
}): Promise<YocoCheckoutResponse> {
  const { secretKey, plan, siteUrl, idempotencyKey, fetchImpl = fetch } = input;
  const site = siteUrl.replace(/\/+$/, "");

  const res = await fetchImpl(`${YOCO_API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      amount: plan.amountCents,
      currency: "ZAR",
      successUrl: `${site}${plan.resultPaths.success}`,
      cancelUrl: `${site}${plan.resultPaths.cancel}`,
      failureUrl: `${site}${plan.resultPaths.failure}`,
      metadata: plan.metadata,
      lineItems: plan.lineItems,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  const text = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    /* non-JSON error body */
  }
  if (!res.ok || typeof data.redirectUrl !== "string" || typeof data.id !== "string") {
    const detail = typeof data.message === "string" ? data.message : text.slice(0, 300);
    throw new Error(`Yoco checkout failed (HTTP ${res.status}): ${detail}`);
  }
  return data as unknown as YocoCheckoutResponse;
}

export interface WebhookVerifyInput {
  secret: string;
  rawBody: string | Buffer;
  headers: Record<string, string | string[] | undefined>;
  nowMs?: number;
  /** Replay window (Yoco recommends a few minutes). */
  toleranceSeconds?: number;
}

function header(headers: WebhookVerifyInput["headers"], name: string): string {
  const v = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

/** Computes the base64 HMAC-SHA256 Yoco expects for `id.timestamp.body`. */
export function signYocoWebhook(secret: string, webhookId: string, timestamp: string, rawBody: string): string {
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  return crypto.createHmac("sha256", key).update(`${webhookId}.${timestamp}.${rawBody}`).digest("base64");
}

export function verifyYocoWebhook(input: WebhookVerifyInput): { ok: true } | { ok: false; reason: string } {
  const { secret, headers, nowMs = Date.now(), toleranceSeconds = 180 } = input;
  if (!secret) return { ok: false, reason: "YOCO_WEBHOOK_SECRET not configured" };

  const webhookId = header(headers, "webhook-id");
  const timestamp = header(headers, "webhook-timestamp");
  const signatureHeader = header(headers, "webhook-signature");
  if (!webhookId || !timestamp || !signatureHeader) return { ok: false, reason: "missing webhook headers" };

  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(nowMs / 1000 - ts) > toleranceSeconds) {
    return { ok: false, reason: "timestamp outside tolerance" };
  }

  const rawBody = typeof input.rawBody === "string" ? input.rawBody : input.rawBody.toString("utf8");
  const expected = Buffer.from(signYocoWebhook(secret, webhookId, timestamp, rawBody));

  // Header format: "v1,<sig> v1,<sig2>" — any match is valid.
  const candidates = signatureHeader
    .split(" ")
    .map((part) => part.split(",")[1] ?? "")
    .filter(Boolean);
  const match = candidates.some((sig) => {
    const given = Buffer.from(sig);
    return given.length === expected.length && crypto.timingSafeEqual(given, expected);
  });
  return match ? { ok: true } : { ok: false, reason: "signature mismatch" };
}
