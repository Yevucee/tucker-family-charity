import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ExternalLink, HeartHandshake, Home, MapPin, Search, Send, Shield } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Slider } from "../components/ui/slider";
import {
  PROPERTY_ENQUIRY_SECRET,
  PROPERTY_ENQUIRY_SUBMIT_URL,
  PROPERTY_ENQUIRY_SUBMIT_URL_REJECTED,
} from "@/config";
import {
  parsePropertyListings,
  propertyListingCardFeatures,
  propertyListingCardTeaser,
  propertyListingReferralNote,
  resolvePropertyImageUrl,
  type PropertyListing,
} from "@/data/propertyListing";

const FALLBACK_ENQUIRY_EMAIL = "info@tuckerfamilycharity.org";

type FilterTab = "all" | "rent" | "sale";
type SortOption = "price-desc" | "price-asc" | "suburb-asc";

const PAGE_SIZE = 12;

const CONTACT_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "either", label: "Either email or phone" },
] as const;

const filterBtn = (active: boolean) =>
  [
    "px-4 py-2 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
    active ? "bg-amber-600 text-white shadow-sm" : "bg-white text-amber-950 border border-amber-200 hover:bg-amber-50",
  ].join(" ");

function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function parsePriceSortValue(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number(digits);
}

function priceSliderStep(min: number, max: number): number {
  const span = max - min;
  if (span <= 500_000) return 5_000;
  if (span <= 2_000_000) return 25_000;
  if (span <= 10_000_000) return 100_000;
  return 250_000;
}

function roundDownToStep(n: number, step: number): number {
  return Math.floor(n / step) * step;
}

function roundUpToStep(n: number, step: number): number {
  return Math.ceil(n / step) * step;
}

function formatPriceLabel(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    if (millions >= 10 || millions % 1 === 0) return `R${millions.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}m`;
    return `R${millions.toLocaleString("en-ZA", { maximumFractionDigits: 1 })}m`;
  }
  if (value >= 1_000) return `R${Math.round(value / 1_000).toLocaleString("en-ZA")}k`;
  return `R${value.toLocaleString("en-ZA")}`;
}

type PriceBounds = { min: number; max: number; step: number };

function computePriceBounds(rows: PropertyListing[]): PriceBounds {
  const prices = rows.map((p) => parsePriceSortValue(p.price)).filter((n) => n > 0);
  if (prices.length === 0) return { min: 0, max: 0, step: 5_000 };
  const rawMin = Math.min(...prices);
  const rawMax = Math.max(...prices);
  const step = priceSliderStep(rawMin, rawMax);
  return {
    min: roundDownToStep(rawMin, step),
    max: roundUpToStep(rawMax, step),
    step,
  };
}

function listingSearchHaystack(p: PropertyListing): string {
  return [p.title, p.suburb, p.price, p.webRef ?? "", p.description, p.cardSummary ?? ""].join(" ").toLowerCase();
}

function isExternalListingUrl(url: string): boolean {
  const u = url.trim();
  return u.startsWith("http://") || u.startsWith("https://");
}

function listingSiteShortName(url: string): string {
  const u = url.toLowerCase();
  if (u.includes("byronthomasproperties.co.za")) return "Byron Thomas Properties";
  if (u.includes("pamgolding.co.za")) return "Pam Golding";
  if (u.includes("property24.com")) return "Property24";
  return "the listing site";
}

/**
 * Prefer letting the browser follow redirects (KITF pattern). Manual POST hops can confuse Apps Script echo and show up as failed echo requests in DevTools.
 */
async function fetchGasWebAppPostFollow(execUrl: string, formBody: string): Promise<Response> {
  return fetch(execUrl, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody,
    mode: "cors",
    redirect: "follow",
  });
}

/**
 * When redirect-follow turns the POST into an effective doGet-style reply (`live` without `saved`), replay using explicit POST to each Location (historical workaround).
 */
async function fetchGasWebAppPostManualHops(execUrl: string, formBody: string): Promise<Response> {
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  let requestUrl = execUrl;

  for (let hop = 0; hop < 12; hop++) {
    const res = await fetch(requestUrl, {
      method: "POST",
      cache: "no-store",
      headers,
      body: formBody,
      mode: "cors",
      redirect: "manual",
    });

    const locRaw = res.headers.get("Location");
    const loc = locRaw?.trim();
    if (loc && res.status >= 300 && res.status < 400) {
      requestUrl = new URL(loc, res.url || requestUrl).href;
      continue;
    }

    return res;
  }

  throw new Error("Apps Script redirect chain too long");
}

type GasPostJson = { ok?: boolean; saved?: boolean; live?: boolean; error?: string };

/** Strip BOM / zero-width chars Google occasionally prefixes on macro responses. */
function normalizeGasBody(raw: string): string {
  let s = raw.replace(/^\uFEFF/, "").replace(/[\u200B-\u200D]/g, "");
  // Some Google responses use an anti-XSSI line prefix before JSON.
  if (s.startsWith(")]}'")) s = s.slice(4).trimStart();
  return s.trim();
}

/** Unencode minimal entities so `"ok"` markers match when JSON is embedded in HTML. */
function decodeHtmlQuotEntities(s: string): string {
  return s.replace(/&quot;/gi, '"').replace(/&#x22;/gi, '"').replace(/&#34;/gi, '"');
}

/** Normalise curly/smart quotes sometimes emitted instead of ASCII `"` in wrapped responses. */
function normalizeGasQuotes(s: string): string {
  return s.replace(/[“”„‟]/g, '"').replace(/[‘’]/g, "'");
}

/** Single pipeline for marker matching and `{…}` scans (entities + quotes after BOM/XSSI strip). */
function gasPrepare(raw: string): string {
  return normalizeGasQuotes(decodeHtmlQuotEntities(normalizeGasBody(raw)));
}

/** Final fetch URL after redirects — host must match Apps Script web-app endpoints (path varies; avoid requiring `/macros/`). */
function isGasAppsScriptResponseUrl(urlStr: string): boolean {
  try {
    const host = new URL(urlStr).hostname.toLowerCase();
    return host === "script.google.com" || host === "script.googleusercontent.com";
  } catch {
    return false;
  }
}

/**
 * Google occasionally returns an empty body on success while CORS headers still allow reading the status.
 * Only trust when the response URL is the known Apps Script macro host (after redirects).
 */
function gasEmptyTrustedSuccess(res: Response, raw: string): GasPostJson | null {
  if (normalizeGasBody(raw).length > 0) return null;
  if (!(res.ok && (res.status === 200 || res.status === 204))) return null;
  if (isGasAppsScriptResponseUrl(res.url)) return { ok: true, saved: true };
  return null;
}

/** Plain JSON body without HTML wrappers — whole-response parse (objects or arrays). */
function parseGasWholeBodySaved(raw: string): GasPostJson | null {
  const t = gasPrepare(raw);
  if (!t || (!t.startsWith("{") && !t.startsWith("["))) return null;
  try {
    const data = JSON.parse(t) as GasPostJson | GasPostJson[];
    if (Array.isArray(data)) {
      const hit = data.find((x) => x && typeof x === "object" && x.ok === true && x.saved === true);
      return hit ?? null;
    }
    if (data && typeof data === "object" && data.ok === true && data.saved === true) return data;
  } catch {
    /* ignore */
  }
  return null;
}


/**
 * If "ok" and "saved" booleans appear inside the same {...} span, treat as success even when the
 * slice is not valid JSON (e.g. CSS / script noise elsewhere in a large HTML wrapper).
 */
function gasSavedFromBoundedMarkers(raw: string): GasPostJson | null {
  const primary = gasPrepare(raw);
  const variants = primary.includes('\\"') ? [primary, primary.replace(/\\"/g, '"')] : [primary];

  for (const n of variants) {
    const markerPairs: ReadonlyArray<[RegExp, RegExp]> = [
      [/"ok"\s*:\s*true\b/, /"saved"\s*:\s*true\b/],
      [/\bok\b\s*:\s*true\b/, /\bsaved\b\s*:\s*true\b/],
    ];

    for (const [okRe, savedRe] of markerPairs) {
      const okM = okRe.exec(n);
      const savedM = savedRe.exec(n);
      if (!okM || !savedM) continue;

      const start = Math.min(okM.index, savedM.index);
      const end = Math.max(okM.index + okM[0].length, savedM.index + savedM[0].length);
      const braceOpen = n.lastIndexOf("{", start);
      const braceClose = n.indexOf("}", end);
      if (braceOpen === -1 || braceClose === -1 || braceClose <= braceOpen) continue;

      const slice = n.slice(braceOpen, braceClose + 1);
      let parsed: GasPostJson;
      try {
        parsed = JSON.parse(slice) as GasPostJson;
      } catch {
        return { ok: true, saved: true };
      }
      if (parsed?.ok === true && parsed?.saved === true) return parsed;
    }
  }

  return null;
}

/**
 * Last resort when JSON.parse fails on the whole body — Apps Script embed may still expose success markers.
 * Avoid treating arbitrary HTML as success: require both markers used together by our deployed script.
 */
function gasBodyIndicatesSaved(raw: string): boolean {
  if (gasSavedFromBoundedMarkers(raw) !== null) return true;
  const primary = gasPrepare(raw);
  const variants = primary.includes('\\"') ? [primary, primary.replace(/\\"/g, '"')] : [primary];
  for (const n of variants) {
    if (/\bok\b\s*:\s*true\b/.test(n) && /\bsaved\b\s*:\s*true\b/.test(n)) return true;
  }
  return false;
}

/** True when the body matches our Apps Script doGet probe (`live`) but not a confirmed doPost (`saved`). */
function gasBodyLooksLikeDoGetOnly(raw: string): boolean {
  const b = gasPrepare(raw).toLowerCase();
  return /"live"\s*:\s*true\b/.test(b) && !/"saved"\s*:\s*true\b/.test(b);
}

/**
 * Macro round-trip succeeded (2xx) but we could not parse JSON — still common when proxies/wrappers alter the body.
 * Never treat obvious HTML login pages, doGet-only payloads, or explicit `{ ok: false }` as success.
 */
function gasMacrosOptimisticSaved(res: Response, raw: string): GasPostJson | null {
  if (!res.ok) return null;
  if (!isGasAppsScriptResponseUrl(res.url)) return null;

  const b = normalizeGasBody(raw).toLowerCase();
  if (/\bok\b\s*:\s*false\b/.test(b)) return null;
  if (gasBodyLooksLikeDoGetOnly(raw)) return null;

  const negatives =
    /<!doctype\b|<\s*html\b|accounts\.google|sign\s+in|access\s+denied|log\s+in\s+with|could\s+not\s+complete|typeerror|referenceerror|service\s+unavailable/i;
  if (negatives.test(b)) return null;

  return { ok: true, saved: true };
}

/** First balanced `{ ... }` starting at text[0]. */
function extractLeadingJsonObject(text: string): string | null {
  if (!text.startsWith("{")) return null;
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return text.slice(0, i + 1);
    }
  }
  return null;
}

/** Scan for `{ "ok": ...` starts — skips unrelated `{` earlier in noisy HTML. */
function parseGasSavedNearOkKey(raw: string): GasPostJson | null {
  const primary = gasPrepare(raw);
  const variants = primary.includes('\\"') ? [primary, primary.replace(/\\"/g, '"')] : [primary];

  for (const n of variants) {
    const re = /\{\s*"ok"\s*:/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(n)) !== null) {
      const slice = extractLeadingJsonObject(n.slice(m.index));
      if (!slice) continue;
      try {
        const data = JSON.parse(slice) as GasPostJson;
        if (data && typeof data === "object" && data.ok === true && data.saved === true) return data;
      } catch {
        /* next occurrence */
      }
    }
  }
  return null;
}

function collectGasBalancedJsonSlices(raw: string): string[] {
  const primary = gasPrepare(raw);
  const variants = primary.includes('\\"') ? [primary, primary.replace(/\\"/g, '"')] : [primary];
  const candidates = new Set<string>();
  for (const trimmed of variants) {
    for (let i = 0; i < trimmed.length; i++) {
      if (trimmed[i] !== "{") continue;
      const slice = extractLeadingJsonObject(trimmed.slice(i));
      if (slice) candidates.add(slice);
    }
  }
  return [...candidates];
}

/** Prefer objects where doPost confirmed append (same markers Apps Script returns). */
function parseGasPostJsonSavedOnly(raw: string): GasPostJson | null {
  for (const c of collectGasBalancedJsonSlices(raw)) {
    try {
      const data = JSON.parse(c) as GasPostJson;
      if (data && typeof data === "object" && data.ok === true && data.saved === true) return data;
    } catch {
      /* next candidate */
    }
  }
  return null;
}

/** First parseable `{…}` slice — used only for structured error messages when save wasn’t detected. */
function parseGasPostJsonAny(raw: string): GasPostJson | null {
  for (const c of collectGasBalancedJsonSlices(raw)) {
    try {
      const data = JSON.parse(c) as GasPostJson;
      if (data && typeof data === "object") return data;
    } catch {
      /* next candidate */
    }
  }
  return null;
}

export function PropertyPartnerships() {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [suburbFilter, setSuburbFilter] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("price-desc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [page, setPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [dialogStep, setDialogStep] = useState<"form" | "success">("form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState<string>(CONTACT_OPTIONS[0].value);
  const [message, setMessage] = useState("");

  const [submitState, setSubmitState] = useState<"idle" | "loading" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const base = import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    const safeUrl = `${base}data/properties.json`;

    (async () => {
      try {
        const res = await fetch(safeUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`Could not load listings (${res.status})`);
        const json: unknown = await res.json();
        if (cancelled) return;
        setListings(parsePropertyListings(json));
        setLoadError(null);
      } catch {
        if (!cancelled) {
          setListings([]);
          setLoadError("We couldn’t load property listings. Please refresh the page or try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const typeFilteredListings = useMemo(() => {
    if (filter === "all") return listings;
    return listings.filter((p) => p.type === filter);
  }, [listings, filter]);

  const priceBounds = useMemo(() => computePriceBounds(typeFilteredListings), [typeFilteredListings]);

  const priceSliderReady = priceBounds.max > priceBounds.min;

  useEffect(() => {
    if (!priceSliderReady) return;
    setPriceRange([priceBounds.min, priceBounds.max]);
  }, [priceBounds.min, priceBounds.max, priceSliderReady]);

  const isPriceFilterActive =
    priceSliderReady && (priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max);

  const filtered = useMemo(() => {
    let rows = listings;
    if (filter !== "all") rows = rows.filter((p) => p.type === filter);

    const q = searchQuery.trim().toLowerCase();
    if (q) rows = rows.filter((p) => listingSearchHaystack(p).includes(q));

    if (suburbFilter) rows = rows.filter((p) => p.suburb === suburbFilter);

    if (isPriceFilterActive) {
      rows = rows.filter((p) => {
        const price = parsePriceSortValue(p.price);
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    const manual = rows.filter((p) => p.syncSource === "manual" || p.directFromCharity);
    const synced = rows.filter((p) => !(p.syncSource === "manual" || p.directFromCharity));

    const sortedSynced = [...synced].sort((a, b) => {
      if (sortOption === "suburb-asc") return a.suburb.localeCompare(b.suburb, undefined, { sensitivity: "base" });
      const pa = parsePriceSortValue(a.price);
      const pb = parsePriceSortValue(b.price);
      return sortOption === "price-asc" ? pa - pb : pb - pa;
    });

    return [...manual, ...sortedSynced];
  }, [listings, filter, searchQuery, suburbFilter, sortOption, isPriceFilterActive, priceRange]);

  const suburbOptions = useMemo(() => {
    const set = new Set(listings.map((p) => p.suburb.trim()).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }, [listings]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [filter, searchQuery, suburbFilter, sortOption, priceRange]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const clearListingFilters = useCallback(() => {
    setSearchQuery("");
    setSuburbFilter("");
    setSortOption("price-desc");
    setFilter("all");
    if (priceSliderReady) setPriceRange([priceBounds.min, priceBounds.max]);
    setPage(1);
  }, [priceBounds.max, priceBounds.min, priceSliderReady]);

  const hasActiveFilters =
    filter !== "all" ||
    searchQuery.trim() !== "" ||
    suburbFilter !== "" ||
    sortOption !== "price-desc" ||
    isPriceFilterActive;

  /** Hide All / Rent / Sale tabs when every listing is the same type (avoids an empty tab). */
  const showListingTypeTabs = useMemo(() => {
    if (listings.length < 2) return false;
    const hasRent = listings.some((p) => p.type === "rent");
    const hasSale = listings.some((p) => p.type === "sale");
    return hasRent && hasSale;
  }, [listings]);

  const resetFormFields = useCallback(() => {
    setName("");
    setEmail("");
    setPhone("");
    setContactMethod(CONTACT_OPTIONS[0].value);
    setMessage("");
    setSubmitError("");
    setSubmitState("idle");
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedProperty(null);
      setDialogStep("form");
      resetFormFields();
    }
  };

  const openInterest = (p: PropertyListing) => {
    resetFormFields();
    setSelectedProperty(p);
    setDialogStep("form");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    if (!PROPERTY_ENQUIRY_SUBMIT_URL) {
      setSubmitState("error");
      setSubmitError(
        `Online enquiries are not connected yet. Please email ${FALLBACK_ENQUIRY_EMAIL} with the property you’re interested in.`
      );
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setSubmitState("error");
      setSubmitError("Please fill in your name, email, and phone number.");
      return;
    }

    const payload: Record<string, unknown> = {
      ...(PROPERTY_ENQUIRY_SECRET ? { secret: PROPERTY_ENQUIRY_SECRET } : {}),
      timestamp: new Date().toISOString(),
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title,
      propertyType: selectedProperty.type,
      suburb: selectedProperty.suburb,
      visitorName: name.trim(),
      visitorEmail: email.trim(),
      visitorPhone: phone.trim(),
      contactMethod,
      message: message.trim(),
      agentEmail: selectedProperty.agentEmail,
      originalListingUrl: selectedProperty.originalListingUrl,
      status: "new",
      notes: "",
    };

    const formBody = new URLSearchParams({ json: JSON.stringify(payload) }).toString();

    setSubmitState("loading");
    setSubmitError("");

    const postInit = {
      method: "POST" as const,
      cache: "no-store" as const,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody,
    };

    try {
      let res: Response;
      let raw: string;

      try {
        res = await fetchGasWebAppPostFollow(PROPERTY_ENQUIRY_SUBMIT_URL, formBody);
        raw = await res.text();
      } catch {
        /* Same recovery path as KeepItInTheFamily: some browsers choke on GAS redirects even though POST should reach Google. */
        await fetch(PROPERTY_ENQUIRY_SUBMIT_URL, { ...postInit, mode: "no-cors" });
        setDialogStep("success");
        resetFormFields();
        return;
      }

      if (res.ok && gasBodyLooksLikeDoGetOnly(raw)) {
        res = await fetchGasWebAppPostManualHops(PROPERTY_ENQUIRY_SUBMIT_URL, formBody);
        raw = await res.text();
      }

      let data =
        gasEmptyTrustedSuccess(res, raw) ??
        parseGasWholeBodySaved(raw) ??
        parseGasSavedNearOkKey(raw) ??
        parseGasPostJsonSavedOnly(raw) ??
        gasSavedFromBoundedMarkers(raw);

      if ((!data || data.ok !== true || data.saved !== true) && gasBodyIndicatesSaved(raw)) {
        data = { ok: true, saved: true };
      }

      if (!data) {
        data = gasMacrosOptimisticSaved(res, raw);
      }

      if (!data) {
        data = parseGasPostJsonAny(raw);
      }

      if (!data) {
        setSubmitState("error");
        setSubmitError(
          "The enquiry server did not return readable JSON (often a Google sign‑in page or an outdated Apps Script deploy). Redeploy Apps Script → Web app → Who has access: **Anyone**. See docs/PROPERTY_ENQUIRY_SHEET_SETUP.md."
        );
        return;
      }
      if (data.ok === true && data.saved === true) {
        setDialogStep("success");
        resetFormFields();
        return;
      }
      setSubmitState("error");
      setSubmitError(
        data.error ||
          (data.live && !data.saved
            ? "The server responded without saving your enquiry (often an outdated Apps Script). Copy the latest Code.gs from the charity repo, deploy again, then retry."
            : `Something went wrong (${res.status}). Try again later.`)
      );
    } catch {
      setSubmitState("error");
      setSubmitError(
        "Network error reaching Google Apps Script. Check your connection and try again. If it persists, email " +
          FALLBACK_ENQUIRY_EMAIL +
          " with the property you’re interested in."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-100/90 mb-2">Property</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">Property Partnerships</h1>
          <p className="text-xl sm:text-2xl font-semibold text-white mb-4">Find a home while supporting Tucker Family Charity</p>
          <p className="text-lg text-amber-100 leading-relaxed max-w-3xl mx-auto">
            Through selected property partnerships, supporters can enquire about homes for rent or sale while helping
            generate support for Tucker Family Charity. When a successful rental or sale comes through the charity
            referral route, a contribution may be made back to the charity.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollToId("available-properties")}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-amber-900 font-semibold hover:bg-amber-50 transition-colors"
            >
              View Properties
            </button>
            <button
              type="button"
              onClick={() => scrollToId("how-it-works")}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-white/80 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-16 md:py-20 bg-white border-t border-amber-100/80 scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-200/80 text-amber-900 mb-4">
                <Search className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">1. Browse selected properties</h3>
              <p className="text-neutral-700 leading-relaxed">
                Explore homes and other listings available through Tucker Family Charity — including selected partner
                properties and charity direct lets.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-200/80 text-amber-900 mb-4">
                <Home className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">2. Register your interest</h3>
              <p className="text-neutral-700 leading-relaxed">
                Submit your details for the property you want. Straight after, we show you the link to the full listing so
                you can read every detail — and Tucker Family Charity can reach out to you.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-200/80 text-amber-900 mb-4">
                <HeartHandshake className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">3. Support the charity</h3>
              <p className="text-neutral-700 leading-relaxed">
                If your enquiry leads to a successful rental or purchase, the partnership may generate support for
                Tucker Family Charity.
              </p>
            </div>
          </div>
          <p className="mt-10 text-sm text-neutral-600 text-center max-w-2xl mx-auto leading-relaxed">
            Tucker Family Charity does not guarantee a specific contribution from any enquiry. Partnership terms apply
            when a referral is recognised by the property partner.
          </p>
        </div>
      </section>

      {/* Listings */}
      <section
        id="available-properties"
        className="py-16 md:py-20 bg-amber-50 border-t border-amber-100/80 scroll-mt-24"
        aria-labelledby="properties-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="properties-heading" className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-4">
            Available Properties
          </h2>
          <p
            className={
              "text-center text-neutral-600 max-w-2xl mx-auto leading-relaxed " +
              (showListingTypeTabs ? "mb-10" : "mb-12")
            }
          >
            Charity-tracked listings — Byron Thomas Properties partnership stock plus Tucker Family Charity direct lets.
            Register your interest to unlock the full listing link; we’ll follow up with you. Listings sync weekly from our
            property partner.
          </p>

          {showListingTypeTabs ? (
            <div
              className="flex flex-wrap justify-center gap-2 mb-12"
              role="tablist"
              aria-label="Filter by listing type"
            >
              <button type="button" role="tab" aria-selected={filter === "all"} className={filterBtn(filter === "all")} onClick={() => setFilter("all")}>
                All
              </button>
              <button type="button" role="tab" aria-selected={filter === "rent"} className={filterBtn(filter === "rent")} onClick={() => setFilter("rent")}>
                For Rent
              </button>
              <button type="button" role="tab" aria-selected={filter === "sale"} className={filterBtn(filter === "sale")} onClick={() => setFilter("sale")}>
                For Sale
              </button>
            </div>
          ) : null}

          {!loading && !loadError && listings.length > 0 ? (
            <div className="mb-10 space-y-4">
              <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
                <label className="flex-1 block">
                  <span className="sr-only">Search properties</span>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-900/50" aria-hidden />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search suburb, title, price, or web ref…"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 bg-white text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    />
                  </div>
                </label>
                <label className="lg:w-56 block">
                  <span className="block text-xs font-semibold text-amber-900/70 mb-1">Suburb</span>
                  <select
                    value={suburbFilter}
                    onChange={(e) => setSuburbFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-amber-200 bg-white text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <option value="">All suburbs</option>
                    {suburbOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="lg:w-48 block">
                  <span className="block text-xs font-semibold text-amber-900/70 mb-1">Sort</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="w-full px-3 py-2.5 rounded-xl border border-amber-200 bg-white text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <option value="price-desc">Price: high to low</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="suburb-asc">Suburb: A to Z</option>
                  </select>
                </label>
              </div>
              {priceSliderReady ? (
                <div className="rounded-xl border border-amber-200 bg-white px-4 py-4 sm:px-5 shadow-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-amber-900/70">Price range</span>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm font-semibold text-amber-950 tabular-nums">
                      <span>
                        Min{" "}
                        <span className="text-base font-bold">
                          {formatPriceLabel(priceRange[0])}
                          {filter === "rent" ? " / mo" : ""}
                        </span>
                      </span>
                      <span className="text-amber-300 hidden sm:inline" aria-hidden>
                        —
                      </span>
                      <span>
                        Max{" "}
                        <span className="text-base font-bold">
                          {formatPriceLabel(priceRange[1])}
                          {filter === "rent" ? " / mo" : ""}
                        </span>
                      </span>
                    </div>
                  </div>
                  <Slider
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={priceBounds.step}
                    value={priceRange}
                    onValueChange={(value) => {
                      if (value.length >= 2) setPriceRange([value[0], value[1]]);
                    }}
                    aria-label="Filter by price range"
                    className="py-2 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-amber-100 [&_[data-slot=slider-range]]:bg-amber-600 [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-amber-600 [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:shadow-md [&_[data-slot=slider-thumb]]:hover:ring-4 [&_[data-slot=slider-thumb]]:hover:ring-amber-200"
                  />
                  <div className="mt-2 flex justify-between text-xs text-neutral-500 tabular-nums">
                    <span>
                      {formatPriceLabel(priceBounds.min)}
                      {filter === "rent" ? " / mo" : ""}
                    </span>
                    <span>
                      {formatPriceLabel(priceBounds.max)}
                      {filter === "rent" ? " / mo" : ""}
                    </span>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600">
                <p>
                  {filtered.length === 0
                    ? "No properties match your filters."
                    : `Showing ${paginated.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} properties`}
                </p>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={clearListingFilters}
                    className="font-semibold text-amber-800 hover:text-amber-950 underline-offset-2 hover:underline"
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {loading ? (
            <p className="text-center text-neutral-600 py-12">Loading properties…</p>
          ) : loadError ? (
            <p className="text-center text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-xl mx-auto">
              {loadError}
            </p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-neutral-600">
                {listings.length === 0
                  ? "No properties are listed yet. Check back soon."
                  : "No properties match your search or filters."}
              </p>
              {listings.length > 0 && hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearListingFilters}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
              {paginated.map((p) => {
                const chips = propertyListingCardFeatures(p);
                const teaser = propertyListingCardTeaser(p);
                const referral = propertyListingReferralNote(p);
                return (
                  <article
                    key={p.id}
                    className={
                      "flex flex-col h-full rounded-2xl border bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden " +
                      (p.directFromCharity
                        ? "border-amber-300/70 ring-1 ring-inset ring-amber-200"
                        : "border-neutral-200/90 hover:border-amber-200/80")
                    }
                  >
                    <div className="relative aspect-video bg-neutral-100 shrink-0">
                      <ImageWithFallback
                        src={resolvePropertyImageUrl(p.image)}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span
                        className={
                          p.type === "rent"
                            ? "absolute top-3 left-3 uppercase tracking-wide rounded-md bg-neutral-900/90 text-white text-[11px] font-bold px-2.5 py-1.5 shadow"
                            : "absolute top-3 left-3 uppercase tracking-wide rounded-md bg-amber-700 text-white text-[11px] font-bold px-2.5 py-1.5 shadow"
                        }
                      >
                        {p.type === "rent" ? "To let" : "For sale"}
                      </span>
                    </div>

                    <div className="p-6 sm:p-7 flex flex-col flex-1 min-h-0 gap-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">{p.title}</h3>
                        <p className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-amber-900/85">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-85" aria-hidden />
                          <span>{p.suburb}</span>
                        </p>
                        <p className="mt-2 text-xl font-semibold text-neutral-900 tracking-tight">{p.price}</p>
                      </div>

                      {chips.length > 0 ? (
                        <ul className="grid grid-cols-2 gap-2" aria-label="Key features">
                          {chips.map((label, i) => (
                            <li
                              key={label}
                              className={
                                "rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700 text-center sm:text-left min-w-0 " +
                                (chips.length % 2 === 1 && i === chips.length - 1 ? "col-span-2" : "")
                              }
                            >
                              {label}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <p className="text-sm leading-relaxed text-neutral-700 line-clamp-2 flex-1 min-h-[2.75rem]">
                        {teaser}
                      </p>

                      <div className="rounded-xl border border-amber-100/90 bg-amber-50/80 px-3.5 py-3 flex gap-2.5">
                        <Shield
                          className="w-4 h-4 shrink-0 text-amber-800 mt-0.5 opacity-90"
                          strokeWidth={2}
                          aria-hidden
                        />
                        <p className="text-xs text-neutral-700 leading-relaxed">{referral}</p>
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Full listing link is shared after you register your interest — your enquiry stays tied to Tucker
                        Family Charity.
                      </p>

                      <button
                        type="button"
                        onClick={() => openInterest(p)}
                        className="mt-auto w-full text-center py-3.5 px-4 rounded-xl bg-amber-600 text-white font-semibold text-[15px] hover:bg-amber-700 transition-colors shadow-sm"
                      >
                        I&apos;m Interested
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            {totalPages > 1 ? (
              <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Property listings pagination">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-full text-sm font-semibold border border-amber-200 bg-white disabled:opacity-40 hover:bg-amber-50 transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 text-sm text-neutral-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 rounded-full text-sm font-semibold border border-amber-200 bg-white disabled:opacity-40 hover:bg-amber-50 transition-colors"
                >
                  Next
                </button>
              </nav>
            ) : null}
            </>
          )}
        </div>
      </section>

      <Dialog open={selectedProperty != null} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[min(90vh,720px)] overflow-y-auto">
          {dialogStep === "success" ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Thank you</DialogTitle>
                <DialogDescription className="text-base text-neutral-700 leading-relaxed pt-2">
                  {selectedProperty && isExternalListingUrl(selectedProperty.originalListingUrl) ? (
                    <>
                      Your details are saved. Below is the link to the full listing — Tucker Family Charity will contact
                      you to follow up.
                      {selectedProperty.directFromCharity
                        ? ""
                        : " For partnership listings, the property partner may contact you as well."}
                    </>
                  ) : (
                    <>
                      Your details are saved. Tucker Family Charity will contact you to follow up with the full listing
                      details.
                      {selectedProperty?.directFromCharity
                        ? ""
                        : " For partnership listings, the property partner may contact you as well."}
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-neutral-600 leading-relaxed">
                We ask you to register first so we have a way to reach you and so your enquiry stays tied to Tucker
                Family Charity
                {selectedProperty?.directFromCharity ? "." : " and the partnership referral route."}
              </p>
              {selectedProperty && isExternalListingUrl(selectedProperty.originalListingUrl) ? (
                <div className="rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm">
                  <p className="font-semibold text-neutral-900 mb-2">
                    You can also open the full listing on{" "}
                    {listingSiteShortName(selectedProperty.originalListingUrl)}:
                  </p>
                  <p className="text-neutral-600 mb-3">
                    {selectedProperty.directFromCharity ? (
                      <>
                        Use it for photos, specs, and next steps on that site. If you contact the agent there, please
                        mention Tucker Family Charity.
                      </>
                    ) : (
                      <>
                        Open the full{" "}
                        {listingSiteShortName(selectedProperty.originalListingUrl)} listing for every detail. If you
                        speak to the agent, please mention Tucker Family Charity so the referral stays connected.
                      </>
                    )}
                  </p>
                  <a
                    href={selectedProperty.originalListingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-4 py-2.5 font-semibold text-amber-800 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                  >
                    Open listing on {listingSiteShortName(selectedProperty.originalListingUrl)}
                    <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
                  </a>
                </div>
              ) : null}
              <DialogFooter className="sm:justify-start pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="inline-flex justify-center px-6 py-2.5 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
                >
                  Close
                </button>
              </DialogFooter>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Register your interest</DialogTitle>
                <DialogDescription>
                  {selectedProperty ? (
                    <>
                      <span className="font-semibold text-neutral-800">{selectedProperty.title}</span>
                      <span className="text-neutral-600"> · {selectedProperty.suburb}</span>
                      <span className="block text-neutral-600 mt-2 text-sm leading-relaxed">
                        After you submit, we&apos;ll show you the link to the full listing and Tucker Family Charity
                        will be able to contact you.
                      </span>
                    </>
                  ) : null}
                </DialogDescription>
              </DialogHeader>

              <input type="hidden" name="propertyId" value={selectedProperty?.id ?? ""} readOnly />
              <input type="hidden" name="propertyTitle" value={selectedProperty?.title ?? ""} readOnly />

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-neutral-900" htmlFor="ppe-name">
                  Full name <span className="text-red-600">*</span>
                </label>
                <input
                  id="ppe-name"
                  name="visitorName"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-neutral-900" htmlFor="ppe-email">
                  Email address <span className="text-red-600">*</span>
                </label>
                <input
                  id="ppe-email"
                  name="visitorEmail"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-neutral-900" htmlFor="ppe-phone">
                  Phone number <span className="text-red-600">*</span>
                </label>
                <input
                  id="ppe-phone"
                  name="visitorPhone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-neutral-900" htmlFor="ppe-contact">
                  Preferred contact method
                </label>
                <select
                  id="ppe-contact"
                  name="contactMethod"
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 px-4 py-2.5 text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {CONTACT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-neutral-900" htmlFor="ppe-message">
                  Message / notes
                </label>
                <textarea
                  id="ppe-message"
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y min-h-[100px]"
                  placeholder="Tell us about your timeline, viewing availability, or questions."
                />
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                By submitting, your details are sent to Tucker Family Charity so we can share the listing link (on the
                next screen) and follow up with you.
                {selectedProperty?.directFromCharity
                  ? ""
                  : " Our property partner may also contact you about this home."}
              </p>

              {PROPERTY_ENQUIRY_SUBMIT_URL_REJECTED ? (
                <p className="text-sm text-red-900 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  This build has an invalid enquiry URL. In GitHub → Settings → Secrets, put your Apps Script{" "}
                  <strong>web app</strong> link (
                  <code className="text-xs bg-white px-1 rounded">https://script.google.com/macros/s/…/exec</code>) in{" "}
                  <code className="text-xs bg-white px-1 rounded">VITE_PROPERTY_ENQUIRY_SUBMIT_URL</code>. Put an optional
                  shared password only in{" "}
                  <code className="text-xs bg-white px-1 rounded">VITE_PROPERTY_ENQUIRY_SECRET</code>. Redeploy after
                  fixing.
                </p>
              ) : null}

              {!PROPERTY_ENQUIRY_SUBMIT_URL && !PROPERTY_ENQUIRY_SUBMIT_URL_REJECTED ? (
                <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Online enquiries are not connected on this build yet. Add{" "}
                  <code className="text-xs bg-white px-1 rounded">VITE_PROPERTY_ENQUIRY_SUBMIT_URL</code> so submissions
                  go to your Google Sheet (see{" "}
                  <span className="font-medium">docs/PROPERTY_ENQUIRY_SHEET_SETUP.md</span>).
                </p>
              ) : null}

              {submitError ? (
                <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2" role="alert">
                  {submitError}
                </p>
              ) : null}

              <DialogFooter className="gap-2 sm:gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="inline-flex justify-center px-4 py-2.5 rounded-xl border border-amber-200 text-neutral-900 font-semibold hover:bg-amber-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitState === "loading"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors disabled:opacity-70"
                >
                  <Send className="w-4 h-4 shrink-0" aria-hidden />
                  {submitState === "loading" ? "Sending…" : "Send enquiry"}
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
