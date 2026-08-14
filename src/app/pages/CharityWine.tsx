import { useCallback, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2, Loader2, Send, Wine } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  WINE_ORDER_SECRET,
  WINE_ORDER_SUBMIT_URL,
} from "@/config";
import {
  buildWineOrderFormSubmitBody,
  buildWineOrderPayload,
  charityWineVariants,
  computeWineOrderSummary,
  formatWinePriceZar,
  ORDER_EMAIL,
  wineDeliveryZoneOptions,
  wineDisplayName,
  wineFullLabel,
  winePageCopy,
  winePriceLabel,
  WINE_BOTTLES_PER_CASE,
  WINE_ORDER_FORMSUBMIT_URL,
  type WineDeliveryZone,
} from "@/data/charityWine";

type SubmitState = "idle" | "loading" | "success" | "error";

function emptyQuantities(): Record<string, number> {
  return Object.fromEntries(charityWineVariants.map((w) => [w.slug, 0]));
}

export function CharityWine() {
  const [quantities, setQuantities] = useState<Record<string, number>>(emptyQuantities);
  const [previewSlug, setPreviewSlug] = useState(charityWineVariants[0].slug);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<WineDeliveryZone | "">("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState("");

  const previewWine = useMemo(
    () => charityWineVariants.find((w) => w.slug === previewSlug) ?? charityWineVariants[0],
    [previewSlug],
  );

  const orderSummary = useMemo(
    () => computeWineOrderSummary(quantities, deliveryZone),
    [quantities, deliveryZone],
  );

  const setWineQuantity = useCallback((slug: string, raw: number) => {
    const quantity = Math.max(0, Math.min(99, Math.floor(raw) || 0));
    setQuantities((prev) => ({ ...prev, [slug]: quantity }));
  }, []);

  const resetForm = useCallback(() => {
    setQuantities(emptyQuantities());
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setDeliveryZone("");
    setDeliveryAddress("");
    setNotes("");
    setHoneypot("");
    setSubmitError("");
    setSubmitState("idle");
  }, []);

  const submitViaAppsScript = async (
    payload: ReturnType<typeof buildWineOrderPayload>,
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!WINE_ORDER_SUBMIT_URL) return { ok: false };

    const formBody = new URLSearchParams({ json: JSON.stringify(payload) }).toString();
    const postInit = {
      method: "POST" as const,
      cache: "no-store" as const,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody,
    };

    try {
      const res = await fetch(WINE_ORDER_SUBMIT_URL, { ...postInit, mode: "cors" });
      let data: { ok?: boolean; saved?: boolean; error?: string } = {};
      try {
        data = (await res.json()) as typeof data;
      } catch {
        /* non-JSON */
      }

      if (data.ok === true && data.saved === true) return { ok: true };

      return { ok: false, error: data.error || winePageCopy.submitErrorGeneric };
    } catch {
      try {
        await fetch(WINE_ORDER_SUBMIT_URL, { ...postInit, mode: "no-cors" });
        return { ok: true };
      } catch {
        return { ok: false };
      }
    }
  };

  const submitViaFormSubmit = async (): Promise<boolean> => {
    try {
      const res = await fetch(WINE_ORDER_FORMSUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(
          buildWineOrderFormSubmitBody({
            customerName,
            customerEmail,
            customerPhone,
            deliveryZone: deliveryZone as WineDeliveryZone,
            deliveryAddress,
            notes,
            orderSummary,
          }),
        ),
      });

      let data: { success?: string } = {};
      try {
        data = (await res.json()) as typeof data;
      } catch {
        /* non-JSON */
      }

      return Boolean(res.ok && data.success);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitState === "loading" || submitState === "success") return;

    setSubmitError("");

    if (honeypot.trim()) {
      setSubmitState("success");
      return;
    }

    if (orderSummary.totalCases < 1) {
      setSubmitState("error");
      setSubmitError("Please select at least one case.");
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !deliveryZone || !deliveryAddress.trim()) {
      setSubmitState("error");
      setSubmitError("Please fill in your name, email, phone, delivery area, and address.");
      return;
    }

    setSubmitState("loading");

    const payload = buildWineOrderPayload({
      customerName,
      customerEmail,
      customerPhone,
      deliveryZone: deliveryZone as WineDeliveryZone,
      deliveryAddress,
      notes,
      quantities,
      secret: WINE_ORDER_SECRET || undefined,
    });
    payload.website = honeypot;

    // FormSubmit = email (Brett + CC Samuel). Apps Script = Sheet log only (no email).
    const [emailOk, gasResult] = await Promise.all([
      submitViaFormSubmit(),
      WINE_ORDER_SUBMIT_URL ? submitViaAppsScript(payload) : Promise.resolve({ ok: false }),
    ]);

    if (emailOk || gasResult.ok) {
      setSubmitState("success");
      return;
    }

    setSubmitState("error");
    setSubmitError(
      gasResult.error || `${winePageCopy.submitErrorGeneric} Email ${ORDER_EMAIL} with your order.`,
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main id="main-content">

      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-6 md:py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">{winePageCopy.title}</h1>
          <p className="text-sm sm:text-base text-amber-100">{winePageCopy.intro}</p>
          <p className="mt-2 text-sm sm:text-base text-amber-100/95">{winePageCopy.impactLine}</p>
          <p className="mt-4 text-sm sm:text-base text-white/95 bg-white/10 rounded-xl px-4 py-3 leading-relaxed">
            <strong>{winePageCopy.deliveryNoticeHeading}:</strong> {winePageCopy.deliveryNoticeBody}
          </p>
          <p className="mt-3 text-sm text-amber-100/95">{winePageCopy.caseNotice}</p>

          <Link
            to="/shop"
            className="mt-5 inline-flex w-full sm:w-auto justify-center items-center gap-2 py-3 px-5 rounded-xl border-2 border-white/80 text-white font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
            Back to shop
          </Link>
        </div>
      </section>

      <section className="py-12 md:py-16 border-t border-amber-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitState === "success" ? (
            <div className="max-w-xl mx-auto text-center space-y-6 py-8">
              <CheckCircle2 className="w-14 h-14 text-amber-600 mx-auto" aria-hidden />
              <p className="text-lg text-neutral-800 leading-relaxed">{winePageCopy.successMessage}</p>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
              >
                Place another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
              <div className="order-2 lg:order-1 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                    <Wine className="w-5 h-5 text-amber-700 shrink-0" aria-hidden />
                    {winePageCopy.featuresHeading}
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-700 leading-relaxed">
                    {winePageCopy.features.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-neutral-900 mb-2">{winePageCopy.chooseHeading}</h2>
                  <p className="text-neutral-700 leading-relaxed mb-4">{winePageCopy.chooseBlurb}</p>
                  <div className="space-y-3">
                    {charityWineVariants.map((wine) => {
                      const qty = quantities[wine.slug] ?? 0;
                      return (
                        <div
                          key={wine.slug}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-amber-100 bg-white p-3 shadow-sm"
                        >
                          <button
                            type="button"
                            onClick={() => setPreviewSlug(wine.slug)}
                            className="flex items-center gap-3 flex-1 min-w-0 text-left"
                          >
                            <div className="relative w-14 h-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                              <ImageWithFallback
                                src={wine.image}
                                alt={wineFullLabel(wine)}
                                className="absolute inset-0 w-full h-full object-contain p-0.5"
                                loading="lazy"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-neutral-900">{wineDisplayName(wine)}</p>
                              <p className="text-xs text-neutral-600">{wine.varietal}</p>
                              <p className="text-xs font-medium text-amber-800 mt-0.5">{winePriceLabel(wine)}</p>
                            </div>
                          </button>
                          <label className="shrink-0 sm:w-28">
                            <span className="block text-xs font-semibold text-neutral-600 mb-1">
                              {winePageCopy.quantityLabel}
                            </span>
                            <input
                              type="number"
                              min={0}
                              max={99}
                              value={qty}
                              onChange={(e) => setWineQuantity(wine.slug, Number(e.target.value))}
                              className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {orderSummary.totalCases > 0 ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                    <h3 className="text-sm font-bold text-neutral-900 mb-3">{winePageCopy.orderSummaryHeading}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="text-xs uppercase tracking-wide text-neutral-500 border-b border-amber-200/80">
                            <th className="py-2 pr-2 font-semibold">Wine</th>
                            <th className="py-2 px-2 font-semibold text-center">Cases</th>
                            <th className="py-2 px-2 font-semibold text-center">Bottles</th>
                            <th className="py-2 px-2 font-semibold text-right">Case price</th>
                            <th className="py-2 pl-2 font-semibold text-right">Line total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderSummary.rows.map(
                            ({ wine, caseQuantity, bottleQuantity, pricePerCaseZar, lineTotalZar }) => (
                            <tr key={wine.slug} className="border-b border-amber-100/80 last:border-0">
                              <td className="py-2 pr-2 text-neutral-800">{wineFullLabel(wine)}</td>
                              <td className="py-2 px-2 text-center tabular-nums">{caseQuantity}</td>
                              <td className="py-2 px-2 text-center tabular-nums">{bottleQuantity}</td>
                              <td className="py-2 px-2 text-right tabular-nums">
                                {formatWinePriceZar(pricePerCaseZar)}
                              </td>
                              <td className="py-2 pl-2 text-right tabular-nums font-medium">
                                {formatWinePriceZar(lineTotalZar)}
                              </td>
                            </tr>
                          ),
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 pt-3 border-t border-amber-200/80 space-y-2 text-sm">
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-neutral-700">
                          Total cases: <strong>{orderSummary.totalCases}</strong>
                        </span>
                        <span className="text-neutral-700">
                          Total bottles: <strong>{orderSummary.totalBottles}</strong>
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-neutral-700">
                          Wine subtotal:{" "}
                          <strong>{formatWinePriceZar(orderSummary.wineSubtotalZar)}</strong>
                        </span>
                      </div>
                      {orderSummary.deliveryFeeZar != null ? (
                        <div className="flex flex-wrap justify-between gap-2">
                          <span className="text-neutral-700">
                            Delivery ({orderSummary.deliveryZoneLabel}):{" "}
                            <strong>{formatWinePriceZar(orderSummary.deliveryFeeZar)}</strong>
                          </span>
                        </div>
                      ) : (
                        <p className="text-neutral-600 text-xs">
                          Select a delivery area below to see the delivery charge (R50 Joburg / R200 elsewhere in SA).
                        </p>
                      )}
                      <div className="flex flex-wrap justify-between gap-2 pt-1 border-t border-amber-200/60">
                        <span className="text-neutral-900 font-semibold">Order total</span>
                        <span className="text-neutral-900 font-semibold">
                          {orderSummary.estimatedGrandTotalZar != null
                            ? formatWinePriceZar(orderSummary.estimatedGrandTotalZar)
                            : `${formatWinePriceZar(orderSummary.wineSubtotalZar)} + delivery`}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-neutral-900">{winePageCopy.detailsHeading}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="sm:col-span-2 block">
                      <span className="block text-sm font-semibold text-neutral-900 mb-1.5">{winePageCopy.nameLabel}</span>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-semibold text-neutral-900 mb-1.5">{winePageCopy.emailLabel}</span>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-semibold text-neutral-900 mb-1.5">{winePageCopy.phoneLabel}</span>
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </label>
                    <label className="sm:col-span-2 block">
                      <span className="block text-sm font-semibold text-neutral-900 mb-2">{winePageCopy.deliveryZoneLabel}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {wineDeliveryZoneOptions.map((option) => {
                          const active = deliveryZone === option.value;
                          return (
                            <label
                              key={option.value}
                              className={[
                                "flex items-start gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-colors",
                                active
                                  ? "border-amber-600 bg-amber-50/80 ring-2 ring-amber-200"
                                  : "border-amber-100 bg-white hover:border-amber-200",
                              ].join(" ")}
                            >
                              <input
                                type="radio"
                                name="delivery-zone"
                                value={option.value}
                                checked={active}
                                onChange={() => setDeliveryZone(option.value)}
                                className="mt-1 shrink-0 accent-amber-600"
                                required
                              />
                              <span>
                                <span className="block text-sm font-bold text-neutral-900">{option.label}</span>
                                <span className="block text-sm text-amber-800 font-semibold mt-0.5">
                                  {option.description}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </label>
                    <label className="sm:col-span-2 block">
                      <span className="block text-sm font-semibold text-neutral-900 mb-1.5">{winePageCopy.deliveryAddressLabel}</span>
                      <input
                        type="text"
                        required
                        autoComplete="street-address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder={winePageCopy.deliveryAddressPlaceholder}
                        className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="block text-sm font-semibold text-neutral-900 mb-1.5">{winePageCopy.notesLabel}</span>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={winePageCopy.notesPlaceholder}
                      className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y min-h-[88px]"
                    />
                  </label>
                </div>

                <div className="hidden" aria-hidden="true">
                  <label>
                    Website
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </label>
                </div>

                {submitState === "error" && submitError ? (
                  <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
                    {submitError}{" "}
                    <a href={`mailto:${ORDER_EMAIL}`} className="font-semibold underline-offset-2 hover:underline">
                      {ORDER_EMAIL}
                    </a>
                  </p>
                ) : null}

                <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-4 text-neutral-700 text-sm leading-relaxed">
                  <p>
                    <strong>{winePageCopy.questionsBlurb}</strong>{" "}
                    <a
                      href={`mailto:${ORDER_EMAIL}`}
                      className="font-semibold text-amber-800 hover:text-amber-900 underline-offset-2 hover:underline"
                    >
                      {winePageCopy.questionsCtaEmail}
                    </a>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitState === "loading" || orderSummary.totalCases < 1 || !deliveryZone}
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 py-3.5 px-8 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitState === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin shrink-0" aria-hidden />
                      {winePageCopy.orderCtaSending}
                    </>
                  ) : (
                    <>
                      {winePageCopy.orderCta}
                      <Send className="w-5 h-5 shrink-0" aria-hidden />
                    </>
                  )}
                </button>
              </div>

              <div className="order-1 lg:order-2 lg:sticky lg:top-24">
                <div className="rounded-2xl border-2 border-amber-100 bg-amber-50/50 overflow-hidden shadow-md">
                  <div className="relative aspect-[3/4] w-full bg-neutral-100">
                    <ImageWithFallback
                      src={previewWine.image}
                      alt={wineFullLabel(previewWine)}
                      className="absolute inset-0 w-full h-full object-contain p-4"
                      loading="eager"
                    />
                  </div>
                  <div className="p-4 text-center border-t border-amber-100/80 bg-white/80">
                    <p className="text-lg font-semibold text-neutral-900">{wineDisplayName(previewWine)}</p>
                    <p className="text-sm text-neutral-600 mt-1">{previewWine.varietal}</p>
                    <p className="text-sm font-medium text-amber-800 mt-2 leading-snug">{winePriceLabel(previewWine)}</p>
                    <p className="text-xs text-neutral-500 mt-1">{WINE_BOTTLES_PER_CASE} bottles per case</p>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
