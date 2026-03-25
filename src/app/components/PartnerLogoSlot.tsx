import { useState } from "react";

type PartnerLogoSlotProps = {
  name: string;
  logo: string | null;
  /**
   * `strip` — home page auto-scroll tiles (fixed width comes from the parent card).
   * `detail` — Partners page grid: full-width uniform logo area per card.
   */
  variant?: "strip" | "detail";
};

const shellStrip =
  "flex h-[108px] w-full max-w-full items-center justify-center rounded-xl bg-gradient-to-b from-amber-50/95 to-white p-3 shadow-none transition-shadow hover:shadow-md sm:h-[120px]";

const shellDetail =
  "flex h-[152px] w-full items-center justify-center rounded-xl bg-gradient-to-b from-amber-50/95 to-white p-4 shadow-none transition-shadow hover:shadow-md sm:h-[168px]";

const imgStrip = "max-h-[85%] max-w-[90%] object-contain";

const imgDetail = "max-h-[78%] max-w-[82%] object-contain";

/**
 * Logo area; favicon URLs may fail—onError falls back to text.
 * Use variant="detail" on the Partners page so layout changes there do not affect the home strip.
 */
export function PartnerLogoSlot({ name, logo, variant = "strip" }: PartnerLogoSlotProps) {
  const [failed, setFailed] = useState(false);
  const shell = variant === "detail" ? shellDetail : shellStrip;
  const imgClass = variant === "detail" ? imgDetail : imgStrip;

  return (
    <div className={shell}>
      {logo && !failed ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className={imgClass}
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className={
            variant === "detail"
              ? "text-xs sm:text-sm font-semibold uppercase tracking-wide text-amber-600/80 text-center px-2 leading-tight"
              : "text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-amber-600/75 text-center px-1 leading-tight"
          }
        >
          {name}
        </span>
      )}
    </div>
  );
}
