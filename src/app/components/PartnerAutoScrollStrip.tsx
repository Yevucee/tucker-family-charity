import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { partners, partnerDisplayLogo, type Partner } from "@/data/partners";
import { PartnerLogoSlot } from "./PartnerLogoSlot";

const SCROLL_SPEED = 0.55;

function PartnerScrollCard({ partner }: { partner: Partner }) {
  const logo = partnerDisplayLogo(partner);
  const baseClass =
    "flex flex-col items-center gap-3 w-[148px] sm:w-[160px] shrink-0 snap-start group";

  const inner = (
    <>
      <PartnerLogoSlot name={partner.name} logo={logo} />
      <span className="text-xs font-semibold text-neutral-800 text-center leading-tight px-1">
        {partner.name}
      </span>
    </>
  );

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} text-inherit no-underline`}
      >
        {inner}
        <span className="sr-only">Opens in new tab</span>
      </a>
    );
  }

  return (
    <Link to="/partners" className={baseClass}>
      {inner}
    </Link>
  );
}

export function PartnerAutoScrollStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const tick = () => {
      if (!pausedRef.current) {
        el.scrollLeft += SCROLL_SPEED;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half - 0.5) {
          el.scrollLeft -= half;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  const list = reducedMotion ? partners : [...partners, ...partners];

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocusCapture={() => {
        pausedRef.current = true;
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          pausedRef.current = false;
        }
      }}
      onTouchStart={() => {
        pausedRef.current = true;
      }}
      onTouchEnd={() => {
        pausedRef.current = false;
      }}
      className={`flex gap-5 sm:gap-6 pb-4 pt-1 scroll-pl-2 scroll-pr-2 sm:scroll-pl-0 sm:scroll-pr-0 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:thin] [scrollbar-color:theme(colors.amber.400)_theme(colors.neutral.100)] ${
        reducedMotion
          ? "overflow-x-auto snap-x snap-mandatory"
          : "overflow-x-hidden"
      }`}
      style={{ WebkitOverflowScrolling: "touch" }}
      role="region"
      aria-label="Our partners. Automatically scrolling; hover, touch, or keyboard focus pauses movement."
    >
      {list.map((partner, i) => (
        <PartnerScrollCard
          key={reducedMotion ? partner.id : `${partner.id}-${i}`}
          partner={partner}
        />
      ))}
    </div>
  );
}
