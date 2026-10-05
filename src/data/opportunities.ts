/**
 * Work Opportunities — curated profiles and job listings.
 * Update `public/data/opportunities.json` when new lists are uploaded (CMS / Sheets export later).
 */

export interface JobSeekerProfile {
  id: string;
  /** Public label — e.g. first name + initial; avoid full contact details on the site */
  displayName: string;
  location: string;
  workType: string;
  skills: string;
  availability: string;
  /** Short public summary shown on the card */
  summary: string;
  /** Optional link to full CV (Google Drive, PDF, etc.) */
  cvUrl?: string;
  /** Filter chips on Looking for work — use ids from PROFILE_FILTER_CATEGORIES */
  categories?: ProfileFilterCategoryId[];
}

/** Employer-friendly groupings for the profile filter bar */
export const PROFILE_FILTER_CATEGORIES = [
  { id: "leadership", label: "Leadership & executive" },
  { id: "operations-events", label: "Operations & events" },
  { id: "marketing-creative", label: "Marketing & creative" },
  { id: "admin-pa", label: "Admin & PA" },
  { id: "project-tech", label: "Projects, tech & supply chain" },
  { id: "people-od", label: "People & OD" },
  { id: "clinical", label: "Clinical & healthcare" },
] as const;

export type ProfileFilterCategoryId = (typeof PROFILE_FILTER_CATEGORIES)[number]["id"];

export const PROFILE_FILTER_AREAS = [
  { id: "all", label: "Any area" },
  { id: "johannesburg", label: "Johannesburg" },
  { id: "cape-town", label: "Cape Town" },
  { id: "national", label: "National / flexible" },
] as const;

export type ProfileFilterAreaId = (typeof PROFILE_FILTER_AREAS)[number]["id"];

export interface ProfileListFilters {
  query: string;
  category: ProfileFilterCategoryId | "all";
  area: ProfileFilterAreaId;
}

export const DEFAULT_PROFILE_LIST_FILTERS: ProfileListFilters = {
  query: "",
  category: "all",
  area: "all",
};

export interface JobOpportunity {
  id: string;
  title: string;
  organisation: string;
  location: string;
  type: string;
  /** Paid | Unpaid | Volunteer | Training | Other */
  compensation: string;
  /** Short teaser on the listing card */
  description: string;
  /** Full job spec shown in the detail dialog */
  fullDescription?: string;
  /** Optional link to downloadable PDF spec */
  specPdfUrl?: string;
  skillsRequired?: string;
  startDate?: string;
}

export interface OpportunitiesData {
  profiles: JobSeekerProfile[];
  opportunities: JobOpportunity[];
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function isValidProfile(x: unknown): x is JobSeekerProfile {
  if (!isRecord(x)) return false;
  return (
    typeof x.id === "string" &&
    x.id.trim() !== "" &&
    typeof x.displayName === "string" &&
    x.displayName.trim() !== "" &&
    typeof x.location === "string" &&
    typeof x.workType === "string" &&
    x.workType.trim() !== "" &&
    typeof x.skills === "string" &&
    typeof x.availability === "string" &&
    typeof x.summary === "string" &&
    (x.cvUrl === undefined || typeof x.cvUrl === "string") &&
    (x.categories === undefined ||
      (Array.isArray(x.categories) &&
        x.categories.every((c) => typeof c === "string" && PROFILE_CATEGORY_IDS.has(c))))
  );
}

const PROFILE_CATEGORY_IDS = new Set<string>(PROFILE_FILTER_CATEGORIES.map((c) => c.id));

function isValidOpportunity(x: unknown): x is JobOpportunity {
  if (!isRecord(x)) return false;
  if (typeof x.id !== "string" || !x.id.trim()) return false;
  if (typeof x.title !== "string" || !x.title.trim()) return false;
  if (typeof x.organisation !== "string") return false;
  if (typeof x.location !== "string") return false;
  if (typeof x.type !== "string") return false;
  if (typeof x.compensation !== "string") return false;
  if (typeof x.description !== "string" || !x.description.trim()) return false;
  if (x.fullDescription !== undefined && typeof x.fullDescription !== "string") return false;
  if (x.specPdfUrl !== undefined && typeof x.specPdfUrl !== "string") return false;
  if (x.skillsRequired !== undefined && typeof x.skillsRequired !== "string") return false;
  if (x.startDate !== undefined && typeof x.startDate !== "string") return false;
  return true;
}

export function parseOpportunitiesData(raw: unknown): OpportunitiesData {
  if (!isRecord(raw)) return { profiles: [], opportunities: [] };
  const profiles = Array.isArray(raw.profiles) ? raw.profiles.filter(isValidProfile) : [];
  const opportunities = Array.isArray(raw.opportunities)
    ? raw.opportunities.filter(isValidOpportunity)
    : [];
  return { profiles, opportunities };
}

export const OPPORTUNITIES_CONTACT_EMAIL = "info@tuckerfamilycharity.org";

/** Looking for work tab (trailing slash matches site routing). */
export const LOOKING_FOR_WORK_PATH = "/work-opportunities/looking-for-work/";

/** HTML `id` on a profile card — same as `JobSeekerProfile.id`. */
export function profileAnchorId(profileId: string): string {
  return profileId;
}

/** Shareable URL that opens Looking for work scrolled to one profile. */
export function profileShareUrl(
  profileId: string,
  origin = "https://www.tuckerfamilycharity.co.za",
): string {
  const base = origin.replace(/\/$/, "");
  return `${base}${LOOKING_FOR_WORK_PATH}#${profileAnchorId(profileId)}`;
}

function profileSearchHaystack(profile: JobSeekerProfile): string {
  return [
    profile.displayName,
    profile.workType,
    profile.skills,
    profile.summary,
    profile.availability,
    profile.location,
    ...(profile.categories ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

function profileMatchesArea(profile: JobSeekerProfile, area: ProfileFilterAreaId): boolean {
  if (area === "all") return true;
  const loc = profile.location.toLowerCase();
  if (area === "johannesburg") return loc.includes("johannesburg");
  if (area === "cape-town") return loc.includes("cape town");
  if (area === "national") {
    return loc === "south africa" || (!loc.includes("johannesburg") && !loc.includes("cape town"));
  }
  return true;
}

export function filterProfiles(
  profiles: JobSeekerProfile[],
  filters: ProfileListFilters,
): JobSeekerProfile[] {
  const q = filters.query.trim().toLowerCase();
  return profiles.filter((profile) => {
    if (filters.category !== "all") {
      const cats = profile.categories ?? [];
      if (!cats.includes(filters.category)) return false;
    }
    if (!profileMatchesArea(profile, filters.area)) return false;
    if (q && !profileSearchHaystack(profile).includes(q)) return false;
    return true;
  });
}

export function profileListFiltersActive(filters: ProfileListFilters): boolean {
  return (
    filters.query.trim() !== "" || filters.category !== "all" || filters.area !== "all"
  );
}

export function profileInterestMailto(profile: JobSeekerProfile): string {
  const subject = `Work Opportunities, interest in candidate: ${profile.displayName}`;
  const body = [
    "I am interested in learning more about the following candidate profile:",
    "",
    `Reference: ${profile.id}`,
    `Name: ${profile.displayName}`,
    `Location: ${profile.location}`,
    `Type of work: ${profile.workType}`,
    "",
    "My name:",
    "My organisation (if any):",
    "How I would like to follow up:",
  ].join("\n");
  return `mailto:${OPPORTUNITIES_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function jobApplicationMailto(job: JobOpportunity): string {
  const subject = `Job application: ${job.title}`;
  const body = [
    "I would like to apply for the following role:",
    "",
    `Reference: ${job.id}`,
    `Role: ${job.title}`,
    job.organisation.trim() ? `Organisation: ${job.organisation}` : "",
    `Location: ${job.location}`,
    "",
    "My name:",
    "My email:",
    "My phone:",
    "",
    "Brief cover note:",
    "",
    "(Please attach your CV.)",
  ]
    .filter(Boolean)
    .join("\n");
  return `mailto:${OPPORTUNITIES_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function jobInterestMailto(job: JobOpportunity): string {
  const subject = `Work Opportunities, interest in role: ${job.title}`;
  const body = [
    "I am interested in the following opportunity:",
    "",
    `Reference: ${job.id}`,
    `Role: ${job.title}`,
    `Organisation: ${job.organisation || "—"}`,
    `Location: ${job.location}`,
    "",
    "My name:",
    "My organisation (if any):",
    "Brief note:",
  ].join("\n");
  return `mailto:${OPPORTUNITIES_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function submitCandidateMailto(): string {
  const subject = "Work Opportunities, candidate profile";
  const body = [
    "I would like to be considered for listing on the Work Opportunities page.",
    "",
    "Name:",
    "Location / area:",
    "Type of work sought:",
    "Skills / experience (short summary):",
    "Availability:",
    "",
    "Please attach my CV if helpful.",
  ].join("\n");
  return `mailto:${OPPORTUNITIES_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function submitRoleMailto(): string {
  const subject = "Work Opportunities, advertise a role";
  const body = [
    "I would like to advertise the following role on the Work Opportunities page.",
    "",
    "Role title:",
    "Organisation:",
    "Location:",
    "Full-time / part-time / contract:",
    "Paid / volunteer / other:",
    "Short description:",
    "Skills required:",
    "Start date (if known):",
  ].join("\n");
  return `mailto:${OPPORTUNITIES_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
