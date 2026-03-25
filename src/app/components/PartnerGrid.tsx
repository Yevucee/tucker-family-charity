import { useState } from "react";
import { Link } from "react-router";
import { ExternalLink } from "lucide-react";
import { partners, partnerDisplayLogo, type Partner } from "@/data/partners";

function PartnerGridCard({ partner }: { partner: Partner }) {
  const resolved = partnerDisplayLogo(partner);
  const [imgOk, setImgOk] = useState(true);
  const showImg = Boolean(resolved && imgOk);

  const body = (
    <>
      <div className="relative aspect-[5/4] rounded-xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-3 flex items-center justify-center shadow-sm group-hover:border-amber-400 group-hover:shadow-md transition-all">
        {showImg ? (
          <img
            src={resolved!}
            alt=""
            className="max-h-[85%] max-w-[90%] object-contain"
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
          />
        ) : (
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-amber-700/80 text-center px-1 leading-tight">
            {partner.name}
          </span>
        )}
        {partner.websiteUrl && (
          <ExternalLink
            className="absolute top-2 right-2 w-3.5 h-3.5 text-amber-600/70 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-hidden
          />
        )}
      </div>
      <span className="text-xs font-semibold text-neutral-800 text-center leading-tight line-clamp-2 mt-2.5 px-0.5">
        {partner.name}
      </span>
    </>
  );

  const className =
    "group flex flex-col items-stretch rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2";

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {body}
        <span className="sr-only">
          {partner.name}, opens partner website in a new tab
        </span>
      </a>
    );
  }

  return (
    <Link to="/partners" className={className}>
      {body}
      <span className="sr-only">{partner.name}, more on our partners page</span>
    </Link>
  );
}

export function PartnerGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
      {partners.map((p) => (
        <PartnerGridCard key={p.id} partner={p} />
      ))}
    </div>
  );
}
