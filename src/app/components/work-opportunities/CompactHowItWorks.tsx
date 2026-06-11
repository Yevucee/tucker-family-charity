import { Briefcase, Handshake, Mail } from "lucide-react";

export function CompactHowItWorks() {
  return (
    <section className="py-8 md:py-10 bg-white border-t border-amber-100/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-bold text-neutral-900 text-center mb-5">How it works</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <li className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3">
            <Briefcase className="w-5 h-5 shrink-0 text-amber-800 mt-0.5" aria-hidden />
            <span className="text-neutral-700 leading-snug">
              We publish curated profiles and roles from our trusted network.
            </span>
          </li>
          <li className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3">
            <Mail className="w-5 h-5 shrink-0 text-amber-800 mt-0.5" aria-hidden />
            <span className="text-neutral-700 leading-snug">
              Browse what is available — contact details stay off the site.
            </span>
          </li>
          <li className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3">
            <Handshake className="w-5 h-5 shrink-0 text-amber-800 mt-0.5" aria-hidden />
            <span className="text-neutral-700 leading-snug">
              Email us if interested; we may help connect where there is a fit.
            </span>
          </li>
        </ol>
        <p className="mt-4 text-xs text-neutral-500 text-center max-w-xl mx-auto">
          Tucker Family Charity does not guarantee employment or placements.
        </p>
      </div>
    </section>
  );
}
