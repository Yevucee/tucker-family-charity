/**
 * Tucker Family Charity wine range — catalog, order helpers, page copy.
 */

import wineChloe from "@/assets/shop/wine-chloe.png";
import wineElla from "@/assets/shop/wine-ella.png";
import wineMadison from "@/assets/shop/wine-madison.png";

/** Fallback contact when the order endpoint is unavailable. */
export const ORDER_EMAIL = "info@tuckerfamilycharity.org";

export const CHARITY_WINE_PATH = "/shop/wine";

export interface CharityWineVariant {
  slug: string;
  name: string;
  vintage: number;
  varietal: string;
  image: string;
  /** ZAR per bottle — omit until Bret confirms pricing (shown as “Price on enquiry”). */
  pricePerBottleZar?: number;
}

export const charityWineVariants: CharityWineVariant[] = [
  {
    slug: "chloe",
    name: "Chloe",
    vintage: 2024,
    varietal: "Sauvignon Blanc",
    image: wineChloe,
  },
  {
    slug: "ella",
    name: "Ella",
    vintage: 2025,
    varietal: "Pinot Noir",
    image: wineElla,
  },
  {
    slug: "madison",
    name: "Madison",
    vintage: 2021,
    varietal: "Merlot / Shiraz",
    image: wineMadison,
  },
];

/** Future checkout modes — website currently submits `enquiry` only. */
export type WineOrderSubmissionMode = "enquiry" | "yoco";

/** Trusted delivery zones — fees recalculated server-side from these values only. */
export type WineDeliveryZone = "johannesburg" | "elsewhere_sa";

export const WINE_DELIVERY_FEE_JOHANNESBURG_ZAR = 50;
export const WINE_DELIVERY_FEE_ELSEWHERE_SA_ZAR = 200;

export const wineDeliveryZoneOptions: ReadonlyArray<{
  value: WineDeliveryZone;
  label: string;
  feeZar: number;
  description: string;
}> = [
  {
    value: "johannesburg",
    label: "Johannesburg",
    feeZar: WINE_DELIVERY_FEE_JOHANNESBURG_ZAR,
    description: `R${WINE_DELIVERY_FEE_JOHANNESBURG_ZAR} delivery`,
  },
  {
    value: "elsewhere_sa",
    label: "Elsewhere in South Africa",
    feeZar: WINE_DELIVERY_FEE_ELSEWHERE_SA_ZAR,
    description: `R${WINE_DELIVERY_FEE_ELSEWHERE_SA_ZAR} delivery`,
  },
];

export function wineDeliveryFeeZar(zone: WineDeliveryZone): number {
  return zone === "johannesburg" ? WINE_DELIVERY_FEE_JOHANNESBURG_ZAR : WINE_DELIVERY_FEE_ELSEWHERE_SA_ZAR;
}

export function wineDeliveryZoneLabel(zone: WineDeliveryZone): string {
  return wineDeliveryZoneOptions.find((o) => o.value === zone)?.label ?? zone;
}

export interface WineOrderLineInput {
  wineSlug: string;
  quantity: number;
}

/** Payload POSTed to Apps Script — totals are recalculated server-side. */
export interface WineOrderPayload {
  submissionMode: WineOrderSubmissionMode;
  timestamp: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryZone: WineDeliveryZone;
  deliveryArea: string;
  notes?: string;
  lines: WineOrderLineInput[];
  /** Honeypot — must stay empty. */
  website?: string;
  secret?: string;
}

export interface WineOrderSummaryRow {
  wine: CharityWineVariant;
  quantity: number;
  pricePerBottleZar: number | null;
  lineTotalZar: number | null;
}

export interface WineOrderSummary {
  rows: WineOrderSummaryRow[];
  totalBottles: number;
  wineSubtotalZar: number | null;
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

export function winePriceLabel(wine: CharityWineVariant): string {
  return wine.pricePerBottleZar != null ? formatWinePriceZar(wine.pricePerBottleZar) : "Price on enquiry";
}

export function getWineBySlug(slug: string): CharityWineVariant | undefined {
  return charityWineVariants.find((w) => w.slug === slug);
}

/** Build order summary from trusted local catalog (display only — server recalculates on submit). */
export function computeWineOrderSummary(
  quantities: Record<string, number>,
  deliveryZone?: WineDeliveryZone | "",
): WineOrderSummary {
  const rows: WineOrderSummaryRow[] = [];
  let totalBottles = 0;
  let wineSubtotalZar: number | null = 0;

  for (const wine of charityWineVariants) {
    const quantity = Math.max(0, Math.min(99, Math.floor(quantities[wine.slug] ?? 0)));
    if (quantity <= 0) continue;

    totalBottles += quantity;
    const pricePerBottleZar = wine.pricePerBottleZar ?? null;
    const lineTotalZar =
      pricePerBottleZar != null ? pricePerBottleZar * quantity : null;

    if (lineTotalZar == null) wineSubtotalZar = null;
    else if (wineSubtotalZar != null) wineSubtotalZar += lineTotalZar;

    rows.push({ wine, quantity, pricePerBottleZar, lineTotalZar });
  }

  const deliveryFeeZar = deliveryZone ? wineDeliveryFeeZar(deliveryZone) : null;
  const deliveryZoneLabel = deliveryZone ? wineDeliveryZoneLabel(deliveryZone) : null;
  let estimatedGrandTotalZar: number | null = wineSubtotalZar;
  if (deliveryFeeZar != null && estimatedGrandTotalZar != null) {
    estimatedGrandTotalZar += deliveryFeeZar;
  }

  return {
    rows,
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
  deliveryArea: string;
  notes: string;
  quantities: Record<string, number>;
  secret?: string;
}): WineOrderPayload {
  const lines: WineOrderLineInput[] = charityWineVariants
    .map((wine) => ({
      wineSlug: wine.slug,
      quantity: Math.max(0, Math.min(99, Math.floor(input.quantities[wine.slug] ?? 0))),
    }))
    .filter((line) => line.quantity > 0);

  return {
    submissionMode: "enquiry",
    timestamp: new Date().toISOString(),
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim(),
    customerPhone: input.customerPhone.trim(),
    deliveryZone: input.deliveryZone,
    deliveryArea: input.deliveryArea.trim(),
    notes: input.notes.trim() || undefined,
    lines,
    website: "",
    ...(input.secret ? { secret: input.secret } : {}),
  };
}

export const winePageCopy = {
  title: "Tucker Family Charity Wine",
  intro:
    "White-label South African wines in partnership with Tucker Family Charity and in support of Oliver’s Village.",
  impactLine: "Every bottle helps support our initiatives.",
  deliveryNoticeHeading: "Delivery charges",
  deliveryNoticeBody:
    "Delivery is charged separately: R50 within Johannesburg, or R200 anywhere else in South Africa. Bret will confirm your final total including wine pricing.",
  orderCta: "Send order enquiry",
  orderCtaSending: "Sending…",
  featuresHeading: "About the range",
  features: [
    "Chloe Sauvignon Blanc 2024",
    "Ella Pinot Noir 2025",
    "Madison Merlot / Shiraz 2021",
    "Wine of South Africa — charity partnership label on every bottle",
  ],
  chooseHeading: "Choose your wines",
  chooseBlurb: "Set the quantity for each bottle you would like, then complete your details below.",
  quantityLabel: "Bottles",
  notesLabel: "Notes or gift message (optional)",
  notesPlaceholder: "Gift message, delivery instructions, or questions…",
  detailsHeading: "Your details",
  nameLabel: "Full name",
  emailLabel: "Email address",
  phoneLabel: "Phone or WhatsApp",
  deliveryZoneLabel: "Delivery area",
  deliverySuburbLabel: "Suburb or address details",
  deliverySuburbPlaceholder: "e.g. Sandton, Fourways, Stellenbosch",
  orderSummaryHeading: "Order summary",
  successMessage:
    "Thank you. Your wine order enquiry has been sent to Bret. He will contact you to confirm availability, pricing, delivery, and payment.",
  questionsBlurb: "Questions before you order?",
  questionsCtaEmail: ORDER_EMAIL,
  submitNotConfigured:
    "Online wine orders are not connected yet. Please email us with your order and we will help you.",
  submitErrorGeneric: "We could not send your order enquiry. Please try again or email us directly.",
};
