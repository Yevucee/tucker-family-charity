import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from "react-router";
import { partners } from "@/data/partners";

const PLACEHOLDER_LOGOS: Record<string, string> = {
  metawell: `${import.meta.env.BASE_URL}partners/metawell-placeholder.svg`,
  "norman-good-fellas": `${import.meta.env.BASE_URL}partners/norman-good-fellas-placeholder.svg`,
};

export function Partners() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative h-[300px] bg-gradient-to-r from-amber-600 to-amber-800">
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Partners</h1>
            <p className="text-xl text-amber-100">
              Supported by organisations who share our commitment to community
            </p>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex flex-col md:flex-row gap-8 items-center md:items-start"
              >
                <div className="flex-shrink-0 w-40 h-24 flex items-center justify-center bg-amber-50 rounded-lg">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-16 w-auto object-contain"
                    />
                  ) : (
                    <img
                      src={PLACEHOLDER_LOGOS[partner.id]}
                      alt={partner.name}
                      className="max-h-12 w-auto object-contain"
                    />
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">{partner.name}</h2>
                  <p className="text-lg text-neutral-700">{partner.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-neutral-900">
            Interested in partnering with us?
          </h2>
          <p className="text-lg text-neutral-700 mb-8">
            We're always open to conversations with organisations who want to support Oliver's Village.
          </p>
          <a
            href="mailto:info@tuckerfamilycharity.org?subject=Partnership Enquiry"
            className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
          >
            Get in Touch
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
