import { Briefcase, Mail, User } from "lucide-react";
import {
  OPPORTUNITIES_CONTACT_EMAIL,
  submitCandidateMailto,
  submitRoleMailto,
} from "@/data/opportunities";

export function WorkOpportunitiesSubmitCta() {
  return (
    <section className="py-10 md:py-12 bg-white border-t border-amber-100/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-neutral-900 text-center mb-2">Want to be listed?</h2>
        <p className="text-center text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Send your profile or role to{" "}
          <a
            href={`mailto:${OPPORTUNITIES_CONTACT_EMAIL}`}
            className="text-orange-600 font-semibold hover:text-orange-700"
          >
            {OPPORTUNITIES_CONTACT_EMAIL}
          </a>
          . We review submissions from our network before publishing anything on this page.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="flex flex-col rounded-2xl border border-amber-100 bg-amber-50/40 p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="shrink-0 w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <User className="w-5 h-5" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Looking for work?</h3>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed flex-1 mb-5">
              Email us a short summary of what you are looking for. You can attach a CV. We may list you as a
              candidate profile (first name and initial only on the site).
            </p>
            <a
              href={submitCandidateMailto()}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-orange-600 text-white font-semibold text-[15px] hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4" aria-hidden />
              Email your profile
            </a>
          </article>

          <article className="flex flex-col rounded-2xl border border-amber-100 bg-amber-50/40 p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="shrink-0 w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Briefcase className="w-5 h-5" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Have a position?</h3>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed flex-1 mb-5">
              Email us the role details and we will consider listing it under Work Available for people in our
              network to browse.
            </p>
            <a
              href={submitRoleMailto()}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-orange-600 text-white font-semibold text-[15px] hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4" aria-hidden />
              Email the role
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
