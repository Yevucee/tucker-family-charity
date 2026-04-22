import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link } from "react-router";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  adultHatColours,
  buildHatOrderMailto,
  HAT_PAYMENT_LINK,
  HAT_QUANTITY_MAX,
  HAT_QUANTITY_MIN,
  HAT_UNIT_PRICE_ZAR,
  hatPageCopy,
  hatVariantImageSrc,
  hatVariantsForFit,
  type HatFit,
} from "@/data/personalisedCharityHat";

const fitToggleBtn =
  "flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2";
const fitActive = "bg-amber-600 text-white shadow-sm";
const fitInactive = "bg-amber-50 text-amber-900 hover:bg-amber-100";

function namesAreComplete(names: string[]): boolean {
  return names.length > 0 && names.every((n) => n.trim().length > 0);
}

export function PersonalisedCharityHat() {
  const [fit, setFit] = useState<HatFit>("adult");
  const [selectedSlug, setSelectedSlug] = useState(adultHatColours[0].slug);
  const [quantity, setQuantity] = useState(1);
  const [names, setNames] = useState<string[]>([""]);
  const [namesTouched, setNamesTouched] = useState(false);

  useEffect(() => {
    setNames((prev) => {
      if (quantity === prev.length) return prev;
      if (quantity > prev.length) {
        return [...prev, ...Array(quantity - prev.length).fill("")];
      }
      return prev.slice(0, quantity);
    });
  }, [quantity]);

  const variants = hatVariantsForFit(fit);
  const selected =
    variants.find((v) => v.slug === selectedSlug) ?? variants[0] ?? adultHatColours[0];
  const previewSrc = hatVariantImageSrc(fit, selected.slug);
  const fitLabel = fit === "adult" ? hatPageCopy.fitAdultLabel : hatPageCopy.fitKidsLabel;

  const trimmedNames = useMemo(() => names.map((n) => n.trim()), [names]);

  const mailtoHref = useMemo(
    () =>
      buildHatOrderMailto({
        fit,
        colourLabel: selected.label,
        quantity,
        names: trimmedNames,
      }),
    [fit, selected.label, quantity, trimmedNames]
  );

  const namesInvalid = namesTouched && !namesAreComplete(names);
  const lineTotal = HAT_UNIT_PRICE_ZAR * quantity;

  const switchFit = (next: HatFit) => {
    setFit(next);
    const nextVariants = hatVariantsForFit(next);
    setSelectedSlug(nextVariants[0]?.slug ?? "aqua");
    setNamesTouched(false);
  };

  const validateNames = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!namesAreComplete(names)) {
      e.preventDefault();
      setNamesTouched(true);
    }
  };

  const setNameAt = (index: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (namesTouched) setNamesTouched(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-100/90 mb-2">
            Tucker products
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {hatPageCopy.title}
          </h1>
          <p className="text-lg text-amber-100 leading-relaxed">{hatPageCopy.intro}</p>
          <p className="mt-4 text-xl font-bold text-white">{hatPageCopy.priceLabel}</p>
          <p className="mt-2 text-amber-100">{hatPageCopy.impactLine}</p>
          <p className="mt-3 text-amber-50 font-medium">{hatPageCopy.tagline}</p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/95 hover:text-white underline-offset-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
            Back to shop
          </Link>
        </div>
      </section>

      <section className="py-12 md:py-16 border-t border-amber-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="order-2 lg:order-1 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-700 shrink-0" aria-hidden />
                  Details
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-neutral-700 leading-relaxed">
                  {hatPageCopy.features.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p id="fit-label" className="text-sm font-semibold text-neutral-900 mb-2">
                  Size
                </p>
                <div
                  className="inline-flex rounded-xl border border-amber-200 bg-white p-1 gap-1 w-full sm:w-auto"
                  role="group"
                  aria-labelledby="fit-label"
                >
                  <button
                    type="button"
                    className={`${fitToggleBtn} ${fit === "adult" ? fitActive : fitInactive}`}
                    aria-pressed={fit === "adult"}
                    onClick={() => switchFit("adult")}
                  >
                    {hatPageCopy.fitAdultLabel} (13 colours)
                  </button>
                  <button
                    type="button"
                    className={`${fitToggleBtn} ${fit === "kids" ? fitActive : fitInactive}`}
                    aria-pressed={fit === "kids"}
                    onClick={() => switchFit("kids")}
                  >
                    {hatPageCopy.fitKidsLabel} (5 colours)
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="hat-colour" className="text-sm font-semibold text-neutral-900 block mb-2">
                  {hatPageCopy.coloursHeading}
                </label>
                <div className="flex gap-3 items-center">
                  <span
                    className="h-10 w-10 shrink-0 rounded-full border border-neutral-200/80 shadow-inner"
                    style={{ backgroundColor: selected.swatchHex }}
                    aria-hidden
                  />
                  <select
                    id="hat-colour"
                    value={selected.slug}
                    onChange={(e) => setSelectedSlug(e.target.value)}
                    className="w-full min-w-0 rounded-xl border border-amber-200 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {variants.map((v) => (
                      <option key={v.slug} value={v.slug}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="hat-quantity" className="text-sm font-semibold text-neutral-900 block mb-2">
                  {hatPageCopy.quantityLabel}
                </label>
                <input
                  id="hat-quantity"
                  type="number"
                  inputMode="numeric"
                  min={HAT_QUANTITY_MIN}
                  max={HAT_QUANTITY_MAX}
                  value={quantity}
                  onChange={(e) => {
                    const raw = Number.parseInt(e.target.value, 10);
                    if (Number.isNaN(raw)) return;
                    const q = Math.min(HAT_QUANTITY_MAX, Math.max(HAT_QUANTITY_MIN, raw));
                    setQuantity(q);
                  }}
                  className="w-full sm:w-32 rounded-xl border border-amber-200 px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-neutral-600">{hatPageCopy.quantityHint}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-neutral-900 mb-2">
                  {quantity === 1 ? hatPageCopy.personalisationLabel : hatPageCopy.nameEachLabel}
                </p>
                <p id="hat-name-hint" className="text-sm text-neutral-600 mb-3">
                  {quantity === 1 ? hatPageCopy.nameEachHintSingle : hatPageCopy.nameEachHintMulti}
                </p>
                <div className="space-y-3">
                  {names.map((name, i) => {
                    const fieldInvalid = namesTouched && !name.trim();
                    return (
                      <div key={i}>
                        {quantity > 1 ? (
                          <label
                            htmlFor={`hat-name-${i}`}
                            className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1"
                          >
                            Hat {i + 1}
                          </label>
                        ) : null}
                        <input
                          id={`hat-name-${i}`}
                          type="text"
                          autoComplete="off"
                          value={name}
                          onChange={(e) => setNameAt(i, e.target.value)}
                          aria-invalid={fieldInvalid}
                          aria-describedby={namesInvalid ? "hat-name-error" : "hat-name-hint"}
                          className={[
                            "w-full rounded-xl border px-4 py-3 text-neutral-900 placeholder:text-neutral-400",
                            "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent",
                            fieldInvalid ? "border-red-400" : "border-amber-200",
                          ].join(" ")}
                          placeholder={quantity === 1 ? "e.g. Oliver" : `Name for hat ${i + 1}`}
                        />
                      </div>
                    );
                  })}
                </div>
                {namesInvalid ? (
                  <p id="hat-name-error" className="mt-2 text-sm font-medium text-red-700" role="alert">
                    {hatPageCopy.namesRequiredMessage}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={HAT_PAYMENT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={validateNames}
                  className="inline-flex justify-center items-center py-3.5 px-6 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors w-full sm:w-auto text-center"
                >
                  {hatPageCopy.orderCtaPayment}
                </a>
                <p className="text-sm text-neutral-600 text-center sm:text-left">
                  <a
                    href={mailtoHref}
                    onClick={validateNames}
                    className="font-semibold text-amber-800 hover:text-amber-900 underline-offset-2 hover:underline"
                  >
                    {hatPageCopy.orderCtaEmailDetails}
                  </a>{" "}
                  if you need help completing your order.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="rounded-2xl border-2 border-amber-100 bg-amber-50/50 overflow-hidden shadow-md">
                <div className="relative aspect-square w-full bg-neutral-100">
                  <ImageWithFallback
                    src={previewSrc}
                    alt={`Personalised charity hat, ${fitLabel}, colour ${selected.label}`}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                    loading="eager"
                  />
                </div>
                <div className="p-4 text-center border-t border-amber-100/80 bg-white/80">
                  <p className="text-sm font-semibold text-neutral-900">{selected.label}</p>
                  <p className="text-xs text-neutral-600 mt-1">
                    {fit === "adult" ? hatPageCopy.fitAdultLabel : hatPageCopy.fitKidsLabel}
                    {quantity > 1 ? ` · ${quantity} hats` : null}
                  </p>
                  <p className="text-sm font-semibold text-amber-900 mt-2">
                    {quantity > 1
                      ? `${quantity} × R${HAT_UNIT_PRICE_ZAR} = R${lineTotal}`
                      : hatPageCopy.priceLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
