import { useState } from "react";

type PartnerLogoSlotProps = {
  name: string;
  logo: string | null;
};

/**
 * Logo area with dashed placeholder when no asset; favicon URLs may fail—onError falls back to text.
 */
export function PartnerLogoSlot({ name, logo }: PartnerLogoSlotProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="w-full aspect-[5/4] rounded-xl border-2 border-dashed border-amber-200 bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-3 shadow-sm group-hover:border-amber-300 group-hover:shadow-md transition-all">
      {logo && !failed ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className="max-h-[85%] max-w-[90%] object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-amber-600/75 text-center px-1">
          Logo pending
        </span>
      )}
    </div>
  );
}
