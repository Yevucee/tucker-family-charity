import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ExternalLink, Palette, ShoppingBag } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  HAT_STORE_DISPLAY_NAME,
  HAT_STORE_ORDER_URL,
  hatGalleryColours,
  hatImageForSlug,
  hatPageCopy,
  ORDER_EMAIL,
} from "@/data/personalisedCharityHat";

export function PersonalisedCharityHat() {
  const [selectedSlug, setSelectedSlug] = useState(hatGalleryColours[0].slug);

  const selected = useMemo(
    () =>
      hatGalleryColours.find((c) => c.slug === selectedSlug) ?? hatGalleryColours[0],
    [selectedSlug]
  );
  const previewSrc = hatImageForSlug(selected.slug);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main id="main-content">

      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-6 md:py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
            {hatPageCopy.title}
          </h1>
          <p className="text-sm sm:text-base text-amber-100">{hatPageCopy.intro}</p>
          <p className="mt-2 text-sm sm:text-base text-amber-100/95">{hatPageCopy.impactLine}</p>

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={HAT_STORE_ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 py-3 px-6 rounded-xl bg-white text-amber-900 font-semibold hover:bg-amber-50 transition-colors shadow-md text-sm sm:text-base"
            >
              {hatPageCopy.orderCta}
              <ExternalLink className="w-5 h-5 shrink-0" aria-hidden />
            </a>
            <Link
              to="/shop/"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 py-3 px-5 rounded-xl border-2 border-white/80 text-white font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
              Back to shop
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-t border-amber-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="order-2 lg:order-1 space-y-10">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-700 shrink-0" aria-hidden />
                  {hatPageCopy.featuresHeading}
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-neutral-700 leading-relaxed">
                  {hatPageCopy.features.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-neutral-900 mb-2 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-amber-700 shrink-0" aria-hidden />
                  {hatPageCopy.coloursHeading}
                </h2>
                <p className="text-neutral-700 leading-relaxed mb-4">{hatPageCopy.coloursBlurb}</p>
                <div className="flex gap-3 items-center">
                  <span
                    className="h-10 w-10 shrink-0 rounded-full border border-neutral-200/80 shadow-inner"
                    style={{ backgroundColor: selected.swatchHex }}
                    aria-hidden
                  />
                  <select
                    id="hat-colour"
                    value={selectedSlug}
                    onChange={(e) => setSelectedSlug(e.target.value)}
                    aria-label={hatPageCopy.coloursHeading}
                    className="w-full min-w-0 rounded-xl border border-amber-200 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {hatGalleryColours.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-5 text-neutral-700 text-sm leading-relaxed">
                <p>
                  <strong>{hatPageCopy.questionsBlurb}</strong>{" "}
                  <a
                    href={`mailto:${ORDER_EMAIL}`}
                    className="font-semibold text-amber-800 hover:text-amber-900 underline-offset-2 hover:underline"
                  >
                    {hatPageCopy.questionsCtaEmail}
                  </a>
                </p>
              </div>

              <a
                href={HAT_STORE_ORDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto justify-center items-center gap-2 py-3.5 px-8 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
              >
                {hatPageCopy.orderCta}
                <ExternalLink className="w-5 h-5 shrink-0" aria-hidden />
              </a>
            </div>

            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="rounded-2xl border-2 border-amber-100 bg-amber-50/50 overflow-hidden shadow-md">
                <div className="relative aspect-square w-full bg-neutral-100">
                  <ImageWithFallback
                    src={previewSrc}
                    alt={`Personalised Tucker Family Charity cap, ${selected.label}`}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                    loading="eager"
                  />
                </div>
                <div className="p-4 text-center border-t border-amber-100/80 bg-white/80">
                  <p className="text-sm font-semibold text-neutral-900">{selected.label}</p>
                  <p className="text-xs text-neutral-600 mt-2">
                    Buy this colour at {HAT_STORE_DISPLAY_NAME}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
