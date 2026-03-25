import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { Sparkles, ShoppingBag, HeartHandshake, ChevronDown } from "lucide-react";
import { shopCatalog } from "@/data/shopCatalog";
import { PartnerExitModal } from "../components/shop/PartnerExitModal";
import type { TuckerCatalogProduct, PartnerCatalogOffer } from "@/data/shopCatalog";

/** CMS / future auction: set true and render `auctionItems` from @/data/shopProducts near the top */
const SHOW_AUCTION_BANNER = false;

type PartnerModalState = { url: string; code?: string } | null;

function tuckerLinkProps(product: TuckerCatalogProduct) {
  const href = product.paymentLink || "#";
  const external = Boolean(product.ctaOpensNewTab);
  return {
    href,
    target: external ? ("_blank" as const) : undefined,
    rel: external ? ("noopener noreferrer" as const) : undefined,
  };
}

export function Shop() {
  const { featuredThisMonth, tuckerProducts, partnerOffers } = shopCatalog;
  const [partnerModal, setPartnerModal] = useState<PartnerModalState>(null);

  const openPartnerModal = (offer: PartnerCatalogOffer) => {
    setPartnerModal({
      url: offer.externalUrl,
      code: offer.checkoutCode?.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3">Shop &amp; offers</h1>
          <p className="text-lg sm:text-xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
            Support Oliver&apos;s Village—browse what we&apos;re featuring, our own products, and
            partner offers that give back.
          </p>
        </div>
      </section>

      {SHOW_AUCTION_BANNER && (
        <section className="py-4 bg-amber-100 text-center text-sm text-amber-900">
          {/* FUTURE: inject featured auction from shopProducts.auctionItems */}
        </section>
      )}

      {/* A. Featured This Month — strongest visual block */}
      <section
        id="featured-this-month"
        className="relative py-14 md:py-20 bg-gradient-to-b from-amber-50 via-white to-white overflow-hidden"
        aria-labelledby="featured-heading"
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2
            id="featured-heading"
            className="text-2xl md:text-3xl font-bold text-neutral-900 text-center mb-10 md:mb-12 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-7 h-7 text-amber-600 shrink-0" aria-hidden />
            {featuredThisMonth.sectionTitle}
          </h2>

          {/* FEATURED: swap `main` content monthly or via CMS */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-amber-200/80 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0">
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[320px]">
                <ImageWithFallback
                  src={featuredThisMonth.main.image}
                  alt={featuredThisMonth.main.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-amber-50/40">
                <p className="text-sm font-semibold uppercase tracking-wider text-amber-700 mb-2">
                  Our spotlight
                </p>
                <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 leading-tight">
                  {featuredThisMonth.main.title}
                </h3>
                <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                  {featuredThisMonth.main.shortDescription}
                </p>
                <div className="mt-auto">
                  <a
                    href={featuredThisMonth.main.ctaHref}
                    target={featuredThisMonth.main.ctaOpensNewTab ? "_blank" : undefined}
                    rel={featuredThisMonth.main.ctaOpensNewTab ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-600 text-white font-semibold text-lg shadow-lg hover:bg-amber-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  >
                    {featuredThisMonth.main.ctaLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Optional supporting featured slots — extend `supporting` in shopCatalog.ts */}
          {featuredThisMonth.supporting && featuredThisMonth.supporting.length > 0 && (
            <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {featuredThisMonth.supporting.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 p-4 rounded-xl bg-white border border-neutral-200 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col">
                    <h4 className="font-bold text-neutral-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{item.shortDescription}</p>
                    <a
                      href={item.ctaHref}
                      className="mt-auto text-sm font-semibold text-amber-700 hover:text-amber-800"
                    >
                      {item.ctaLabel} →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* B. Shop More cue */}
      <section
        id="shop-more"
        className="py-10 md:py-12 border-y border-amber-100/80 bg-amber-50/30"
        aria-label="More below"
      >
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">Shop More</h2>
          <p className="text-neutral-600 mb-6">Discover more products and partner offers below.</p>
          <a
            href="#tucker-products"
            className="inline-flex flex-col items-center gap-1 text-amber-700 font-semibold hover:text-amber-800 transition-colors"
          >
            <span className="flex items-center gap-1">
              Scroll to Tucker products
              <ChevronDown className="w-4 h-4" aria-hidden />
            </span>
          </a>
        </div>
      </section>

      {/* C. Tucker Products */}
      <section
        id="tucker-products"
        className="py-16 md:py-20 bg-white scroll-mt-20"
        aria-labelledby="tucker-products-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="flex items-center gap-2 text-amber-700 font-semibold mb-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Our store</span>
              </div>
              <h2 id="tucker-products-heading" className="text-3xl md:text-4xl font-bold text-neutral-900">
                Tucker Products
              </h2>
              <p className="mt-3 text-lg text-neutral-600 max-w-2xl">
                Direct charity items—wine, caps, and Tucker-branded goods. Every purchase supports
                Oliver&apos;s Village.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {tuckerProducts.map((product) => {
              const link = tuckerLinkProps(product);
              return (
                <article
                  key={product.id}
                  className="group flex flex-col rounded-2xl overflow-hidden border-2 border-amber-100 bg-white shadow-md hover:shadow-xl hover:border-amber-200/80 transition-all duration-300"
                >
                  {/* PAYMENT: set product.paymentLink in src/data/shopCatalog.ts */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{product.title}</h3>
                    {product.priceLabel && (
                      <p className="text-sm font-semibold text-amber-800 mb-2">{product.priceLabel}</p>
                    )}
                    <p className="text-neutral-600 mb-6 flex-1 leading-relaxed">{product.shortDescription}</p>
                    <a
                      {...link}
                      className="mt-auto block w-full text-center py-3.5 px-4 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
                    >
                      {product.ctaLabel}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* D. Partner Offers */}
      <section
        id="partner-offers"
        className="py-16 md:py-20 bg-neutral-50 scroll-mt-20"
        aria-labelledby="partner-offers-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 md:mb-14">
            <div className="flex items-center gap-2 text-neutral-600 font-semibold mb-2">
              <HeartHandshake className="w-5 h-5" />
              <span>Friends of the charity</span>
            </div>
            <h2 id="partner-offers-heading" className="text-3xl md:text-4xl font-bold text-neutral-900">
              Partner Offers
            </h2>
            <p className="mt-3 text-lg text-neutral-600 max-w-2xl">
              External partners you can shop with—we may earn a contribution when you use these
              links. You&apos;ll see a short message before leaving our site.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {partnerOffers.map((offer) => (
              <article
                key={offer.id}
                className="flex flex-col rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={offer.image}
                    alt={offer.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1 border-t border-neutral-100">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{offer.title}</h3>
                  <p className="text-neutral-600 mb-6 flex-1 leading-relaxed">{offer.shortDescription}</p>
                  {/* PARTNER: `checkoutCode` in shopCatalog.ts feeds the redirect modal */}
                  <button
                    type="button"
                    onClick={() => openPartnerModal(offer)}
                    className="mt-auto w-full py-3.5 px-4 rounded-xl border-2 border-neutral-800 text-neutral-900 font-semibold hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    {offer.ctaLabel}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How to Order — condensed */}
      <section className="py-16 bg-white border-t border-neutral-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">Questions about an order?</h2>
          <p className="text-neutral-600 mb-6">
            We&apos;re happy to help with Tucker products, delivery, or payment options.
          </p>
          <a
            href="mailto:info@tuckerfamilycharity.org?subject=Shop%20Enquiry"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
          >
            Email info@tuckerfamilycharity.org
          </a>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-16 md:py-20 bg-stone-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Your purchase makes an impact</h2>
          <p className="text-lg text-stone-100 mb-8 leading-relaxed">
            Proceeds from Tucker products and selected partner offers help provide education, meals,
            and opportunity for children at Oliver&apos;s Village.
          </p>
          <Link
            to="/olivers-village"
            className="inline-block bg-white text-stone-700 px-8 py-3 rounded-full hover:bg-stone-50 transition-colors font-semibold"
          >
            Learn more about Oliver&apos;s Village
          </Link>
        </div>
      </section>

      <PartnerExitModal
        open={partnerModal != null}
        targetUrl={partnerModal?.url ?? ""}
        checkoutCode={partnerModal?.code}
        onClose={() => setPartnerModal(null)}
      />

      <Footer />
    </div>
  );
}
