/**
 * Tucker Family Charity wine range — catalog, order helpers, page copy.
 */

import wineChloe from "@/assets/shop/wine-chloe.png";
import wineElla from "@/assets/shop/wine-ella.png";
import wineMadison from "@/assets/shop/wine-madison.png";
import { winePageCopy as winePageCopyBase } from "./copy/winePageCopy.ts";

/** Primary order inbox when the form is submitted. */
export const ORDER_EMAIL = "brett@tuckerfamilycharity.co.za";

/** CC copy on every order email (FormSubmit + Apps Script). */
export const ORDER_CC_EMAILS =
  "samuel.polley1@gmail.com, tuckerfamilycharity@gmail.com";

export const WINE_ORDER_FORMSUBMIT_URL = `https://formsubmit.co/ajax/${encodeURIComponent(ORDER_EMAIL)}`;

export const CHARITY_WINE_PATH = "/shop/wine";

import {
  WINE_BOTTLES_PER_CASE,
  WINE_DELIVERY_FEE_ELSEWHERE_SA_ZAR,
  WINE_DELIVERY_FEE_JOHANNESBURG_ZAR,
  getWinePriceBySlug,
  wineDeliveryFeeZar,
  wineDeliveryZoneLabel,
  type WineDeliveryZone,
} from "./winePricing.ts";

export {
  WINE_BOTTLES_PER_CASE,
  WINE_DELIVERY_FEE_ELSEWHERE_SA_ZAR,
  WINE_DELIVERY_FEE_JOHANNESBURG_ZAR,
  wineDeliveryFeeZar,
  wineDeliveryZoneLabel,
};
export type { WineDeliveryZone };

export interface CharityWineVariant {
  slug: string;
  name: string;
  vintage: number;
  varietal: string;
  image: string;
  /** ZAR per bottle — case price is derived (× bottles per case). Source: src/data/winePricing.ts */
  pricePerBottleZar: number;
}

const wineImages: Record<string, string> = {
  chloe: wineChloe,
  ella: wineElla,
  madison: wineMadison,
};

function variantFromPriceList(slug: string): CharityWineVariant {
  const entry = getWinePriceBySlug(slug);
  if (!entry) throw new Error(`Unknown wine slug in price list: ${slug}`);
  return { ...entry, image: wineImages[slug] };
}

export const charityWineVariants: CharityWineVariant[] = ["chloe", "ella", "madison"].map(variantFromPriceList);

/** `enquiry` = email/Sheet order form; `yoco` = paid via Yoco card checkout (Railway API). */
export type WineOrderSubmissionMode = "enquiry" | "yoco";

export const wineDeliveryZoneOptions: ReadonlyArray<{
  value: WineDeliveryZone;
  label: string;
  feeZar: number;
  description: string;
}> = [
  {
    value: "johannesburg",
    label: wineDeliveryZoneLabel("johannesburg"),
    feeZar: WINE_DELIVERY_FEE_JOHANNESBURG_ZAR,
    description: `R${WINE_DELIVERY_FEE_JOHANNESBURG_ZAR} delivery`,
  },
  {
    value: "elsewhere_sa",
    label: wineDeliveryZoneLabel("elsewhere_sa"),
    feeZar: WINE_DELIVERY_FEE_ELSEWHERE_SA_ZAR,
    description: `R${WINE_DELIVERY_FEE_ELSEWHERE_SA_ZAR} delivery`,
  },
];

export interface WineOrderLineInput {
  wineSlug: string;
  /** Cases ordered (each case = WINE_BOTTLES_PER_CASE bottles). */
  caseQuantity: number;
}

/** Payload POSTed to Apps Script — totals are recalculated server-side. */
export interface WineOrderPayload {
  submissionMode: WineOrderSubmissionMode;
  timestamp: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryZone: WineDeliveryZone;
  deliveryAddress: string;
  notes?: string;
  lines: WineOrderLineInput[];
  /** Honeypot — must stay empty. */
  website?: string;
  secret?: string;
}

export interface WineOrderSummaryRow {
  wine: CharityWineVariant;
  caseQuantity: number;
  bottleQuantity: number;
  pricePerBottleZar: number;
  pricePerCaseZar: number;
  lineTotalZar: number;
}

export interface WineOrderSummary {
  rows: WineOrderSummaryRow[];
  totalCases: number;
  totalBottles: number;
  wineSubtotalZar: number;
  deliveryFeeZar: number | null;
  deliveryZoneLabel: string | null;
  estimatedGrandTotalZar: number | null;
}

export function wineDisplayName(wine: CharityWineVariant): string {
  return `${wine.name} ${wine.vintage}`;
}

export function wineFullLabel(wine: CharityWineVariant): string {
  return `${wine.name} ${wine.vintage} (${wine.varietal})`;
}

export function formatWinePriceZar(amount: number): string {
  return `R${amount.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}`;
}

export function winePricePerCaseZar(wine: CharityWineVariant): number {
  return wine.pricePerBottleZar * WINE_BOTTLES_PER_CASE;
}

export function wineCardPriceSummary(wine: CharityWineVariant): string {
  return `${formatWinePriceZar(wine.pricePerBottleZar)} per bottle · ${formatWinePriceZar(winePricePerCaseZar(wine))} per case (${WINE_BOTTLES_PER_CASE} bottles)`;
}

export function winePriceLabel(wine: CharityWineVariant): string {
  return wineCardPriceSummary(wine);
}

export function formatWineOrderLineSummary(row: WineOrderSummaryRow): string {
  const caseWord = row.caseQuantity === 1 ? "case" : "cases";
  return `${wineFullLabel(row.wine)} — ${row.caseQuantity} ${caseWord} (${row.bottleQuantity} bottles) @ ${formatWinePriceZar(row.pricePerCaseZar)}/case = ${formatWinePriceZar(row.lineTotalZar)}`;
}

export function getWineBySlug(slug: string): CharityWineVariant | undefined {
  return charityWineVariants.find((w) => w.slug === slug);
}

/** `quantities` = cases per wine slug. */
export function computeWineOrderSummary(
  quantities: Record<string, number>,
  deliveryZone?: WineDeliveryZone | "",
): WineOrderSummary {
  const rows: WineOrderSummaryRow[] = [];
  let totalCases = 0;
  let totalBottles = 0;
  let wineSubtotalZar = 0;

  for (const wine of charityWineVariants) {
    const caseQuantity = Math.max(0, Math.min(99, Math.floor(quantities[wine.slug] ?? 0)));
    if (caseQuantity <= 0) continue;

    const bottleQuantity = caseQuantity * WINE_BOTTLES_PER_CASE;
    const pricePerCaseZar = winePricePerCaseZar(wine);
    const lineTotalZar = pricePerCaseZar * caseQuantity;

    totalCases += caseQuantity;
    totalBottles += bottleQuantity;
    wineSubtotalZar += lineTotalZar;

    rows.push({
      wine,
      caseQuantity,
      bottleQuantity,
      pricePerBottleZar: wine.pricePerBottleZar,
      pricePerCaseZar,
      lineTotalZar,
    });
  }

  const deliveryFeeZar = deliveryZone ? wineDeliveryFeeZar(deliveryZone) : null;
  const deliveryZoneLabel = deliveryZone ? wineDeliveryZoneLabel(deliveryZone) : null;
  const estimatedGrandTotalZar =
    deliveryFeeZar != null && totalCases > 0 ? wineSubtotalZar + deliveryFeeZar : null;

  return {
    rows,
    totalCases,
    totalBottles,
    wineSubtotalZar,
    deliveryFeeZar,
    deliveryZoneLabel,
    estimatedGrandTotalZar,
  };
}

export function buildWineOrderPayload(input: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryZone: WineDeliveryZone;
  deliveryAddress: string;
  notes: string;
  quantities: Record<string, number>;
  secret?: string;
}): WineOrderPayload {
  const lines: WineOrderLineInput[] = charityWineVariants
    .map((wine) => ({
      wineSlug: wine.slug,
      caseQuantity: Math.max(0, Math.min(99, Math.floor(input.quantities[wine.slug] ?? 0))),
    }))
    .filter((line) => line.caseQuantity > 0);

  return {
    submissionMode: "enquiry",
    timestamp: new Date().toISOString(),
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim(),
    customerPhone: input.customerPhone.trim(),
    deliveryZone: input.deliveryZone,
    deliveryAddress: input.deliveryAddress.trim(),
    notes: input.notes.trim() || undefined,
    lines,
    website: "",
    ...(input.secret ? { secret: input.secret } : {}),
  };
}

/** Body for FormSubmit.co — sends order email with no server setup required. */
export function buildWineOrderFormSubmitBody(input: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryZone: WineDeliveryZone;
  deliveryAddress: string;
  notes: string;
  orderSummary: WineOrderSummary;
}): Record<string, string | number> {
  const zoneLabel = wineDeliveryZoneLabel(input.deliveryZone);
  const deliveryFee = wineDeliveryFeeZar(input.deliveryZone);
  const wineLines = input.orderSummary.rows.map((row) => formatWineOrderLineSummary(row)).join("\n");

  const message = [
    "New wine order enquiry from the Tucker Family Charity website.",
    "",
    `Submitted: ${new Date().toLocaleString("en-ZA")}`,
    "",
    "Customer",
    `Name: ${input.customerName.trim()}`,
    `Email: ${input.customerEmail.trim()}`,
    `Phone / WhatsApp: ${input.customerPhone.trim()}`,
    "",
    "Delivery",
    `Area: ${zoneLabel} (${formatWinePriceZar(deliveryFee)} delivery)`,
    `Address: ${input.deliveryAddress.trim()}`,
    "",
    "Order (sold by the case — 6 bottles per case)",
    wineLines,
    "",
    `Total cases: ${input.orderSummary.totalCases}`,
    `Total bottles: ${input.orderSummary.totalBottles}`,
    `Wine subtotal: ${formatWinePriceZar(input.orderSummary.wineSubtotalZar)}`,
    `Delivery: ${formatWinePriceZar(deliveryFee)}`,
    `Order total: ${formatWinePriceZar(input.orderSummary.estimatedGrandTotalZar ?? input.orderSummary.wineSubtotalZar + deliveryFee)}`,
    input.notes.trim() ? `\nNotes / gift message:\n${input.notes.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    name: input.customerName.trim(),
    email: input.customerEmail.trim(),
    phone: input.customerPhone.trim(),
    delivery_area: zoneLabel,
    delivery_fee: formatWinePriceZar(deliveryFee),
    delivery_address: input.deliveryAddress.trim(),
    total_cases: String(input.orderSummary.totalCases),
    total_bottles: String(input.orderSummary.totalBottles),
    wine_subtotal: formatWinePriceZar(input.orderSummary.wineSubtotalZar),
    delivery: formatWinePriceZar(deliveryFee),
    order_total: formatWinePriceZar(
      input.orderSummary.estimatedGrandTotalZar ?? input.orderSummary.wineSubtotalZar + deliveryFee,
    ),
    order_details: wineLines,
    message,
    _subject: `New wine order enquiry — ${input.customerName.trim()}`,
    _replyto: input.customerEmail.trim(),
    _cc: ORDER_CC_EMAILS,
    _template: "table",
    _captcha: "false",
  };
}

export const winePageCopy = {
  ...winePageCopyBase,
  deliveryNoticeHeading: "Delivery charges",
  deliveryNoticeBody:
    "Delivery is charged separately: R50 within Johannesburg, or R200 anywhere else in South Africa.",
  caseNotice: "We sell by the case only (6 bottles per case).",
  orderCta: "Send order enquiry",
  orderCtaSending: "Sending…",
  /** Yoco card checkout (VITE_YOCO_CHECKOUT_ENABLED=true) */
  payCta: "Pay securely by card",
  payCtaSending: "Opening secure payment…",
  payNote:
    "You will be taken to Yoco's secure payment page. Your total includes delivery. We will contact you to arrange delivery once payment is confirmed.",
  payErrorGeneric: "We could not start the payment. Please try again, or email us your order.",
  featuresHeading: "About the range",
  features: charityWineVariants.map(
    (w) => `${w.name} ${w.varietal} ${w.vintage} — ${formatWinePriceZar(w.pricePerBottleZar)}/bottle (${formatWinePriceZar(winePricePerCaseZar(w))}/case)`,
  ),
  chooseHeading: "Choose your cases",
  chooseBlurb: `Select how many cases you would like for each wine (${WINE_BOTTLES_PER_CASE} bottles per case), then complete your details below.`,
  quantityLabel: "Cases",
  notesLabel: "Notes or gift message (optional)",
  notesPlaceholder: "Gift message, delivery instructions, or questions…",
  detailsHeading: "Your details",
  nameLabel: "Full name",
  emailLabel: "Email address",
  phoneLabel: "Phone or WhatsApp",
  deliveryZoneLabel: "Delivery area",
  deliveryAddressLabel: "Delivery address",
  deliveryAddressPlaceholder: "Street address, complex or estate, city",
  orderSummaryHeading: "Order summary",
  successMessage:
    "Thank you. Your wine order enquiry has been sent. We will contact you to confirm delivery and payment.",
  questionsBlurb: "Questions before you order?",
  questionsCtaEmail: ORDER_EMAIL,
  submitErrorGeneric: "We could not send your order enquiry. Please try again or email us directly.",
};
