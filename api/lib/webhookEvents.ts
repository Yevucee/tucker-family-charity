/**
 * Handles verified Yoco webhook events.
 *
 * payment.succeeded is the ONLY proof of payment (the browser success redirect is UX only).
 * For paid wine orders we forward the order to the existing wine Apps Script
 * (scripts/wine-order-submit.gs) so it lands in the same Sheet log + staff email as enquiries,
 * with submissionMode "yoco".
 */

import { decodeWineLines } from "./checkoutPlans.ts";

export interface YocoWebhookEvent {
  id?: string;
  type?: string;
  createdDate?: string;
  payload?: {
    id?: string;
    amount?: number;
    currency?: string;
    status?: string;
    mode?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface WebhookHandlerOptions {
  wineNotifyUrl?: string;
  wineNotifySecret?: string;
  fetchImpl?: typeof fetch;
  log?: (msg: string) => void;
}

export interface WebhookOutcome {
  handled: boolean;
  orderType?: string;
  wineNotified?: boolean;
  note?: string;
}

function str(value: unknown): string {
  return value == null ? "" : String(value);
}

export function formatCents(cents: number | undefined): string {
  if (typeof cents !== "number") return "?";
  // Locale-independent (en-ZA would give "R3 338,00" with a non-breaking space).
  return `R${(cents / 100).toFixed(2)}`;
}

export function buildWineNotifyPayload(event: YocoWebhookEvent, secret?: string): Record<string, unknown> | null {
  const meta = event.payload?.metadata ?? {};
  const lines = decodeWineLines(str(meta.wineLines));
  if (!lines.length) return null;

  const paidNote = [
    `PAID via Yoco ${formatCents(event.payload?.amount)}`,
    `payment ${str(event.payload?.id)}`,
    `checkout ${str(meta.checkoutId)}`,
    event.payload?.mode ? `mode ${event.payload.mode}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const customerNotes = str(meta.notes).trim();

  return {
    submissionMode: "yoco",
    timestamp: event.createdDate || new Date().toISOString(),
    customerName: str(meta.customerName),
    customerEmail: str(meta.customerEmail),
    customerPhone: str(meta.customerPhone),
    deliveryZone: str(meta.deliveryZone),
    deliveryAddress: str(meta.deliveryAddress),
    notes: customerNotes ? `${paidNote}\n\n${customerNotes}` : paidNote,
    lines,
    website: "",
    ...(secret ? { secret } : {}),
  };
}

export async function handleYocoEvent(event: YocoWebhookEvent, options: WebhookHandlerOptions = {}): Promise<WebhookOutcome> {
  const { wineNotifyUrl = "", wineNotifySecret = "", fetchImpl = fetch, log = (m: string) => console.log(m) } = options;
  const meta = event.payload?.metadata ?? {};
  const orderType = str(meta.orderType) || "unknown";

  log(
    `[yoco-webhook] ${event.type ?? "?"} ${orderType} ${formatCents(event.payload?.amount)} ` +
      `payment=${str(event.payload?.id)} checkout=${str(meta.checkoutId)} mode=${str(event.payload?.mode)}`,
  );

  if (event.type !== "payment.succeeded") return { handled: false, orderType, note: "ignored event type" };
  if (orderType !== "wine") return { handled: true, orderType };

  if (!wineNotifyUrl) return { handled: true, orderType, wineNotified: false, note: "WINE_ORDER_NOTIFY_URL not set" };

  const payload = buildWineNotifyPayload(event, wineNotifySecret);
  if (!payload) return { handled: true, orderType, wineNotified: false, note: "no wine lines in metadata" };

  try {
    const res = await fetchImpl(wineNotifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ json: JSON.stringify(payload) }).toString(),
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    let ok = res.ok;
    try {
      const data = (await res.json()) as { ok?: boolean; error?: string };
      ok = data.ok === true;
      if (!ok) log(`[yoco-webhook] wine notify rejected: ${data.error ?? "unknown"}`);
    } catch {
      /* Apps Script sometimes returns HTML on redirect — treat HTTP status as the answer */
    }
    return { handled: true, orderType, wineNotified: ok };
  } catch (err) {
    log(`[yoco-webhook] wine notify failed: ${String(err)}`);
    return { handled: true, orderType, wineNotified: false, note: String(err) };
  }
}
