import { useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { CompactHowItWorks } from "../../components/work-opportunities/CompactHowItWorks";
import { ProfileCard } from "../../components/work-opportunities/ProfileCard";
import { useOpportunitiesData } from "../../components/work-opportunities/useOpportunitiesData";
import { WorkOpportunitiesHero } from "../../components/work-opportunities/WorkOpportunitiesHero";

export function LookingForWork() {
  const { profiles, loading, loadError } = useOpportunitiesData();

  useEffect(() => {
    document.title = "Looking for Work | Work Opportunities | Tucker Family Charity";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <WorkOpportunitiesHero
        title="Looking for Work"
        description="Profiles from our network. Email Tucker Family Charity if you would like to learn more about a candidate."
      />

      <section className="py-10 md:py-14 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-neutral-600 py-12">Loading profiles…</p>
          ) : loadError ? (
            <p className="text-center text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-xl mx-auto">
              {loadError}
            </p>
          ) : profiles.length === 0 ? (
            <p className="text-center text-neutral-600 py-12 max-w-md mx-auto leading-relaxed">
              No profiles are listed at the moment. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
              {profiles.map((p) => (
                <ProfileCard key={p.id} profile={p} />
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
