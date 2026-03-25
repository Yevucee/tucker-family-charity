import type { ReactElement } from "react";
import { ExternalLink } from "lucide-react";
import auctionArtwork from "@/assets/auction-fred-schimmel-abstract.png";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { AuctionItem } from "@/data/shopProducts";
import type { FeaturedThisMonth } from "@/data/shopCatalog";
import { FeaturedCarouselSlide } from "./FeaturedMonthCarousel";

export type FeaturedSlidesVariant = "full" | "compact";

/**
 * Shared specials slides for Shop (full) and Home (compact). Same data as shopCatalog + auctionItems.
 */
export function buildFeaturedMonthSlides(
  featuredAuction: AuctionItem | undefined,
  featuredBlock: FeaturedThisMonth,
  variant: FeaturedSlidesVariant
): ReactElement[] {
  const compact = variant === "compact";
  const slides: ReactElement[] = [];

  if (featuredAuction) {
    slides.push(
      <FeaturedCarouselSlide key="auction">
        <div
          className={
            compact
              ? "rounded-xl overflow-hidden border border-amber-200/80 bg-white h-full shadow-md"
              : "rounded-2xl overflow-hidden shadow-xl border border-amber-200/80 bg-white h-full"
          }
        >
          <div
            className={
              compact
                ? "flex flex-col sm:flex-row sm:min-h-[160px] sm:max-h-[220px]"
                : "flex flex-col md:flex-row md:min-h-[260px] md:max-h-[340px]"
            }
          >
            <div
              className={
                compact
                  ? "relative w-full aspect-[5/3] sm:aspect-auto sm:w-[40%] sm:min-h-[140px] shrink-0 bg-neutral-100"
                  : "relative w-full aspect-[16/10] md:aspect-auto md:w-[42%] md:min-h-[240px] shrink-0 bg-neutral-100"
              }
            >
              <img
                src={auctionArtwork}
                alt={`${featuredAuction.title} — silent auction for Oliver's Village`}
                className="absolute inset-0 w-full h-full object-cover sm:object-contain bg-white"
              />
            </div>
            <div
              className={
                compact
                  ? "flex-1 p-3 sm:p-4 flex flex-col justify-center min-w-0"
                  : "flex-1 p-5 md:p-7 flex flex-col justify-center min-w-0"
              }
            >
              <p
                className={
                  compact
                    ? "text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1.5"
                    : "text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2"
                }
              >
                Special · Silent auction
              </p>
              <p
                className={
                  compact
                    ? "text-sm sm:text-base font-bold text-neutral-900 mb-1"
                    : "text-lg font-bold text-neutral-900 mb-1"
                }
              >
                Art that makes a difference
              </p>
              <p
                className={
                  compact
                    ? "text-xs text-neutral-600 mb-2 line-clamp-2"
                    : "text-sm text-neutral-600 mb-3 line-clamp-2"
                }
              >
                <strong>{featuredAuction.title}</strong>
                {featuredAuction.reserve ? ` · Reserve ${featuredAuction.reserve}` : ""}
              </p>
              <p
                className={
                  compact
                    ? "text-xs text-neutral-700 mb-3 line-clamp-2 leading-relaxed"
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
                  compact
                    ? "inline-flex items-center justify-center gap-1.5 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-semibold text-xs w-fit"
                    : "inline-flex items-center justify-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors font-semibold text-sm sm:text-base w-fit"
                }
              >
                Place a bid
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </a>
              {!compact && (
                <p className="text-xs text-neutral-500 mt-3">Bidding closes end of March 2026</p>
              )}
            </div>
          </div>
        </div>
      </FeaturedCarouselSlide>
    );
  }

  const main = featuredBlock.main;
  slides.push(
    <FeaturedCarouselSlide key={main.id}>
      <div
        className={
          compact
            ? "rounded-xl overflow-hidden border border-amber-200/80 bg-white h-full shadow-md"
            : "rounded-2xl overflow-hidden shadow-xl border border-amber-200/80 bg-white h-full"
        }
      >
        <div
          className={
            compact
              ? "flex flex-col sm:flex-row sm:min-h-[160px] sm:max-h-[220px]"
              : "flex flex-col md:flex-row md:min-h-[260px] md:max-h-[340px]"
          }
        >
          <div
            className={
              compact
                ? "relative w-full aspect-[5/3] sm:aspect-auto sm:w-[40%] sm:min-h-[140px] shrink-0"
                : "relative w-full aspect-[16/10] md:aspect-auto md:w-[42%] md:min-h-[240px] shrink-0"
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
              compact
                ? "flex-1 p-3 sm:p-4 flex flex-col justify-center min-w-0 bg-gradient-to-br from-white to-amber-50/40"
                : "flex-1 p-5 md:p-7 flex flex-col justify-center min-w-0 bg-gradient-to-br from-white to-amber-50/40"
            }
          >
            <p
              className={
                compact
                  ? "text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1"
                  : "text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2"
              }
            >
              Our spotlight
            </p>
            <h3
              className={
                compact
                  ? "text-sm sm:text-base font-bold text-neutral-900 mb-2 leading-tight line-clamp-2"
                  : "text-xl md:text-2xl font-bold text-neutral-900 mb-3 leading-tight"
              }
            >
              {main.title}
            </h3>
            <p
              className={
                compact
                  ? "text-xs text-neutral-700 mb-3 line-clamp-2 leading-relaxed"
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
                compact
                  ? "inline-flex items-center justify-center px-4 py-2 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors w-fit text-xs"
                  : "inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors w-fit text-sm sm:text-base"
              }
            >
              {main.ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </FeaturedCarouselSlide>
  );

  for (const item of featuredBlock.supporting ?? []) {
    slides.push(
      <FeaturedCarouselSlide key={item.id}>
        <div
          className={
            compact
              ? "rounded-xl overflow-hidden border border-amber-200/80 bg-white h-full shadow-md"
              : "rounded-2xl overflow-hidden shadow-xl border border-amber-200/80 bg-white h-full"
          }
        >
          <div
            className={
              compact
                ? "flex flex-col sm:flex-row sm:min-h-[140px] sm:max-h-[200px]"
                : "flex flex-col md:flex-row md:min-h-[220px] md:max-h-[300px]"
            }
          >
            <div
              className={
                compact
                  ? "relative w-full aspect-[5/3] sm:aspect-auto sm:w-[38%] sm:min-h-[120px] shrink-0"
                  : "relative w-full aspect-[16/10] md:aspect-auto md:w-[38%] md:min-h-[220px] shrink-0"
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
                compact
                  ? "flex-1 p-3 sm:p-4 flex flex-col justify-center min-w-0"
                  : "flex-1 p-5 md:p-6 flex flex-col justify-center min-w-0"
              }
            >
              <p
                className={
                  compact
                    ? "text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1"
                    : "text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2"
                }
              >
                Also featuring
              </p>
              <h3
                className={
                  compact
                    ? "text-sm font-bold text-neutral-900 mb-1 line-clamp-1"
                    : "text-lg md:text-xl font-bold text-neutral-900 mb-2"
                }
              >
                {item.title}
              </h3>
              <p
                className={
                  compact
                    ? "text-xs text-neutral-600 mb-2 line-clamp-2 leading-relaxed"
                    : "text-sm text-neutral-600 mb-4 line-clamp-3 leading-relaxed"
                }
              >
                {item.shortDescription}
              </p>
              <a
                href={item.ctaHref}
                className={
                  compact
                    ? "inline-flex text-xs font-semibold text-amber-700 hover:text-amber-800 w-fit"
                    : "inline-flex text-sm font-semibold text-amber-700 hover:text-amber-800 w-fit"
                }
              >
                {item.ctaLabel} →
              </a>
            </div>
          </div>
        </div>
      </FeaturedCarouselSlide>
    );
  }

  return slides;
}
