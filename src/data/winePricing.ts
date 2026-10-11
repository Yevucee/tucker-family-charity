/**
 * Wine prices + delivery fees — pure data, no image imports.
 *
 * Shared by the website (src/data/charityWine.ts) and the Railway checkout API
 * (api/lib/wineCheckout.ts) so the price a customer sees is the price Yoco charges.
 * Keep scripts/wine-order-submit.gs in sync when changing prices.
 */

/** All wines are sold in cases of this many bottles. */
export const WINE_BOTTLES_PER_CASE = 6;

/** Maximum cases per wine per order (matches the quantity input). */
export const WINE_MAX_CASES_PER_LINE = 99;

export interface WinePriceEntry {
  slug: string;
  name: string;
  vintage: number;
  varietal: string;
  /** ZAR per bottle — case price is derived (× bottles per case). */
  pricePerBottleZar: number;
}

export const winePriceList: readonly WinePriceEntry[] = [
  { slug: "chloe", name: "Chloe", vintage: 2024, varietal: "Sauvignon Blanc", pricePerBottleZar: 159 },
  { slug: "ella", name: "Ella", vintage: 2025, varietal: "Pinot Noir", pricePerBottleZar: 205 },
  { slug: "madison", name: "Madison", vintage: 2021, varietal: "Merlot / Shiraz", pricePerBottleZar: 179 },
];

/** Trusted delivery zones — fees recalculated server-side from these values only. */
export type WineDeliveryZone = "johannesburg" | "elsewhere_sa";

export const WINE_DELIVERY_FEE_JOHANNESBURG_ZAR = 50;
export const WINE_DELIVERY_FEE_ELSEWHERE_SA_ZAR = 200;

export function isWineDeliveryZone(value: unknown): value is WineDeliveryZone {
  return value === "johannesburg" || value === "elsewhere_sa";
}

export function wineDeliveryFeeZar(zone: WineDeliveryZone): number {
  return zone === "johannesburg" ? WINE_DELIVERY_FEE_JOHANNESBURG_ZAR : WINE_DELIVERY_FEE_ELSEWHERE_SA_ZAR;
}

export function wineDeliveryZoneLabel(zone: WineDeliveryZone): string {
  return zone === "johannesburg" ? "Johannesburg" : "Elsewhere in South Africa";
}

export function getWinePriceBySlug(slug: string): WinePriceEntry | undefined {
  return winePriceList.find((w) => w.slug === slug);
}

export function winePricePerCaseZarFor(entry: Pick<WinePriceEntry, "pricePerBottleZar">): number {
  return entry.pricePerBottleZar * WINE_BOTTLES_PER_CASE;
}
