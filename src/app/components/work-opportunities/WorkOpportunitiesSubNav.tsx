import { NavLink } from "react-router";
import { Briefcase, Search } from "lucide-react";

const tabClass = ({ isActive }: { isActive: boolean }) =>
  [
    "inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
    isActive
      ? "bg-amber-600 text-white shadow-sm"
      : "bg-white text-amber-950 border border-amber-200 hover:bg-amber-50",
  ].join(" ");

export function WorkOpportunitiesSubNav() {
  return (
    <nav
      className="flex flex-wrap justify-center gap-2"
      aria-label="Work Opportunities sections"
    >
      <NavLink to="/work-opportunities/looking-for-work" className={tabClass} end>
        <Search className="w-4 h-4" aria-hidden />
        Looking for Work
      </NavLink>
      <NavLink to="/work-opportunities/work-available" className={tabClass}>
        <Briefcase className="w-4 h-4" aria-hidden />
        Work Available
      </NavLink>
    </nav>
  );
}
