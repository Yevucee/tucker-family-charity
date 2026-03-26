import { Link, NavLink, useLocation } from "react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import logo from "@/assets/4920ca320ce31a579ec4c3d0fcc360b4528a2024.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [programmesOpen, setProgrammesOpen] = useState(false);
  const location = useLocation();
  const isProgrammesActive =
    location.pathname.startsWith("/golf-learnership-programme") ||
    location.pathname.startsWith("/olivers-village");

  return (
    <header className="bg-white border-b border-amber-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Tucker Family Charity" className="h-16 md:h-20 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
              }
            >
              About
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
              }
            >
              Events
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/partners"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
              }
            >
              Partners
            </NavLink>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger
                className={`flex items-center gap-1 transition-colors ${
                  isProgrammesActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600"
                }`}
              >
                Programmes
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="z-[100]"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                  <Link to="/olivers-village" className="cursor-pointer">
                    Oliver&apos;s Village
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                  <Link to="/golf-learnership-programme" className="cursor-pointer">
                    Golf Learnership Programme
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <NavLink
              to="/keep-it-in-the-family"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
              }
            >
              Keep It In The Family
            </NavLink>
            <Link
              to="/donate"
              className="bg-orange-600 text-white px-5 py-2 rounded-full hover:bg-orange-700 transition-colors"
            >
              Support Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-amber-950"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-amber-200/80">
            <div className="flex flex-col gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  isActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </NavLink>
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  isActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </NavLink>
              <NavLink
                to="/partners"
                className={({ isActive }) =>
                  isActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Partners
              </NavLink>
              <Collapsible open={programmesOpen} onOpenChange={setProgrammesOpen}>
                <CollapsibleTrigger
                  className={`flex items-center justify-between w-full py-2 ${
                    isProgrammesActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
                  }`}
                >
                  Programmes
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${programmesOpen ? "rotate-180" : ""}`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pl-4 py-2 flex flex-col">
                    <Link
                      to="/olivers-village"
                      className="text-amber-950 hover:text-orange-600 transition-colors block py-2"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setProgrammesOpen(false);
                      }}
                    >
                      Oliver&apos;s Village
                    </Link>
                    <Link
                      to="/golf-learnership-programme"
                      className="text-amber-950 hover:text-orange-600 transition-colors block py-2"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setProgrammesOpen(false);
                      }}
                    >
                      Golf Learnership Programme
                    </Link>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <NavLink
                to="/keep-it-in-the-family"
                className={({ isActive }) =>
                  isActive ? "text-orange-600 font-semibold" : "text-amber-950 hover:text-orange-600 transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Keep It In The Family
              </NavLink>
              <Link
                to="/donate"
                className="flex items-center justify-center min-h-[44px] bg-orange-600 text-white px-5 py-3 rounded-full hover:bg-orange-700 transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Support Us
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
