import { useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { CompactHowItWorks } from "../../components/work-opportunities/CompactHowItWorks";
import { JobCard } from "../../components/work-opportunities/JobCard";
import { useOpportunitiesData } from "../../components/work-opportunities/useOpportunitiesData";
import { WorkOpportunitiesHero } from "../../components/work-opportunities/WorkOpportunitiesHero";

export function WorkAvailable() {
  const { jobs, loading, loadError } = useOpportunitiesData();

  useEffect(() => {
    document.title = "Work Available | Work Opportunities | Tucker Family Charity";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <WorkOpportunitiesHero
        title="Work Available"
        description="Roles and placements from our network. Email us if you are interested or would like us to follow up."
      />

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
