import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Search, Phone, Filter, Mail, Globe, Briefcase, Users } from "lucide-react";
import { DIRECTORY_SHEET_ID, NETWORKING_SHEET_ID } from "@/config";

interface ServicesEntry {
  name: string;
  profession: string;
  area: string;
  phone: string;
  trusted_by: string;
  notes: string;
  website?: string;
}

interface NetworkingEntry {
  name: string;
  company: string;
  sectors: string;
  business_interests: string;
  phone: string;
  email: string;
  area: string;
  website: string;
}

const MOCK_SERVICES: ServicesEntry[] = [
  {
    name: "John Smith",
    profession: "Plumber",
    area: "Sandton",
    phone: "+27 11 123 4567",
    trusted_by: "Tucker family",
    notes: "Reliable emergency plumbing work",
  },
  {
    name: "Sarah Johnson",
    profession: "Electrician",
    area: "Johannesburg North",
    phone: "+27 11 234 5678",
    trusted_by: "Tucker family",
    notes: "Residential and commercial",
  },
  {
    name: "Mike Williams",
    profession: "Gardener",
    area: "Rosebank",
    phone: "+27 11 345 6789",
    trusted_by: "Community network",
    notes: "Landscaping and maintenance",
  },
];

export function KeepItInTheFamily() {
  const [activeTab, setActiveTab] = useState<"services" | "networking">("services");
  const [servicesEntries, setServicesEntries] = useState<ServicesEntry[]>([]);
  const [networkingEntries, setNetworkingEntries] = useState<NetworkingEntry[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [networkingLoading, setNetworkingLoading] = useState(true);
  const [servicesSearch, setServicesSearch] = useState("");
  const [servicesCategory, setServicesCategory] = useState<string>("all");
  const [networkingSearch, setNetworkingSearch] = useState("");
  const [networkingCategory, setNetworkingCategory] = useState<string>("all");

  useEffect(() => {
    const fetchServices = async () => {
      if (!DIRECTORY_SHEET_ID || DIRECTORY_SHEET_ID === "YOUR_SHEET_ID") {
        setServicesEntries(MOCK_SERVICES);
        setServicesLoading(false);
        return;
      }
      try {
        const url = `https://opensheet.elk.sh/${DIRECTORY_SHEET_ID}/Sheet1`;
        const res = await fetch(url);
        const data = await res.json();
        setServicesEntries(Array.isArray(data) ? data : []);
      } catch {
        setServicesEntries(MOCK_SERVICES);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const normalizeRow = (row: Record<string, unknown>): NetworkingEntry => {
      const get = (...keys: string[]) => {
        const key = keys.find((k) => row[k] != null && String(row[k]).trim() !== "");
        return key != null ? String(row[key]).trim() : "";
      };
      return {
        name: get("name", "Name"),
        company: get("company", "Company"),
        sectors: get("sectors", "Sectors"),
        business_interests: get("business_interests", "Business Interest"),
        phone: get("phone", "Phone"),
        email: get("email", "Email"),
        area: get("area", "Area"),
        website: get("website", "Website"),
      };
    };

    const fetchNetworking = async () => {
      if (!NETWORKING_SHEET_ID || NETWORKING_SHEET_ID === "YOUR_SHEET_ID") {
        setNetworkingEntries([]);
        setNetworkingLoading(false);
        return;
      }
      try {
        const url = `https://opensheet.elk.sh/${NETWORKING_SHEET_ID}/Sheet1`;
        const res = await fetch(url);
        const raw = await res.json();
        const rows = Array.isArray(raw) ? raw : [];
        const normalized = rows
          .map((r: Record<string, unknown>) => normalizeRow(r))
          .filter((r) => r.name || r.company);
        setNetworkingEntries(normalized);
      } catch {
        setNetworkingEntries([]);
      } finally {
        setNetworkingLoading(false);
      }
    };
    fetchNetworking();
  }, []);

  const servicesCategories = [
    "all",
    ...Array.from(new Set(servicesEntries.map((e) => e.profession).filter(Boolean))),
  ];
  const filteredServices = servicesEntries.filter((e) => {
    const matchSearch =
      !servicesSearch ||
      e.name.toLowerCase().includes(servicesSearch.toLowerCase()) ||
      e.profession.toLowerCase().includes(servicesSearch.toLowerCase()) ||
      e.area.toLowerCase().includes(servicesSearch.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(servicesSearch.toLowerCase()));
    const matchCategory =
      servicesCategory === "all" || e.profession === servicesCategory;
    return matchSearch && matchCategory;
  });

  const networkingSectors = [
    "all",
    ...Array.from(
      new Set(
        networkingEntries.flatMap((e) =>
          (e.sectors || "")
            .split(/[;,]/)
            .map((s) => s.trim())
            .filter(Boolean)
        )
      )
    ),
  ].filter(Boolean);
  const filteredNetworking = networkingEntries.filter((e) => {
    const sectorsList = (e.sectors || "").split(/[;,]/).map((s) => s.trim().toLowerCase());
    const interestsList = (e.business_interests || "")
      .split(/[;,]/)
      .map((s) => s.trim().toLowerCase());
    const matchSearch =
      !networkingSearch ||
      e.name.toLowerCase().includes(networkingSearch.toLowerCase()) ||
      (e.company && e.company.toLowerCase().includes(networkingSearch.toLowerCase())) ||
      sectorsList.some((s) => s.includes(networkingSearch.toLowerCase())) ||
      interestsList.some((s) => s.includes(networkingSearch.toLowerCase())) ||
      (e.area && e.area.toLowerCase().includes(networkingSearch.toLowerCase()));
    const matchSector =
      networkingCategory === "all" ||
      sectorsList.some((s) => s === networkingCategory.toLowerCase());
    return matchSearch && matchSector;
  });

  const registerMailto =
    "mailto:info@tuckerfamilycharity.org?subject=Keep%20It%20In%20The%20Family%20-%20Networking%20Membership";

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero + Tabs (orange banner – title, subtitle, tabs centred) */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16 md:py-20">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Keep It In The Family</h1>
            <p className="text-xl text-amber-100 mb-8">
              Support family and friends in business—trusted professionals and networking, all in one
              place.
            </p>
          </div>
          <div className="w-full flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-1.5 border border-white/30 inline-flex gap-1">
              <button
                onClick={() => setActiveTab("services")}
                className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg font-semibold text-base transition-all duration-200 ${
                  activeTab === "services"
                    ? "bg-white text-amber-800 shadow-md"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
              >
                <Briefcase className="w-5 h-5 text-current shrink-0" />
                Services
              </button>
              <button
                onClick={() => setActiveTab("networking")}
                className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg font-semibold text-base transition-all duration-200 ${
                  activeTab === "networking"
                    ? "bg-white text-amber-800 shadow-md"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
              >
                <Users className="w-5 h-5 text-current shrink-0" />
                Networking
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services tab */}
      {activeTab === "services" && (
        <>
          <section className="py-12 bg-amber-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Find Trusted Professionals</h2>
              <p className="text-lg text-neutral-700">
                Search by name or sector. Plumbers, electricians, accountants, builders—people
                recommended by our community. Free to view.
              </p>
            </div>
          </section>

          <section className="py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="search"
                    placeholder="Search by name, profession, area..."
                    value={servicesSearch}
                    onChange={(e) => setServicesSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                  <select
                    value={servicesCategory}
                    onChange={(e) => setServicesCategory(e.target.value)}
                    className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {servicesCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "All categories" : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {servicesLoading ? (
                <div className="text-center py-12 text-neutral-500">Loading...</div>
              ) : filteredServices.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">No matches found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((entry, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-neutral-100"
                    >
                      <h3 className="text-xl font-bold text-neutral-900 mb-1">{entry.name}</h3>
                      <p className="text-orange-600 font-semibold mb-2">
                        {entry.profession}
                        {entry.area && ` • ${entry.area}`}
                      </p>
                      <p className="text-sm text-neutral-600 mb-2">
                        Trusted by {entry.trusted_by}
                      </p>
                      {entry.notes && (
                        <p className="text-neutral-700 mb-4">{entry.notes}</p>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {entry.phone && (
                          <a
                            href={`tel:${entry.phone.replace(/\s/g, "")}`}
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                          >
                            <Phone className="w-4 h-4" />
                            {entry.phone}
                          </a>
                        )}
                        {entry.website && (
                          <a
                            href={entry.website.startsWith("http") ? entry.website : `https://${entry.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Networking tab */}
      {activeTab === "networking" && (
        <>
          <section className="py-12 bg-amber-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Business Networking</h2>
              <p className="text-lg text-neutral-700 mb-6">
                Directory of business owners and shareholders. Expand your network through trusted
                introductions.
              </p>
              <div className="bg-white rounded-lg p-6 text-left max-w-xl mx-auto border border-amber-200">
                <p className="font-semibold text-neutral-900 mb-2">Membership</p>
                <p className="text-neutral-700">
                  R100/month or R1000 once off. Charity monthly contributors get automatic listing.
                </p>
              </div>
            </div>
          </section>

          <section className="py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="search"
                    placeholder="Search by name, company, sector..."
                    value={networkingSearch}
                    onChange={(e) => setNetworkingSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                  <select
                    value={networkingCategory}
                    onChange={(e) => setNetworkingCategory(e.target.value)}
                    className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {networkingSectors.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "All sectors" : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 pb-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {networkingLoading ? (
                <div className="text-center py-12 text-neutral-500">Loading...</div>
              ) : filteredNetworking.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">No matches found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNetworking.map((entry, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-neutral-100"
                    >
                      <h3 className="text-xl font-bold text-neutral-900 mb-1">{entry.name}</h3>
                      {entry.company && (
                        <p className="text-orange-600 font-semibold mb-2">{entry.company}</p>
                      )}
                      {entry.sectors && (
                        <p className="text-sm text-neutral-600 mb-1">
                          {entry.sectors.replace(/[;,]/g, ", ")}
                        </p>
                      )}
                      {entry.business_interests && (
                        <p className="text-sm text-neutral-500 mb-2">{entry.business_interests}</p>
                      )}
                      {entry.area && (
                        <p className="text-sm text-neutral-500 mb-3">{entry.area}</p>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {entry.phone && (
                          <a
                            href={`tel:${entry.phone.replace(/\s/g, "")}`}
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                          >
                            <Phone className="w-4 h-4" />
                            {entry.phone}
                          </a>
                        )}
                        {entry.email && (
                          <a
                            href={`mailto:${entry.email}`}
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                          >
                            <Mail className="w-4 h-4" />
                            Email
                          </a>
                        )}
                        {entry.website && (
                          <a
                            href={
                              entry.website.startsWith("http")
                                ? entry.website
                                : `https://${entry.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="py-8 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <a
                href={registerMailto}
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Register your business
              </a>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
