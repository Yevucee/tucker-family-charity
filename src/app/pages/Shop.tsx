import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { ShoppingBag, Mail, Phone, Palette, ExternalLink } from "lucide-react";
import auctionArtwork from "@/assets/auction-fred-schimmel-abstract.png";
import { auctionItems, shopProducts } from "@/data/shopProducts";

// PAYMENT: Replace product paymentLink in src/data/shopProducts.ts with Yoco, PayFast, or external URL

export function Shop() {
  const featuredAuction = auctionItems.find((a) => a.featured) ?? auctionItems[0];

  const getProductLink = (product: (typeof shopProducts)[0]) => {
    if (product.paymentLink && product.paymentLink !== "#") {
      return { href: product.paymentLink, external: true };
    }
    if (product.id === "wine") {
      return { href: "mailto:info@tuckerfamilycharity.org?subject=Wine Enquiry", external: false };
    }
    if (product.id === "clothing") {
      return { href: "mailto:info@tuckerfamilycharity.org?subject=Caps Order", external: false };
    }
    return { href: "mailto:info@tuckerfamilycharity.org?subject=Shop Enquiry", external: false };
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative h-[300px] bg-gradient-to-r from-amber-600 to-amber-800">
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Shop</h1>
            <p className="text-xl text-amber-100">
              Support Oliver's Village through our quality products
            </p>
          </div>
        </div>
      </section>

      {/* Silent Auction - Top, most prominent */}
      <section className="py-16 md:py-24 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-amber-700 font-semibold mb-4">
                <Palette className="w-5 h-5" />
                <span>In partnership with {featuredAuction.donor}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Art That Makes a Difference
              </h2>
              <p className="text-lg text-neutral-700 mb-6">
                We're excited to begin a monthly art auction in partnership with Dale Sargent Fine Art. Each month we'll share a special piece of art, giving you the chance to own something beautiful while helping support a meaningful cause.
              </p>
              <p className="text-neutral-700 mb-6">
                This month's artwork is <strong>{featuredAuction.title}</strong>. {featuredAuction.description}
              </p>
              {featuredAuction.reserve && (
                <p className="text-orange-600 font-bold text-xl mb-6">Reserve {featuredAuction.reserve}</p>
              )}
              <p className="text-neutral-700 mb-8">
                All proceeds above the base price go directly to Oliver's Village. This is a silent auction—your bid remains private.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={featuredAuction.bidLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-amber-600 text-white px-8 py-4 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
                >
                  Place a Bid
                  <ExternalLink className="w-4 h-4" />
                </a>
                <span className="text-sm text-neutral-600 self-center">
                  Bidding closes end of March 2026
                </span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="rounded-xl overflow-hidden shadow-2xl bg-white transition-transform duration-300 hover:scale-[1.02]">
                <img
                  src={auctionArtwork}
                  alt={`${featuredAuction.title} - Mixed media on paper`}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop - Product cards below */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ShoppingBag className="w-16 h-16 text-amber-700 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-neutral-900">Shop with Purpose</h2>
            <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
              Every purchase goes directly to supporting the students and programs at Oliver's Village.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {shopProducts.map((product) => {
              const link = getProductLink(product);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48 flex-shrink-0 group overflow-hidden">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 min-h-0">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{product.title}</h3>
                    <p className="text-neutral-600 mb-4 flex-1">{product.shortDescription}</p>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="block w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold text-center"
                    >
                      {product.ctaLabel}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center text-neutral-900">
            How to Order
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-700">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Get in Touch</h3>
              <p className="text-neutral-600">
                Contact us via email or phone to discuss your order
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-700">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Confirm Details</h3>
              <p className="text-neutral-600">
                We'll confirm quantities, pricing, and delivery arrangements
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-700">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Make a Difference</h3>
              <p className="text-neutral-600">
                Receive your products and know you've supported Oliver's Village
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-neutral-900">
              Contact Us to Order
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:info@tuckerfamilycharity.org"
                className="flex items-center justify-center gap-3 p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <Mail className="w-6 h-6 text-amber-700" />
                <span className="text-lg text-neutral-900">info@tuckerfamilycharity.org</span>
              </a>
              <div className="flex items-center justify-center gap-3 p-4 bg-amber-50 rounded-lg">
                <Phone className="w-6 h-6 text-amber-700" />
                <span className="text-lg text-neutral-900">Contact via email for phone number</span>
              </div>
            </div>
            <p className="text-center text-neutral-600 mt-6">
              We typically respond within 24 hours. All proceeds support Oliver's Village.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-20 bg-stone-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Your Purchase Makes an Impact</h2>
          <p className="text-xl text-stone-100 mb-8">
            100% of merchandise profits go directly to supporting students at Oliver's Village.
            Every cap and bottle of wine helps provide education, meals, and opportunities for children in need.
          </p>
          <Link
            to="/about"
            className="bg-white text-stone-700 px-8 py-3 rounded-full hover:bg-stone-50 transition-colors font-semibold"
          >
            Learn More About Our Work
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
