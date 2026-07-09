import { Briefcase, Handshake, Mail, Send } from "lucide-react";

export function CompactHowItWorks() {
  return (
    <section className="py-8 md:py-10 bg-amber-50/50 border-t border-amber-100/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-bold text-neutral-900 text-center mb-5">How it works</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <li className="flex gap-3 rounded-xl border border-amber-100 bg-white px-4 py-3">
            <Send className="w-5 h-5 shrink-0 text-amber-800 mt-0.5" aria-hidden />
            <span className="text-neutral-700 leading-snug">
              Email us your profile or role. We review submissions from our trusted network.
            </span>
          </li>
          <li className="flex gap-3 rounded-xl border border-amber-100 bg-white px-4 py-3">
            <Briefcase className="w-5 h-5 shrink-0 text-amber-800 mt-0.5" aria-hidden />
            <span className="text-neutral-700 leading-snug">
              Selected profiles and roles are published here for others to browse.
            </span>
          </li>
          <li className="flex gap-3 rounded-xl border border-amber-100 bg-white px-4 py-3">
            <Mail className="w-5 h-5 shrink-0 text-amber-800 mt-0.5" aria-hidden />
            <span className="text-neutral-700 leading-snug">
              Contact details stay off the site. Email us if something looks like a good fit.
            </span>
          </li>
          <li className="flex gap-3 rounded-xl border border-amber-100 bg-white px-4 py-3">
            <Handshake className="w-5 h-5 shrink-0 text-amber-800 mt-0.5" aria-hidden />
            <span className="text-neutral-700 leading-snug">
              We may help connect people where there is a match. We do not guarantee employment.
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
}
