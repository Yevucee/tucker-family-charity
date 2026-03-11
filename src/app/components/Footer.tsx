import { Heart, Instagram, MapPin } from "lucide-react";
import { Link } from "react-router";
import { Facebook } from "lucide-react";
import logo from "@/assets/4920ca320ce31a579ec4c3d0fcc360b4528a2024.png";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Tucker Family Charity" className="h-20 md:h-24 w-auto brightness-0 invert" />
            </div>
            <p className="text-neutral-400 max-w-md text-lg">
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
              <Link to="/events" className="text-neutral-400 hover:text-orange-500 transition-colors">
                Events
              </Link>
              <Link to="/#support" className="text-neutral-400 hover:text-orange-500 transition-colors">
                Donate
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

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Tucker Family Charity. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}