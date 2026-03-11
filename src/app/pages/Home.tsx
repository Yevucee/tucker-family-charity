import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { BookOpen, Utensils, Building2, Users, Calendar, MapPin, Instagram } from "lucide-react";
import { INSTAGRAM_WIDGET_URL } from "@/config";
import logo from "@/assets/4920ca320ce31a579ec4c3d0fcc360b4528a2024.png";
import schoolGrounds from "@/assets/0cac28478cd9e148e19e33753c2ce2b1507d4676.png";
import computerLab from "@/assets/d5c30ac405997a9f47bb022e66f8a25896a2b859.png";
import gardenArea from "@/assets/f0dd27edb7bda065be4dd5f0f576138f64514baf.png";

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] bg-neutral-900">
        <img
          src={schoolGrounds}
          alt="Oliver's Village school grounds"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Supporting Education and Opportunity in Johannesburg
              </h1>
              <p className="text-xl mb-8 text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
                Tucker Family Charity raises funds to support Oliver's Village, a community education centre helping children and families build a better future.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/#support"
                  className="bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
                >
                  Support the Charity
                </Link>
                <Link
                  to="/about"
                  className="bg-white text-neutral-900 px-8 py-3 rounded-full hover:bg-neutral-100 transition-colors font-semibold"
                >
                  Learn About Oliver's Village
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-neutral-900">
                About the Charity
              </h2>
              <p className="text-lg text-neutral-700 mb-6">
                Tucker Family Charity is a small family-led initiative based in Johannesburg. The charity was created to support Oliver's Village, a community project that provides education, meals and training to children and families from nearby communities.
              </p>
              <p className="text-lg text-neutral-700 mb-8">
                Through events, fundraising and merchandise sales, we help provide practical support where it matters most. We're proud to be part of Oliver's Village's journey, and we invite you to join us.
              </p>
              <Link
                to="/about"
                className="inline-block text-orange-600 hover:text-orange-700 font-semibold"
              >
                Read our full story →
              </Link>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <img
                src={computerLab}
                alt="Computer lab at Oliver's Village"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-neutral-900">Where the Money Goes</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Every contribution helps provide essential support for children and families at Oliver's Village
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-amber-50 p-8 rounded-lg">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                Early Childhood Education
              </h3>
              <p className="text-neutral-700">
                Funding helps provide a safe learning environment, teachers and classroom materials for young children.
              </p>
            </div>

            <div className="bg-amber-50 p-8 rounded-lg">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Utensils className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                Meals and Nutrition
              </h3>
              <p className="text-neutral-700">
                Donations support daily meals for children attending the centre and food support for vulnerable families.
              </p>
            </div>

            <div className="bg-amber-50 p-8 rounded-lg">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                Computer and Skills Training
              </h3>
              <p className="text-neutral-700">
                Funds help maintain computer facilities that provide digital skills training for young people and adults.
              </p>
            </div>

            <div className="bg-amber-50 p-8 rounded-lg">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                Community Support
              </h3>
              <p className="text-neutral-700">
                Support also helps maintain the facilities and programmes that benefit the wider community.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/about"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
            >
              See the Impact
            </Link>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-neutral-900">
              Upcoming Events
            </h2>
            <p className="text-lg text-neutral-600">
              Join us at our next fundraising event and be part of our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Event 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1768776179834-93e6cafc6d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBldmVudCUyMG91dGRvb3IlMjBwZW9wbGV8ZW58MXx8fHwxNzczMTMyMzA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Community fundraiser"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">April 15, 2026</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Spring Fundraiser Gala</h3>
                <div className="flex items-center gap-2 text-neutral-600 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>Johannesburg Community Center</span>
                </div>
                <p className="text-neutral-600 mb-4">
                  An evening of music, food, and community celebrating our collective impact on education.
                </p>
              </div>
            </div>

            {/* Event 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1771924368588-507c6a048363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzMwNDU0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Wine tasting event"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">May 22, 2026</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Charity Wine Tasting</h3>
                <div className="flex items-center gap-2 text-neutral-600 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>The Vineyard, Constantia</span>
                </div>
                <p className="text-neutral-600 mb-4">
                  Sample exquisite South African wines while supporting a great cause. All proceeds benefit Oliver's Village.
                </p>
              </div>
            </div>

            {/* Event 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1666281269793-da06484657e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwc2Nob29sJTIwZWR1Y2F0aW9uJTIwYm9va3N8ZW58MXx8fHwxNzczMTMyMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="School visit"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">June 10, 2026</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">School Visit Day</h3>
                <div className="flex items-center gap-2 text-neutral-600 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>Oliver's Village, Johannesburg</span>
                </div>
                <p className="text-neutral-600 mb-4">
                  Meet the students and teachers, tour the facilities, and see firsthand the impact of your support.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/events"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram Feed Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-neutral-900">
              Latest Updates from the Community
            </h2>
            <p className="text-lg text-neutral-600 flex items-center justify-center gap-2">
              <Instagram className="w-5 h-5" />
              Follow @tuckerfamilycharity for daily stories
            </p>
          </div>

          {/* Instagram Embed - Set VITE_INSTAGRAM_WIDGET_URL in .env to show your feed */}
          <div className="max-w-4xl mx-auto">
            {INSTAGRAM_WIDGET_URL ? (
              <iframe
                src={INSTAGRAM_WIDGET_URL}
                title="Instagram feed"
                className="w-full border-0 rounded-lg overflow-hidden"
                style={{ minHeight: "400px" }}
              />
            ) : (
              <div className="bg-neutral-100 rounded-lg p-8 text-center">
                <a
                  href="https://stormlikes.com/embed-instagram-feed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 font-semibold underline"
                >
                  Get a free Instagram feed embed
                </a>
                <p className="text-neutral-600 mt-4 text-sm max-w-md mx-auto">
                  Stormlikes (no signup) or EmbedSocial: enter &quot;tuckerfamilycharity&quot;, get the embed code, copy the iframe src URL, then add{" "}
                  <code className="bg-neutral-200 px-1 rounded">VITE_INSTAGRAM_WIDGET_URL=your_url</code> to a{" "}
                  <code className="bg-neutral-200 px-1 rounded">.env</code> file in the project root.
                </p>
                <a
                  href="https://instagram.com/tuckerfamilycharity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 text-neutral-500 hover:text-orange-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  Follow @tuckerfamilycharity on Instagram
                </a>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://instagram.com/tuckerfamilycharity"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
            >
              <Instagram className="w-5 h-5" />
              Follow @tuckerfamilycharity on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Merch Preview */}
      <section id="support" className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-neutral-900">
              Support Through Merchandise
            </h2>
            <p className="text-lg text-neutral-600">
              Every purchase directly supports Oliver's Village students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Charity Hat */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-80">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1663280426478-9294cf296749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwYmFzZWJhbGwlMjBjYXAlMjBoYXR8ZW58MXx8fHwxNzczMTMyMzA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Tucker Family Charity hat"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-neutral-900">Charity Hat</h3>
                <p className="text-orange-600 font-bold text-xl mb-4">R250</p>
                <p className="text-neutral-600 mb-6">
                  High-quality cap featuring the Tucker Family Charity logo. Comfortable, stylish, and supports education.
                </p>
                <Link
                  to="/shop"
                  className="block w-full bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold text-center"
                >
                  Support the Charity
                </Link>
              </div>
            </div>

            {/* Charity Wine */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-80">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1733248113910-400496b9a544?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwYm90dGxlJTIwcmVkfGVufDF8fHx8MTc3MzEzMjMwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Tucker Family Charity wine"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-neutral-900">Charity Wine</h3>
                <p className="text-orange-600 font-bold text-xl mb-4">R180</p>
                <p className="text-neutral-600 mb-6">
                  Premium South African red wine. Enjoy a bottle and know you're making a difference in children's lives.
                </p>
                <Link
                  to="/shop"
                  className="block w-full bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold text-center"
                >
                  Support the Charity
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}