import { Link } from "react-router";
import { Instagram, MapPin } from "lucide-react";
import { Facebook } from "lucide-react";
import logo from "@/assets/4920ca320ce31a579ec4c3d0fcc360b4528a2024.png";

export function Footer() {
  return (
    <footer className="bg-amber-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {/* Black-on-white PNG: invert → white art + black mat; screen blends the mat away on dark bg. */}
              <img
                src={logo}
                alt="Tucker Family Charity"
                className="h-20 md:h-24 w-auto opacity-95 invert mix-blend-screen"
              />
            </div>
            <p className="text-amber-200/90 max-w-md text-base md:text-lg">
              A vibrant family-led charity creating practical opportunities and supporting vulnerable communities
              through partnership, action and shared purpose.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-amber-200/90 hover:text-orange-400 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-amber-200/90 hover:text-orange-400 transition-colors">
                About Us
              </Link>
              <Link to="/olivers-village" className="text-amber-200/90 hover:text-orange-400 transition-colors">
                Oliver&apos;s Village
              </Link>
              <Link to="/events" className="text-amber-200/90 hover:text-orange-400 transition-colors">
                Events
              </Link>
              <Link to="/shop" className="text-amber-200/90 hover:text-orange-400 transition-colors">
                Shop
              </Link>
              <Link to="/donate" className="text-amber-200/90 hover:text-orange-400 transition-colors">
                Support Us
              </Link>
              <Link to="/partners" className="text-amber-200/90 hover:text-orange-400 transition-colors">
                Partners
              </Link>
              <Link to="/golf-learnership-programme" className="text-amber-200/90 hover:text-orange-400 transition-colors">
                Golf Learnership
              </Link>
              <Link to="/keep-it-in-the-family" className="text-amber-200/90 hover:text-orange-400 transition-colors">
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
                className="flex items-center gap-2 text-amber-200/90 hover:text-orange-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
                @tuckerfamilycharity
              </a>
              <a
                href="https://www.facebook.com/tuckerfamilycharity"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-amber-200/90 hover:text-orange-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                Tucker Family Charity
              </a>
              <div className="flex items-start gap-2 text-amber-200/90">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Johannesburg, South Africa</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-900/50 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={logo}
              alt="Tucker Family Charity"
              className="h-12 md:h-14 w-auto opacity-95 invert mix-blend-screen hover:opacity-100 transition-opacity"
            />
          </Link>
          <p className="text-amber-200/80 text-sm text-center sm:text-right">
            &copy; {new Date().getFullYear()} Tucker Family Charity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}