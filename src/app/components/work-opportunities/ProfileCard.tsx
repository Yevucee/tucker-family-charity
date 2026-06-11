import { Mail, MapPin, User } from "lucide-react";
import { profileInterestMailto, type JobSeekerProfile } from "@/data/opportunities";

export function ProfileCard({ profile }: { profile: JobSeekerProfile }) {
  return (
    <article className="flex flex-col h-full rounded-2xl border border-amber-100/90 bg-white shadow-md hover:shadow-lg transition-shadow p-6 sm:p-7">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
          <User className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-neutral-900">{profile.displayName}</h3>
          <p className="mt-1 flex items-start gap-1.5 text-sm font-medium text-amber-900/85">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-85" aria-hidden />
            <span>{profile.location}</span>
          </p>
        </div>
      </div>

      <p className="text-sm font-semibold text-orange-600 mb-3">{profile.workType}</p>

      <dl className="space-y-2 text-sm text-neutral-700 flex-1">
        <div>
          <dt className="font-semibold text-neutral-800">Skills / experience</dt>
          <dd className="mt-0.5 leading-relaxed">{profile.skills}</dd>
        </div>
        <div>
          <dt className="font-semibold text-neutral-800">Availability</dt>
          <dd className="mt-0.5">{profile.availability}</dd>
        </div>
        {profile.summary.trim() ? (
          <div>
            <dt className="font-semibold text-neutral-800">Summary</dt>
            <dd className="mt-0.5 leading-relaxed">{profile.summary}</dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-4 text-xs text-neutral-600 leading-relaxed">
        Contact details are not published here. Email Tucker Family Charity if you would like to explore a connection.
      </p>

      <a
        href={profileInterestMailto(profile)}
        className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-orange-600 text-white font-semibold text-[15px] hover:bg-orange-700 transition-colors shadow-sm"
      >
        <Mail className="w-4 h-4" aria-hidden />
        I&apos;m Interested
      </a>
    </article>
  );
}
