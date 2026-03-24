import { Link } from "react-router";

type PartnerLogoSlotProps = {
  name: string;
  logo: string | null;
};

/**
 * Logo area with dashed placeholder when no asset; used in home partner scroller and partners page.
 */
export function PartnerLogoSlot({ name, logo }: PartnerLogoSlotProps) {
  return (
    <div className="w-full aspect-[5/4] rounded-xl border-2 border-dashed border-amber-200 bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-3 shadow-sm group-hover:border-amber-300 group-hover:shadow-md transition-all">
      {logo ? (
        <img src={logo} alt={`${name} logo`} className="max-h-[85%] max-w-[90%] object-contain" />
      ) : (
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-amber-600/75 text-center px-1">
          Logo pending
        </span>
      )}
    </div>
  );
}

export function PartnerScrollCard({ name, logo }: PartnerLogoSlotProps) {
  return (
    <Link
      to="/partners"
      className="flex flex-col items-center gap-3 w-[148px] sm:w-[160px] shrink-0 snap-start group"
    >
      <PartnerLogoSlot name={name} logo={logo} />
      <span className="text-xs font-semibold text-neutral-800 text-center leading-tight px-1">
        {name}
      </span>
    </Link>
  );
}
