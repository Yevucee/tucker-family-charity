import { Children, useCallback, useEffect, useRef, useState } from "react";

/** Time between automatic slide changes */
const AUTO_ADVANCE_MS = 5000;

type FeaturedMonthCarouselProps = {
  /** When false or only one child, no auto-scroll and no snap strip */
  enableCarousel: boolean;
  children: React.ReactNode;
};

/**
 * Horizontal featured strip: one slide visible; auto-advances when `enableCarousel` and 2+ slides.
 * Pauses while hovered/focused on the scroll strip only; respects prefers-reduced-motion.
 */
export function FeaturedMonthCarousel({ enableCarousel, children }: FeaturedMonthCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideCount = Children.toArray(children).length;
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);

  const scrollToIndex = useCallback((i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    activeRef.current = i;
    setActive(i);
    el.scrollTo({ left: i * w, behavior: "smooth" });
  }, []);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (!enableCarousel || slideCount <= 1) return;
    const el = scrollerRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const tick = () => {
      if (pausedRef.current || !el) return;
      const w = el.clientWidth;
      if (w <= 0) return;
      const next = (activeRef.current + 1) % slideCount;
      activeRef.current = next;
      setActive(next);
      el.scrollTo({ left: next * w, behavior: "smooth" });
    };

    const id = window.setInterval(tick, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [enableCarousel, slideCount]);

  /** Only pause auto-scroll while pointer/focus is on the swipe strip (not the whole page width). */
  const pauseStripEnter = () => {
    pausedRef.current = true;
  };
  const pauseStripLeave = () => {
    pausedRef.current = false;
  };

  if (!enableCarousel || slideCount <= 1) {
    return <div>{children}</div>;
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className={[
          "flex overflow-x-auto scroll-smooth snap-x snap-mandatory",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        ].join(" ")}
        tabIndex={0}
        onMouseEnter={pauseStripEnter}
        onMouseLeave={pauseStripLeave}
        onFocus={() => {
          pausedRef.current = true;
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) pausedRef.current = false;
        }}
        onScroll={() => {
          const el = scrollerRef.current;
          if (!el) return;
          const w = el.clientWidth || 1;
          const i = Math.round(el.scrollLeft / w);
          if (i !== activeRef.current && i >= 0 && i < slideCount) {
            activeRef.current = i;
            setActive(i);
          }
        }}
      >
        {children}
      </div>
      <div
        className="flex justify-center gap-2 mt-4"
        role="tablist"
        aria-label="Featured slides"
      >
        {Array.from({ length: slideCount }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Show featured item ${i + 1} of ${slideCount}`}
            onClick={() => scrollToIndex(i)}
            className={
              i === active
                ? "h-2.5 w-2.5 rounded-full bg-amber-600 ring-2 ring-amber-200"
                : "h-2.5 w-2.5 rounded-full bg-neutral-300 hover:bg-neutral-400"
            }
          />
        ))}
      </div>
    </div>
  );
}

type SlidePadding = "default" | "none";

/** Wrapper width for each slide inside the carousel scroller */
export function FeaturedCarouselSlide({
  children,
  slidePadding = "default",
}: {
  children: React.ReactNode;
  /** `none` = full-width slide (e.g. Home featured strip) */
  slidePadding?: SlidePadding;
}) {
  const pad =
    slidePadding === "none"
      ? "px-0"
      : "px-1 sm:px-1.5";
  return (
    <div className={`min-w-full shrink-0 snap-start snap-always box-border ${pad}`}>
      {children}
    </div>
  );
}
