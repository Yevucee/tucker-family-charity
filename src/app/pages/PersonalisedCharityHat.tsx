import { useMemo, useState, type MouseEvent } from "react";
import { Link } from "react-router";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  adultHatColours,
  buildHatOrderMailto,
  HAT_PAYMENT_LINK,
  hatPageCopy,
  hatVariantImageSrc,
  hatVariantsForFit,
  type HatFit,
} from "@/data/personalisedCharityHat";

const fitToggleBtn =
  "flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2";
const fitActive = "bg-amber-600 text-white shadow-sm";
const fitInactive = "bg-amber-50 text-amber-900 hover:bg-amber-100";

export function PersonalisedCharityHat() {
  const [fit, setFit] = useState<HatFit>("adult");
  const [selectedSlug, setSelectedSlug] = useState(adultHatColours[0].slug);
  const [sideName, setSideName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);

  const variants = hatVariantsForFit(fit);
  const selected =
    variants.find((v) => v.slug === selectedSlug) ?? variants[0] ?? adultHatColours[0];
  const previewSrc = hatVariantImageSrc(fit, selected.slug);
  const fitLabel = fit === "adult" ? hatPageCopy.fitAdultLabel : hatPageCopy.fitKidsLabel;

  const mailtoHref = useMemo(
    () =>
      buildHatOrderMailto({
        fit,
        colourLabel: selected.label,
        sideName: sideName.trim(),
      }),
    [fit, selected.label, sideName]
  );

  const nameInvalid = nameTouched && !sideName.trim();
  const hasPayment = Boolean(HAT_PAYMENT_LINK?.trim());

  const switchFit = (next: HatFit) => {
    setFit(next);
    const nextVariants = hatVariantsForFit(next);
    setSelectedSlug(nextVariants[0]?.slug ?? "aqua");
    setNameTouched(false);
  };

  const validateName = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!sideName.trim()) {
      e.preventDefault();
      setNameTouched(true);
    }
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
                <p id="colour-label" className="text-sm font-semibold text-neutral-900 mb-3">
                  {hatPageCopy.coloursHeading}
                </p>
                <div
                  className="flex flex-wrap gap-2.5"
                  role="radiogroup"
                  aria-labelledby="colour-label"
                >
                  {variants.map((v) => {
                    const isSelected = v.slug === selected.slug;
                    return (
                      <button
                        key={v.slug}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelectedSlug(v.slug)}
                        className={[
                          "group flex items-center gap-2 rounded-full border-2 pl-1 pr-3 py-1 text-left transition-colors",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
                          isSelected
                            ? "border-amber-600 bg-amber-50 shadow-sm"
                            : "border-amber-100 bg-white hover:border-amber-200",
                        ].join(" ")}
                      >
                        <span
                          className="h-8 w-8 rounded-full border border-neutral-200/80 shadow-inner shrink-0"
                          style={{ backgroundColor: v.swatchHex }}
                          aria-hidden
                        />
                        <span className="text-sm font-medium text-neutral-800 pr-1">{v.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="hat-side-name" className="text-sm font-semibold text-neutral-900 block mb-2">
                  {hatPageCopy.personalisationLabel}
                </label>
                <input
                  id="hat-side-name"
                  type="text"
                  autoComplete="off"
                  value={sideName}
                  onChange={(e) => {
                    setSideName(e.target.value);
                    if (nameTouched) setNameTouched(false);
                  }}
                  onBlur={() => setNameTouched(true)}
                  aria-invalid={nameInvalid}
                  aria-describedby={nameInvalid ? "hat-name-error" : "hat-name-hint"}
                  className={[
                    "w-full rounded-xl border px-4 py-3 text-neutral-900 placeholder:text-neutral-400",
                    "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent",
                    nameInvalid ? "border-red-400" : "border-amber-200",
                  ].join(" ")}
                  placeholder="e.g. Oliver"
                />
                <p id="hat-name-hint" className="mt-2 text-sm text-neutral-600">
                  {hatPageCopy.personalisationHint}
                </p>
                {nameInvalid ? (
                  <p id="hat-name-error" className="mt-2 text-sm font-medium text-red-700" role="alert">
                    {hatPageCopy.nameRequiredMessage}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {hasPayment ? (
                  <>
                    <a
                      href={HAT_PAYMENT_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex justify-center items-center py-3.5 px-5 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors text-center"
                    >
                      {hatPageCopy.orderCtaPay}
                    </a>
                    <a
                      href={mailtoHref}
                      onClick={validateName}
                      className="inline-flex justify-center items-center py-3.5 px-5 rounded-xl border-2 border-amber-800 text-amber-950 font-semibold hover:bg-amber-50 transition-colors text-center"
                    >
                      {hatPageCopy.orderCtaEmailSecondary}
                    </a>
                  </>
                ) : (
                  <a
                    href={mailtoHref}
                    onClick={validateName}
                    className="inline-flex justify-center items-center py-3.5 px-6 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors w-full sm:w-auto text-center"
                  >
                    {hatPageCopy.orderCtaEmail}
                  </a>
                )}
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="rounded-2xl border-2 border-amber-100 bg-amber-50/50 overflow-hidden shadow-md">
                <div className="relative aspect-square w-full bg-neutral-100">
                  <ImageWithFallback
                    src={previewSrc}
                    alt={`Personalised charity hat, ${fitLabel}, colour ${selected.label}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="p-4 text-center border-t border-amber-100/80 bg-white/80">
                  <p className="text-sm font-semibold text-neutral-900">{selected.label}</p>
                  <p className="text-xs text-neutral-600 mt-1">
                    {fit === "adult" ? hatPageCopy.fitAdultLabel : hatPageCopy.fitKidsLabel} ·{" "}
                    {hatPageCopy.priceLabel}
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
