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
    <div className="flex h-[108px] w-full max-w-full cursor-default items-center justify-center rounded-xl bg-gradient-to-b from-amber-50/95 to-white p-3 shadow-none transition-shadow hover:shadow-md sm:h-[120px]">
      {logo && !failed ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className="max-h-[85%] max-w-[90%] object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-amber-600/75 text-center px-1 leading-tight">
          {name}
        </span>
      )}
    </div>
  );
}
