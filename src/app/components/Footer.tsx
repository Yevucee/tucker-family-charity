import { Link } from "react-router";
import { Instagram, MapPin } from "lucide-react";
import { Facebook } from "lucide-react";
import logo from "@/assets/4920ca320ce31a579ec4c3d0fcc360b4528a2024.png";
import { partners, partnerDisplayLogo } from "@/data/partners";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Tucker Family Charity" className="h-20 md:h-24 w-auto invert opacity-90" />
            </div>
            <p className="text-neutral-400 max-w-md text-base md:text-lg">
              Supporting Oliver's Village in Johannesburg — raising funds to provide education, meals and training to children and families.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-neutral-400 hover:text-orange-500 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-neutral-400 hover:text-orange-500 transition-colors">
                About Us
              </Link>
              <Link to="/olivers-village" className="text-neutral-400 hover:text-orange-500 transition-colors">
                Oliver&apos;s Village
              </Link>
              <Link to="/events" className="text-neutral-400 hover:text-orange-500 transition-colors">
                Events
              </Link>
              <Link to="/shop" className="text-neutral-400 hover:text-orange-500 transition-colors">
                Shop
              </Link>
              <Link to="/donate" className="text-neutral-400 hover:text-orange-500 transition-colors">
                Support Us
              </Link>
              <Link to="/partners" className="text-neutral-400 hover:text-orange-500 transition-colors">
                Partners
              </Link>
              <Link to="/golf-learnership-programme" className="text-neutral-400 hover:text-orange-500 transition-colors">
                Golf Learnership
              </Link>
              <Link to="/keep-it-in-the-family" className="text-neutral-400 hover:text-orange-500 transition-colors">
                Keep It In The Family
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com/tuckerfamilycharity"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-400 hover:text-orange-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
                @tuckerfamilycharity
              </a>
              <a
                href="https://www.facebook.com/tuckerfamilycharity"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-400 hover:text-orange-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                Tucker Family Charity
              </a>
              <div className="flex items-start gap-2 text-neutral-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Johannesburg, South Africa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Partner logos */}
        <div className="border-t border-neutral-800 mt-8 pt-8">
          <p className="text-neutral-500 text-sm mb-4">Supported by</p>
          <div className="flex flex-wrap gap-x-5 gap-y-3 items-center">
            {partners.map((partner) => {
              const src = partnerDisplayLogo(partner);
              if (partner.websiteUrl) {
                return (
                  <a
                    key={partner.id}
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 hover:opacity-100 transition-opacity shrink-0"
                  >
                    {src ? (
                      <img
                        src={src}
                        alt={partner.name}
                        className="h-8 w-8 sm:h-9 sm:w-9 object-contain rounded"
                      />
                    ) : (
                      <span className="text-sm text-neutral-400 hover:text-orange-400">
                        {partner.name}
                      </span>
                    )}
                  </a>
                );
              }
              return (
                <Link
                  key={partner.id}
                  to="/partners"
                  className="opacity-70 hover:opacity-100 transition-opacity shrink-0 text-sm text-neutral-500 hover:text-neutral-300"
                >
                  {partner.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={logo}
              alt="Tucker Family Charity"
              className="h-12 md:h-14 w-auto invert opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>
          <p className="text-neutral-400 text-sm text-center sm:text-right">
            &copy; {new Date().getFullYear()} Tucker Family Charity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}