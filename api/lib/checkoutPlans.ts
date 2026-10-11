/**
 * Turns a browser request into a trusted checkout plan (amount, line items, metadata).
 *
 * Prices are ALWAYS looked up server-side — never trust an amount from the browser,
 * except a custom donation amount, which is bounded by DonationSettings in the Sheet.
 */

import {
  WINE_BOTTLES_PER_CASE,
  WINE_MAX_CASES_PER_LINE,
  getWinePriceBySlug,
  isWineDeliveryZone,
  wineDeliveryFeeZar,
  wineDeliveryZoneLabel,
  winePricePerCaseZarFor,
  type WineDeliveryZone,
} from "../../src/data/winePricing.ts";
import { findActiveItem, type PaymentCatalog } from "./paymentCatalog.ts";

export type CheckoutType = "donation" | "product" | "wine";

export interface YocoLineItem {
  displayName: string;
  quantity: number;
  pricingDetails: { price: number };
}

export interface CheckoutPlan {
  type: CheckoutType;
  amountCents: number;
  lineItems: YocoLineItem[];
  /** String values only — copied by Yoco onto the payment and echoed in the webhook. */
  metadata: Record<string, string>;
  /** Site paths for Yoco redirects (UX only — the webhook is proof of payment). */
  resultPaths: { success: string; cancel: string; failure: string };
}

export class CheckoutRequestError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const SHOP_RESULT_PATHS = {
  success: "/shop/payment/success/",
  cancel: "/shop/payment/cancelled/",
  failure: "/shop/payment/failed/",
};

const DONATE_RESULT_PATHS = {
  success: "/donate/thank-you/",
  cancel: "/donate/cancelled/",
  failure: "/donate/failed/",
};

const zarToCents = (zar: number) => Math.round(zar * 100);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function trimmed(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

function wholeNumber(value: unknown): number | null {
  const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  return typeof n === "number" && Number.isInteger(n) ? n : null;
}

export function buildDonationPlan(catalog: PaymentCatalog, body: Record<string, unknown>): CheckoutPlan {
  const itemId = trimmed(body.itemId, 80).toLowerCase();
  let amountZar: number;
  let label: string;

  if (itemId) {
    const item = findActiveItem(catalog, itemId, "donation");
    if (!item) throw new CheckoutRequestError("That donation option is no longer available. Please refresh the page.");
    amountZar = item.priceZar;
    label = item.name;
  } else {
    const { allowCustomAmount, minAmountZar, maxAmountZar } = catalog.settings;
    if (!allowCustomAmount) throw new CheckoutRequestError("Please choose one of the donation amounts.");
    const custom = wholeNumber(body.amountZar);
    if (custom == null) throw new CheckoutRequestError("Please enter a donation amount in whole rands.");
    if (custom < minAmountZar || custom > maxAmountZar) {
      throw new CheckoutRequestError(`Donations must be between R${minAmountZar} and R${maxAmountZar.toLocaleString("en-ZA")}.`);
    }
    amountZar = custom;
    label = `Donation — R${custom.toLocaleString("en-ZA")}`;
  }

  return {
    type: "donation",
    amountCents: zarToCents(amountZar),
    lineItems: [{ displayName: label, quantity: 1, pricingDetails: { price: zarToCents(amountZar) } }],
    metadata: {
      orderType: "donation",
      itemId: itemId || "custom",
      amountZar: String(amountZar),
    },
    resultPaths: DONATE_RESULT_PATHS,
  };
}

export function buildProductPlan(catalog: PaymentCatalog, body: Record<string, unknown>): CheckoutPlan {
  const itemId = trimmed(body.itemId, 80).toLowerCase();
  const item = itemId ? findActiveItem(catalog, itemId, "product") : undefined;
  if (!item) throw new CheckoutRequestError("That product is not available for online payment right now.");

  const quantity = wholeNumber(body.quantity ?? 1);
  if (quantity == null || quantity < 1 || quantity > 20) {
    throw new CheckoutRequestError("Quantity must be between 1 and 20.");
  }

  return {
    type: "product",
    amountCents: zarToCents(item.priceZar * quantity),
    lineItems: [{ displayName: item.name, quantity, pricingDetails: { price: zarToCents(item.priceZar) } }],
    metadata: {
      orderType: "product",
      itemId: item.id,
      quantity: String(quantity),
      unitPriceZar: String(item.priceZar),
    },
    resultPaths: SHOP_RESULT_PATHS,
  };
}

export interface WineOrderDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryZone: WineDeliveryZone;
  deliveryAddress: string;
  notes: string;
  lines: Array<{ wineSlug: string; caseQuantity: number }>;
}

export function parseWineOrder(body: Record<string, unknown>): WineOrderDetails {
  const customer = asRecord(body.customer);
  const customerName = trimmed(customer.name ?? body.customerName, 120);
  const customerEmail = trimmed(customer.email ?? body.customerEmail, 160).toLowerCase();
  const customerPhone = trimmed(customer.phone ?? body.customerPhone, 40);
  const deliveryAddress = trimmed(body.deliveryAddress, 300);
  const notes = trimmed(body.notes, 300);
  const deliveryZone = body.deliveryZone;

  if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
    throw new CheckoutRequestError("Please fill in your name, email, phone and delivery address.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    throw new CheckoutRequestError("Please enter a valid email address.");
  }
  if (!isWineDeliveryZone(deliveryZone)) {
    throw new CheckoutRequestError("Please choose a delivery area.");
  }

  const rawLines = Array.isArray(body.lines) ? body.lines : [];
  const merged = new Map<string, number>();
  for (const raw of rawLines) {
    const line = asRecord(raw);
    const slug = trimmed(line.wineSlug, 40).toLowerCase();
    const cases = wholeNumber(line.caseQuantity);
    if (!getWinePriceBySlug(slug)) throw new CheckoutRequestError(`Unknown wine: ${slug || "(blank)"}`);
    if (cases == null || cases < 0) throw new CheckoutRequestError("Case quantities must be whole numbers.");
    if (cases === 0) continue;
    merged.set(slug, (merged.get(slug) ?? 0) + cases);
  }
  const lines = [...merged.entries()].map(([wineSlug, caseQuantity]) => ({ wineSlug, caseQuantity }));
  if (lines.length === 0) throw new CheckoutRequestError("Please select at least one case.");
  if (lines.some((l) => l.caseQuantity > WINE_MAX_CASES_PER_LINE)) {
    throw new CheckoutRequestError(`Maximum ${WINE_MAX_CASES_PER_LINE} cases per wine — please contact us for bigger orders.`);
  }

  return { customerName, customerEmail, customerPhone, deliveryZone, deliveryAddress, notes, lines };
}

/** Compact "chloe:2,ella:1" form so the order survives Yoco metadata limits. */
export function encodeWineLines(lines: WineOrderDetails["lines"]): string {
  return lines.map((l) => `${l.wineSlug}:${l.caseQuantity}`).join(",");
}

export function decodeWineLines(encoded: string): WineOrderDetails["lines"] {
  return encoded
    .split(",")
    .map((part) => part.split(":"))
    .map(([wineSlug, qty]) => ({ wineSlug: (wineSlug ?? "").trim(), caseQuantity: Number(qty) }))
    .filter((l) => getWinePriceBySlug(l.wineSlug) && Number.isInteger(l.caseQuantity) && l.caseQuantity > 0);
}

export function buildWinePlan(body: Record<string, unknown>): CheckoutPlan {
  const order = parseWineOrder(body);

  const lineItems: YocoLineItem[] = order.lines.map(({ wineSlug, caseQuantity }) => {
    const wine = getWinePriceBySlug(wineSlug)!;
    return {
      displayName: `${wine.name} ${wine.vintage} (${wine.varietal}) — case of ${WINE_BOTTLES_PER_CASE}`,
      quantity: caseQuantity,
      pricingDetails: { price: zarToCents(winePricePerCaseZarFor(wine)) },
    };
  });

  const deliveryFee = wineDeliveryFeeZar(order.deliveryZone);
  lineItems.push({
    displayName: `Delivery — ${wineDeliveryZoneLabel(order.deliveryZone)}`,
    quantity: 1,
    pricingDetails: { price: zarToCents(deliveryFee) },
  });

  const amountCents = lineItems.reduce((sum, li) => sum + li.pricingDetails.price * li.quantity, 0);

  return {
    type: "wine",
    amountCents,
    lineItems,
    metadata: {
      orderType: "wine",
      wineLines: encodeWineLines(order.lines),
      deliveryZone: order.deliveryZone,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      ...(order.notes ? { notes: order.notes } : {}),
    },
    resultPaths: SHOP_RESULT_PATHS,
  };
}

export function buildCheckoutPlan(catalog: PaymentCatalog, rawBody: unknown): CheckoutPlan {
  const body = asRecord(rawBody);
  const type = trimmed(body.type, 20).toLowerCase();
  switch (type) {
    case "donation":
      return buildDonationPlan(catalog, body);
    case "product":
      return buildProductPlan(catalog, body);
    case "wine":
      return buildWinePlan(body);
    default:
      throw new CheckoutRequestError('type must be "donation", "product" or "wine".');
  }
}
