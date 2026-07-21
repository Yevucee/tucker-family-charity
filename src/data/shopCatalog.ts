import { PERSONALISED_HAT_PATH } from "./personalisedCharityHat";
import { CHARITY_WINE_PATH } from "./charityWine";

import capMustard from "@/assets/shop/cap-mustard.png";
import wineListing from "@/assets/shop/wine-listing.png";
import wineFeaturedMonth from "@/assets/shop/wine-featured-month.png";
import partnerSportsRepublic from "@/assets/shop/partner-sports-republic.jpg";

const SPORTS_REPUBLIC_URL = "https://sportsrepublic.shop/?sca_ref=11855386.HTKenH216a7FmF";

/**
 * Shop page content — CMS-ready shape.
 *
 * When moving to a headless CMS, mirror these category keys:
 * - featured
 * - tucker_products
 * - partner_offers
 *
 * FEATURED: Update `featuredThisMonth` each month (or point main CTA at a payment URL).
 * PAYMENT: Set `paymentLink` / `ctaHref` on Tucker items to Yoco, PayFast, etc.
 * PARTNER: Set `externalUrl` and optional `checkoutCode` for the leave-site modal.
 */

/** Mirrors future CMS category field */
export type ShopCatalogCategory = "featured" | "tucker_products" | "partner_offers";

export interface FeaturedSupportingItem {
  id: string;
  category: "featured";
  title: string;
  shortDescription: string;
  image: string;
  ctaLabel: string;
  /** PAYMENT or internal link */
  ctaHref: string;
}

export interface FeaturedThisMonth {
  sectionTitle: string;
  main: {
    id: string;
    category: "featured";
    title: string;
    shortDescription: string;
    image: string;
    ctaLabel: string;
    ctaHref: string;
    /** Set true when ctaHref is a payment or external product URL */
    ctaOpensNewTab?: boolean;
  };
  /** Optional 1–2 spotlight items under the hero (leave empty if unused) */
  supporting?: FeaturedSupportingItem[];
}

export interface TuckerCatalogProduct {
  id: string;
  category: "tucker_products";
  title: string;
  shortDescription: string;
  image: string;
  /** e.g. "From R120" — omit when price is TBC */
  priceLabel?: string;
  ctaLabel: string;
  /**
   * PAYMENT: Hosted checkout (Yoco, PayFast, etc.).
   * Use mailto: or # until the live link is ready.
   */
  paymentLink: string;
  ctaOpensNewTab?: boolean;
  /** When set, the product card CTA uses in-app navigation (e.g. PDP). */
  productDetailPath?: string;
}

export interface PartnerCatalogOffer {
  id: string;
  category: "partner_offers";
  title: string;
  shortDescription: string;
  image: string;
  ctaLabel: string;
  externalUrl: string;
  /**
   * PARTNER CODE: Shown in the redirect modal. Omit or "" if no code —
   * modal copy adapts automatically.
   */
  checkoutCode?: string;
  /** Optional short benefit lines shown as badges on the card */
  highlightBullets?: string[];
  /** Small print on the card (e.g. T&Cs) */
  termsNote?: string;
  /** Extra line in the leave-site modal (e.g. donation %) */
  modalExtraNote?: string;
  /** Hash anchor on Shop page, e.g. offer-sports-republic */
  shopAnchorId?: string;
  /** Logo-style images: use contain so they stay sharp; default cover for photos */
  imageFit?: "cover" | "contain";
}

export interface ShopCatalog {
  featuredThisMonth: FeaturedThisMonth;
  tuckerProducts: TuckerCatalogProduct[];
  partnerOffers: PartnerCatalogOffer[];
}

export const shopCatalog: ShopCatalog = {
  featuredThisMonth: {
    sectionTitle: "Featured This Month",
    main: {
      id: "featured-wine",
      category: "featured",
      title: "Tucker Family Charity Wine",
      shortDescription:
        "Featured this month: our white-label range — Chloe, Ella, and Madison — in partnership with Tucker Family Charity and in support of Oliver’s Village.",
      image: wineFeaturedMonth,
      ctaLabel: "View & order",
      ctaHref: CHARITY_WINE_PATH,
      ctaOpensNewTab: false,
    },
    supporting: [
      {
        id: "featured-personalised-caps",
        category: "featured",
        title: "Personalised Tucker Family Charity caps",
        shortDescription:
          "Colours and checkout on Cheyna Dot—embroidery celebrates Tucker Family Charity while supporting Oliver’s Village.",
        image: capMustard,
        ctaLabel: "View & order",
        ctaHref: PERSONALISED_HAT_PATH,
      },
    ],
  },
  tuckerProducts: [
    {
      id: "wine",
      category: "tucker_products",
      title: "Tucker Family Charity Wine",
      shortDescription:
        "Our white-label range — Chloe, Ella, and Madison — in partnership with Tucker Family Charity and in support of Oliver’s Village. Proceeds help support our initiatives.",
      image: wineListing,
      priceLabel: "Price on enquiry",
      ctaLabel: "View & order",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=Wine%20Order",
      ctaOpensNewTab: false,
      productDetailPath: CHARITY_WINE_PATH,
    },
    {
      id: "caps",
      category: "tucker_products",
      title: "Personalised Tucker Family Charity Cap",
      shortDescription:
        "Pick your colour and add a name—the order is placed on our partner store (Cheyna Dot). Every hat supports Oliver’s Village. See all shades on the Tucker page, then continue there to buy.",
      image: capMustard,
      priceLabel: "Via Cheyna Dot",
      ctaLabel: "View colours & partner link",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=Cap%20Purchase",
      ctaOpensNewTab: false,
      productDetailPath: PERSONALISED_HAT_PATH,
    },
    {
      id: "apparel",
      category: "tucker_products",
      title: "Tucker clothing",
      shortDescription: "Charity-branded apparel coming soon—join the waitlist by email.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      ctaLabel: "Order now",
      paymentLink: "mailto:info@tuckerfamilycharity.org?subject=Clothing%20Waitlist",
      ctaOpensNewTab: false,
    },
  ],
  partnerOffers: [
    {
      id: "face-for-men",
      category: "partner_offers",
      title: "Face for Men",
      shortDescription: "Quality grooming and skincare—support the charity when you shop our partner.",
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
      ctaLabel: "View offer",
      // PARTNER: replace with live partner storefront URL
      externalUrl: "https://example.com/partners/face-for-men",
      checkoutCode: "TUCKER10",
    },
    {
      id: "puma",
      category: "partner_offers",
      title: "Puma",
      shortDescription:
        "Sportswear and gear through our partner link—proceeds help support Tucker Family Charity’s initiatives.",
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
      ctaLabel: "Shop offer",
      externalUrl: "https://www.puma.com",
      // No checkoutCode — modal uses shorter copy without code line
    },
    {
      id: "sports-republic",
      category: "partner_offers",
      title: "Sports Republic",
      shortDescription:
        "Tucker Family Charity Special: save 15% on non-sale items with code TUXFAM15 — plus 10% of your purchase is donated to the charity.",
      image: partnerSportsRepublic,
      imageFit: "contain",
      ctaLabel: "Shop Sports Republic",
      externalUrl: SPORTS_REPUBLIC_URL,
      checkoutCode: "TUXFAM15",
      highlightBullets: ["15% off non-sale items", "10% donated to charity"],
      termsNote: "Online only · Valid on non-sale items · T&Cs apply",
      modalExtraNote: "10% of qualifying sales will be donated to Tucker Family Charity.",
      shopAnchorId: "offer-sports-republic",
    },
  ],
};
