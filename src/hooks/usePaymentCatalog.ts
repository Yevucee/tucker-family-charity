/**
 * Loads donation presets + shop product prices from the Railway API
 * (which reads the "TFC Payment Catalog" Google Sheet). Falls back to the bundled
 * public/data/payment-catalog.json so the page still renders if the API is down.
 */

import { useEffect, useState } from "react";
import { YOCO_CHECKOUT_API_URL } from "@/config";

export interface PaymentCatalogEntry {
  id: string;
  name: string;
  priceZar: number;
  description: string;
}

export interface PaymentCatalogData {
  donations: PaymentCatalogEntry[];
  products: PaymentCatalogEntry[];
  settings: { allowCustomAmount: boolean; minAmountZar: number; maxAmountZar: number };
  source: "sheet" | "fallback" | "bundled";
}

type RawRow = Record<string, string | undefined>;

/** Mirrors api/lib/paymentCatalog.ts parsing for the bundled JSON (display only — server re-checks). */
function fromBundled(raw: { catalog?: RawRow[]; settings?: RawRow[] }): PaymentCatalogData {
  const rows = Array.isArray(raw.catalog) ? raw.catalog : [];
  const isYes = (v?: string) => /^(y|yes|true|1)$/i.test(String(v ?? "").trim());
  const entries = rows
    .filter((r) => isYes(r.active) && r.id && Number(r.price_zar) > 0)
    .map((r) => ({
      kind: String(r.kind ?? "").toLowerCase(),
      entry: {
        id: String(r.id),
        name: String(r.name ?? r.id),
        priceZar: Number(String(r.price_zar).replace(/[^\d]/g, "")),
        description: String(r.description ?? ""),
      },
    }));
  const settingRows = Array.isArray(raw.settings) ? raw.settings : [];
  const setting = (key: string) => settingRows.find((s) => s.setting === key)?.value;
  return {
    donations: entries.filter((e) => e.kind === "donation").map((e) => e.entry),
    products: entries.filter((e) => e.kind === "product").map((e) => e.entry),
    settings: {
      allowCustomAmount: isYes(setting("allow_custom_amount") ?? "TRUE"),
      minAmountZar: Number(setting("min_amount_zar")) || 50,
      maxAmountZar: Number(setting("max_amount_zar")) || 500000,
    },
    source: "bundled",
  };
}

async function fetchCatalog(signal: AbortSignal): Promise<PaymentCatalogData> {
  if (YOCO_CHECKOUT_API_URL) {
    try {
      const res = await fetch(`${YOCO_CHECKOUT_API_URL}/payment-catalog`, { signal });
      if (res.ok) return (await res.json()) as PaymentCatalogData;
    } catch (err) {
      if (signal.aborted) throw err;
    }
  }
  const res = await fetch(`${import.meta.env.BASE_URL}data/payment-catalog.json`, { signal });
  return fromBundled(await res.json());
}

export function usePaymentCatalog(enabled = true) {
  const [catalog, setCatalog] = useState<PaymentCatalogData | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    setLoading(true);
    fetchCatalog(controller.signal)
      .then((data) => {
        setCatalog(data);
        setError(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [enabled]);

  return { catalog, loading, error };
}

export function formatRands(amount: number): string {
  return `R${amount.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}`;
}
