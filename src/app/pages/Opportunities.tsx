import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  Briefcase,
  Handshake,
  MessageSquare,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import {
  LOOKING_FOR_WORK_SUBMIT_URL,
  LOOKING_FOR_WORK_SUBMIT_URL_REJECTED,
  LOOKING_FOR_WORK_SUBMIT_SECRET,
  OFFERING_WORK_SUBMIT_URL,
  OFFERING_WORK_SUBMIT_URL_REJECTED,
  OFFERING_WORK_SUBMIT_SECRET,
} from "@/config";
import heroImage from "@/assets/OV photo_s for Website/Computer Training 12.jpg";

type OpportunityTab = "seeking" | "offering";
type SubmitState = "idle" | "loading" | "success" | "error";

const filterBtn = (active: boolean) =>
  [
    "px-5 py-2.5 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
    active
      ? "bg-amber-600 text-white shadow-sm"
      : "bg-white text-amber-950 border border-amber-200 hover:bg-amber-50",
  ].join(" ");

const inputClass =
  "w-full px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500";

const PRIVACY_NOTE =
  "By submitting this form, you agree that your details may be shared with Tucker Family Charity and relevant trusted partners for the purpose of exploring work or opportunity connections.";

/**
 * POST helper — same pattern as Keep It In The Family (`json` field, form-urlencoded).
 * When `submitUrl` is empty, validates only and returns success (front-end demo until GAS is deployed).
 */
async function postOpportunityForm(
  submitUrl: string,
  secret: string,
  payload: Record<string, unknown>
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!submitUrl) {
    return { ok: true };
  }

  const formBody = new URLSearchParams({
    json: JSON.stringify({
      ...(secret ? { secret } : {}),
      ...payload,
    }),
  }).toString();

  const postInit = {
    method: "POST" as const,
    cache: "no-store" as const,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody,
  };

  try {
    const res = await fetch(submitUrl, { ...postInit, mode: "cors" });
    let data: { ok?: boolean; error?: string } = {};
    try {
      data = (await res.json()) as { ok?: boolean; error?: string };
    } catch {
      /* non-JSON */
    }
    if (!res.ok || data.ok === false) {
      return { ok: false, error: data.error || `Something went wrong (${res.status}). Try again later.` };
    }
    return { ok: true };
  } catch {
    try {
      await fetch(submitUrl, { ...postInit, mode: "no-cors" });
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: "Network error. Check your connection and try again.",
      };
    }
  }
}

function ConfigBanner({
  rejected,
  configured,
  envKey,
}: {
  rejected: boolean;
  configured: boolean;
  envKey: string;
}) {
  if (rejected) {
    return (
      <p className="text-sm text-red-900 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
        This build has an invalid submission URL for <code className="text-xs bg-white px-1 rounded">{envKey}</code>.
        Use a deployed Apps Script web app URL ending in <code className="text-xs bg-white px-1 rounded">/exec</code>.
      </p>
    );
  }
  if (!configured) {
    return (
      <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        Submissions are stored locally for now. Add{" "}
        <code className="text-xs bg-white px-1 rounded">{envKey}</code> when the Google Apps Script endpoint is
        ready.
      </p>
    );
  }
  return null;
}

export function Opportunities() {
  const [activeTab, setActiveTab] = useState<OpportunityTab>("seeking");

  // --- Looking for Work form ---
  const [seekName, setSeekName] = useState("");
  const [seekEmail, setSeekEmail] = useState("");
  const [seekPhone, setSeekPhone] = useState("");
  const [seekLocation, setSeekLocation] = useState("");
  const [seekWorkType, setSeekWorkType] = useState("");
  const [seekSkills, setSeekSkills] = useState("");
  const [seekAvailability, setSeekAvailability] = useState("");
  const [seekNotes, setSeekNotes] = useState("");
  const [seekSubmitState, setSeekSubmitState] = useState<SubmitState>("idle");
  const [seekSubmitError, setSeekSubmitError] = useState("");

  // --- Offering Work form ---
  const [offerContactName, setOfferContactName] = useState("");
  const [offerOrganisation, setOfferOrganisation] = useState("");
  const [offerEmail, setOfferEmail] = useState("");
  const [offerPhone, setOfferPhone] = useState("");
  const [offerType, setOfferType] = useState("");
  const [offerLocation, setOfferLocation] = useState("");
  const [offerCompensation, setOfferCompensation] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerSkillsRequired, setOfferSkillsRequired] = useState("");
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerNotes, setOfferNotes] = useState("");
  const [offerSubmitState, setOfferSubmitState] = useState<SubmitState>("idle");
  const [offerSubmitError, setOfferSubmitError] = useState("");

  useEffect(() => {
    document.title = "Opportunities | Tucker Family Charity";
  }, []);

  const scrollToForms = () => {
    document.getElementById("opportunities-forms")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activateTab = (tab: OpportunityTab) => {
    setActiveTab(tab);
    requestAnimationFrame(() => scrollToForms());
  };

  const resetSeekForm = () => {
    setSeekName("");
    setSeekEmail("");
    setSeekPhone("");
    setSeekLocation("");
    setSeekWorkType("");
    setSeekSkills("");
    setSeekAvailability("");
    setSeekNotes("");
  };

  const resetOfferForm = () => {
    setOfferContactName("");
    setOfferOrganisation("");
    setOfferEmail("");
    setOfferPhone("");
    setOfferType("");
    setOfferLocation("");
    setOfferCompensation("");
    setOfferDescription("");
    setOfferSkillsRequired("");
    setOfferStartDate("");
    setOfferNotes("");
  };

  /**
   * Job Seekers sheet column mapping (Google Sheet tab: "Job Seekers"):
   * Timestamp | Full Name | Email | Phone | Location | Type of Work Wanted | Skills / Experience |
   * Availability | CV Link | Additional Notes | Status | Internal Notes
   *
   * CV upload: future — store link in `cvLink` when file upload is added.
   * Admin review: set `status` / `internalNotes` in the sheet (not on this form).
   *
   * GAS endpoint: LOOKING_FOR_WORK_GOOGLE_SCRIPT_ENDPOINT_HERE
   * → set VITE_LOOKING_FOR_WORK_SUBMIT_URL in .env / GitHub Actions secret.
   */
  const handleSeekSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSeekSubmitError("");

    if (
      !seekName.trim() ||
      !seekEmail.trim() ||
      !seekPhone.trim() ||
      !seekLocation.trim() ||
      !seekWorkType.trim() ||
      !seekSkills.trim() ||
      !seekAvailability.trim()
    ) {
      setSeekSubmitState("error");
      setSeekSubmitError("Please fill in all required fields.");
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      fullName: seekName.trim(),
      email: seekEmail.trim(),
      phone: seekPhone.trim(),
      location: seekLocation.trim(),
      workType: seekWorkType.trim(),
      skills: seekSkills.trim(),
      availability: seekAvailability.trim(),
      cvLink: "",
      additionalNotes: seekNotes.trim(),
      status: "new",
      internalNotes: "",
    };

    setSeekSubmitState("loading");
    const result = await postOpportunityForm(
      LOOKING_FOR_WORK_SUBMIT_URL,
      LOOKING_FOR_WORK_SUBMIT_SECRET,
      payload
    );

    if (!result.ok) {
      setSeekSubmitState("error");
      setSeekSubmitError(result.error);
      return;
    }

    setSeekSubmitState("success");
    resetSeekForm();
  };

  /**
   * Opportunities sheet column mapping (Google Sheet tab: "Opportunities"):
   * Timestamp | Contact Name | Organisation | Email | Phone | Type of Opportunity | Location |
   * Paid / Unpaid / Volunteer / Training | Opportunity Description | Skills Required |
   * Preferred Start Date | Additional Notes | Status | Internal Notes
   *
   * GAS endpoint: OFFERING_WORK_GOOGLE_SCRIPT_ENDPOINT_HERE
   * → set VITE_OFFERING_WORK_SUBMIT_URL in .env / GitHub Actions secret.
   */
  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfferSubmitError("");

    if (
      !offerContactName.trim() ||
      !offerEmail.trim() ||
      !offerPhone.trim() ||
      !offerType.trim() ||
      !offerLocation.trim() ||
      !offerCompensation.trim() ||
      !offerDescription.trim()
    ) {
      setOfferSubmitState("error");
      setOfferSubmitError("Please fill in all required fields.");
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      contactName: offerContactName.trim(),
      organisation: offerOrganisation.trim(),
      email: offerEmail.trim(),
      phone: offerPhone.trim(),
      opportunityType: offerType.trim(),
      location: offerLocation.trim(),
      compensation: offerCompensation.trim(),
      description: offerDescription.trim(),
      skillsRequired: offerSkillsRequired.trim(),
      preferredStartDate: offerStartDate.trim(),
      additionalNotes: offerNotes.trim(),
      status: "new",
      internalNotes: "",
    };

    setOfferSubmitState("loading");
    const result = await postOpportunityForm(
      OFFERING_WORK_SUBMIT_URL,
      OFFERING_WORK_SUBMIT_SECRET,
      payload
    );

    if (!result.ok) {
      setOfferSubmitState("error");
      setOfferSubmitError(result.error);
      return;
    }

    setOfferSubmitState("success");
    resetOfferForm();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
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
              Tucker Family Charity believes opportunity can change lives. Through our community network, we aim to help
              connect people looking for work with individuals, businesses and partners who may have opportunities to
              offer.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => activateTab("seeking")}
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-amber-900 font-semibold hover:bg-amber-50 transition-colors"
              >
                I&apos;m Looking for Work
              </button>
              <button
                type="button"
                onClick={() => activateTab("offering")}
                className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-white/80 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                I Have Work to Offer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-16 md:py-20 bg-white border-t border-amber-100/80 scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-200/80 text-amber-900 mb-4">
                <MessageSquare className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">1. Tell us what you need</h3>
              <p className="text-neutral-700 leading-relaxed">
                Job seekers can share their skills, experience and the type of work they are looking for.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-200/80 text-amber-900 mb-4">
                <Users className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">2. Share opportunities</h3>
              <p className="text-neutral-700 leading-relaxed">
                Employers, businesses and community members can tell us about roles, placements or practical work
                opportunities.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-200/80 text-amber-900 mb-4">
                <Handshake className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">3. We help connect</h3>
              <p className="text-neutral-700 leading-relaxed">
                Where there is a suitable match, Tucker Family Charity can help make an introduction or pass on the
                details.
              </p>
            </div>
          </div>
          <p className="mt-10 text-sm text-neutral-600 text-center max-w-2xl mx-auto leading-relaxed">
            Tucker Family Charity does not guarantee employment or placements. We aim to make practical introductions
            where our network may be able to help.
          </p>
        </div>
      </section>

      {/* Forms */}
      <section
        id="opportunities-forms"
        className="py-16 md:py-20 bg-amber-50 border-t border-amber-100/80 scroll-mt-24"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-wrap justify-center gap-2 mb-10"
            role="tablist"
            aria-label="Opportunity forms"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "seeking"}
              className={filterBtn(activeTab === "seeking")}
              onClick={() => setActiveTab("seeking")}
            >
              <span className="inline-flex items-center gap-2">
                <Search className="w-4 h-4" aria-hidden />
                Looking for Work
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "offering"}
              className={filterBtn(activeTab === "offering")}
              onClick={() => setActiveTab("offering")}
            >
              <span className="inline-flex items-center gap-2">
                <Briefcase className="w-4 h-4" aria-hidden />
                Offering Work
              </span>
            </button>
          </div>

          {activeTab === "seeking" && (
            <div role="tabpanel" aria-labelledby="seeking-tab">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">Looking for Work</h2>
                <p className="text-neutral-700 leading-relaxed">
                  If you are looking for work, you can share your details with Tucker Family Charity. We may be able to
                  connect you with people or organisations in our network who are offering suitable opportunities.
                </p>
              </div>

              <form
                onSubmit={handleSeekSubmit}
                className="bg-white rounded-2xl shadow-md border border-amber-200/90 p-6 sm:p-8 space-y-5"
              >
                <div>
                  <label htmlFor="seek-name" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Full name <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="seek-name"
                    type="text"
                    required
                    value={seekName}
                    onChange={(e) => setSeekName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="seek-email" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Email address <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="seek-email"
                    type="email"
                    required
                    value={seekEmail}
                    onChange={(e) => setSeekEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="seek-phone" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Phone number <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="seek-phone"
                    type="tel"
                    required
                    value={seekPhone}
                    onChange={(e) => setSeekPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="seek-location" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Location / area <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="seek-location"
                    type="text"
                    required
                    placeholder="e.g. Johannesburg North, Sandton"
                    value={seekLocation}
                    onChange={(e) => setSeekLocation(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="seek-work-type" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Type of work wanted <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="seek-work-type"
                    type="text"
                    required
                    placeholder="e.g. admin, retail, hospitality, trades"
                    value={seekWorkType}
                    onChange={(e) => setSeekWorkType(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="seek-skills" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Skills / experience <span className="text-orange-600">*</span>
                  </label>
                  <textarea
                    id="seek-skills"
                    required
                    rows={3}
                    value={seekSkills}
                    onChange={(e) => setSeekSkills(e.target.value)}
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <div>
                  <label htmlFor="seek-availability" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Availability <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="seek-availability"
                    type="text"
                    required
                    placeholder="e.g. immediately, part-time, weekdays only"
                    value={seekAvailability}
                    onChange={(e) => setSeekAvailability(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="seek-cv" className="block text-sm font-semibold text-neutral-800 mb-1">
                    CV
                  </label>
                  <p
                    id="seek-cv"
                    className="text-sm text-neutral-600 bg-amber-50/80 border border-amber-200/80 rounded-lg px-4 py-3"
                  >
                    CV upload functionality can be added later.
                  </p>
                </div>

                <div>
                  <label htmlFor="seek-notes" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Additional notes
                  </label>
                  <textarea
                    id="seek-notes"
                    rows={3}
                    value={seekNotes}
                    onChange={(e) => setSeekNotes(e.target.value)}
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <ConfigBanner
                  rejected={LOOKING_FOR_WORK_SUBMIT_URL_REJECTED}
                  configured={Boolean(LOOKING_FOR_WORK_SUBMIT_URL)}
                  envKey="VITE_LOOKING_FOR_WORK_SUBMIT_URL"
                />

                {seekSubmitState === "success" && (
                  <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    Thank you. Your details have been received. If a suitable opportunity becomes available, Tucker
                    Family Charity may be in touch.
                  </p>
                )}
                {seekSubmitState === "error" && seekSubmitError && (
                  <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {seekSubmitError}
                  </p>
                )}

                <p className="text-xs text-neutral-600 leading-relaxed">{PRIVACY_NOTE}</p>

                <button
                  type="submit"
                  disabled={seekSubmitState === "loading"}
                  className="w-full py-3.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {seekSubmitState === "loading" ? "Submitting…" : "Submit Your Details"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "offering" && (
            <div role="tabpanel" aria-labelledby="offering-tab">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">Offering Work</h2>
                <p className="text-neutral-700 leading-relaxed">
                  If you are an individual, business or organisation with work opportunities to offer, you can share the
                  details with us. This may include jobs, temporary work, internships, placements, apprenticeships,
                  training opportunities or practical community work.
                </p>
              </div>

              <form
                onSubmit={handleOfferSubmit}
                className="bg-white rounded-2xl shadow-md border border-amber-200/90 p-6 sm:p-8 space-y-5"
              >
                <div>
                  <label htmlFor="offer-contact" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Contact name <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="offer-contact"
                    type="text"
                    required
                    value={offerContactName}
                    onChange={(e) => setOfferContactName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="offer-org" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Organisation / company name
                  </label>
                  <input
                    id="offer-org"
                    type="text"
                    value={offerOrganisation}
                    onChange={(e) => setOfferOrganisation(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="offer-email" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Email address <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="offer-email"
                    type="email"
                    required
                    value={offerEmail}
                    onChange={(e) => setOfferEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="offer-phone" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Phone number <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="offer-phone"
                    type="tel"
                    required
                    value={offerPhone}
                    onChange={(e) => setOfferPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="offer-type" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Type of opportunity <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="offer-type"
                    type="text"
                    required
                    placeholder="e.g. full-time job, internship, placement"
                    value={offerType}
                    onChange={(e) => setOfferType(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="offer-location" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Location <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="offer-location"
                    type="text"
                    required
                    value={offerLocation}
                    onChange={(e) => setOfferLocation(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="offer-compensation" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Paid / unpaid / volunteer / training <span className="text-orange-600">*</span>
                  </label>
                  <select
                    id="offer-compensation"
                    required
                    value={offerCompensation}
                    onChange={(e) => setOfferCompensation(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select…</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Training">Training</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="offer-description" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Brief description of opportunity <span className="text-orange-600">*</span>
                  </label>
                  <textarea
                    id="offer-description"
                    required
                    rows={4}
                    value={offerDescription}
                    onChange={(e) => setOfferDescription(e.target.value)}
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <div>
                  <label htmlFor="offer-skills" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Skills or experience required
                  </label>
                  <textarea
                    id="offer-skills"
                    rows={3}
                    value={offerSkillsRequired}
                    onChange={(e) => setOfferSkillsRequired(e.target.value)}
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <div>
                  <label htmlFor="offer-start" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Preferred start date
                  </label>
                  <input
                    id="offer-start"
                    type="text"
                    placeholder="e.g. March 2026, flexible"
                    value={offerStartDate}
                    onChange={(e) => setOfferStartDate(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="offer-notes" className="block text-sm font-semibold text-neutral-800 mb-1">
                    Additional notes
                  </label>
                  <textarea
                    id="offer-notes"
                    rows={3}
                    value={offerNotes}
                    onChange={(e) => setOfferNotes(e.target.value)}
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <ConfigBanner
                  rejected={OFFERING_WORK_SUBMIT_URL_REJECTED}
                  configured={Boolean(OFFERING_WORK_SUBMIT_URL)}
                  envKey="VITE_OFFERING_WORK_SUBMIT_URL"
                />

                {offerSubmitState === "success" && (
                  <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    Thank you. Your opportunity has been received. Tucker Family Charity will review the details and
                    follow up if appropriate.
                  </p>
                )}
                {offerSubmitState === "error" && offerSubmitError && (
                  <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {offerSubmitError}
                  </p>
                )}

                <p className="text-xs text-neutral-600 leading-relaxed">{PRIVACY_NOTE}</p>

                <button
                  type="submit"
                  disabled={offerSubmitState === "loading"}
                  className="w-full py-3.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {offerSubmitState === "loading" ? "Submitting…" : "Share an Opportunity"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Closing note */}
      <section className="py-12 bg-white border-t border-amber-100/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-4">
            <UserPlus className="w-6 h-6" aria-hidden />
          </div>
          <p className="text-neutral-700 leading-relaxed">
            Tucker Family Charity is not an employer. We work through trusted relationships in our community to help
            people explore opportunities that may be a good fit — without promising a specific outcome.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
