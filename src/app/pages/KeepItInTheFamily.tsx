import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Search, Phone, Filter, Globe, Briefcase, UserPlus, BookOpen } from "lucide-react";
import { Link } from "react-router";
import {
  DIRECTORY_SHEET_ID,
  KITF_SUBMIT_URL,
  KITF_SUBMIT_URL_REJECTED,
  KITF_SUBMIT_SECRET,
} from "@/config";
import { KITF_OTHER_CATEGORY, SERVICE_CATEGORIES } from "@/data/kitfCategories";
import { KITF_FORM_LIMITS } from "@/data/kitfForm";
import {
  DEFAULT_PHONE_COUNTRY,
  formatPhoneForDisplay,
  getPhoneCountryOptions,
  normalizePhoneForStorage,
  phonePlaceholderForCountry,
  phoneTelHref,
} from "@/utils/phone";
import { KITF_LIBRARY_PATH } from "@/data/kitfLibrary";
import type { CountryCode } from "libphonenumber-js";

const PHONE_COUNTRY_OPTIONS = getPhoneCountryOptions();

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">{children}</p>;
}

function validateKitfFieldLengths(fields: {
  name: string;
  professionOther: string;
  area: string;
  endorsedBy: string;
  aboutCompany: string;
  website: string;
  isOtherCategory: boolean;
}): string | null {
  const { name, professionOther, area, endorsedBy, aboutCompany, website, isOtherCategory } = fields;
  if (name.length > KITF_FORM_LIMITS.name) {
    return `Name / business name must be ${KITF_FORM_LIMITS.name} characters or fewer.`;
  }
  if (isOtherCategory && professionOther.length > KITF_FORM_LIMITS.professionOther) {
    return `Service type must be ${KITF_FORM_LIMITS.professionOther} characters or fewer (a few words only).`;
  }
  if (area.length > KITF_FORM_LIMITS.area) return `Area must be ${KITF_FORM_LIMITS.area} characters or fewer.`;
  if (endorsedBy.length > KITF_FORM_LIMITS.endorsedBy) {
    return `Endorsed by must be ${KITF_FORM_LIMITS.endorsedBy} characters or fewer.`;
  }
  if (aboutCompany.length > KITF_FORM_LIMITS.aboutCompany) {
    return `About your company must be ${KITF_FORM_LIMITS.aboutCompany} characters or fewer.`;
  }
  if (website.length > KITF_FORM_LIMITS.website) {
    return `Website must be ${KITF_FORM_LIMITS.website} characters or fewer.`;
  }
  return null;
}

interface ServicesEntry {
  name: string;
  profession: string;
  area: string;
  phone: string;
  endorsed_by: string;
  notes: string;
  website?: string;
}

function normalizeServicesRow(row: Record<string, unknown>): ServicesEntry {
  const get = (...keys: string[]) => {
    const key = keys.find((k) => row[k] != null && String(row[k]).trim() !== "");
    return key != null ? String(row[key]).trim() : "";
  };
  const endorsed =
    get("endorsed_by", "Endorsed by", "trusted_by", "Trusted by") || "";
  return {
    name: get("name", "Name"),
    profession: get("profession", "Profession"),
    area: get("area", "Area"),
    phone: get("phone", "Phone"),
    endorsed_by: endorsed,
    notes: get("notes", "Notes"),
    website: get("website", "Website"),
  };
}

const MOCK_SERVICES: ServicesEntry[] = [
  {
    name: "John Smith",
    profession: "Plumber",
    area: "Sandton",
    phone: "+27 11 123 4567",
    endorsed_by: "Tucker family",
    notes: "Reliable emergency plumbing work",
  },
  {
    name: "Sarah Johnson",
    profession: "Electrician",
    area: "Johannesburg North",
    phone: "+27 11 234 5678",
    endorsed_by: "Tucker family",
    notes: "Residential and commercial",
  },
  {
    name: "Mike Williams",
    profession: "Gardener",
    area: "Rosebank",
    phone: "+27 11 345 6789",
    endorsed_by: "Community network",
    notes: "Landscaping and maintenance",
  },
];

export function KeepItInTheFamily() {
  const [activeTab, setActiveTab] = useState<"services" | "addService">("services");
  const [servicesEntries, setServicesEntries] = useState<ServicesEntry[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesSearch, setServicesSearch] = useState("");
  const [servicesCategory, setServicesCategory] = useState<string>("all");

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState(SERVICE_CATEGORIES[0] ?? "");
  const [formProfessionOther, setFormProfessionOther] = useState("");
  const [formArea, setFormArea] = useState("");
  const [formPhoneCountry, setFormPhoneCountry] = useState<CountryCode>(DEFAULT_PHONE_COUNTRY);
  const [formPhoneNational, setFormPhoneNational] = useState("");
  const [formEndorsedBy, setFormEndorsedBy] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      if (!DIRECTORY_SHEET_ID || DIRECTORY_SHEET_ID === "YOUR_SHEET_ID") {
        setServicesEntries(MOCK_SERVICES);
        setServicesLoading(false);
        return;
      }
      try {
        const url = `https://opensheet.elk.sh/${DIRECTORY_SHEET_ID}/Sheet1`;
        const res = await fetch(url);
        const data = await res.json();
        const rows = Array.isArray(data) ? data : [];
        setServicesEntries(rows.map((r: Record<string, unknown>) => normalizeServicesRow(r)));
      } catch {
        setServicesEntries(MOCK_SERVICES);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  const servicesCategories = [
    "all",
    ...Array.from(new Set(servicesEntries.map((e) => e.profession).filter(Boolean))),
  ];
  const filteredServices = servicesEntries.filter((e) => {
    const matchSearch =
      !servicesSearch ||
      e.name.toLowerCase().includes(servicesSearch.toLowerCase()) ||
      e.profession.toLowerCase().includes(servicesSearch.toLowerCase()) ||
      e.area.toLowerCase().includes(servicesSearch.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(servicesSearch.toLowerCase())) ||
      (e.endorsed_by && e.endorsed_by.toLowerCase().includes(servicesSearch.toLowerCase()));
    const matchCategory =
      servicesCategory === "all" || e.profession === servicesCategory;
    return matchSearch && matchCategory;
  });

  const professionForSubmit =
    formCategory === KITF_OTHER_CATEGORY ? formProfessionOther.trim() : formCategory.trim();

  const resetForm = () => {
    setFormName("");
    setFormCategory(SERVICE_CATEGORIES[0] ?? "");
    setFormProfessionOther("");
    setFormArea("");
    setFormPhoneCountry(DEFAULT_PHONE_COUNTRY);
    setFormPhoneNational("");
    setFormEndorsedBy("");
    setFormNotes("");
    setFormWebsite("");
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!KITF_SUBMIT_URL) {
      setSubmitState("error");
      setSubmitError("Form submissions are not configured yet. Please contact the charity.");
      return;
    }
    if (!formName.trim() || !professionForSubmit || !formArea.trim() || !formPhoneNational.trim() || !formEndorsedBy.trim()) {
      setSubmitState("error");
      setSubmitError("Please fill in name, category (or Other), area, phone, and endorsed by.");
      return;
    }
    if (formCategory === KITF_OTHER_CATEGORY && !formProfessionOther.trim()) {
      setSubmitState("error");
      setSubmitError("Please enter a short service type when you select Other.");
      return;
    }

    const lengthError = validateKitfFieldLengths({
      name: formName.trim(),
      professionOther: formProfessionOther.trim(),
      area: formArea.trim(),
      endorsedBy: formEndorsedBy.trim(),
      aboutCompany: formNotes.trim(),
      website: formWebsite.trim(),
      isOtherCategory: formCategory === KITF_OTHER_CATEGORY,
    });
    if (lengthError) {
      setSubmitState("error");
      setSubmitError(lengthError);
      return;
    }

    const phoneResult = normalizePhoneForStorage(formPhoneNational, formPhoneCountry);
    if (!phoneResult.ok) {
      setSubmitState("error");
      setSubmitError(phoneResult.error);
      return;
    }

    const payload = {
      ...(KITF_SUBMIT_SECRET ? { secret: KITF_SUBMIT_SECRET } : {}),
      name: formName.trim(),
      profession: professionForSubmit,
      area: formArea.trim(),
      phone: phoneResult.display,
      endorsed_by: formEndorsedBy.trim(),
      notes: formNotes.trim(),
      website: formWebsite.trim(),
    };

    setSubmitState("loading");
    const formBody = new URLSearchParams({ json: JSON.stringify(payload) }).toString();
    const postInit = {
      method: "POST" as const,
      cache: "no-store" as const,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody,
    };

    try {
      // CORS-"simple": type exactly `application/x-www-form-urlencoded` (no charset) or browsers send OPTIONS.
      const res = await fetch(KITF_SUBMIT_URL, { ...postInit, mode: "cors" });
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = (await res.json()) as { ok?: boolean; error?: string };
      } catch {
        /* non-JSON */
      }
      if (!res.ok || data.ok === false) {
        setSubmitState("error");
        setSubmitError(data.error || `Something went wrong (${res.status}). Try again later.`);
        return;
      }
      setSubmitState("success");
      resetForm();
    } catch {
      // GAS often 302s; some browsers treat the chain as a CORS failure and reject cors fetch —
      // "Network error" even though the server is reachable. no-cors still sends the POST body.
      try {
        await fetch(KITF_SUBMIT_URL, { ...postInit, mode: "no-cors" });
        setSubmitState("success");
        resetForm();
      } catch {
        setSubmitState("error");
        setSubmitError(
          "Network error. Check your connection and try again. If it persists, try another browser or network."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16 md:py-20">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Keep It In The Family</h1>
            <p className="text-xl text-amber-100 mb-8">
              Support family and friends in business—trusted professionals in one place. Add your
              service so the community can find you.
            </p>
          </div>
          <div className="w-full flex justify-center px-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-1.5 border border-white/30 flex flex-wrap justify-center gap-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("services")}
                className={`flex flex-1 sm:flex-initial items-center justify-center gap-2 min-h-[44px] px-6 py-3.5 rounded-lg font-semibold text-base transition-all duration-200 ${
                  activeTab === "services"
                    ? "bg-white text-amber-800 shadow-md"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
              >
                <Briefcase className="w-5 h-5 text-current shrink-0" />
                Services
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("addService")}
                className={`flex flex-1 sm:flex-initial items-center justify-center gap-2 min-h-[44px] px-6 py-3.5 rounded-lg font-semibold text-base transition-all duration-200 ${
                  activeTab === "addService"
                    ? "bg-white text-amber-800 shadow-md"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
              >
                <UserPlus className="w-5 h-5 text-current shrink-0" />
                Add your service
              </button>
              <Link
                to={KITF_LIBRARY_PATH}
                className="flex flex-1 sm:flex-initial items-center justify-center gap-2 min-h-[44px] px-6 py-3.5 rounded-lg font-semibold text-base transition-all duration-200 text-white/90 hover:bg-white/20 hover:text-white border border-white/40"
              >
                <BookOpen className="w-5 h-5 shrink-0" aria-hidden />
                Resource library
              </Link>
            </div>
          </div>
        </div>
      </section>

      {activeTab === "services" && (
        <>
          <section className="py-12 bg-amber-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Find Trusted Professionals</h2>
              <p className="text-lg text-neutral-700">
                Search by name or sector. Plumbers, electricians, accountants, builders—people
                recommended by our community. Free to view.
              </p>
            </div>
          </section>

          <section className="py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="search"
                    placeholder="Search by name, profession, area..."
                    value={servicesSearch}
                    onChange={(e) => setServicesSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                  <select
                    value={servicesCategory}
                    onChange={(e) => setServicesCategory(e.target.value)}
                    className="px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {servicesCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "All categories" : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {servicesLoading ? (
                <div className="text-center py-12 text-neutral-500">Loading...</div>
              ) : filteredServices.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">No matches found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((entry, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 sm:p-6 border border-amber-100/90"
                    >
                      <h3 className="text-xl font-bold text-neutral-900 mb-1">{entry.name}</h3>
                      <p className="text-orange-600 font-semibold mb-2">
                        {entry.profession}
                        {entry.area && ` • ${entry.area}`}
                      </p>
                      {entry.endorsed_by && (
                        <p className="text-sm text-neutral-600 mb-2">
                          Endorsed by {entry.endorsed_by}
                        </p>
                      )}
                      {entry.notes && <p className="text-neutral-700 mb-4">{entry.notes}</p>}
                      <div className="flex flex-wrap gap-3">
                        {entry.phone && (
                          <a
                            href={phoneTelHref(entry.phone)}
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                          >
                            <Phone className="w-4 h-4" />
                            {formatPhoneForDisplay(entry.phone)}
                          </a>
                        )}
                        {entry.website && (
                          <a
                            href={
                              entry.website.startsWith("http")
                                ? entry.website
                                : `https://${entry.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {activeTab === "addService" && (
        <section className="py-12 pb-20 bg-amber-50/50">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Add your service</h2>
              <p className="text-neutral-700">
                Submit your details to appear in the community directory. Use a short service type and put
                longer descriptions in About your company. Listings are reviewed before they appear for
                everyone.
              </p>
            </div>

            <form
              onSubmit={handleSubmitListing}
              className="bg-white rounded-lg shadow-md border border-amber-200/90 p-6 sm:p-8 space-y-5"
            >
              <div>
                <label htmlFor="kitf-name" className="block text-sm font-semibold text-neutral-800 mb-1">
                  Name / business name
                </label>
                <input
                  id="kitf-name"
                  type="text"
                  required
                  maxLength={KITF_FORM_LIMITS.name}
                  placeholder="e.g. Company Name Inc"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <FieldHint>Your name or trading name as you want it on the listing.</FieldHint>
              </div>

              <div>
                <label htmlFor="kitf-category" className="block text-sm font-semibold text-neutral-800 mb-1">
                  Service type
                </label>
                <select
                  id="kitf-category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {SERVICE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <FieldHint>Choose the closest match. This appears as a short tag on your card.</FieldHint>
                {formCategory === KITF_OTHER_CATEGORY && (
                  <>
                    <label htmlFor="kitf-profession-other" className="sr-only">
                      Your service type
                    </label>
                    <input
                      id="kitf-profession-other"
                      type="text"
                      maxLength={KITF_FORM_LIMITS.professionOther}
                      placeholder="e.g. Insurance broker"
                      value={formProfessionOther}
                      onChange={(e) => setFormProfessionOther(e.target.value)}
                      className="mt-2 w-full px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <FieldHint>
                      2–4 words only (max {KITF_FORM_LIMITS.professionOther}). Put the full description in
                      About your company below.
                    </FieldHint>
                  </>
                )}
              </div>

              <div>
                <label htmlFor="kitf-area" className="block text-sm font-semibold text-neutral-800 mb-1">
                  Area
                </label>
                <input
                  id="kitf-area"
                  type="text"
                  required
                  maxLength={KITF_FORM_LIMITS.area}
                  placeholder="e.g. Northcliff, Sandton"
                  value={formArea}
                  onChange={(e) => setFormArea(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <FieldHint>Where you mainly work or serve clients.</FieldHint>
              </div>

              <div>
                <label htmlFor="kitf-phone-country" className="block text-sm font-semibold text-neutral-800 mb-1">
                  Phone
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    id="kitf-phone-country"
                    value={formPhoneCountry}
                    onChange={(e) => setFormPhoneCountry(e.target.value as CountryCode)}
                    className="sm:w-56 px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                    aria-label="Country code"
                  >
                    {PHONE_COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.callingCode})
                      </option>
                    ))}
                  </select>
                  <input
                    id="kitf-phone"
                    type="tel"
                    required
                    value={formPhoneNational}
                    onChange={(e) => setFormPhoneNational(e.target.value)}
                    placeholder={phonePlaceholderForCountry(formPhoneCountry)}
                    className="flex-1 px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    aria-label="Phone number"
                  />
                </div>
                <FieldHint>
                  Mobile or landline. For South Africa, enter with or without a leading 0. We save numbers in
                  international format (e.g. +27 82 123 4567).
                </FieldHint>
              </div>

              <div>
                <label htmlFor="kitf-endorsed" className="block text-sm font-semibold text-neutral-800 mb-1">
                  Endorsed by
                </label>
                <input
                  id="kitf-endorsed"
                  type="text"
                  required
                  maxLength={KITF_FORM_LIMITS.endorsedBy}
                  placeholder="e.g. Brett Tucker"
                  value={formEndorsedBy}
                  onChange={(e) => setFormEndorsedBy(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <FieldHint>Who recommends you? First and last name is enough.</FieldHint>
              </div>

              <div>
                <label htmlFor="kitf-notes" className="block text-sm font-semibold text-neutral-800 mb-1">
                  About your company <span className="font-normal text-neutral-500">(optional)</span>
                </label>
                <textarea
                  id="kitf-notes"
                  rows={4}
                  maxLength={KITF_FORM_LIMITS.aboutCompany}
                  placeholder="e.g. Emergency call-outs, medical aid and insurance advice, custom curtains and blinds…"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-y"
                />
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
                  <span>A short summary of what you offer. This is the main description on your listing.</span>
                  <span className="tabular-nums shrink-0">
                    {formNotes.length}/{KITF_FORM_LIMITS.aboutCompany}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="kitf-website" className="block text-sm font-semibold text-neutral-800 mb-1">
                  Website <span className="font-normal text-neutral-500">(optional)</span>
                </label>
                <input
                  id="kitf-website"
                  type="url"
                  inputMode="url"
                  maxLength={KITF_FORM_LIMITS.website}
                  placeholder="https://www.example.co.za"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200/90 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <FieldHint>Full URL including https://</FieldHint>
              </div>

              {KITF_SUBMIT_URL_REJECTED && (
                <p className="text-sm text-red-900 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  This site build has an invalid submission URL. In GitHub → Settings → Secrets,
                  put your Apps Script <strong>web app</strong> link (starts with{" "}
                  <code className="text-xs bg-white px-1 rounded">https://script.google.com/macros/s/</code>{" "}
                  and ends with <code className="text-xs bg-white px-1 rounded">/exec</code>) in{" "}
                  <code className="text-xs bg-white px-1 rounded">VITE_KITF_SUBMIT_URL</code>. Do not
                  put the shared secret there—that belongs only in{" "}
                  <code className="text-xs bg-white px-1 rounded">VITE_KITF_SUBMIT_SECRET</code>.
                  Redeploy Pages after fixing.
                </p>
              )}
              {!KITF_SUBMIT_URL && !KITF_SUBMIT_URL_REJECTED && (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                  The submission link is not configured on this build. Add{" "}
                  <code className="text-xs bg-white px-1 rounded">VITE_KITF_SUBMIT_URL</code> for
                  the form to reach Google Sheets.
                </p>
              )}

              {submitState === "success" && (
                <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  Thank you—your listing was submitted. Refresh the Services tab after it is added to
                  the sheet.
                </p>
              )}
              {submitState === "error" && submitError && (
                <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitState === "loading"}
                className="w-full py-3.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitState === "loading" ? "Submitting…" : "Submit listing"}
              </button>
            </form>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
