import { useEffect } from "react";
import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MapPin, ExternalLink } from "lucide-react";
import aerialTop from "@/assets/OV photo_s for Website/Aerial (1).jpg";
import computerLab from "@/assets/d5c30ac405997a9f47bb022e66f8a25896a2b859.png";
import gardenArea from "@/assets/f0dd27edb7bda065be4dd5f0f576138f64514baf.png";
import gardenBeds from "@/assets/7b52c9c4cb4c502f6ea99c7fce5fe04da5995174.png";
import aerialEcd from "@/assets/OV photo_s for Website/Aerial ECD.jpg";
import kitchenArea from "@/assets/8d8da24d7e2cba1694663d3735775c2318c86b68.png";
import diningArea from "@/assets/8e268001b9e0fd2784e0fabc8aa1f352deb6f3d2.png";

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
              Oliver&apos;s Village is a community education centre in Putfontein, Benoni that Tucker Family Charity is
              proud to support. It provides education, skills development, early childhood care and food security
              through a range of community programmes.
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
                vulnerable communities in Daveyton, Etwatwa, Wattville and surrounding informal settlements.
              </p>
              <p className="text-lg text-neutral-700 mb-6">
                What began as a small soup kitchen has grown into a place of hope and opportunity. From its base in
                Putfontein, the organisation now delivers free quality services through its Early Childhood Development
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
              Real facilities and programmes at Oliver&apos;s Village
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/80">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={computerLab}
                  alt="Computer lab at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">
                  Skills Development at Oliver&apos;s Village Computer Training Centre
                </h3>
                <p className="text-neutral-600">
                  Computer facilities provide digital skills training for young people and adults, helping them build
                  essential skills for the future.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/80">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={gardenBeds}
                  alt="Vegetable gardens at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Food gardens</h3>
                <p className="text-neutral-600">
                  Sustainable vegetable gardens provide fresh produce and teach beneficiaries about nutrition,
                  agriculture, and self-sufficiency.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/80">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={kitchenArea}
                  alt="Community kitchen at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Meals &amp; nutrition</h3>
                <p className="text-neutral-600">
                  A feeding programme ensures children attending the centre receive regular, nutritious meals every day.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/80">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={diningArea}
                  alt="Community dining area at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Community space</h3>
                <p className="text-neutral-600">
                  Comfortable outdoor spaces where children can eat together, learn, and build community connections.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/80">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={gardenArea}
                  alt="Garden program at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Educational gardens</h3>
                <p className="text-neutral-600">
                  Hands-on learning through gardening helps beneficiaries develop practical skills and environmental
                  awareness.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/80">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={schoolGrounds}
                  alt="Oliver's Village school campus"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">School campus</h3>
                <p className="text-neutral-600">
                  Safe, well-maintained facilities providing a nurturing environment for learning, growth, and
                  development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Impact in numbers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">350+</div>
              <div className="text-lg text-orange-100">Beneficiaries supported</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">R450K</div>
              <div className="text-lg text-orange-100">Raised this year</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-lg text-orange-100">Community events</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-lg text-orange-100">Funds to school</div>
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
