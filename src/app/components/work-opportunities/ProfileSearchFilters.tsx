import { Search, X } from "lucide-react";
import {
  DEFAULT_PROFILE_LIST_FILTERS,
  PROFILE_FILTER_AREAS,
  PROFILE_FILTER_CATEGORIES,
  type ProfileListFilters,
  profileListFiltersActive,
} from "@/data/opportunities";

const filterChipClass = (active: boolean) =>
  [
    "shrink-0 px-3.5 py-2 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
    active
      ? "bg-orange-600 text-white shadow-sm"
      : "bg-white text-amber-950 border border-amber-200 hover:bg-amber-50",
  ].join(" ");

type Props = {
  filters: ProfileListFilters;
  onChange: (next: ProfileListFilters) => void;
  totalCount: number;
  filteredCount: number;
};

export function ProfileSearchFilters({ filters, onChange, totalCount, filteredCount }: Props) {
  const active = profileListFiltersActive(filters);

  return (
    <div className="mb-10 rounded-2xl border border-amber-100/90 bg-white shadow-md p-5 sm:p-6 space-y-5">
      <div>
        <label htmlFor="profile-search" className="block text-sm font-semibold text-neutral-800 mb-2">
          Search candidates
        </label>
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700/70 pointer-events-none"
            aria-hidden
          />
          <input
            id="profile-search"
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Role, skills, or keywords — e.g. COO, CRA, marketing, PMP…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-amber-200/90 bg-amber-50/40 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/80 focus:border-orange-400"
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-neutral-800 mb-2">Type of role</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={filterChipClass(filters.category === "all")}
            onClick={() => onChange({ ...filters, category: "all" })}
          >
            All types
          </button>
          {PROFILE_FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={filterChipClass(filters.category === cat.id)}
              onClick={() =>
                onChange({
                  ...filters,
                  category: filters.category === cat.id ? "all" : cat.id,
                })
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-neutral-800 mb-2">Area</p>
        <div className="flex flex-wrap gap-2">
          {PROFILE_FILTER_AREAS.map((area) => (
            <button
              key={area.id}
              type="button"
              className={filterChipClass(filters.area === area.id)}
              onClick={() => onChange({ ...filters, area: area.id })}
            >
              {area.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-amber-100/80">
        <p className="text-sm text-neutral-600">
          Showing <span className="font-semibold text-neutral-900">{filteredCount}</span> of{" "}
          <span className="font-semibold text-neutral-900">{totalCount}</span> profiles
        </p>
        {active ? (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_PROFILE_LIST_FILTERS)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 hover:text-orange-800"
          >
            <X className="w-4 h-4" aria-hidden />
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
