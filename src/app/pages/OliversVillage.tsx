import { useEffect } from "react";
import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MapPin, ExternalLink } from "lucide-react";
import aerialTop from "@/assets/OV photo_s for Website/Aerial (1).jpg";
import computerTraining from "@/assets/OV photo_s for Website/Computer Training 12.jpg";
import foodGardens from "@/assets/OV photo_s for Website/Food Gardens High-Res (5).jpeg";
import aerialEcd from "@/assets/OV photo_s for Website/Aerial ECD.jpg";
import ecdCentre from "@/assets/OV photo_s for Website/ECD Centre (12).jpg";
import feedingSoupKitchen from "@/assets/OV photo_s for Website/Extra photo 4 (Soup Kitchen).jpg";
import agriculturalTraining from "@/assets/OV photo_s for Website/Extra photo 2 (Agri Training Centre).jpeg";
import waterHarvesting from "@/assets/OV photo_s for Website/Water Harvesting.jpeg";

const OFFICIAL_SITE = "https://oliversvillage.co.za/";
const DONATIONS_PAGE = "https://oliversvillage.co.za/donations-form/";

export function OliversVillage() {
  useEffect(() => {
    document.title = "Oliver's Village | Tucker Family Charity";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16 md:py-20">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[240px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto w-full text-center text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Oliver&apos;s Village</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-8">
              A community education centre in Putfontein Benoni that Tucker Family Charity is proud to support -
              Oliver&apos;s Village provides various social services such as education, skills development, early
              childhood care and food security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={OFFICIAL_SITE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-full hover:bg-amber-50 transition-colors font-semibold"
              >
                Visit oliversvillage.co.za
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={DONATIONS_PAGE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/15 text-white border border-white/40 px-8 py-3 rounded-full hover:bg-white/25 transition-colors font-semibold"
              >
                Support Oliver&apos;s Village
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-t border-amber-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-[min(45vh,420px)] sm:h-[min(50vh,480px)] rounded-xl overflow-hidden shadow-xl">
            <img
              src={aerialTop}
              alt="Aerial view of Oliver's Village"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 text-white text-lg font-medium drop-shadow-md max-w-xl">
              A nurturing campus where children learn, play and grow together.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-amber-50 border-t border-amber-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[min(400px,55vh)] rounded-lg overflow-hidden shadow-xl group order-2 lg:order-1">
              <img
                src={aerialEcd}
                alt="Aerial view of Oliver's Village Early Childhood Development Centre"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold mb-6 text-neutral-900">About Oliver&apos;s Village</h2>
              <p className="text-lg text-neutral-700 mb-6">
                Founded in 2001, Oliver&apos;s Village is a non-profit organisation based in Putfontein, Benoni, serving
                vulnerable communities in Daveyton, Etwatwa, Wattville and surrounding Informal Settlements.
              </p>
              <p className="text-lg text-neutral-700 mb-6">
                What began as a small soup kitchen has grown into a place of hope and opportunity. From the village in
                Putfontein, the organisation delivers free, quality services through its Early Childhood Development
                Centre, Computer Training Centre, Feeding Programme, Agricultural College and Agricultural Social
                Enterprise.
              </p>
              <p className="text-lg text-neutral-700 mb-8">
                Each day, Oliver&apos;s Village supports more than 600 beneficiaries, most from previously disadvantaged
                backgrounds, by meeting immediate needs while also equipping individuals with the skills and support
                needed to build a better future.
              </p>
              <p className="text-lg text-neutral-700 mb-8">
                Through its holistic approach, Oliver&apos;s Village remains committed to restoring dignity, nurturing
                potential and creating lasting change.
              </p>
              <div className="flex flex-wrap items-start gap-3 text-neutral-600">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="font-medium text-neutral-800">Location: Putfontein, Benoni</p>
                  <p className="text-sm mt-1">
                    Full address and contact details are on the{" "}
                    <a
                      href={OFFICIAL_SITE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 font-semibold underline-offset-2 hover:underline"
                    >
                      official Oliver&apos;s Village website
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white border-t border-amber-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-neutral-900">See the impact of your support</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Social Service Programmes at Oliver&apos;s Village
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/80">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={ecdCentre}
                  alt="Early Childhood Development Centre at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Early Childhood Development Centre</h3>
                <p className="text-neutral-600">
                  The Early Childhood Development Centre at Oliver&apos;s Village nurtures young children with quality
                  care, early learning, and emotional support. By laying a strong foundation for growth and education, it
                  empowers children to reach their full potential from the very start.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/80">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={feedingSoupKitchen}
                  alt="Feeding programme at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Feeding Programme</h3>
                <p className="text-neutral-600">
                  Oliver&apos;s Village&apos;s Feeding Programme provides daily nutritious meals to vulnerable children
                  and community members, addressing immediate hunger while supporting health and wellbeing. The programme
                  ensures that beneficiaries have the strength and energy to learn, grow, and thrive.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/80">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={computerTraining}
                  alt="Computer training centre at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Computer Training Centre</h3>
                <p className="text-neutral-600">
                  Oliver&apos;s Village equips community members with essential digital and internet skills needed to
                  thrive in a modern world, strengthening communication, supporting entrepreneurship and improving access
                  to employment opportunities.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/80">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={agriculturalTraining}
                  alt="Agricultural training college at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Agricultural Training College</h3>
                <p className="text-neutral-600">
                  Equipping individuals with practical farming skills and hands-on experience in sustainable agriculture.
                  The programme not only supports food security within the community but also empowers beneficiaries to
                  build livelihoods with confidence and dignity.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/80">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={foodGardens}
                  alt="Agricultural food gardens at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Agricultural Food Gardens</h3>
                <p className="text-neutral-600">
                  Oliver&apos;s Village&apos;s Agricultural Food Gardens combined with its Social Enterprise, provide
                  fresh, nutritious produce to the community while creating sustainable livelihoods. The initiative teaches
                  practical farming skills, promotes food security and generates income, empowering beneficiaries to build
                  independence and support their families.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/80">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={waterHarvesting}
                  alt="Sustainability infrastructure at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Sustainability-focused</h3>
                <p className="text-neutral-600">
                  Operating entirely off solar energy and supported by rainwater harvesting and a borehole system. Its
                  composting, bakery and vegetable gardens supply fresh food to the soup kitchen and Early Childhood
                  Development Centre, creating a thoughtful, eco-conscious system that nourishes both people and community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-amber-50 border-t border-amber-100/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-neutral-900">Get involved</h2>
          <p className="text-xl text-neutral-600 mb-8">
            Every contribution makes a real difference for beneficiaries at Oliver&apos;s Village.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={DONATIONS_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-full hover:bg-orange-50 transition-colors font-semibold"
            >
              Support Oliver&apos;s Village
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              to="/donate"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
            >
              Donate via Tucker Family Charity
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
