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
}

export interface JobOpportunity {
  id: string;
  title: string;
  organisation: string;
  location: string;
  type: string;
  /** Paid | Unpaid | Volunteer | Training | Other */
  compensation: string;
  description: string;
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
    typeof x.summary === "string"
  );
}

function isValidOpportunity(x: unknown): x is JobOpportunity {
  if (!isRecord(x)) return false;
  if (typeof x.id !== "string" || !x.id.trim()) return false;
  if (typeof x.title !== "string" || !x.title.trim()) return false;
  if (typeof x.organisation !== "string") return false;
  if (typeof x.location !== "string" || !x.location.trim()) return false;
  if (typeof x.type !== "string" || !x.type.trim()) return false;
  if (typeof x.compensation !== "string" || !x.compensation.trim()) return false;
  if (typeof x.description !== "string" || !x.description.trim()) return false;
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
