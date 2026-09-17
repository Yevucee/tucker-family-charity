import { useCallback, useEffect, useRef, useState } from "react";
import type { HomeGallerySlide } from "@/data/homeOliversVillageGallery";

const AUTO_ADVANCE_MS = 5500;

type HomeAboutPhotoCarouselProps = {
  slides: HomeGallerySlide[];
  className?: string;
};

/**
 * Crossfade carousel for the Home About section — one landscape frame, dot controls, pauses on hover.
 */
export function HomeAboutPhotoCarousel({ slides, className = "" }: HomeAboutPhotoCarouselProps) {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const count = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive(((index % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setActive((i) => (i + 1) % count);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(id);
  }, [count]);

  if (count === 0) return null;

  const single = count === 1;

  return (
    <div
      className={`relative overflow-hidden rounded-lg shadow-xl group ${className}`}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocus={() => {
        pausedRef.current = true;
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) pausedRef.current = false;
      }}
    >
      <div className="relative h-[280px] sm:h-[350px] md:h-[400px] bg-neutral-900">
        {slides.map((slide, i) => (
          <img
            key={slide.alt}
            src={slide.src}
            alt={slide.alt}
            className={[
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out",
              i === active ? "opacity-100 z-10" : "opacity-0 z-0",
              "motion-reduce:transition-none",
            ].join(" ")}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
          />
        ))}
        <div
          className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/35 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      {!single ? (
        <div
          className="absolute bottom-3 left-0 right-0 z-30 flex justify-center gap-2 px-3"
          role="tablist"
          aria-label="Oliver's Village photos"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.alt}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show photo ${i + 1} of ${count}: ${slide.alt}`}
              onClick={() => goTo(i)}
              className={
                i === active
                  ? "h-2.5 w-2.5 rounded-full bg-white ring-2 ring-orange-500/90 shadow-sm"
                  : "h-2.5 w-2.5 rounded-full bg-white/55 hover:bg-white/80 shadow-sm"
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
