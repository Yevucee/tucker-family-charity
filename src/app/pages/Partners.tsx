import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ExternalLink } from "lucide-react";
import { partners, partnerDisplayLogo } from "@/data/partners";
import { PartnerLogoSlot } from "../components/PartnerLogoSlot";

export function Partners() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16 md:py-20">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Partners</h1>
            <p className="text-xl text-amber-100">
              Supported by organisations who share our commitment to community
            </p>
          </div>
        </div>
      </section>

      {/* Partners grid */}
      <section className="py-16 md:py-20 bg-amber-50 border-t border-amber-100/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {partners.map((partner) => (
              <article
                key={partner.id}
                className="flex flex-col rounded-2xl border border-amber-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {partner.websiteUrl ? (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-4"
                  >
                    <div className="w-full">
                      <PartnerLogoSlot
                        variant="detail"
                        name={partner.name}
                        logo={partnerDisplayLogo(partner)}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900 group-hover:text-orange-600 flex items-center gap-2 flex-wrap">
                        {partner.name}
                        <ExternalLink className="w-4 h-4 opacity-60 shrink-0" aria-hidden />
                      </h2>
                      <p className="text-sm font-semibold text-orange-600 mt-1">Visit website</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="w-full">
                      <PartnerLogoSlot
                        variant="detail"
                        name={partner.name}
                        logo={partnerDisplayLogo(partner)}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900">{partner.name}</h2>
                      <p className="text-sm text-amber-800/70 mt-1">Website to be confirmed</p>
                    </div>
                  </div>
                )}
                <p className="text-neutral-700 leading-relaxed mt-4 flex-1 border-t border-amber-100/80 pt-4">
                  {partner.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white border-t border-amber-100/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-neutral-900">
            Interested in partnering with us?
          </h2>
          <p className="text-lg text-neutral-700 mb-8">
            We&apos;re always open to conversations with organisations who want to support Oliver&apos;s
            Village.
          </p>
          <a
            href="mailto:info@tuckerfamilycharity.org?subject=Partnership%20Enquiry"
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
