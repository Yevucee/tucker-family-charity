import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ExternalLink, HeartHandshake, Home, Search, Send } from "lucide-react";
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
import {
  PROPERTY_ENQUIRY_SECRET,
  PROPERTY_ENQUIRY_SUBMIT_URL,
  PROPERTY_ENQUIRY_SUBMIT_URL_REJECTED,
} from "@/config";
import {
  parsePropertyListings,
  resolvePropertyImageUrl,
  type PropertyListing,
} from "@/data/propertyListing";

const FALLBACK_ENQUIRY_EMAIL = "info@tuckerfamilycharity.org";

type FilterTab = "all" | "rent" | "sale";

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

function isExternalListingUrl(url: string): boolean {
  const u = url.trim();
  return u.startsWith("http://") || u.startsWith("https://");
}

export function PropertyPartnerships() {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<FilterTab>("all");
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

  const filtered = useMemo(() => {
    if (filter === "all") return listings;
    return listings.filter((p) => p.type === filter);
  }, [listings, filter]);

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
    const postInit = {
      method: "POST" as const,
      cache: "no-store" as const,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody,
    };

    setSubmitState("loading");
    setSubmitError("");

    try {
      const res = await fetch(PROPERTY_ENQUIRY_SUBMIT_URL, { ...postInit, mode: "cors" });
      const raw = await res.text();
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = JSON.parse(raw) as { ok?: boolean; error?: string };
      } catch {
        setSubmitState("error");
        setSubmitError(
          "The enquiry server did not return JSON (often a Google sign‑in page). Redeploy Apps Script → Web app → Who has access: **Anyone** — not restricted to your organisation only. See docs/PROPERTY_ENQUIRY_SHEET_SETUP.md."
        );
        return;
      }
      if (!res.ok || data.ok !== true) {
        setSubmitState("error");
        setSubmitError(data.error || `Something went wrong (${res.status}). Try again later.`);
        return;
      }
      setDialogStep("success");
      resetFormFields();
    } catch {
      try {
        await fetch(PROPERTY_ENQUIRY_SUBMIT_URL, { ...postInit, mode: "no-cors" });
        setDialogStep("success");
        resetFormFields();
      } catch {
        setSubmitState("error");
        setSubmitError(
          "Network error. Check your connection and try again. If it persists, try another browser or network."
        );
      }
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
                Explore homes available through our property partner.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-200/80 text-amber-900 mb-4">
                <Home className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">2. Register your interest</h3>
              <p className="text-neutral-700 leading-relaxed">
                Submit your details for the property you are interested in.
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
          <p className="text-center text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Curated listings through our property partner. Details are updated manually—contact us if something looks out
            of date.
          </p>

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

          {loading ? (
            <p className="text-center text-neutral-600 py-12">Loading properties…</p>
          ) : loadError ? (
            <p className="text-center text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-xl mx-auto">
              {loadError}
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-neutral-600 py-12">
              No properties match this filter yet. Try another tab or check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-10">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="flex flex-col rounded-2xl border-2 border-amber-100 bg-white shadow-md hover:shadow-lg hover:border-amber-200/80 transition-all overflow-hidden"
                >
                  <div className="relative aspect-[4/3] bg-neutral-100">
                    <ImageWithFallback
                      src={resolvePropertyImageUrl(p.image)}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span
                      className={
                        p.type === "rent"
                          ? "absolute top-3 left-3 rounded-full bg-amber-700 text-white text-xs font-bold px-3 py-1 shadow"
                          : "absolute top-3 left-3 rounded-full bg-orange-700 text-white text-xs font-bold px-3 py-1 shadow"
                      }
                    >
                      {p.type === "rent" ? "For Rent" : "For Sale"}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 mb-1">{p.title}</h3>
                    <p className="text-sm text-amber-800 font-medium mb-2">{p.suburb}</p>
                    <p className="text-lg font-semibold text-neutral-900 mb-3">{p.price}</p>
                    <ul className="text-sm text-neutral-600 space-y-1 mb-4">
                      <li>
                        {p.bedrooms} bed · {p.bathrooms} bath
                        {p.parking ? ` · ${p.parking}` : null}
                      </li>
                    </ul>
                    <p className="text-neutral-700 text-sm leading-relaxed flex-1 mb-3">{p.description}</p>
                    {p.features && p.features.length > 0 ? (
                      <ul className="text-sm text-neutral-600 space-y-1 mb-4 list-disc list-inside">
                        {p.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                      The full listing on our property partner&apos;s site is shared with you after you register your
                      interest, so your enquiry is tracked through Tucker Family Charity.
                    </p>
                    <button
                      type="button"
                      onClick={() => openInterest(p)}
                      className="mt-auto w-full text-center py-3.5 px-4 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
                    >
                      I&apos;m Interested
                    </button>
                  </div>
                </article>
              ))}
            </div>
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
                  Your interest has been received and the property partner will be in touch with you soon.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Your enquiry helps Tucker Family Charity track support generated through this partnership.
              </p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Charity admins: confirm new rows appear on the enquiries Sheet after each test submission.
              </p>
              {selectedProperty && isExternalListingUrl(selectedProperty.originalListingUrl) ? (
                <div className="rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm">
                  <p className="font-semibold text-neutral-900 mb-2">View the full listing</p>
                  <p className="text-neutral-600 mb-3">
                    You can now open the detailed listing on Pam Golding in a new tab. Please mention Tucker Family
                    Charity if you follow up, so the referral stays connected.
                  </p>
                  <a
                    href={selectedProperty.originalListingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-amber-800 hover:text-amber-900"
                  >
                    Open listing on Pam Golding
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
                By submitting your interest, your details will be shared with Tucker Family Charity and the relevant
                property partner so they can respond to your enquiry.
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
