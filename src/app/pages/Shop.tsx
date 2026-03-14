import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { ShoppingBag, Mail, Phone, Palette, ExternalLink } from "lucide-react";
import auctionArtwork from "@/assets/auction-fred-schimmel-abstract.png";

export function Shop() {
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

      {/* Art Auction Section */}
      <section className="py-16 md:py-24 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-amber-700 font-semibold mb-4">
                <Palette className="w-5 h-5" />
                <span>In partnership with Dale Sargent Fine Art</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Art That Makes a Difference
              </h2>
              <p className="text-lg text-neutral-700 mb-6">
                We're excited to begin a monthly art auction in partnership with Dale Sargent Fine Art, running until the end of the year. Each month we'll share a special piece of art, giving you the chance to own something beautiful while helping support a meaningful cause.
              </p>
              <p className="text-neutral-700 mb-6">
                This month's artwork is <strong>Fred Schimmel, Abstract</strong>. Mixed media on paper, 65cm × 52cm (framed 83cm × 72cm), signed.
              </p>
              <p className="text-neutral-700 mb-6">
                This is a silent auction, so your name and bid amount remain completely private. Only you know what you've bid.
              </p>
              <p className="text-neutral-700 mb-6">
                If you'd like to place a bid, check the link below.
              </p>
              <p className="text-neutral-700 mb-8">
                All proceeds above the base price go directly to Oliver's Village, helping support the incredible work they do with children and families.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://www.giftsbyyou.com/product-page/fred-schimmel-abstract"
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
              <p className="text-amber-800 font-medium mt-6">
                Every bid helps make a difference.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="rounded-xl overflow-hidden shadow-2xl bg-white">
                <img
                  src={auctionArtwork}
                  alt="Fred Schimmel, Abstract - Mixed media on paper, 65cm x 52cm"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="w-16 h-16 text-amber-700 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-neutral-900">
            Shop with Purpose
          </h2>
          <p className="text-lg text-neutral-700">
            Every purchase goes directly to supporting the students and programs at Oliver's Village. 
            Buy our carefully selected wine or branded caps and make a tangible difference in children's lives.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Wine */}
            <div className="bg-white rounded-lg overflow-hidden shadow-xl">
              <div className="relative h-96">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1601506340309-07309cf0c4a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwYm90dGxlcyUyMHJlZCUyMHdoaXRlfGVufDF8fHx8MTc3MzE0NzQ5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Tucker Family Charity Wine"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                      Tucker Family Charity Wine
                    </h3>
                    <p className="text-amber-700 font-semibold text-lg">
                      Available in Red & White
                    </p>
                  </div>
                </div>
                
                <p className="text-neutral-700 mb-6">
                  Premium quality South African wine selected to represent the spirit of our charity. 
                  Each bottle sold contributes directly to Oliver's Village programs. Perfect for gifting 
                  or enjoying while supporting a great cause.
                </p>

                <div className="bg-amber-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-neutral-900 mb-2">What's Included:</h4>
                  <ul className="space-y-1 text-neutral-700">
                    <li>• Premium South African varietals</li>
                    <li>• Custom Tucker Family Charity labels</li>
                    <li>• 100% of proceeds to Oliver's Village</li>
                    <li>• Available in cases or individual bottles</li>
                  </ul>
                </div>

                <a
                  href="mailto:info@tuckerfamilycharity.org?subject=Wine Enquiry"
                  className="block w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold text-center"
                >
                  Enquire About Wine
                </a>
              </div>
            </div>

            {/* Caps */}
            <div className="bg-white rounded-lg overflow-hidden shadow-xl">
              <div className="relative h-96">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1577379655310-bcee476e7c01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlYmFsbCUyMGNhcCUyMGhhdHxlbnwxfHx8fDE3NzMxNDAwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Tucker Family Charity Caps"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                      Tucker Family Charity Caps
                    </h3>
                    <p className="text-amber-700 font-semibold text-lg">
                      One Size Fits All
                    </p>
                  </div>
                </div>
                
                <p className="text-neutral-700 mb-6">
                  High-quality branded caps featuring the Tucker Family Charity logo. Wear your support 
                  with pride and start conversations about Oliver's Village wherever you go. Durable, 
                  comfortable, and stylish.
                </p>

                <div className="bg-amber-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-neutral-900 mb-2">Features:</h4>
                  <ul className="space-y-1 text-neutral-700">
                    <li>• Premium quality fabric</li>
                    <li>• Embroidered Tucker Family Charity logo</li>
                    <li>• Adjustable strap for perfect fit</li>
                    <li>• Available in multiple colors</li>
                  </ul>
                </div>

                <a
                  href="mailto:info@tuckerfamilycharity.org?subject=Caps Order"
                  className="block w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold text-center"
                >
                  Order Caps
                </a>
              </div>
            </div>

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

          {/* Contact Information */}
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
          <h2 className="text-4xl font-bold mb-6">
            Your Purchase Makes an Impact
          </h2>
          <p className="text-xl text-stone-100 mb-8">
            100% of merchandise profits go directly to supporting students at Oliver's Village. 
            Every cap and bottle of wine helps provide education, meals, and opportunities for children in need.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/about"
              className="bg-white text-stone-700 px-8 py-3 rounded-full hover:bg-stone-50 transition-colors font-semibold"
            >
              Learn More About Our Work
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}