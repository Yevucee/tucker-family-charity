import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Search, Phone, Filter } from "lucide-react";
import { DIRECTORY_SHEET_ID } from "@/config";

interface DirectoryEntry {
  name: string;
  profession: string;
  area: string;
  phone: string;
  trusted_by: string;
  notes: string;
}

// Fallback mock data when Google Sheet is not configured
const MOCK_ENTRIES: DirectoryEntry[] = [
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
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      if (!DIRECTORY_SHEET_ID || DIRECTORY_SHEET_ID === "YOUR_SHEET_ID") {
        setEntries(MOCK_ENTRIES);
        setLoading(false);
        return;
      }

      try {
        const url = `https://opensheet.elk.sh/${DIRECTORY_SHEET_ID}/Sheet1`;
        const res = await fetch(url);
        const data = await res.json();
        setEntries(Array.isArray(data) ? data : []);
      } catch {
        setEntries(MOCK_ENTRIES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = ["all", ...Array.from(new Set(entries.map((e) => e.profession).filter(Boolean)))];
  const filtered = entries.filter((e) => {
    const matchSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.profession.toLowerCase().includes(search.toLowerCase()) ||
      e.area.toLowerCase().includes(search.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = category === "all" || e.profession === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative h-[300px] bg-gradient-to-r from-amber-600 to-amber-800">
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Keep It In The Family</h1>
            <p className="text-xl text-amber-100">
              Trusted people recommended by our family and community network
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-neutral-700">
            Plumbers, electricians, gardeners, accountants, child minders, builders, tutors—people we trust and recommend. Search or filter to find someone.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="search"
                placeholder="Search by name, profession, area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-neutral-500 flex-shrink-0" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Cards */}
      <section className="py-12 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-neutral-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">No matches found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((entry, i) => (
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
                  {entry.phone && (
                    <a
                      href={`tel:${entry.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      <Phone className="w-4 h-4" />
                      {entry.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
