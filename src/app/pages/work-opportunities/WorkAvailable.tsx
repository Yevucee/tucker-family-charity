import { useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { CompactHowItWorks } from "../../components/work-opportunities/CompactHowItWorks";
import { JobCard } from "../../components/work-opportunities/JobCard";
import { useOpportunitiesData } from "../../components/work-opportunities/useOpportunitiesData";
import { WorkOpportunitiesSubNav } from "../../components/work-opportunities/WorkOpportunitiesSubNav";

export function WorkAvailable() {
  const { jobs, loading, loadError } = useOpportunitiesData();

  useEffect(() => {
    document.title = "Work Available | Work Opportunities | Tucker Family Charity";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-10 md:py-12 border-b border-amber-900/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-100/90 mb-1">
            Work Opportunities
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">Work Available</h1>
          <p className="text-base sm:text-lg text-amber-100 leading-relaxed max-w-2xl mx-auto">
            Roles and placements from our network. Email us if you are interested or would like us to follow up.
          </p>
          <div className="mt-6">
            <WorkOpportunitiesSubNav />
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-neutral-600 py-12">Loading opportunities…</p>
          ) : loadError ? (
            <p className="text-center text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-xl mx-auto">
              {loadError}
            </p>
          ) : jobs.length === 0 ? (
            <p className="text-center text-neutral-600 py-12 max-w-md mx-auto leading-relaxed">
              No opportunities are listed at the moment. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
              {jobs.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CompactHowItWorks />
      <Footer />
    </div>
  );
}
