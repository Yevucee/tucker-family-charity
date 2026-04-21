import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from "react-router";
import { DollarSign, Clock, Package, ShoppingBag, Heart } from "lucide-react";
import { DONATION_LINK, VOLUNTEER_SIGNUP_URL } from "@/config";
import { currentNeeds } from "@/data/currentNeeds";

const CONTACT_EMAIL = "info@tuckerfamilycharity.org";

export function Donate() {
  const volunteerHref =
    VOLUNTEER_SIGNUP_URL ||
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Offer my time — volunteer enquiry")}`;

  const itemsMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Offer items — material donation")}`;

  const donationDisabled = !DONATION_LINK || DONATION_LINK === "#";

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero / intro */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16 md:py-20">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto w-full text-center text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">Support Us</h1>
            <p className="text-lg sm:text-xl text-amber-100 leading-relaxed">
              There are many ways to support Tucker Family Charity. Whether you give financially, offer your time,
              donate useful items or purchase our charity merchandise, every contribution helps us create practical
              impact through community, partnerships and shared effort.
            </p>
          </div>
        </div>
      </section>

      {/* 1. Donate Money */}
      <section className="py-16 md:py-20 bg-white border-t border-amber-100/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-orange-600" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold mb-4 text-neutral-900">Donate Money</h2>
              <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                Financial contributions help support the charity&apos;s events, community initiatives, project
                partnerships and wider impact. Every donation helps us direct support where it is needed most.
              </p>

              {/* TODO: Replace placeholder copy with real banking details when ready (account name, bank, branch, reference). */}
              <div className="rounded-xl border-2 border-dashed border-amber-300/90 bg-amber-50/50 px-5 py-6 mb-8">
                <p className="text-sm font-semibold text-neutral-800 mb-2">Bank transfer</p>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Banking details will be added here for direct transfers. Until then, please use the donation link
                  below if available.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Primary payment: set VITE_DONATION_LINK (Yoco / PayFast / hosted page). */}
                {donationDisabled ? (
                  <span className="inline-flex items-center justify-center bg-orange-600/50 text-white px-8 py-3 rounded-full font-semibold cursor-not-allowed">
                    Donate Now
                  </span>
                ) : (
                  <a
                    href={DONATION_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
                  >
                    Donate Now
                  </a>
                )}
              </div>
              {donationDisabled ? (
                <p className="text-sm text-amber-900/60 mt-3">
                  Online donation link coming soon — check back or contact us below.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Give Your Time */}
      <section className="py-16 md:py-20 bg-amber-50 border-y border-amber-200/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Clock className="w-8 h-8 text-orange-600" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold mb-4 text-neutral-900">Give Your Time</h2>
              <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
                Support is not only financial. You can also help by volunteering your time, skills or practical
                support through community hours, events and other hands-on opportunities.
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2 mb-8">
                <li>Help at events</li>
                <li>Offer practical skills</li>
                <li>Support logistics</li>
                <li>Contribute time through community hours</li>
              </ul>
              {/* TODO: Set VITE_VOLUNTEER_SIGNUP_URL to your Google Form or sign-up page; until then this uses email. */}
              <a
                href={volunteerHref}
                className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
              >
                Offer Your Time
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Donate Items */}
      <section className="py-16 md:py-20 bg-white border-t border-amber-100/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-orange-600" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold mb-4 text-neutral-900">Donate Items</h2>
              <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                Books, school supplies, useful materials and practical donated goods can all make a meaningful difference
                to the people and projects we support.
              </p>

              <div className="bg-amber-50 rounded-xl p-6 md:p-8 border border-amber-200/80 mb-8">
                <h3 className="text-xl font-bold mb-4 text-neutral-900 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-orange-600 shrink-0" aria-hidden />
                  Current Needs
                </h3>
                {/* Update list in src/data/currentNeeds.ts */}
                <ul className="space-y-2 text-neutral-700">
                  {currentNeeds.map((need) => (
                    <li key={need} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" aria-hidden />
                      <span>{need}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* TODO: Replace mailto with a Google Form or phone contact when ready. */}
              <a
                href={itemsMailto}
                className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
              >
                Offer Items
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Shop With Us (no Featured This Month here — that lives on Home + Shop only) */}
      <section className="py-16 md:py-20 bg-amber-50 border-t border-amber-200/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-8 h-8 text-orange-600" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold mb-4 text-neutral-900">Shop With Us</h2>
              <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                You can also support Tucker Family Charity through direct donations or by purchasing our charity
                merchandise. Proceeds from Tucker Family Charity Products and selected partner offers help provide
                education, daily meals and opportunity for vulnerable communities.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
              >
                Visit the Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-amber-600 to-orange-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Every contribution matters</h2>
          <p className="text-lg text-amber-50 leading-relaxed mb-10">
            Whether you give money, time, materials or purchase our charity merchandise, your support helps Tucker
            Family Charity turn community into practical action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center justify-center bg-white text-orange-700 px-8 py-3 rounded-full hover:bg-amber-50 transition-colors font-semibold"
            >
              Contact Us
            </a>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors font-semibold"
            >
              Visit the Shop
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
