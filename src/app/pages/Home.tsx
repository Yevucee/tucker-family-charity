import { useMemo } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import {
  PartyPopper,
  HeartHandshake,
  Briefcase,
  Handshake,
  Calendar,
  MapPin,
  Instagram,
  Sparkles,
  Banknote,
  Clock,
  Package,
} from "lucide-react";
import { PartnerAutoScrollStrip } from "../components/PartnerAutoScrollStrip";
import { INSTAGRAM_ELFSIGHT_APP_ID, INSTAGRAM_WIDGET_URL } from "@/config";
import { InstagramEmbed } from "@/app/components/InstagramEmbed";
import logo from "@/assets/4920ca320ce31a579ec4c3d0fcc360b4528a2024.png";
import schoolGrounds from "@/assets/0cac28478cd9e148e19e33753c2ce2b1507d4676.png";
import computerLab from "@/assets/d5c30ac405997a9f47bb022e66f8a25896a2b859.png";
import gardenArea from "@/assets/f0dd27edb7bda065be4dd5f0f576138f64514baf.png";
import { shopCatalog } from "@/data/shopCatalog";
import { auctionItems } from "@/data/shopProducts";
import { FeaturedMonthCarousel } from "../components/shop/FeaturedMonthCarousel";
import { buildFeaturedMonthSlides } from "../components/shop/featuredMonthSlides";

export function Home() {
  const featuredAuction = auctionItems.find((a) => a.featured) ?? auctionItems[0];
  const homeFeaturedSlides = useMemo(
    () => buildFeaturedMonthSlides(featuredAuction, shopCatalog.featuredThisMonth, "home"),
    [featuredAuction, shopCatalog.featuredThisMonth]
  );
  const homeFeaturedUseCarousel = homeFeaturedSlides.length > 1;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[400px] py-16 md:py-20 flex items-center bg-neutral-900">
        <img
          src={schoolGrounds}
          alt="Oliver's Village school grounds"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
                Connecting People. Creating Opportunity. Uplifting Communities.
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
                As a family-led charity, through education, community events, and powerful partnerships, we create opportunities, support local businesses, and drive meaningful impact — from Oliver's Village to the broader community.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
                >
                  Our Story
                </Link>
                <Link
                  to="/olivers-village"
                  className="bg-white text-neutral-900 px-8 py-3 rounded-full hover:bg-neutral-100 transition-colors font-semibold text-center"
                >
                  Oliver&apos;s Village
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-neutral-900">
                About the Charity
              </h2>
              <p className="text-lg text-neutral-700 mb-6">
                Tucker Family Charity is a small family-led initiative based in Johannesburg. The charity was created to support Oliver's Village, a community project that provides education, meals and training to children and families from nearby communities.
              </p>
              <p className="text-lg text-neutral-700 mb-4">
                Through events, fundraising and merchandise sales, we help provide practical support where it matters most. We also maintain a trusted directory of local tradespeople and services recommended by our community—<Link to="/keep-it-in-the-family" className="text-orange-600 hover:text-orange-700 font-semibold">Keep It In The Family</Link>.
              </p>
              <p className="text-lg text-neutral-700 mb-8">
                We're proud to be part of Oliver's Village's journey, and we invite you to join us.
              </p>
              <Link
                to="/about"
                className="inline-block text-orange-600 hover:text-orange-700 font-semibold"
              >
                Read our full story →
              </Link>
            </div>
            <div className="relative h-[280px] sm:h-[350px] md:h-[400px] rounded-lg overflow-hidden shadow-xl group">
              <img
                src={computerLab}
                alt="Computer lab at Oliver's Village"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Support — preview; full detail on /donate and /shop */}
      <section id="support" className="py-20 bg-amber-50 border-t border-amber-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-neutral-900">Ways to Support</h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              There are many ways to support Tucker Family Charity, from featured monthly offers to practical help that
              makes a real difference.
            </p>
          </div>

          {/* Featured This Month — full content width inside section; slides show full text + image per screen */}
          <div className="w-full">
            <div className="rounded-2xl bg-gradient-to-b from-amber-200/90 via-amber-100/85 to-amber-50 p-6 sm:p-8 md:p-10 shadow-md ring-2 ring-amber-300/60">
              <div className="mb-5">
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900 flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6 text-orange-600 shrink-0" aria-hidden />
                  Featured This Month
                </h3>
                <p className="text-neutral-700 leading-relaxed mb-1">
                  Support this month&apos;s highlighted products, offers and fundraising priorities.
                </p>
                {shopCatalog.featuredThisMonth.sectionTitle ? (
                  <p className="text-sm text-amber-900/80 font-medium mt-2">
                    {shopCatalog.featuredThisMonth.sectionTitle}
                  </p>
                ) : null}
              </div>
              <FeaturedMonthCarousel enableCarousel={homeFeaturedUseCarousel}>
                {homeFeaturedSlides}
              </FeaturedMonthCarousel>
              <div className="mt-8 flex justify-center">
                <Link
                  to="/shop#featured-this-month"
                  className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-3.5 rounded-full hover:bg-orange-700 transition-colors font-semibold text-center"
                >
                  Shop This Month&apos;s Offers
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-14 md:mt-20 pt-12 md:pt-14 border-t border-amber-200/80">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center mb-10">
              Other Ways to Help
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white rounded-xl p-8 shadow-md border border-amber-100/80 flex flex-col h-full">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-5 shrink-0">
                  <Banknote className="w-7 h-7 text-orange-600" aria-hidden />
                </div>
                <h4 className="text-xl font-bold text-neutral-900 mb-3">Donate Money</h4>
                <p className="text-neutral-600 leading-relaxed flex-1">
                  Support our work, events and community projects through direct financial giving.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-md border border-amber-100/80 flex flex-col h-full">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-5 shrink-0">
                  <Clock className="w-7 h-7 text-orange-600" aria-hidden />
                </div>
                <h4 className="text-xl font-bold text-neutral-900 mb-3">Give Your Time</h4>
                <p className="text-neutral-600 leading-relaxed flex-1">
                  Volunteer at events, offer practical help, or contribute your skills through community hours.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-md border border-amber-100/80 flex flex-col h-full">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-5 shrink-0">
                  <Package className="w-7 h-7 text-orange-600" aria-hidden />
                </div>
                <h4 className="text-xl font-bold text-neutral-900 mb-3">Donate Items</h4>
                <p className="text-neutral-600 leading-relaxed flex-1">
                  Books, materials and useful goods can all make a meaningful difference.
                </p>
              </div>
            </div>
            <div className="mt-12 flex justify-center">
              <Link
                to="/donate"
                className="inline-flex items-center justify-center border-2 border-orange-600 text-orange-700 bg-white px-8 py-3.5 rounded-full hover:bg-amber-50 transition-colors font-semibold"
              >
                See All Ways to Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How we create impact — four pillars */}
      <section className="py-20 bg-white border-t border-amber-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-neutral-900">How We Create Impact</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Through events, partnerships, employment connections and long-term support for the causes we believe in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            <div className="bg-amber-50 p-8 md:p-9 rounded-lg flex flex-col h-full min-h-[280px]">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-5 shrink-0">
                <PartyPopper className="w-8 h-8 text-orange-600" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Community Events</h3>
              <p className="text-neutral-700 text-base leading-relaxed flex-1">
                Padel, concerts, black tie evenings, golf days and community gatherings that bring people together and
                generate support for meaningful causes.
              </p>
            </div>

            <div className="bg-amber-50 p-8 md:p-9 rounded-lg flex flex-col h-full min-h-[280px]">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-5 shrink-0">
                <HeartHandshake className="w-8 h-8 text-orange-600" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Projects We Support</h3>
              <p className="text-neutral-700 text-base leading-relaxed flex-1">
                Supporting initiatives such as Oliver's Village through financial support, awareness and long-term
                partnership.
              </p>
            </div>

            <div className="bg-amber-50 p-8 md:p-9 rounded-lg flex flex-col h-full min-h-[280px]">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-5 shrink-0">
                <Briefcase className="w-8 h-8 text-orange-600" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Opportunity and Employment</h3>
              <p className="text-neutral-700 text-base leading-relaxed flex-1">
                Helping connect people to work opportunities, trusted networks and practical support that can improve
                lives.
              </p>
            </div>

            <div className="bg-amber-50 p-8 md:p-9 rounded-lg flex flex-col h-full min-h-[280px]">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-5 shrink-0">
                <Handshake className="w-8 h-8 text-orange-600" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Community Partnerships</h3>
              <p className="text-neutral-700 text-base leading-relaxed flex-1">
                Working with local businesses, partners and supporters to create practical impact across different
                sectors.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/olivers-village"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
            >
              See the impact
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
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 group overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1768776179834-93e6cafc6d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBldmVudCUyMG91dGRvb3IlMjBwZW9wbGV8ZW58MXx8fHwxNzczMTMyMzA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Community fundraiser"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
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
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 group overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1771924368588-507c6a048363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzMwNDU0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Wine tasting event"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
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
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 group overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1666281269793-da06484657e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwc2Nob29sJTIwZWR1Y2F0aW9uJTIwYm9va3N8ZW58MXx8fHwxNzczMTMyMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="School visit"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
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

          {/* Instagram Embed - Elfsight app ID or iframe URL */}
          <div className="max-w-4xl mx-auto">
            {INSTAGRAM_ELFSIGHT_APP_ID || INSTAGRAM_WIDGET_URL ? (
              <InstagramEmbed
                elfsightAppId={INSTAGRAM_ELFSIGHT_APP_ID}
                widgetUrl={INSTAGRAM_WIDGET_URL}
              />
            ) : (
              <div className="bg-neutral-100 rounded-lg p-8 text-center">
                <a
                  href="https://elfsight.com/instagram-feed-instashow/create/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 font-semibold underline"
                >
                  Get a free Instagram feed (Elfsight)
                </a>
                <ol className="text-neutral-600 mt-4 text-sm max-w-lg mx-auto text-left list-decimal list-inside space-y-2">
                  <li>Sign up at Elfsight (free, no card)</li>
                  <li>Connect <strong>@tuckerfamilycharity</strong>, pick a template</li>
                  <li>Click &quot;Add to website&quot; and copy the embed code</li>
                  <li>Extract the app ID from the div class (e.g. <code className="bg-neutral-200 px-1 rounded">elfsight-app-xxxxx</code>)</li>
                  <li>Add repo secret <code className="bg-neutral-200 px-1 rounded">INSTAGRAM_ELFSIGHT_APP_ID</code> in GitHub Settings → Secrets</li>
                </ol>
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

      {/* Partners — horizontal scroll; logos from data/partners.ts (asset or favicon) */}
      <section className="pt-16 pb-24 md:pb-32 bg-white border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold text-neutral-600 mb-8">
            Supported by our partners
          </h2>
          <PartnerAutoScrollStrip />
        </div>
      </section>

      <Footer />
    </div>
  );
}