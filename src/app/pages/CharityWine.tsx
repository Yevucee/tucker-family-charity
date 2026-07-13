import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Mail, Wine } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  charityWineVariants,
  ORDER_EMAIL,
  wineDisplayName,
  wineFullLabel,
  wineOrderMailto,
  winePageCopy,
} from "@/data/charityWine";

export function CharityWine() {
  const [selectedSlug, setSelectedSlug] = useState(charityWineVariants[0].slug);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const selected = useMemo(
    () => charityWineVariants.find((w) => w.slug === selectedSlug) ?? charityWineVariants[0],
    [selectedSlug]
  );

  const orderHref = wineOrderMailto(selected, quantity, notes);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-6 md:py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
            {winePageCopy.title}
          </h1>
          <p className="text-sm sm:text-base text-amber-100">{winePageCopy.intro}</p>
          <p className="mt-2 text-sm sm:text-base text-amber-100/95">{winePageCopy.impactLine}</p>

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="order-2 lg:order-1 space-y-10">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {charityWineVariants.map((wine) => {
                    const active = wine.slug === selectedSlug;
                    return (
                      <button
                        key={wine.slug}
                        type="button"
                        onClick={() => setSelectedSlug(wine.slug)}
                        aria-pressed={active}
                        className={[
                          "rounded-xl border-2 p-3 text-left transition-colors",
                          active
                            ? "border-amber-600 bg-amber-50/80 ring-2 ring-amber-200"
                            : "border-amber-100 bg-white hover:border-amber-200",
                        ].join(" ")}
                      >
                        <div className="relative aspect-[3/4] mb-2 overflow-hidden rounded-lg bg-neutral-100">
                          <ImageWithFallback
                            src={wine.image}
                            alt={wineFullLabel(wine)}
                            className="absolute inset-0 w-full h-full object-contain p-1"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-sm font-bold text-neutral-900">{wineDisplayName(wine)}</p>
                        <p className="text-xs text-neutral-600 mt-0.5">{wine.varietal}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="wine-quantity" className="block text-sm font-semibold text-neutral-900 mb-2">
                    {winePageCopy.quantityLabel}
                  </label>
                  <input
                    id="wine-quantity"
                    type="number"
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="wine-notes" className="block text-sm font-semibold text-neutral-900 mb-2">
                  {winePageCopy.notesLabel}
                </label>
                <textarea
                  id="wine-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={winePageCopy.notesPlaceholder}
                  className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-y min-h-[88px]"
                />
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-5 text-neutral-700 text-sm leading-relaxed">
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

              <a
                href={orderHref}
                className="inline-flex w-full sm:w-auto justify-center items-center gap-2 py-3.5 px-8 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
              >
                {winePageCopy.orderCta}
                <Mail className="w-5 h-5 shrink-0" aria-hidden />
              </a>
            </div>

            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="rounded-2xl border-2 border-amber-100 bg-amber-50/50 overflow-hidden shadow-md">
                <div className="relative aspect-[3/4] w-full bg-neutral-100">
                  <ImageWithFallback
                    src={selected.image}
                    alt={wineFullLabel(selected)}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                    loading="eager"
                  />
                </div>
                <div className="p-4 text-center border-t border-amber-100/80 bg-white/80">
                  <p className="text-lg font-semibold text-neutral-900">{wineDisplayName(selected)}</p>
                  <p className="text-sm text-neutral-600 mt-1">{selected.varietal}</p>
                  <p className="text-xs text-neutral-500 mt-2">Price on enquiry</p>
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
