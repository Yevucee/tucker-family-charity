import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  Briefcase,
  Handshake,
  Mail,
  MapPin,
  MessageSquare,
  Search,
  User,
  Users,
} from "lucide-react";
import {
  jobInterestMailto,
  parseOpportunitiesData,
  profileInterestMailto,
  type JobOpportunity,
  type JobSeekerProfile,
} from "@/data/opportunities";
import heroImage from "@/assets/OV photo_s for Website/Computer Training 12.jpg";

type OpportunityTab = "profiles" | "jobs";

const filterBtn = (active: boolean) =>
  [
    "px-5 py-2.5 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
    active
      ? "bg-amber-600 text-white shadow-sm"
      : "bg-white text-amber-950 border border-amber-200 hover:bg-amber-50",
  ].join(" ");

function ProfileCard({ profile }: { profile: JobSeekerProfile }) {
  return (
    <article className="flex flex-col h-full rounded-2xl border border-amber-100/90 bg-white shadow-md hover:shadow-lg transition-shadow p-6 sm:p-7">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
          <User className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-neutral-900">{profile.displayName}</h3>
          <p className="mt-1 flex items-start gap-1.5 text-sm font-medium text-amber-900/85">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-85" aria-hidden />
            <span>{profile.location}</span>
          </p>
        </div>
      </div>

      <p className="text-sm font-semibold text-orange-600 mb-3">{profile.workType}</p>

      <dl className="space-y-2 text-sm text-neutral-700 flex-1">
        <div>
          <dt className="font-semibold text-neutral-800">Skills / experience</dt>
          <dd className="mt-0.5 leading-relaxed">{profile.skills}</dd>
        </div>
        <div>
          <dt className="font-semibold text-neutral-800">Availability</dt>
          <dd className="mt-0.5">{profile.availability}</dd>
        </div>
        {profile.summary.trim() ? (
          <div>
            <dt className="font-semibold text-neutral-800">Summary</dt>
            <dd className="mt-0.5 leading-relaxed">{profile.summary}</dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-4 text-xs text-neutral-600 leading-relaxed">
        Contact details are not published here. Email Tucker Family Charity if you would like to explore a connection.
      </p>

      <a
        href={profileInterestMailto(profile)}
        className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-orange-600 text-white font-semibold text-[15px] hover:bg-orange-700 transition-colors shadow-sm"
      >
        <Mail className="w-4 h-4" aria-hidden />
        I&apos;m Interested
      </a>
    </article>
  );
}

function JobCard({ job }: { job: JobOpportunity }) {
  return (
    <article className="flex flex-col h-full rounded-2xl border border-amber-100/90 bg-white shadow-md hover:shadow-lg transition-shadow p-6 sm:p-7">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
          <Briefcase className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-neutral-900 leading-snug">{job.title}</h3>
          {job.organisation.trim() ? (
            <p className="mt-1 text-sm text-neutral-600">{job.organisation}</p>
          ) : null}
          <p className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-amber-900/85">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-85" aria-hidden />
            <span>{job.location}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-900">
          {job.type}
        </span>
        <span className="rounded-full bg-neutral-50 border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700">
          {job.compensation}
        </span>
        {job.startDate?.trim() ? (
          <span className="rounded-full bg-neutral-50 border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600">
            Start: {job.startDate}
          </span>
        ) : null}
      </div>

      <p className="text-sm leading-relaxed text-neutral-700 flex-1">{job.description}</p>

      {job.skillsRequired?.trim() ? (
        <p className="mt-4 text-sm text-neutral-700">
          <span className="font-semibold text-neutral-800">Skills required: </span>
          {job.skillsRequired}
        </p>
      ) : null}

      <p className="mt-4 text-xs text-neutral-600 leading-relaxed">
        Tucker Family Charity is not the employer. Email us if you would like to follow up on this opportunity.
      </p>

      <a
        href={jobInterestMailto(job)}
        className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-orange-600 text-white font-semibold text-[15px] hover:bg-orange-700 transition-colors shadow-sm"
      >
        <Mail className="w-4 h-4" aria-hidden />
        I&apos;m Interested
      </a>
    </article>
  );
}

export function Opportunities() {
  const [activeTab, setActiveTab] = useState<OpportunityTab>("profiles");
  const [profiles, setProfiles] = useState<JobSeekerProfile[]>([]);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Opportunities | Tucker Family Charity";
  }, []);

  useEffect(() => {
    let cancelled = false;
    const base = import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    const url = `${base}data/opportunities.json`;

    (async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Could not load listings (${res.status})`);
        const json: unknown = await res.json();
        if (cancelled) return;
        const data = parseOpportunitiesData(json);
        setProfiles(data.profiles);
        setJobs(data.opportunities);
        setLoadError(null);
      } catch {
        if (!cancelled) {
          setProfiles([]);
          setJobs([]);
          setLoadError("We couldn’t load opportunities. Please refresh the page or try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToListings = () => {
    document.getElementById("opportunities-listings")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activateTab = (tab: OpportunityTab) => {
    setActiveTab(tab);
    requestAnimationFrame(() => scrollToListings());
  };

  const activeList = activeTab === "profiles" ? profiles : jobs;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative py-16 md:py-20 overflow-hidden">
        <img
          src={heroImage}
          alt="People learning practical skills in a supportive community setting"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/88 via-amber-700/82 to-amber-900/88" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto w-full text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-100/90 mb-2">
              Community support
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Connecting people with opportunity
            </h1>
            <p className="text-lg sm:text-xl text-amber-100 leading-relaxed max-w-3xl mx-auto mb-10">
              Tucker Family Charity shares curated profiles and work opportunities from our trusted network. Browse
              what is available and email us if you would like to explore a connection.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => activateTab("profiles")}
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-amber-900 font-semibold hover:bg-amber-50 transition-colors"
              >
                People Looking for Work
              </button>
              <button
                type="button"
                onClick={() => activateTab("jobs")}
                className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-white/80 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Work Available
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-16 md:py-20 bg-white border-t border-amber-100/80 scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-200/80 text-amber-900 mb-4">
                <Users className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">1. Curated profiles</h3>
              <p className="text-neutral-700 leading-relaxed">
                We list people from our network who are looking for work — skills, experience and availability shared
                with care and discretion.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-200/80 text-amber-900 mb-4">
                <Briefcase className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">2. Shared opportunities</h3>
              <p className="text-neutral-700 leading-relaxed">
                When partners, businesses or community members have roles or placements to offer, we publish the
                details here for others to browse.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-200/80 text-amber-900 mb-4">
                <Handshake className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">3. Email if interested</h3>
              <p className="text-neutral-700 leading-relaxed">
                If something looks like a good fit, email Tucker Family Charity. We can help make an introduction or
                pass on details where appropriate.
              </p>
            </div>
          </div>
          <p className="mt-10 text-sm text-neutral-600 text-center max-w-2xl mx-auto leading-relaxed">
            Tucker Family Charity does not guarantee employment or placements. Listings are updated as new profiles and
            opportunities are added to our network.
          </p>
        </div>
      </section>

      <section
        id="opportunities-listings"
        className="py-16 md:py-20 bg-amber-50 border-t border-amber-100/80 scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-wrap justify-center gap-2 mb-10"
            role="tablist"
            aria-label="Opportunity listings"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "profiles"}
              className={filterBtn(activeTab === "profiles")}
              onClick={() => setActiveTab("profiles")}
            >
              <span className="inline-flex items-center gap-2">
                <Search className="w-4 h-4" aria-hidden />
                People Looking for Work
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "jobs"}
              className={filterBtn(activeTab === "jobs")}
              onClick={() => setActiveTab("jobs")}
            >
              <span className="inline-flex items-center gap-2">
                <Briefcase className="w-4 h-4" aria-hidden />
                Work Available
              </span>
            </button>
          </div>

          <div className="text-center mb-10 max-w-2xl mx-auto">
            {activeTab === "profiles" ? (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">People looking for work</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Profiles shared through Tucker Family Charity. Email us if you would like to learn more about a
                  candidate — we do not publish direct contact details on the site.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">Work available</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Roles, placements and practical opportunities from our network. Email us if you are interested in a
                  listing or would like Tucker Family Charity to follow up.
                </p>
              </>
            )}
          </div>

          {loading ? (
            <p className="text-center text-neutral-600 py-12">Loading…</p>
          ) : loadError ? (
            <p className="text-center text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-xl mx-auto">
              {loadError}
            </p>
          ) : activeList.length === 0 ? (
            <p className="text-center text-neutral-600 py-12 max-w-md mx-auto leading-relaxed">
              {activeTab === "profiles"
                ? "No profiles are listed at the moment. Check back soon — new lists are added as they become available."
                : "No opportunities are listed at the moment. Check back soon — new roles are added as partners share them."}
            </p>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch"
              role="tabpanel"
            >
              {activeTab === "profiles"
                ? profiles.map((p) => <ProfileCard key={p.id} profile={p} />)
                : jobs.map((j) => <JobCard key={j.id} job={j} />)}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white border-t border-amber-100/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-4">
            <MessageSquare className="w-6 h-6" aria-hidden />
          </div>
          <p className="text-neutral-700 leading-relaxed mb-6">
            Tucker Family Charity is not an employer. We help trusted people in our community explore opportunities
            that may be a good fit — without promising a specific outcome.
          </p>
          <a
            href="mailto:info@tuckerfamilycharity.org?subject=Opportunities%20%E2%80%94%20general%20enquiry"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors"
          >
            <Mail className="w-4 h-4" aria-hidden />
            Email Tucker Family Charity
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
