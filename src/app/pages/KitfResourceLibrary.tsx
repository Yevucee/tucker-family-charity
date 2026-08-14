import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, BookOpen, ExternalLink, Filter, Search, Star } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { KITF_LIBRARY_SHEET_ID } from "@/config";
import {
  kitfLibraryOpensheetUrl,
  kitfLibraryPageCopy,
  normalizeDisplayType,
  normalizeKitfLibraryRow,
  resourceCardDescription,
  resourceHasExternalLink,
  resourceSearchHaystack,
  sortLibraryResources,
  type KitfLibraryResource,
} from "@/data/kitfLibrary";

const PAGE_SIZE = 24;

function typeBadgeClass(type: string): string {
  switch (type) {
    case "Podcast":
      return "bg-violet-100 text-violet-900 ring-violet-200/80";
    case "YouTube":
      return "bg-red-100 text-red-900 ring-red-200/80";
    case "TED Talk":
      return "bg-rose-100 text-rose-950 ring-rose-200/80";
    case "Netflix":
      return "bg-neutral-800 text-white ring-neutral-700";
    case "Book":
      return "bg-amber-100 text-amber-950 ring-amber-200/80";
    case "Article":
      return "bg-sky-100 text-sky-950 ring-sky-200/80";
    case "LinkedIn":
    case "Social":
      return "bg-blue-100 text-blue-950 ring-blue-200/80";
    case "Wildlife":
      return "bg-emerald-100 text-emerald-950 ring-emerald-200/80";
    case "Motivation":
    case "Health":
      return "bg-teal-100 text-teal-950 ring-teal-200/80";
    case "Video":
    case "Talk":
      return "bg-orange-100 text-orange-950 ring-orange-200/80";
    default:
      return "bg-neutral-100 text-neutral-800 ring-neutral-200/80";
  }
}

function ResourceCard({ resource }: { resource: KitfLibraryResource }) {
  const displayType = normalizeDisplayType(resource.type);
  const hasLink = resourceHasExternalLink(resource.link);
  const summary = resourceCardDescription(resource);
  const hasCustomDescription = resource.description.trim().length >= 20;

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-amber-100/90 flex flex-col h-full overflow-hidden">
      <div className="p-5 sm:p-6 flex flex-col flex-1 min-h-0">
        <div className="flex items-center gap-2 h-8 mb-3 overflow-hidden shrink-0">
          <span
            className={`inline-flex items-center shrink-0 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md ring-1 ring-inset ${typeBadgeClass(displayType)}`}
          >
            {displayType}
          </span>
          {resource.topic && (
            <span className="inline-flex items-center shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-950 ring-1 ring-inset ring-amber-200/80 truncate max-w-[40%]">
              {resource.topic}
            </span>
          )}
          {resource.featured && (
            <span className="inline-flex items-center gap-1 shrink-0 text-[11px] font-semibold text-amber-800 ml-auto">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" aria-hidden />
              Featured
            </span>
          )}
        </div>

        <h3
          className="text-lg font-bold text-neutral-900 leading-snug line-clamp-3 h-[5.25rem] overflow-hidden shrink-0"
          title={resource.title}
        >
          {resource.title}
        </h3>

        <p
          className={`text-sm h-5 line-clamp-1 overflow-hidden shrink-0 mt-2 mb-3 ${
            resource.author ? "text-neutral-600" : "text-transparent select-none"
          }`}
          aria-hidden={!resource.author}
        >
          {resource.author || "\u00a0"}
        </p>

        <p
          className={`text-sm leading-relaxed line-clamp-3 h-[4.5rem] overflow-hidden shrink-0 ${
            hasCustomDescription ? "text-neutral-700" : "text-neutral-500 italic"
          }`}
        >
          {summary}
        </p>
      </div>

      <div className="px-5 sm:px-6 py-4 bg-amber-50/50 border-t border-amber-100/90 mt-auto shrink-0 min-h-[3.25rem] flex items-center">
        {hasLink ? (
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-semibold text-orange-700 hover:text-orange-800"
          >
            {kitfLibraryPageCopy.openResource}
            <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
          </a>
        ) : (
          <span className="text-sm text-neutral-500">{kitfLibraryPageCopy.noLink}</span>
        )}
      </div>
    </article>
  );
}

export function KitfResourceLibrary() {
  const [resources, setResources] = useState<KitfLibraryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchLibrary = async () => {
      if (!KITF_LIBRARY_SHEET_ID) {
        setLoadError(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(kitfLibraryOpensheetUrl());
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        const rows = Array.isArray(data) ? data : [];
        const parsed = rows
          .map((row: Record<string, unknown>) => normalizeKitfLibraryRow(row))
          .filter((row): row is KitfLibraryResource => row != null);
        setResources(sortLibraryResources(parsed));
        setLoadError(false);
      } catch {
        setResources([]);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const typeOptions = useMemo(() => {
    const types = new Set(resources.map((r) => normalizeDisplayType(r.type)).filter(Boolean));
    return ["all", ...Array.from(types).sort((a, b) => a.localeCompare(b))];
  }, [resources]);

  const topicOptions = useMemo(() => {
    const topics = new Set(resources.map((r) => r.topic).filter(Boolean));
    return ["all", ...Array.from(topics).sort((a, b) => a.localeCompare(b))];
  }, [resources]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((resource) => {
      if (typeFilter !== "all" && normalizeDisplayType(resource.type) !== typeFilter) return false;
      if (topicFilter !== "all" && resource.topic !== topicFilter) return false;
      if (!q) return true;
      return resourceSearchHaystack(resource).includes(q);
    });
  }, [resources, search, typeFilter, topicFilter]);

  const featured = useMemo(
    () => filtered.filter((r) => r.featured).slice(0, 6),
    [filtered],
  );

  const showFeaturedStrip =
    featured.length > 0 && search.trim() === "" && typeFilter === "all" && topicFilter === "all" && page === 1;

  const listForGrid = useMemo(() => {
    if (!showFeaturedStrip) return filtered;
    const featuredLinks = new Set(featured.map((r) => r.link));
    return filtered.filter((r) => !featuredLinks.has(r.link));
  }, [filtered, featured, showFeaturedStrip]);

  const totalPages = Math.max(1, Math.ceil(listForGrid.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return listForGrid.slice(start, start + PAGE_SIZE);
  }, [listForGrid, safePage]);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, topicFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const showFrom = listForGrid.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const showTo = Math.min(safePage * PAGE_SIZE, listForGrid.length);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main id="main-content">

      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 mb-4">
            <BookOpen className="w-7 h-7" aria-hidden />
          </div>
          <p className="text-sm uppercase tracking-wide text-amber-100/90 mb-2">{kitfLibraryPageCopy.subtitle}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{kitfLibraryPageCopy.title}</h1>
          <p className="text-lg text-amber-100 leading-relaxed">{kitfLibraryPageCopy.intro}</p>
          <Link
            to="/keep-it-in-the-family/"
            className="mt-6 inline-flex items-center gap-2 py-3 px-5 rounded-xl border-2 border-white/80 text-white font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
            {kitfLibraryPageCopy.backToKitf}
          </Link>
        </div>
      </section>

      <section className="py-8 bg-amber-50/80 border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" aria-hidden />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={kitfLibraryPageCopy.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 min-w-[180px]">
                <Filter className="w-5 h-5 text-neutral-500 shrink-0" aria-hidden />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  aria-label="Filter by format"
                >
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? kitfLibraryPageCopy.typeFilterAll : type}
                    </option>
                  ))}
                </select>
              </div>
              {topicOptions.length > 1 && (
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="w-full sm:min-w-[180px] px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  aria-label="Filter by topic"
                >
                  {topicOptions.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic === "all" ? kitfLibraryPageCopy.topicFilterAll : topic}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center py-16 text-neutral-500">{kitfLibraryPageCopy.loading}</p>
          ) : loadError ? (
            <p className="text-center py-16 text-neutral-600 max-w-xl mx-auto">{kitfLibraryPageCopy.loadError}</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-16 text-neutral-500">{kitfLibraryPageCopy.resultsEmpty}</p>
          ) : (
            <>
              {showFeaturedStrip && (
                <div className="mb-12">
                  <h2 className="text-xl font-bold text-neutral-900 mb-5">{kitfLibraryPageCopy.featuredHeading}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((resource, index) => (
                      <ResourceCard key={`featured-${resource.link}-${index}`} resource={resource} />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <p className="text-sm text-neutral-600">
                  {kitfLibraryPageCopy.showing(showFrom, showTo, listForGrid.length)}
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      className="px-4 py-2 rounded-lg border border-amber-200 text-sm font-semibold disabled:opacity-40 hover:bg-amber-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-neutral-600">
                      Page {safePage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                      className="px-4 py-2 rounded-lg border border-amber-200 text-sm font-semibold disabled:opacity-40 hover:bg-amber-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {paginated.map((resource, index) => (
                  <ResourceCard key={`${resource.link}-${index}`} resource={resource} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="px-4 py-2 rounded-lg border border-amber-200 text-sm font-semibold disabled:opacity-40 hover:bg-amber-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="px-4 py-2 rounded-lg border border-amber-200 text-sm font-semibold disabled:opacity-40 hover:bg-amber-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
