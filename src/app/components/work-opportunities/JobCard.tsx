import { useState } from "react";
import { Briefcase, FileText, Mail, MapPin } from "lucide-react";
import {
  jobApplicationMailto,
  type JobOpportunity,
} from "@/data/opportunities";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export function JobCard({ job }: { job: JobOpportunity }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const fullSpec = job.fullDescription?.trim() || job.description;

  return (
    <>
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
          <p className="mt-4 text-sm text-neutral-700 line-clamp-3">
            <span className="font-semibold text-neutral-800">Key requirements: </span>
            {job.skillsRequired}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setDetailOpen(true)}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl border-2 border-amber-800 text-amber-950 font-semibold text-[15px] hover:bg-amber-900 hover:text-white transition-colors"
          >
            <FileText className="w-4 h-4" aria-hidden />
            View full job description
          </button>
          <a
            href={jobApplicationMailto(job)}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-orange-600 text-white font-semibold text-[15px] hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Mail className="w-4 h-4" aria-hidden />
            Apply by email
          </a>
        </div>
      </article>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[min(85vh,720px)] overflow-hidden flex flex-col gap-0 p-0 border-amber-200/80">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-amber-100/80 text-left shrink-0">
            <DialogTitle className="text-xl font-bold text-neutral-900 pr-8">{job.title}</DialogTitle>
            <p className="text-sm text-neutral-600 mt-1">{job.location}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-900">
                {job.type}
              </span>
              <span className="rounded-full bg-neutral-50 border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700">
                {job.compensation}
              </span>
            </div>
          </DialogHeader>

          <div className="px-6 py-5 overflow-y-auto flex-1 min-h-0">
            <div className="text-sm leading-relaxed text-neutral-700 whitespace-pre-wrap">{fullSpec}</div>
            {job.specPdfUrl ? (
              <p className="mt-4">
                <a
                  href={job.specPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-amber-800 hover:text-amber-900 underline-offset-2 hover:underline"
                >
                  Download PDF job spec
                </a>
              </p>
            ) : null}
          </div>

          <DialogFooter className="px-6 py-4 border-t border-amber-100/80 bg-amber-50/40 sm:justify-stretch shrink-0">
            <a
              href={jobApplicationMailto(job)}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors"
            >
              <Mail className="w-4 h-4" aria-hidden />
              Apply by email
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
