import { useEffect, useState } from "react";
import {
  parseOpportunitiesData,
  type JobOpportunity,
  type JobSeekerProfile,
} from "@/data/opportunities";

export function useOpportunitiesData() {
  const [profiles, setProfiles] = useState<JobSeekerProfile[]>([]);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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
          setLoadError("We couldn’t load listings. Please refresh the page or try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { profiles, jobs, loading, loadError };
}
