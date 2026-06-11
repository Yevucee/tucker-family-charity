import { Briefcase, Mail, MapPin } from "lucide-react";
import { jobInterestMailto, type JobOpportunity } from "@/data/opportunities";

export function JobCard({ job }: { job: JobOpportunity }) {
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
