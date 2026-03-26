import type { ReactElement } from "react";
import { ExternalLink } from "lucide-react";
import auctionArtwork from "@/assets/auction-fred-schimmel-abstract.png";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { AuctionItem } from "@/data/shopProducts";
import type { FeaturedThisMonth } from "@/data/shopCatalog";
import { FeaturedCarouselSlide } from "./FeaturedMonthCarousel";

export type FeaturedSlidesVariant = "full" | "compact" | "home";

/**
 * Home + Shop (`split`): horizontal card — 40% width is a square image; 60% is
 * centred copy that scrolls if needed (no overlap). Same grid structure per slide.
 */
const SPLIT_CARD_HOME =
  "w-full max-w-6xl mx-auto min-w-0 rounded-2xl border border-amber-200/80 bg-white shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-[40%_60%] md:items-stretch";

const SPLIT_CARD_SHOP =
  "w-full max-w-6xl mx-auto min-w-0 rounded-2xl overflow-hidden shadow-xl border border-amber-200/80 bg-white grid grid-cols-1 md:grid-cols-[40%_60%] md:items-stretch";

/** Square fills the 40% column; image covers the square */
const SPLIT_IMAGE_CELL =
  "relative w-full aspect-square overflow-hidden bg-amber-50 md:rounded-l-2xl";

const SPLIT_IMG_COVER = "absolute inset-0 h-full w-full object-cover";

function splitTextPaneClass(extraBg: string): string {
  const bg = extraBg ? ` ${extraBg}` : "";
  return [
    "min-w-0 min-h-0 flex flex-col justify-center items-center text-center",
    "px-6 py-8 md:px-8 md:py-8 lg:px-10",
    "gap-3 [overflow-wrap:anywhere] overflow-y-auto overscroll-contain",
    bg,
  ].join("");
}

/**
 * Home (`home`) + Shop (`full`): 40% square image / 60% centred text.
 * `compact` keeps the smaller two-column preview layout.
 */
export function buildFeaturedMonthSlides(
  featuredAuction: AuctionItem | undefined,
  featuredBlock: FeaturedThisMonth,
  variant: FeaturedSlidesVariant
): ReactElement[] {
  const isHome = variant === "home";
  const isCompact = variant === "compact";
  const split = !isCompact;
  const slidePadding = isHome ? "none" : "default";

  const splitOuter = isHome ? SPLIT_CARD_HOME : SPLIT_CARD_SHOP;

  const slides: ReactElement[] = [];

  if (featuredAuction) {
    const imgColCompact = isCompact
      ? "relative w-full aspect-[5/3] sm:aspect-auto sm:w-[40%] sm:min-h-[140px] sm:max-w-[40%] shrink-0 bg-amber-50"
      : "relative w-full aspect-[16/10] md:aspect-auto md:w-[40%] md:min-h-[240px] shrink-0 bg-amber-50";

    const rowCompact = isCompact
      ? "flex flex-col sm:flex-row sm:min-h-[160px]"
      : "flex flex-col md:flex-row md:items-stretch md:min-h-[260px]";

    slides.push(
      <FeaturedCarouselSlide key="auction" slidePadding={slidePadding}>
        <div
          className={
            split
              ? splitOuter
              : isCompact
                ? "rounded-xl overflow-hidden border border-amber-200/80 bg-white h-full shadow-md"
                : "rounded-2xl overflow-hidden shadow-xl border border-amber-200/80 bg-white h-full"
          }
        >
          {split ? (
            <>
              <div className={SPLIT_IMAGE_CELL}>
                <img
                  src={auctionArtwork}
                  alt={`${featuredAuction.title} — silent auction for Oliver's Village`}
                  className={SPLIT_IMG_COVER}
                />
              </div>
              <div className={splitTextPaneClass("")}>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 shrink-0">
                  Special · Silent auction
                </p>
                <p className="text-base md:text-lg font-bold text-neutral-900 max-w-lg">
                  Art that makes a difference
                </p>
                <p className="text-sm text-neutral-600 max-w-lg">
                  <strong>{featuredAuction.title}</strong>
                  {featuredAuction.reserve ? ` · Reserve ${featuredAuction.reserve}` : ""}
                </p>
                <p className="text-sm text-neutral-700 leading-relaxed max-w-lg">
                  In partnership with {featuredAuction.donor}. {featuredAuction.description}
                </p>
                <a
                  href={featuredAuction.bidLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors font-semibold text-sm w-fit max-w-full shrink-0"
                >
                  Place a bid
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </a>
                <p className="text-xs text-neutral-500 max-w-lg shrink-0">
                  Bidding closes end of March 2026
                </p>
              </div>
            </>
          ) : (
            <div className={rowCompact}>
              <div className={imgColCompact}>
                <img
                  src={auctionArtwork}
                  alt={`${featuredAuction.title} — silent auction for Oliver's Village`}
                  className="absolute inset-0 w-full h-full object-cover sm:object-contain bg-white"
                />
              </div>
              <div
                className={
                  isCompact
                    ? "flex-1 w-full min-w-0 max-w-full overflow-hidden px-4 py-4 sm:px-5 sm:py-5 flex flex-col justify-center"
                    : "flex-1 md:w-[60%] md:flex-[0_0_60%] p-5 md:p-8 lg:p-10 flex flex-col justify-center min-w-0"
                }
              >
                <p
                  className={
                    isCompact
                      ? "text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1.5"
                      : "text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2"
                  }
                >
                  Special · Silent auction
                </p>
                <p
                  className={
                    isCompact
                      ? "text-sm sm:text-base font-bold text-neutral-900 mb-1 break-words min-w-0"
                      : "text-lg font-bold text-neutral-900 mb-1"
                  }
                >
                  Art that makes a difference
                </p>
                <p
                  className={
                    isCompact
                      ? "text-xs text-neutral-600 mb-2 line-clamp-2 break-words min-w-0"
                      : "text-sm text-neutral-600 mb-3 line-clamp-2"
                  }
                >
                  <strong>{featuredAuction.title}</strong>
                  {featuredAuction.reserve ? ` · Reserve ${featuredAuction.reserve}` : ""}
                </p>
                <p
                  className={
                    isCompact
                      ? "text-xs text-neutral-700 mb-3 line-clamp-3 leading-relaxed break-words"
                      : "text-sm text-neutral-700 mb-5 line-clamp-3 leading-relaxed"
                  }
                >
                  In partnership with {featuredAuction.donor}. {featuredAuction.description}
                </p>
                <a
                  href={featuredAuction.bidLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    isCompact
                      ? "inline-flex items-center justify-center gap-1.5 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-semibold text-xs w-fit"
                      : "inline-flex items-center justify-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors font-semibold text-sm sm:text-base w-fit"
                  }
                >
                  Place a bid
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </a>
              </div>
            </div>
          )}
        </div>
      </FeaturedCarouselSlide>
    );
  }

  const main = featuredBlock.main;
  slides.push(
    <FeaturedCarouselSlide key={main.id} slidePadding={slidePadding}>
      <div
        className={
          split
            ? splitOuter
            : isCompact
              ? "rounded-xl overflow-hidden border border-amber-200/80 bg-white h-full shadow-md"
              : "rounded-2xl overflow-hidden shadow-xl border border-amber-200/80 bg-white h-full"
        }
      >
        {split ? (
          <>
            <div className={SPLIT_IMAGE_CELL}>
              <ImageWithFallback
                src={main.image}
                alt={main.title}
                className={SPLIT_IMG_COVER}
                loading="eager"
              />
            </div>
            <div
              className={splitTextPaneClass("bg-gradient-to-br from-white to-amber-50/40 md:rounded-r-2xl")}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 shrink-0">
                Our spotlight
              </p>
              <h3 className="text-lg md:text-xl font-bold text-neutral-900 leading-snug max-w-lg">
                {main.title}
              </h3>
              <p className="text-sm md:text-base text-neutral-700 leading-relaxed max-w-lg">
                {main.shortDescription}
              </p>
              <a
                href={main.ctaHref}
                target={main.ctaOpensNewTab ? "_blank" : undefined}
                rel={main.ctaOpensNewTab ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors w-fit max-w-full shrink-0 text-sm"
              >
                {main.ctaLabel}
              </a>
            </div>
          </>
        ) : (
          <div
            className={
              isCompact
                ? "flex flex-col sm:flex-row sm:min-h-[160px]"
                : "flex flex-col md:flex-row md:items-stretch md:min-h-[260px]"
            }
          >
            <div
              className={
                isCompact
                  ? "relative w-full aspect-[5/3] sm:aspect-auto sm:w-[40%] sm:min-h-[140px] sm:max-w-[40%] shrink-0"
                  : "relative w-full aspect-[16/10] md:aspect-auto md:w-[40%] md:min-h-[240px] md:h-full shrink-0 overflow-hidden md:rounded-l-2xl"
              }
            >
              <ImageWithFallback
                src={main.image}
                alt={main.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div
              className={
                isCompact
                  ? "flex-1 w-full min-w-0 max-w-full overflow-hidden px-4 py-4 sm:px-5 sm:py-5 flex flex-col justify-center bg-gradient-to-br from-white to-amber-50/40"
                  : "flex-1 md:w-[60%] md:flex-[0_0_60%] min-w-0 p-5 md:p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-white to-amber-50/40"
              }
            >
              <p
                className={
                  isCompact
                    ? "text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1 break-words"
                    : "text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2"
                }
              >
                Our spotlight
              </p>
              <h3
                className={
                  isCompact
                    ? "text-sm sm:text-base font-bold text-neutral-900 mb-2 leading-tight line-clamp-2 break-words min-w-0"
                    : "text-xl md:text-2xl font-bold text-neutral-900 mb-3 leading-tight"
                }
              >
                {main.title}
              </h3>
              <p
                className={
                  isCompact
                    ? "text-xs text-neutral-700 mb-3 line-clamp-4 leading-relaxed break-words min-w-0"
                    : "text-sm md:text-base text-neutral-700 mb-6 line-clamp-4 leading-relaxed"
                }
              >
                {main.shortDescription}
              </p>
              <a
                href={main.ctaHref}
                target={main.ctaOpensNewTab ? "_blank" : undefined}
                rel={main.ctaOpensNewTab ? "noopener noreferrer" : undefined}
                className={
                  isCompact
                    ? "inline-flex items-center justify-center px-4 py-2 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors w-fit text-xs"
                    : "inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors w-fit text-sm sm:text-base"
                }
              >
                {main.ctaLabel}
              </a>
            </div>
          </div>
        )}
      </div>
    </FeaturedCarouselSlide>
  );

  for (const item of featuredBlock.supporting ?? []) {
    slides.push(
      <FeaturedCarouselSlide key={item.id} slidePadding={slidePadding}>
        <div
          className={
            split
              ? splitOuter
              : isCompact
                ? "rounded-xl overflow-hidden border border-amber-200/80 bg-white h-full shadow-md"
                : "rounded-2xl overflow-hidden shadow-xl border border-amber-200/80 bg-white h-full"
          }
        >
          {split ? (
            <>
              <div className={SPLIT_IMAGE_CELL}>
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className={SPLIT_IMG_COVER}
                  loading="lazy"
                />
              </div>
              <div className={splitTextPaneClass("md:rounded-r-2xl")}>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 shrink-0">
                  Also featuring
                </p>
                <h3 className="text-base md:text-lg font-bold text-neutral-900 max-w-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-lg">
                  {item.shortDescription}
                </p>
                <a
                  href={item.ctaHref}
                  className="inline-flex flex-wrap justify-center text-sm font-semibold text-amber-700 hover:text-amber-800 max-w-full min-w-0 shrink-0"
                >
                  {item.ctaLabel} →
                </a>
              </div>
            </>
          ) : (
            <div
              className={
                isCompact
                  ? "flex flex-col sm:flex-row sm:min-h-[140px]"
                  : "flex flex-col md:flex-row md:items-stretch md:min-h-[220px]"
              }
            >
              <div
                className={
                  isCompact
                    ? "relative w-full aspect-[5/3] sm:aspect-auto sm:w-[38%] sm:min-h-[120px] sm:max-w-[38%] shrink-0"
                    : "relative w-full aspect-[16/10] md:aspect-auto md:w-[40%] md:min-h-[220px] md:h-full shrink-0 overflow-hidden md:rounded-l-2xl"
                }
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div
                className={
                  isCompact
                    ? "flex-1 w-full min-w-0 max-w-full overflow-hidden px-4 py-4 sm:px-5 sm:py-4 flex flex-col justify-center"
                    : "flex-1 md:w-[60%] md:flex-[0_0_60%] min-w-0 p-5 md:p-8 lg:p-10 flex flex-col justify-center"
                }
              >
                <p
                  className={
                    isCompact
                      ? "text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1"
                      : "text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2"
                  }
                >
                  Also featuring
                </p>
                <h3
                  className={
                    isCompact
                      ? "text-sm font-bold text-neutral-900 mb-1 line-clamp-2 break-words min-w-0"
                      : "text-lg md:text-xl font-bold text-neutral-900 mb-2"
                  }
                >
                  {item.title}
                </h3>
                <p
                  className={
                    isCompact
                      ? "text-xs text-neutral-600 mb-2 line-clamp-2 leading-relaxed break-words min-w-0"
                      : "text-sm text-neutral-600 mb-4 line-clamp-3 leading-relaxed"
                  }
                >
                  {item.shortDescription}
                </p>
                <a
                  href={item.ctaHref}
                  className={
                    isCompact
                      ? "inline-flex text-xs font-semibold text-amber-700 hover:text-amber-800 w-fit"
                      : "inline-flex text-sm font-semibold text-amber-700 hover:text-amber-800 w-fit"
                  }
                >
                  {item.ctaLabel} →
                </a>
              </div>
            </div>
          )}
        </div>
      </FeaturedCarouselSlide>
    );
  }

  return slides;
}
