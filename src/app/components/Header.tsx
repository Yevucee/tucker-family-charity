import { Link } from "react-router";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/4920ca320ce31a579ec4c3d0fcc360b4528a2024.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Tucker Family Charity" className="h-16 md:h-20 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-neutral-700 hover:text-orange-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-neutral-700 hover:text-orange-600 transition-colors">
              About
            </Link>
            <Link to="/events" className="text-neutral-700 hover:text-orange-600 transition-colors">
              Events
            </Link>
            <Link to="/shop" className="text-neutral-700 hover:text-orange-600 transition-colors">
              Shop
            </Link>
            <a
              href="#support"
              className="bg-orange-600 text-white px-5 py-2 rounded-full hover:bg-orange-700 transition-colors"
            >
              Support Us
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-neutral-200">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-neutral-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-neutral-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/events"
                className="text-neutral-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/shop"
                className="text-neutral-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <a
                href="#support"
                className="bg-orange-600 text-white px-5 py-2 rounded-full hover:bg-orange-700 transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Support Us
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}